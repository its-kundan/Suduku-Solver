"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu"; // Assuming these are defined somewhere
import { cn } from "@/lib/utils";
// import { useState, useEffect } from "react";
import { FaSun, FaMoon, FaGithub } from "react-icons/fa";
import Calender from "@/components/Calender";
import cover from "@/components/ui/cover";

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
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4 bg-none">
        {/* Logo and Home Link (Left Side) */}
        <div className="flex items-center space-x-4">
          <HoveredLink href="/" className="text-lg font-bold dark:text-white">
            <cover > Sudoku</cover>
          </HoveredLink>
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
              <a href="https://github.com/its-kundan/Suduku-Solver" // Replace with your actual GitHub link
                className="inline-block text-2xl bg-gray-200 dark:bg-gray-800 rounded-full focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                 <FaGithub className="text-current" /> {/* Assuming FaGithub is imported */}
              </a>    

        </div>

        {/* Menu Items (Right Side) */}
        <div className="flex items-center space-x-8 bg-none">
          <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="About">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/about">How to play?</HoveredLink>
                <HoveredLink href="/developer">Developers</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Services">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/web-dev">9 X 9</HoveredLink>
                <HoveredLink href="/interface-design">Others</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="New Games">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/newgame">Easy</HoveredLink>
                <HoveredLink href="/newgame">Medium</HoveredLink>
                <HoveredLink href="/newgame">Hard</HoveredLink>
                <HoveredLink href="/newgame">Expert</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Daily-Challege">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/web-dev"> <Calender /></HoveredLink>
                <HoveredLink href="/interface-design">Others</HoveredLink>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="(Reqest a Feature)">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/web-dev"> <a href="https://github.com/its-kundan/Suduku-Solver"  target="_blank" rel="noopener noreferrer"// Replace with your actual GitHub link
                className="inline-block text-2xl bg-gray-200 dark:bg-gray-800 rounded-full focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                <FaGithub className="text-current" /> {/* Assuming FaGithub is imported */}
              </a></HoveredLink>
                <HoveredLink href="/interface-design">Others</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Contact Us">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/web-dev">Follow on Social media</HoveredLink>
                <HoveredLink href="/interface-design">Others</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="login/signup">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/login">login</HoveredLink>
                <HoveredLink href="/signup">Signup</HoveredLink>
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
