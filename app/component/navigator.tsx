"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from "react";

import { useGlobalContext } from "../provider"
import NavPathName from "./navpathname";
import Icon from "@/public/icon";

const GUEST_PROFILE = "https://yt3.googleusercontent.com/Ux21viBcv03vV1Vj8QIQA0vq9AqwC_RmtDmoKZ2S77Kt7DLGgJvNAbC-v2KGzIFKoHKQ_AcNby8=s900-c-k-c0x00ffffff-no-rj";

export default function GlobalNavigator (): React.ReactNode {

  // check whether this component is rendered in client side or not
  const [isClient, setIsClient] = useState(false)
 
  // set isClient to true in client rendering
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // access global data
  const {globalParams, setGlobalParams} = useGlobalContext();
  
  // toggle of theme menu (light or dark mode)
  const [themeToggle, setThemeToggle] = useState<number>(0);
  const avaliableTheme = ["light", "dark", "system"]
  
  // access theme
  const { theme, setTheme } = useTheme();

  // switch among 3 themes options
  const handleThemeToggle = () => {
    setThemeToggle((prev) => (prev + 1) % 3)
    setTheme(avaliableTheme[themeToggle])
  }
  
  // if route is changed -> reset global.access status
  useEffect(() => {
    setGlobalParams("popUp", false);
  }, [usePathname()]);

  return (
    <nav className="fixed left-0 top-0 flex w-full h-16 z-100 px-4
    justify-between backdrop-blur-xl">
      {/* Left portion */}
      <div className='flex flex-row items-center justify-center'>
        <Link href={'/'} id="brand" className="-button-line relative mr-2">
          Selestial Sella
        </Link>
        <div className="hidden lg:inline">
          <span id="pri-chip" className="lg:inline mx-2 text-xs font-semibold">
              Beta 2.0
          </span>
        </div>
        <NavPathName />
      </div>

      {/* Right portion */}
      <div className="flex justify-center items-center">

        {/* section links */}
        <div className="hidden md:flex flex-row justify-center items-center gap-8 pr-8 text-md border-r border-ter dark:border-ter-dark">
          <Link 
            onClick={() => {
              setGlobalParams("isLoading", true);
              if ((window !== undefined) && (usePathname() == "/course")) {
                window.location.reload();
              }
            }}
            href={"/course"} className="-button-line">
            <h5>Course</h5>
          </Link>
          <Link 
            onClick={() => {
              setGlobalParams("isLoading", true);
              if ((window !== undefined) && (usePathname() == "/library")) {
                window.location.reload();
              }
            }}
            href={"/library"} className="-button-line">
            <h5>Library</h5>
          </Link>
        </div>

        {/* theme toggle */}
        {isClient && theme &&
          <button
            className="flex felx-row justify-center items-center ml-6 mr-2"
            onClick={() => handleThemeToggle()}>
            <Icon icon={theme} size={20} />
            <h5 className="hidden lg:inline ml-2">{theme.charAt(0).toLocaleUpperCase() + theme.slice(1)}</h5>
        </button>}

        {/* user profile */}
        {globalParams.authChecked &&
          <div className="m-4">
          {(globalParams.user != null) ? (
            // user is already logged in, render user profie
            <Link href={"./login"} className="flex flex-row justify-center items-center gap-3">
              <div id="frame" className="overflow-hidden bg-cover h-6 w-6 rounded-full border-pri">
                <img className="h-full w-full" src={globalParams.user.photoURL} alt="" />
              </div>
              <h5 className="hidden lg:inline">Member</h5>
            </Link>
          ) : (
            // user is already logged in, render guest profile
            <Link href={"./login"} className="flex flex-row justify-center items-center gap-3">
              <div id="frame" className="overflow-hidden bg-cover h-6 w-6 rounded-full border-pri">
                <img className="h-full w-full" src={GUEST_PROFILE} alt="" />
              </div>
              <h5 className="hidden lg:inline">Guest</h5>
            </Link>
          )}
        </div>}

      </div>
    </nav>
  );
}
