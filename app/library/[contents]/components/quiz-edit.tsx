"use client";

import { useState, useEffect } from "react";

import makeid from "@/app/libs/utils/make-id";
import firestoreUpdate from "../../../libs/firestore/firestore-manager";
import Icon from "@/public/icon";
import { useContentInterfaceContext } from "../content-provider";
import { useGlobalContext } from "@/app/provider";

export default function EditorInterface ({
    libraryData,
    questionData
}: {
    libraryData: {[key: string]: string}, // {uid: {library data}}
    questionData: {[key: string]: {[key: string]: any}} // {uid: {each question}}
}): React.ReactNode {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // connect to interface context
  const {contentInterfaceParams, setContentInterfaceParams} = useContentInterfaceContext();

  // counterpart of content data for editing
  const [bufferQuestion, setBufferQuestion] = useState(questionData);

  // detect footprint of question and return id="changed"
  const handleFootprintQuestion = (uid: string, footprint: string) => {
    try {
        if (Object.keys(questionData).includes(uid)) {
            if (questionData[uid][footprint] === bufferQuestion[uid][footprint]) {
                return "original"
            } else if (questionData[uid][footprint].toString() === bufferQuestion[uid][footprint].toString()) {
                return "original"
            } else {
                return "changed"
            }
        } else {
            return "changed-all"
        }
    } catch (error) {
        return "changed-all"
    }
  }

  // discard all changes if toggle
  useEffect(() => {
    if (contentInterfaceParams.discardChangesToggle && 
        globalParams.popUpConfirm &&
        (globalParams.popUpAction === "discardChangesToggle")) {
        setBufferQuestion(questionData);
        setContentInterfaceParams("discardChangesToggle", false);
        setGlobalParams("popUpConfirm", false);
        setGlobalParams("popUpAction", "");
    }
  }, [globalParams]);

  // save all changes if toggle 
  useEffect(() => {
    if (contentInterfaceParams.saveChangesToggle &&
        globalParams.popUpConfirm &&
        (globalParams.popUpAction == "saveChangesToggle")) {
        firestoreUpdate({
            collectionName: "content",
            originalData: questionData, 
            editedData: bufferQuestion
        }).then(
            (data) => {
                setGlobalParams("popUpConfirm", false);
                setGlobalParams("popUpAction", "");
                setContentInterfaceParams("saveChangesToggle", false);
                setContentInterfaceParams("logUpdate", data);
            }
        );
    }
  }, [globalParams]);

  // duplicate question
  const handleDuplicateQuestion = (uid: string): void => {
    const newUid = makeid(length=20);
    setBufferQuestion((prev) => ({
        ...prev,
        [newUid]: {
            mode: bufferQuestion[uid].mode,
            libraryFootprint: bufferQuestion[uid].libraryFootprint,
            questionSection: bufferQuestion[uid].questionSection,
            questionImage: bufferQuestion[uid].questionImage,
            questionText: bufferQuestion[uid].question,
            questionBackText: bufferQuestion[uid].questionBackText,
            library: bufferQuestion[uid].library,
            tag: bufferQuestion[uid].tag,
            choices: bufferQuestion[uid].choices
        }
    }));
  }

  // duplicate question choice
  const handleDuplicateQuestionChoice = (uid: string, targetIndex: number): void => {
    const newUid = makeid(length=20);
    setBufferQuestion((prev) => ({
        ...prev,
        [uid]: {
            ...prev[uid],
            choices: [
                ...prev[uid].choices.slice(0, targetIndex),
                prev[uid].choices[targetIndex],
                ...prev[uid].choices.slice(targetIndex, -1)
            ]
        }
    }));
  }

  // handle delete question
  const handleDeleteQuestion = (uid: string): void => {
    setBufferQuestion((prev) => {
        if (prev) {
            const { [uid]: {}, ...rest } = prev;
            return rest;
        } else {
            return prev;
        }
    });
  }

  // handle delete choice
  const handleDeleteChoice = (uid: string, deleteIndex: number): void => {
    setBufferQuestion((prev) => ({
        ...prev,
        [uid]: {
            ...prev[uid],
            choices: [
                ...prev[uid].choices.slice(0, deleteIndex),
                ...prev[uid].choices.slice(deleteIndex + 1, -1)
            ]
        }
    }));
  }

  // handle add new question
  const handleAddQuestion = (): void => {
    const newUid = makeid(length=20);
    setBufferQuestion((prev) => ({
        ...prev,
        [newUid]: {
            mode: "MIXED",
            libraryFootprint: [libraryData.id],
            questionSection: "",
            questionImage: "",
            questionText: "",
            questionBackText: "",
            library: [libraryData.id],
            tag: [""],
            choices: [{
                choiceImage: "",
                choiceAnswer: false,
                choiceBackText: "",
                choiceText: ""
            }, {
                choiceImage: "",
                choiceAnswer: false,
                choiceBackText: "",
                choiceText: ""
            }] // may be have another parameter determining amount of choices added
        }
    }));
  }

  // handle add new question choice
  const handleAddQuestionChoice = (uid: string, insertIndex: number): void => {
    setBufferQuestion((prev) => ({
        ...prev,
        [uid]: {
            ...prev[uid],
            choices: [
                ...prev[uid].choices.slice(0, insertIndex),
                {
                    choiceImage: "",
                    choiceAnswer: false,
                    choiceBackText: "",
                    choiceText: ""
                },
                ...prev[uid].choices.slice(insertIndex, -1)
            ]
        }
    }));
  }

  // update question data on placeholder change
  const onPlaceholderQuestionChange = (uid: string, targetKey: string, targetValue: any): void => {
    setBufferQuestion((prev) => ({
        ...prev,
        [uid]: {
            ...prev[uid],
            [targetKey]: targetValue
        }
    }));
  };

  // update question choice data on placeholder change
  const onPlaceholderQuestionChoiceChange = (uid: string, targetIndex: number, targetKey: string, targetValue: any): void => {
    setBufferQuestion((prev) => ({
        ...prev,
        [uid]: {
            ...prev[uid],
            choices: [
                ...prev[uid].choices.slice(0, targetIndex),
                {
                    ...prev[uid].choices[targetIndex],
                    [targetKey]: [targetValue]
                },
                ...prev[uid].choices.slice(targetIndex + 1, -1)
            ]
        }
    }));
  };

    // Filter by search key
    let filteredQuestion: {[key: string]: {[key: string]: any}} = {};
    for (let index = 0; index < Object.values(bufferQuestion).length; index++) {
        // Each content data
        const question: {[key: string]: any} = Object.values(bufferQuestion)[index];
        // Create combination of all content information for search target
        const search_target = question["id"] + " " + question["title"] + " " + question["tag"];

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(contentInterfaceParams.searchKey.toLowerCase())) {
        filteredQuestion[Object.keys(bufferQuestion)[index]] = question;
        }
    }

    return (
        <main>

        </main>
    );
}