"use client";

import { createContext, useContext, useState, useMemo } from "react";

interface interfaceStructure {
  displayToogle: boolean,
  searchKey: string,
  sortAscending: boolean,
  editMode: boolean,
  currentSectionUid: string,
  currentTopicUid: string,
  discardChangesToggle: boolean,
  saveChangesToggle: boolean,
  logUpdate: {},
  themeToggle: boolean
}

const interfaceInitialValue = {
  displayToogle: false,
  searchKey: "",
  sortAscending: true,
  editMode: false,
  currentSectionUid: "",
  currentTopicUid: "",
  discardChangesToggle: false,
  saveChangesToggle: false,
  logUpdate: {},
  themeToggle: true
};

const InterfaceContext = createContext<any>({});

export function useInterfaceContext() {
  return useContext(InterfaceContext);
}

export function TopicInterfaceProvider({ children }: {children: React.ReactNode}) {

  // Configure params
  const [interfaceParams, setAllInterfaceParams] = useState<interfaceStructure>(interfaceInitialValue);

  // Function for setting specific interface parameter
  const setInterfaceParams = (
    param: keyof typeof interfaceInitialValue, 
    value: any
  ): void => {
    setAllInterfaceParams((prev) => ({
      ...prev,
      [param]: value
    }));
  }

  // UseMemo optimization
  const interfaceValue = useMemo(() => ({interfaceParams, setInterfaceParams}), [interfaceParams]);

  return (
    <InterfaceContext.Provider value={interfaceValue}>
      {children}
    </InterfaceContext.Provider>
  );
}
