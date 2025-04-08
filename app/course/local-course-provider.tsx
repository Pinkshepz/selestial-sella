"use client";

import { createContext, useContext, useState, useMemo } from "react";
import Course from "@/app/utility/interface/interface-course";

interface LocalCourseContextStructure {
  displayToogle: boolean,
  searchKey: string,
  sortAscending: boolean,
  editMode: boolean,
  bufferCourse: {[key: string]: Course},
  currentCourseUid: string,
  addCourseToggle: boolean,
  discardChangesToggle: boolean,
  saveChangesToggle: boolean,
  logUpdate: {},
  currentDeleteButtonRef: string
}

const localQuizContextInitialValue = {
  displayToogle: false,
  searchKey: "",
  sortAscending: true,
  editMode: false,
  bufferCourse: {},
  currentCourseUid: "",
  addCourseToggle: false,
  discardChangesToggle: false,
  saveChangesToggle: false,
  logUpdate: {},
  currentDeleteButtonRef: ""
};

const LocalCourseContext = createContext<any>({});

export function useLocalCourseContext() {
  return useContext(LocalCourseContext);
}

export function LocalCourseContextProvider({ children }: {children: React.ReactNode}) {

  // Configure params
  const [localCourseContextParams, setAllLocalCourseContextParams] = useState<LocalCourseContextStructure>(localQuizContextInitialValue);

  // Function for setting specific interface parameter
  const setLocalCourseContextParams = (
    param: keyof typeof localQuizContextInitialValue, 
    value: any
  ): void => {
    setAllLocalCourseContextParams((prev) => ({
      ...prev,
      [param]: value
    }));
  }

  // UseMemo optimization
  const interfaceValue = useMemo(() => ({localCourseContextParams, setLocalCourseContextParams}), [localCourseContextParams]);

  return (
    <LocalCourseContext.Provider value={interfaceValue}>
      {children}
    </LocalCourseContext.Provider>
  );
}
