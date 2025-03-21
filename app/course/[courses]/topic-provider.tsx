"use client";

import { createContext, useContext, useState, useMemo } from "react";

interface TopicInterfaceStructure {
  editMode: boolean,
  searchKey: string,
  addQuestionToggle: boolean,
  discardChangesToggle: boolean,
  deleteAllChangesToggle: boolean,
  saveChangesToggle: boolean,
  logUpdate: {},
  sortAscending: boolean
}

const topicInterfaceInitialValue = {
  editMode: false,
  searchKey: "",
  addQuestionToggle: false,
  discardChangesToggle: false,
  deleteAllChangesToggle: false,
  saveChangesToggle: false,
  logUpdate: {},
  sortAscending: true
};

const TopicInterfaceContext = createContext<any>({});

export function useTopicInterfaceContext() {
  return useContext(TopicInterfaceContext);
}

export function TopicInterfaceProvider({ children }: {children: React.ReactNode}) {

  // Configure params
  const [topicInterfaceParams, setAllTopicInterfaceParams] = useState<TopicInterfaceStructure>(topicInterfaceInitialValue);

  // Function for setting specific interface parameter
  const setTopicInterfaceParams = (
    param: keyof typeof topicInterfaceInitialValue, 
    value: boolean | number
  ) => {

    setAllTopicInterfaceParams((prev) => ({
      ...prev,
      [param]: value
    }));
  }

  // UseMemo optimization
  const topicInterfaceValue = useMemo(() => ({topicInterfaceParams, setTopicInterfaceParams}), [topicInterfaceParams])

  return (
    <TopicInterfaceContext.Provider value={topicInterfaceValue}>
      {children}
    </TopicInterfaceContext.Provider>
  );
}
