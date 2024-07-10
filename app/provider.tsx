"use client";

import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import app from "./libs/firebase/fireclient";
import { getAuth } from "firebase/auth";

// manage theme provider
const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
  
export default ThemeProvider;

// manage global data provider
interface globalContextStructure {
  user: null | {},
  authChecked: boolean,
  path: string,
  isLoading: boolean;
  popUp: boolean,
  popUpConfirm: boolean,
  popUpAction: string,
  popUpText: string
}

const globalInitialValue = {
  user: null,
  authChecked: false,
  path: "/",
  isLoading: false,
  popUp: false,
  popUpConfirm: false,
  popUpAction: "",
  popUpText: ""
};

const GlobalContext = createContext<any>({});

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export function GlobalProvider({ children }: {children: React.ReactNode}) {

  // Configure params
  const [globalParams, setAllGlobalParams] = useState<globalContextStructure>(globalInitialValue);

  // Function for setting specific interface parameter
  const setGlobalParams = (
    param: keyof typeof globalInitialValue, 
    value: any
  ) => {

    setAllGlobalParams((prev) => ({
      ...prev,
      [param]: value
    }))
  }

  // check current path
  const path = usePathname();

  // check login status and update path
  useEffect(() => {
    setGlobalParams("path", path);
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setGlobalParams("user", user);
        setGlobalParams("authChecked", true);
      } else {
        setGlobalParams("user", null);
        setGlobalParams("authChecked", true);
      }
    });
    return () => unsubscribe();
  }, [path]);

  // set context value: we will get this value after calling useGlobalContext UseMemo optimization
  const globalValue = useMemo(() => ({globalParams, setGlobalParams}), [globalParams])

  return (
    <GlobalContext.Provider value={globalValue}>
      {children}
    </GlobalContext.Provider>
  );
}
