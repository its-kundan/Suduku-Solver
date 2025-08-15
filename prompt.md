
---

**ROLE:** You are a senior full-stack engineer and product architect.
**GOAL:** Build a production-ready “Mind Games” web app starting from an existing Next.js Sudoku project and expanding to a multi-game platform (Sudoku, Crossword, Word Search) with OCR scan-to-grid, daily challenges, leaderboards, streaks, XP levels, and Google/Email auth.
**CONSTRAINTS:** Next.js App Router, TypeScript, Tailwind, Shadcn UI, Prisma (Postgres), NextAuth, Tesseract.js for OCR. Clean architecture, reusable game engine interfaces, strong typing, accessibility, SEO.

---

## Global Guidelines (apply to every task)

* Use TypeScript everywhere (strict mode).
* Use App Router (`src/app/*`) and server actions where sensible.
* UI: Tailwind + shadcn/ui + lucide-react icons; keep components atomic with a `ui/` library folder.
* State: game-local state with hooks; no heavy global state unless required.
* Data: Prisma + Postgres. Add efficient indexes and Prisma Zod schemas where useful.
* Auth: NextAuth (Google + Email).
* Quality: ESLint + Prettier, `aria-*` accessibility, responsive, dark mode, Lighthouse ≥ 90.
* DX: Write small, focused modules; add unit tests (Vitest) for core logic (solver, OCR parsing); add basic Playwright e2e for flows.
* After each task: run, test, and commit with a descriptive message.

---

## Task 0 — Project Bootstrap & Libs

**Do:**

1. Upgrade to Next.js 14+, App Router, TypeScript.
2. Install deps:

   ```bash
   pnpm add @prisma/client prisma next-auth @next-auth/prisma-adapter zod lucide-react tesseract.js sharp
   pnpm add -D prisma vite tsx vitest @vitest/ui @types/node @types/react @testing-library/react @playwright/test eslint prettier
   pnpm add ioredis
   ```
3. Tailwind + shadcn/ui setup; configure theme and dark mode; add Button, Card, Input, Tabs, Dialog, Sheet, Avatar, DropdownMenu, Progress, Badge, Skeleton.
4. Add path aliases (`@/components`, `@/lib`, `@/games`, `@/server`).
5. Create `.env.example` with all keys.

**Deliverables:**

* Working dev server.
* Base layout: top nav (Games, Daily, Leaderboard, Profile), footer, theme toggle.

---

## Task 1 — Database & Prisma Schema

**Do:** Create `prisma/schema.prisma` with models & enums:

* `User` (name, email, image, xp, level, streakDays, lastPlayedAt)
* `Puzzle` (id, type: `SUDOKU|CROSSWORD|WORDSEARCH`, gridJson, solutionJson, difficulty: `EASY|MEDIUM|HARD|EXPERT`, isDaily, dailyDate, createdBy)
* `GameSession` (userId, puzzleId, status, moves, seconds, score, snapshotJson, startedAt, finishedAt)
* `Leaderboard` (type, period: `DAILY|WEEKLY|ALL_TIME`, scopeDate)
* `LeaderboardEntry` (leaderboardId, userId, score, seconds)
* NextAuth models: `Account`, `Session`, `VerificationToken`

Add indexes on `(type,isDaily,dailyDate)` and `(userId,puzzleId)`.

**Deliverables:**

* `npx prisma migrate dev -n init`
* `@prisma/client` generated
* Seed script with a few Sudoku puzzles (varying difficulty).

---

## Task 2 — Auth (Google + Email)

**Do:** Implement NextAuth route `src/app/api/auth/[...nextauth]/route.ts` using PrismaAdapter, GoogleProvider, EmailProvider (SMTP). Session strategy = database.

**UI:**

* `/signin` page with Google button, email magic link, and a compact privacy note.
* Avatar menu: Profile, Sign out.

**Deliverables:**

* Protected routes: Daily, Leaderboard, Profile.
* `useSession()` wired; server components can read auth via `getServerSession`.

---

## Task 3 — Game Abstractions & Routing

**Do:** Architect multi-game support.

* Create `@/games/types.ts`:

  * `GameType = 'SUDOKU'|'CROSSWORD'|'WORDSEARCH'`
  * `IGame` interface: `name`, `icon`, `Rules`, `Play` component, `validate()`, `score(params)`, optional `fromImage(file)` for OCR.
* Create `@/games/registry.ts` exporting a registry map and helper `getGame(type)`.

**Routes:**

* `/games` (catalog with game cards)
* `/games/[type]` (play UI shell; loads the game module)
* `/daily` (auto-route to today’s daily puzzle for the user’s chosen game; default Sudoku)

**Deliverables:**

* Working navigation & lazy-loaded game components.

---

## Task 4 — Sudoku Core (Input → Validate → Solve)

**Do:** Port/upgrade existing Sudoku to TypeScript:

* `@/games/sudoku/SudokuGrid.tsx` (9x9 grid, keyboard input, pencil marks)
* `@/games/sudoku/logic/validate.ts` (rows/cols/boxes)
* `@/games/sudoku/logic/solve.ts` (backtracking; deterministic)
* `@/games/sudoku/index.ts` implementing `IGame` with:

  * `validate(grid): {valid:boolean; errors?:cells[]}`
  * `score({seconds,moves,difficulty})` (see Task 8 formula)
  * `fromImage(file)` placeholder that calls OCR pipeline (Task 5)

**UI:**

* Buttons: Clear, Validate, Auto-solve, Undo/Redo.
* Error highlighting; conflict hints toggle.
* Mobile friendly.

**Tests:** vitest unit tests for `validate` and `solve`.

**Deliverables:**

* Fully functional Sudoku with strict validation & solver.

---

## Task 5 — OCR “Scan & Auto-Fill” (Sudoku)

**Do:** Implement an OCR pipeline for Sudoku:

* Client: `UploadDialog` to accept image (jpg/png). Send to `/api/ocr/sudoku`.
* Server API `/api/ocr/sudoku`:

  1. Preprocess with `sharp` (grayscale, normalize, threshold).
  2. (Optional) Grid detection: simple Hough-ish line enhance; but for v1: accept user-assisted crop:

     * If detection fails, return `needsCrop: true` plus a preview.
  3. For each cell (9x9), crop into tiles, call `tesseract.js` (whitelist `123456789`).
  4. Return 81-length array with 0 for blanks.
* Client receives parsed grid → populates Sudoku state.

**Files:** `@/server/ocr/sudoku.ts`, `@/app/api/ocr/sudoku/route.ts`.

**Deliverables:**

* Real images with clear grids parse ≥80% accuracy for clean inputs.
* Fallback crop flow implemented.

**Tests:** mock image tiles → ensure digit mapping pipeline.

---

## Task 6 — Persist Game Sessions

**Do:** Game shell saves progress and completion:

* API `POST /api/games/submit`:

  * Inputs: `puzzleId, moves, seconds, snapshotJson`
  * Compute `score = base - seconds - 2*moves` where base by difficulty {EASY:500, MEDIUM:800, HARD:1100, EXPERT:1400}, min 0.
  * Create `GameSession` with `COMPLETED`; set `finishedAt`.
  * Update user xp/level (Task 9).
* API `POST /api/games/save` to persist in-progress snapshot every 10s.

**Deliverables:**

* Resuming an unfinished session restores grid.
* Submitting writes session, returns new totals.

---

## Task 7 — Daily Challenge Generator (Sudoku)

**Do:**

* API `GET /api/cron/daily` (idempotent): at 00:00 IST, create today’s daily Sudoku puzzle (grid+solution) with difficulty MEDIUM. Use a simple generator or shuffle seeded templates for v1.
* Vercel Cron config example in `vercel.json`.

**UI:**

* `/daily` shows today’s puzzle, a countdown until next daily, and “Your best time”.

**Deliverables:**

* If puzzle already exists for today, do nothing.
* Manual run creates today’s entry.

---

## Task 8 — Leaderboards (Daily/Weekly/All-Time)

**Do:**

* API:

  * `POST /api/leaderboard/push` on game submit:

    * Upsert entries for DAILY (scope=YYYY-MM-DD), WEEKLY (ISO week), ALL\_TIME.
  * `GET /api/leaderboard?type=SUDOKU&period=DAILY&date=YYYY-MM-DD`
* Optional cache with Upstash Redis.

**UI:**

* `/leaderboard` with Tabs: Daily / Weekly / All-time.
* Rows: Rank, User, Score, Time(s), Date.
* “Your rank” pinned if authenticated.

**Deliverables:**

* Deterministic tie-breakers (lower seconds wins).

---

## Task 9 — Streaks, XP, and Levels

**Do:**

* After a daily completion, update streak:

  * If lastPlayedAt is yesterday → `streakDays++`
  * If today but already played → keep
  * Else reset to 1
  * Set `lastPlayedAt` = today (IST)
* XP rule: `xp += 50 + difficultyBonus - seconds/10` (floor), difficultyBonus {0, 50, 100, 150}.
* Level rule: `level = 1 + floor(xp / 500)`.
* UI Badges and a streak flame icon with tooltip.

**Deliverables:**

* `/profile` page shows XP bar, Level, Streak, recent sessions.

---

## Task 10 — Game Catalog & Level-Wise Challenges

**Do:**

* `/games` grid showing:

  * Sudoku (Ready), Crossword (Beta), Word Search (Beta).
* `/challenges` with level-gated sets:

  * Level 1–3: Easy
  * 4–6: Medium
  * 7–9: Hard
  * 10+: Expert
* Lock card UI with tooltip explaining requirements.

**Deliverables:**

* Trying a locked challenge shows a friendly modal.

---

## Task 11 — Crossword (Scaffold)

**Do (scaffold only):**

* Data shape: `{ grid:[rows][cols]{#,char?}, clues:{across:[{n,text,answer,positions}], down:[...] } }`
* Rendering with numbered cells, focus navigation, highlight word.
* Validation: filled letters must match solutionJson when “Check” clicked.
* Seed 1 small 5x5 crossword.

**Deliverables:**

* Playable scaffold with manual test data; no generator yet.

---

## Task 12 — Word Search (Scaffold)

**Do (scaffold only):**

* Data shape: `{ grid:[rows][cols]letters, words:[string], solution:{word->coords[]} }`
* Mouse/touch drag selection draws line overlay; confirm when matches solution.
* Simple score = words found + time bonus.

**Deliverables:**

* Playable scaffold with sample word list.

---

## Task 13 — Sharing & Social

**Do:**

* Share modal after completion: copy link, Twitter intent, image badge.
* OG image endpoint `/api/og/result?puzzleId=...&score=...` (Satori + @vercel/og).

**Deliverables:**

* Link preview shows score badge & game type.

---

## Task 14 — Admin Utilities (MVP)

**Do:**

* Protected `/admin`:

  * Upload/enter puzzles (Sudoku JSON; Crossword/WordSearch JSON).
  * Mark as “daily” for a date.
* Basic audit list with filters.

**Deliverables:**

* Role check (simple email allowlist in env).

---

## Task 15 — Accessibility & Mobile Polish

**Do:**

* Ensure keyboard nav for all grids.
* Proper labels, roles, `aria-live` for validation messages.
* Mobile: large tap targets, bottom action bar for game controls.

**Deliverables:**

* Axe & Lighthouse passing (≥ 90).

---

## Task 16 — Testing

**Do:**

* Vitest: sudoku `validate`, `solve`, and scoring.
* Playwright: auth flow, start daily, complete small puzzle (mock fast solver), see leaderboard update.

**Deliverables:**

* `pnpm test` & `pnpm test:e2e` green.

---

## Task 17 — Observability

**Do:**

* Add simple analytics (PostHog or Umami).
* Add Sentry for error tracking on client+server.

**Deliverables:**

* DSNs via env; PII safe.

---

## Task 18 — SEO & Metadata

**Do:**

* `generateMetadata` per route, canonical URLs, sitemap, robots.txt.
* Titles: “Mind Games — Sudoku, Crossword, Word Search | Daily Challenge”.

**Deliverables:**

* Structured data (BreadcrumbList for /games, Article for /daily puzzle page).

---

## Task 19 — Deployment

**Do:**

* Vercel app, Neon (Postgres), Upstash (Redis).
* Add Vercel Cron for `/api/cron/daily` at 00:00 Asia/Kolkata.
* Populate `.env` from `.env.example`.

**Deliverables:**

* Live URL with working daily puzzles, auth, leaderboards.

---

## Task 20 — Documentation

**Do:**

* Update `README.md`:

  * Features, Tech, Local setup, Env, Scripts, Testing, Deploy.
  * JSON shapes for each game type.
  * Admin guide & data import format.
* Add `CONTRIBUTING.md` and `SECURITY.md`.

**Deliverables:**

* Clear developer onboarding in ≤10 minutes.

---

## Nice-to-Have (after MVP)

* OpenCV.js line detection to improve OCR robustness.
* Device camera capture & guide overlay for Sudoku scanning.
* Real crossword constructor & word-search generator.
* Friends list & private leaderboards.
* PWA install (offline for current puzzle).

---

## Acceptance Criteria (MVP)

* A user can: sign in → pick Sudoku → upload a photo → auto-fill → solve → submit → see XP, streak update → see themselves on leaderboards → attempt daily puzzle.
* Crossword and Word Search are playable in Beta with seeded data.
* Cron creates daily Sudoku at midnight IST.
* Lighthouse scores ≥ 90 (Performance/Accessibility/Best Practices/SEO).

---

**Start implementing now. Work task-by-task in order. After each task, run the app, verify acceptance criteria, and commit with a descriptive message.**
