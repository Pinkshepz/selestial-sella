"use client";

import { createContext, useContext, useState, useMemo } from "react";

interface interfaceStructure {
  displayToogle: boolean,
  searchKey: string,
  sortAscending: boolean,
  editMode: boolean,
  addLibraryToggle: boolean,
  discardChangesToggle: boolean,
  saveChangesToggle: boolean,
  logUpdate: {}
}

const interfaceInitialValue = {
  displayToogle: false,
  searchKey: "",
  sortAscending: true,
  editMode: false,
  addLibraryToggle: false,
  discardChangesToggle: false,
  saveChangesToggle: false,
  logUpdate: {}
};

const InterfaceContext = createContext<any>({});

export function useInterfaceContext() {
  return useContext(InterfaceContext);
}

export function LibraryInterfaceProvider({ children }: {children: React.ReactNode}) {

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
