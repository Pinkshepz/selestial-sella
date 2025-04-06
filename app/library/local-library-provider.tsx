"use client";

import { createContext, useContext, useState, useMemo } from "react";
import Library from "@/app/utility/interface/interface-library";

interface LocalLibraryContextStructure {
  displayToogle: boolean,
  searchKey: string,
  sortAscending: boolean,
  editMode: boolean,
  bufferLibrary: {[key: string]: Library},
  currentLibraryUid: string,
  addLibraryToggle: boolean,
  discardChangesToggle: boolean,
  saveChangesToggle: boolean,
  logUpdate: {}
}

const localQuizContextInitialValue = {
  displayToogle: false,
  searchKey: "",
  sortAscending: true,
  editMode: false,
  bufferLibrary: {},
  currentLibraryUid: "",
  addLibraryToggle: false,
  discardChangesToggle: false,
  saveChangesToggle: false,
  logUpdate: {}
};

const LocalLibraryContext = createContext<any>({});

export function useLocalLibraryContext() {
  return useContext(LocalLibraryContext);
}

export function LocalLibraryContextProvider({ children }: {children: React.ReactNode}) {

  // Configure params
  const [localLibraryContextParams, setAllLocalLibraryContextParams] = useState<LocalLibraryContextStructure>(localQuizContextInitialValue);

  // Function for setting specific interface parameter
  const setLocalLibraryContextParams = (
    param: keyof typeof localQuizContextInitialValue, 
    value: any
  ): void => {
    setAllLocalLibraryContextParams((prev) => ({
      ...prev,
      [param]: value
    }));
  }

  // UseMemo optimization
  const interfaceValue = useMemo(() => ({localLibraryContextParams, setLocalLibraryContextParams}), [localLibraryContextParams]);

  return (
    <LocalLibraryContext.Provider value={interfaceValue}>
      {children}
    </LocalLibraryContext.Provider>
  );
}
