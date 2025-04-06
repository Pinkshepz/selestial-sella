"use client";

//// 1.1 Metadata & module & framework
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { usePathname } from 'next/navigation'

//// 1.2 Custom React hooks
import { useGlobalContext } from "../global-provider"

//// 1.3 React components
import NavPathName from "./navpathname";

//// 1.4 Utility functions
////     N/A

//// 1.5 Public and others
import Icon from "@/public/icon";
import cat from "@/public/images/cat.png";


export default function GlobalNavigator (): React.ReactNode {

  // check whether this component is rendered in client side or not
  const [isClient, setIsClient] = useState(false)
 
  // set isClient to true in client rendering
  useEffect(() => {
    setIsClient(true)
    setGlobalParams("theme", document.getElementsByTagName("html")[0].className);
  }, [])
  
  // access global data
  const {globalParams, setGlobalParams} = useGlobalContext();
  
  // toggle of theme menu (light or dark mode)
  const [themeToggle, setThemeToggle] = useState<number>(0);
  const avaliableTheme = ["light", "dark"]
  
  // access theme
  const { theme, setTheme } = useTheme();

  // access path
  const currentPath = usePathname();

  // switch among 3 themes options
  const handleThemeToggle = () => {
    setThemeToggle((prev) => (prev + 1) % avaliableTheme.length);
    setTheme(avaliableTheme[themeToggle]);
    setGlobalParams("theme", avaliableTheme[themeToggle]);
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
      if ((window !== undefined) && (currentPath == `/${route}`)) {
        window.location.reload();
      }
    }

    return (
      <Link onClick={handleLink} href={`/${route}`} className="-button-line">
        <h5>{route.toLocaleUpperCase()}</h5>
      </Link>
    );
  }

  return (
    <nav className="fixed left-0 top-0 flex flex-row justify-between items-center gap-8 w-full z-100 px-4 backdrop-blur-lg">

      {/* Left portion */}
      <div className='flex flex-row items-center justify-center'>
        <Link href={'/'} onClick={() => setGlobalParams("isLoading", true)} id="brand-static" className="font-black text-xl relative mr-2">
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
                <Image src={cat} alt="" priority={true}></Image>
              </div>
              <h5 className="hidden lg:inline">GUEST</h5>
            </Link>
          )}
        </div>}

      </div>
    </nav>
  );
}
