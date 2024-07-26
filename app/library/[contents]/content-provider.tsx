"use client";

import { createContext, useContext, useState, useMemo } from "react";

interface ContentInterfaceStructure {
  pageSwitch: boolean,
  shuffleQuestion: boolean,
  shuffleChoice: boolean,
  questionNumber: number
  currentQuestion: number,
  editMode: boolean,
  searchKey: string,
  addQuestionToggle: boolean,
  discardChangesToggle: boolean,
  deleteAllChangesToggle: boolean,
  saveChangesToggle: boolean,
  logUpdate: {},
  importSheetToggle: boolean,
  sortAscending: boolean
}

const contentInterfaceInitialValue = {
  pageSwitch: false,
  shuffleQuestion: false,
  shuffleChoice: false,
  questionNumber: 0,
  currentQuestion: 0,
  editMode: false,
  searchKey: "",
  addQuestionToggle: false,
  discardChangesToggle: false,
  deleteAllChangesToggle: false,
  saveChangesToggle: false,
  logUpdate: {},
  importSheetToggle: false,
  sortAscending: true
};

const ContentInterfaceContext = createContext<any>({});

export function useContentInterfaceContext() {
  return useContext(ContentInterfaceContext);
}

export function ContentInterfaceProvider({ children }: {children: React.ReactNode}) {

  // Configure params
  const [contentInterfaceParams, setAllContentInterfaceParams] = useState<ContentInterfaceStructure>(contentInterfaceInitialValue);

  // Function for setting specific interface parameter
  const setContentInterfaceParams = (
    param: keyof typeof contentInterfaceInitialValue, 
    value: boolean | number
  ) => {

    setAllContentInterfaceParams((prev) => ({
      ...prev,
      [param]: value
    }));
  }

  // UseMemo optimization
  const contentInterfaceValue = useMemo(() => ({contentInterfaceParams, setContentInterfaceParams}), [contentInterfaceParams])

  return (
    <ContentInterfaceContext.Provider value={contentInterfaceValue}>
      {children}
    </ContentInterfaceContext.Provider>
  );
}
