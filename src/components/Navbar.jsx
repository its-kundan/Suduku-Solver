"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu"; // Assuming these are defined somewhere
import { cn } from "@/lib/utils";
// import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }) {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle the dark mode state
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add or remove the 'dark' class on the body tag based on the darkMode state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  const [active, setActive] = useState(null);
  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900",
        className
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        {/* Logo and Home Link (Left Side) */}
        <div className="flex items-center space-x-4">
          <HoveredLink href="/" className="text-lg font-bold dark:text-white">
            SudoKu
          </HoveredLink>
        </div>

        {/* Menu Items (Right Side) */}
        <div className="flex items-center space-x-8">
          <Menu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item="Services">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/web-dev">9 X 9</HoveredLink>
                <HoveredLink href="/interface-design">Others</HoveredLink>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="text">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/web-dev">9 X 9</HoveredLink>
                <HoveredLink href="/interface-design">Others</HoveredLink>
              </div>
            </MenuItem>

            {/* <MenuItem setActive={setActive} active={active} item="Pricing">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/hobby">W</HoveredLink>
                <HoveredLink href="/individual">Individual</HoveredLink>
                <HoveredLink href="/team">Team</HoveredLink>
                <HoveredLink href="/enterprise">Enterprise</HoveredLink>
              </div>
            </MenuItem> */}
            <MenuItem setActive={setActive} active={active} item="dark"> dark
              <button
                onClick={toggleDarkMode}
                className="text-2xl  bg-gray-200 dark:bg-gray-800 rounded-full focus:outline-none"
              >
                {!darkMode ? (
                  <FaSun className="text-yellow-500" />
                ) : (
                  <FaMoon className="text-blue-500" />
                )}
              </button>
            </MenuItem>
            {/* <MenuItem setActive={setActive} active={active} item="Pricing">
              <div className="flex flex-col text-sm">
                 <button className="bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Login
                </button>
              </div>
            </MenuItem> */}
          </Menu>

          {/* Login Button */}
         
        </div>
      </div>
    </div>
  );
}
