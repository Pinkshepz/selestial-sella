"use client";

import metadata from "@/metadata.json";
import { createContext, useContext, useState, useMemo } from "react";
import Question from "@/app/utility/interface/interface-quiz";
import Library, {defaultLibrary} from "@/app/utility/interface/interface-library";

interface LocalQuizContextStructure {
  bufferQuestion: {[key: string]: Question},
  bufferLibrary: Library,
  pageSwitch: boolean,
  shuffleQuestion: boolean,
  shuffleChoice: boolean,
  currentQuestionModality: keyof typeof metadata.questionModality,
  editMode: boolean,
  searchKey: string,
  currentQuestionUid: string,
  addQuestionToggle: boolean,
  discardChangesToggle: boolean,
  saveChangesToggle: boolean,
  autosaveToggle: number,
  logUpdate: {},
  sortAscending: boolean,
  themeToggle: boolean,
  currentDeleteButtonRef: string,
  screenWidth: number,
  asideHidden: boolean
}

const localQuizContextInitialValue = {
  bufferQuestion: {},
  bufferLibrary: defaultLibrary({newUid: "0"}),
  pageSwitch: false,
  shuffleQuestion: false,
  shuffleChoice: false,
  currentQuestionModality: Object.keys(metadata.questionModality)[0] as keyof typeof metadata.questionModality,
  editMode: false,
  searchKey: "",
  currentQuestionUid: "",
  addQuestionToggle: false,
  discardChangesToggle: false,
  saveChangesToggle: false,
  autosaveToggle: 5,
  logUpdate: {},
  sortAscending: true,
  themeToggle: true,
  currentDeleteButtonRef: "",
  screenWidth: 0,
  asideHidden: true
};

const LocalQuizContext = createContext<any>({});

export function useLocalQuizContext() {
  return useContext(LocalQuizContext);
}

export function LocalQuizContextProvider({ children }: {children: React.ReactNode}) {

  // Configure params
  const [localQuizContextParams, setAllLocalQuizContextParams] = useState<LocalQuizContextStructure>(localQuizContextInitialValue);

  // Function for setting specific interface parameter
  const setLocalQuizContextParams = (
    param: keyof typeof localQuizContextInitialValue, 
    value: boolean | number
  ) => {

    setAllLocalQuizContextParams((prev) => ({
      ...prev,
      [param]: value
    }));
  }

  // UseMemo optimization
  const contentInterfaceValue = useMemo(() => ({localQuizContextParams, setLocalQuizContextParams}), [localQuizContextParams])

  return (
    <LocalQuizContext.Provider value={contentInterfaceValue}>
      {children}
    </LocalQuizContext.Provider>
  );
}
