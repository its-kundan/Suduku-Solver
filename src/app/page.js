"use client";
import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import Sudoku from "@/components/Sudoku"; 
import { Background } from "@/components/Background";
import { Cover } from "@/components/ui/cover";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BackgroundLines } from "@/components/ui/background-lines";


export default function Home() {
  

  return (
    <>
      <BackgroundLines className="absolute inset-0 z-0" />
      {/* <Background/> */}

      <div className="relative z-10 flex items-center justify-center w-full flex-col px-4">
        <Sudoku className="flex justify-center align-middle z-20" />

        {/* </Background> */}
        {/* <BackgroundBeams /> */}
      </div>
    </>
  );
}
