"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from "react";

import { useGlobalContext } from "../global-provider"
import NavPathName from "./navpathname";
import Icon from "@/public/icon";

const GUEST_PROFILE = "https://yt3.googleusercontent.com/c2qSc796fIy8cqrcoq-JNBnBCsXgT9wpA19k2aBEx8r1Wzn8VUCWrySazhO28iao40CmUrV-3A=s900-c-k-c0x00ffffff-no-rj";

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

  // access path
  const currentPath = usePathname();

  // switch among 3 themes options
  const handleThemeToggle = () => {
    setThemeToggle((prev) => (prev + 1) % 3)
    setTheme(avaliableTheme[themeToggle])
  }
  
  // if route is changed -> reset global.access status
  useEffect(() => {
    setGlobalParams("popUp", false);
  }, [currentPath]);

  // Link elements
  const NavigatorLink = ({route}: {route: string}): React.ReactNode => {
    const handleLink = () => {
      setGlobalParams("isLoading", true);
      // if link to route A is clicked while it is already on the route A -> reload
      if ((window !== undefined) && (currentPath == "/course")) {
        window.location.reload();
      }
    }

    return (
      <Link 
        onClick={handleLink}
        href={`/${route}`} className="-button-line">
        <h5>{route.toLocaleUpperCase()}</h5>
      </Link>
    );
  }

  return (
    <nav className="fixed left-0 top-0 flex flex-row justify-between items-center gap-8 w-full z-100 px-4 backdrop-blur-lg">

      {/* Left portion */}
      <div className='flex flex-row items-center justify-center'>
        <Link href={'/'} id="brand-static" className="font-black text-xl relative mr-2">
          AURICLE
        </Link>
        <NavPathName />
      </div>

      {/* Right portion */}
      <div className="flex justify-center items-center">

        <div className="flex flex-row justify-center items-center gap-8 h-full mr-4 text-md overflow-x-scroll overflow-y-hidden -scroll-none">
          <NavigatorLink route="course" />
          <NavigatorLink route="library" />
          <NavigatorLink route="script" />
        </div>

        {/* theme toggle */}
        {isClient && theme &&
          <button
            className="flex felx-row justify-center items-center ml-6 mr-4"
            onClick={() => handleThemeToggle()}>
            <Icon icon={theme} size={20} />
            <h5 className="hidden lg:inline ml-2">{theme.toLocaleUpperCase()}</h5>
        </button>}

        {/* user profile */}
        {globalParams.authChecked &&
          <div className="m-4">
          {(globalParams.user != null) ? (
            // user is already logged in, render user profie
            <Link href={"/login"} className="flex flex-row justify-center items-center gap-3">
              <div id="frame" className="overflow-hidden bg-cover h-6 w-6 rounded-full border-pri">
                <img className="h-full w-full" src={globalParams.user.photoURL} alt="" />
              </div>
              <h5 className="hidden lg:inline">MEMBER</h5>
            </Link>
          ) : (
            // user is already logged in, render guest profile
            <Link href={"/login"} className="flex flex-row justify-center items-center gap-3">
              <div id="frame" className="overflow-hidden bg-cover h-6 w-6 rounded-full border-pri">
                <img className="h-full w-full" src={GUEST_PROFILE} alt="" />
              </div>
              <h5 className="hidden lg:inline">GUEST</h5>
            </Link>
          )}
        </div>}

      </div>
    </nav>
  );
}
