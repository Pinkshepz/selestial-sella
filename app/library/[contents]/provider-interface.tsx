"use client";

import { createContext, useContext, useState, useMemo } from "react";

interface interfaceStructure {
  pageSwitch: boolean,
  shuffleQuestion: boolean,
  shuffleChoice: boolean,
  questionNumber: number
  currentQuestion: number
}

const interfaceInitialValue = {
  pageSwitch: false,
  shuffleQuestion: false,
  shuffleChoice: false,
  questionNumber: 0,
  currentQuestion: 0
};

const InterfaceContext = createContext<any>({});

export function useInterfaceContext() {
  return useContext(InterfaceContext);
}

export function InterfaceProvider({ children }: {children: React.ReactNode}) {

  // Configure params
  const [interfaceParams, setAllInterfaceParams] = useState<interfaceStructure>(interfaceInitialValue);

  // Function for setting specific interface parameter
  const setInterfaceParams = (
    param: keyof typeof interfaceInitialValue, 
    value: boolean | number
  ) => {

    setAllInterfaceParams((prev) => ({
      ...prev,
      [param]: value
    }))
  }

  // UseMemo optimization
  const interfaceValue = useMemo(() => ({interfaceParams, setInterfaceParams}), [interfaceParams])

  return (
    <InterfaceContext.Provider value={interfaceValue}>
      {children}
    </InterfaceContext.Provider>
  );
}
