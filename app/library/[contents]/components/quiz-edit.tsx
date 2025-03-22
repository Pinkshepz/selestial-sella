"use client";

import { useState, useEffect, useRef } from "react";

import makeid from "@/app/libs/utils/make-id";
import firestoreUpdate from "../../../libs/firestore/firestore-manager";
import firestoreUpdateQuiz from "@/app/libs/firestore/firestore-manager-quiz";
import Icon from "@/public/icon";
import { ChipTextColor, TextColor } from "@/app/libs/material/chip";
import sortUidObjectByValue from "@/app/libs/utils/sort-uid-object-by-value";
import { useContentInterfaceContext } from "../content-provider";
import { useGlobalContext } from "@/app/global-provider";

export default function EditorInterface ({
    libraryData,
    questionData,
    ggSheetImport
}: {
    libraryData: {[key: string]: string}, // {uid: {library data}}
    questionData: {[key: string]: {[key: string]: any}}, // {uid: {each question}}
    ggSheetImport: {[key: string]: {[key: string]: any}} | undefined // {uid: {each question}}
}): React.ReactNode {
    // supplement wallpaper
    const BG = "https://media.suara.com/pictures/653x366/2019/12/19/95933-aurora.jpg";
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // connect to interface context
    const {contentInterfaceParams, setContentInterfaceParams} = useContentInterfaceContext();

    // counterpart of content data for editing
    const [bufferQuestion, setBufferQuestion] = useState(questionData);

    // recent mode of question
    const [recentlyUsedMode, setRecentlyUsedMode] = useState("flashcard");

    // recent section of question
    const [recentlyUsedSection, setRecentlyUsedSection] = useState("");

    // toggle reset id
    const [toggleResetId, setToggleResetId] = useState(false);

    // target uid to scroll to after id has been already reset
    const [targetUidScroll, setTargetUidScroll] = useState("");

    // choice key toggle
    const [choiceKeyToggle, setChoiceKeyToggle] = useState(1);

    // track cursor position. Update when cursor position is changed
    const [cursorPosY, setCursorPosY] = useState(0); // cursor position

    const setCoordinate = (e: MouseEvent) => {
        if ((window !== undefined) && (e.clientY > (window.innerHeight * 0.5))) {
            setCursorPosY(window.innerHeight * 0.5);
        } else {
            setCursorPosY(e.clientY);
        }
    };
    
    useEffect(() => {
        window.addEventListener("mousemove", setCoordinate);
    }, [setCoordinate]);

    // autosave toggle and clock
    const [autoSaveToggle, setAutoSaveToggle] = useState(true);
    const CLOCK: number[] = [10, 30, 60, 120, 300, 600];
    const [defaultAutosaveTime, setDefaultAutosaveTime] = useState(CLOCK[2]);
    const [autoSaveClock, setAutoSaveClock] = useState(defaultAutosaveTime);

    // toggle autosave clock default time [30, 60, 300, 600]
    const toggleAutosaveClock = (): void => {
        const currentIndex: number = CLOCK.indexOf(defaultAutosaveTime);
        // change to next clock option
        setDefaultAutosaveTime(CLOCK[(currentIndex + 1) % CLOCK.length]);
        setAutoSaveClock(CLOCK[(currentIndex + 1) % CLOCK.length]);
        return;
    };

    // autosave clock countdown
    const [time, setTime] = useState(Date.now());

    // run autosave clock
    useEffect(() => {
        if (autoSaveToggle) {
            const interval = setInterval(() => setTime(Date.now()), 1000);
            setAutoSaveClock(autoSaveClock - 1);
            return () => {
                clearInterval(interval);
            };
        }
    }, [time, autoSaveToggle]);

    // ref for elements
    const elementsRef: {[key: string]: any} = useRef({});

    // go to ref
    const scrollToRef = (refKey: string): void => {
        try {
            elementsRef.current[refKey].scrollIntoView({
                block: "start",
                behavior: "smooth"
            });
            setTargetUidScroll("");
            return;
        } catch (error) {
            return;
        }
    };

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
    };

    // handle reset id toggle
    useEffect(() => {
        if (toggleResetId) {
            const processData = (): typeof bufferQuestion => {
                let processedData: typeof bufferQuestion = {};
                // assign new question number and library uid
                Object.keys(sortUidObjectByValue(bufferQuestion, "id", true)).map((uid, index) => {
                    processedData[uid] = {
                        ...bufferQuestion[uid],
                        id: index + 1
                    }
                });
                setToggleResetId(false);
                scrollToRef(targetUidScroll);
                return sortUidObjectByValue(processedData, "id", true);
            }
            setBufferQuestion(processData());
        }
    }, [toggleResetId]);

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
                questionText: bufferQuestion[uid].questionText,
                questionBackText: bufferQuestion[uid].questionBackText,
                library: bufferQuestion[uid].library,
                id: bufferQuestion[uid].id + 0.1,
                choices: bufferQuestion[uid].choices
            }
        }));
        setTargetUidScroll(newUid);
        setToggleResetId(true);
    }

    // duplicate question choice
    const handleDuplicateQuestionChoice = (uid: string, targetIndex: number): void => {
        setBufferQuestion((prev) => ({
            ...prev,
            [uid]: {
                ...prev[uid],
                choices: [
                    ...prev[uid].choices.slice(0, targetIndex + 1),
                    prev[uid].choices[targetIndex],
                    ...prev[uid].choices.slice(targetIndex + 1, prev[uid].choices.length)
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
    const handleDeleteQuestionChoice = (uid: string, deleteIndex: number): void => {
        setBufferQuestion((prev) => ({
            ...prev,
            [uid]: {
                ...prev[uid],
                choices: [
                    ...prev[uid].choices.slice(0, deleteIndex),
                    ...prev[uid].choices.slice(deleteIndex + 1, prev[uid].choices.legth)
                ]
            }
        }));
    }

    // handle add new question
    useEffect(() => {
        if (contentInterfaceParams.addQuestionToggle) {
            const newUid = makeid(length=20);
            setBufferQuestion((prev) => ({
                ...prev,
                [newUid]: {
                    mode: recentlyUsedMode,
                    libraryFootprint: libraryData.id, // for recover deleted library
                    questionSection: recentlyUsedSection,
                    questionImage: "",
                    questionText: "",
                    questionBackText: "",
                    library: [libraryData.uid],
                    id: Object.keys(bufferQuestion).length + 1,
                    choices: [{
                        choiceImage: "",
                        choiceAnswer: false,
                        choiceBackText: "",
                        choiceText: ""
                    }] // may be have another parameter determining amount of choices added
                }
            }));
            setTargetUidScroll(newUid);
            setToggleResetId(true);
        }
        setContentInterfaceParams("addQuestionToggle", false)
    }, [contentInterfaceParams.addQuestionToggle]);

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
                    ...prev[uid].choices.slice(insertIndex + 1, prev[uid].choices.length)
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
        // remember recent section
        if (targetKey == "questionSection") {
            setRecentlyUsedSection(targetValue);
        }
        // if id change -> reset id
        if (targetKey == "id") {
            setToggleResetId(true);
            setTargetUidScroll(uid);
        }
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
                        [targetKey]: targetValue
                    },
                    ...prev[uid].choices.slice(targetIndex + 1, prev[uid].choices.length)
                ]
            }
        }));
    };

    // change choice position
    const handleChoicePositionBackward = (uid: string, choiceIndex: number): void => {
        if (choiceIndex > 0) {
            setBufferQuestion((prev) => ({
                ...prev,
                [uid]: {
                    ...prev[uid],
                    choices: [
                        ...prev[uid].choices.slice(0, choiceIndex - 1),
                        {
                            ...prev[uid].choices[choiceIndex]
                        },
                        ...prev[uid].choices.slice(choiceIndex - 1, choiceIndex),
                        ...prev[uid].choices.slice(choiceIndex + 1, prev[uid].choices.length)
                    ]
                }
            }));
            setChoiceKeyToggle((prev) => (prev + 1));
            return;
        } else {
            return;
        }
    }

    const handleChoicePositionForward = (uid: string, choiceIndex: number): void => {
        if (choiceIndex < bufferQuestion[uid].choices.length) {
                setBufferQuestion((prev) => ({
                ...prev,
                [uid]: {
                    ...prev[uid],
                    choices: [
                        ...prev[uid].choices.slice(0, choiceIndex),
                        ...prev[uid].choices.slice(choiceIndex + 1, choiceIndex + 2),
                        {
                            ...prev[uid].choices[choiceIndex]
                        },
                        ...prev[uid].choices.slice(choiceIndex + 2, prev[uid].choices.length)
                    ]
                }
            }));
            setChoiceKeyToggle((prev) => (prev + 1));
            return;
        } else {
            return;
        }
    }

    // toggle question mode ["singleChoice", "multipleChoice", "flashcard"]
    const MODE: string[] = ["singleChoice", "multipleChoice", "flashcard"];
    const toggleQuestionMode = (uid: string, currentMode: string): void => {
        const currentIndex: number = MODE.indexOf(currentMode);
        // change to next mode
        onPlaceholderQuestionChange(uid, "mode", MODE[(currentIndex + 1) % MODE.length]);
        setRecentlyUsedMode(MODE[(currentIndex + 1) % MODE.length]);
        return;
    };

    // delete all changes if toggle
    useEffect(() => {
        if (contentInterfaceParams.deleteAllChangesToggle && 
            globalParams.popUpConfirm &&
            (globalParams.popUpAction === "deleteAllChangesToggle")) {
            setBufferQuestion({});
            setContentInterfaceParams("deleteAllChangesToggle", false);
            setGlobalParams("popUpConfirm", false);
            setGlobalParams("popUpAction", "");
            setAutoSaveClock(defaultAutosaveTime);
        }
        setChoiceKeyToggle((prev) => (prev + 1));
    }, [globalParams.popUpConfirm]);

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
    }, [globalParams.popUpConfirm]);
    
    // run autosave
    useEffect(() => {
        if ((autoSaveToggle) && (autoSaveClock == 1)) {
            setGlobalParams("isLoading", true);
            const cloneLibraryData = structuredClone(libraryData);
            const libraryUid = cloneLibraryData.uid;
            delete cloneLibraryData.uid;

            const processData = (rawData: typeof bufferQuestion): typeof bufferQuestion => {
                let processedData: typeof bufferQuestion = {};
                // assign new question number and library uid
                Object.keys(sortUidObjectByValue(rawData, "id", true)).map((uid, index) => {
                    processedData[uid] = {
                        ...rawData[uid],
                        id: index + 1,
                        library: libraryUid
                    }
                });
                return sortUidObjectByValue(processedData, "id", true);
            }

            // update library data
            firestoreUpdate({
                collectionName: "library",
                originalData: {[libraryUid]: cloneLibraryData}, 
                editedData: {[libraryUid]: {
                    ...cloneLibraryData,
                    totalQuestion: Object.keys(bufferQuestion).length
                }}
            });

            // update all question data
            firestoreUpdateQuiz({
                originalData: questionData, 
                editedData: processData(bufferQuestion)
            }).then(
                () => {
                    setGlobalParams("isLoading", false);
                    setAutoSaveClock(defaultAutosaveTime);
                }
            );
        }
    }, [time]);

    // save all changes if toggle 
    useEffect(() => {
        if (contentInterfaceParams.saveChangesToggle &&
            globalParams.popUpConfirm &&
            (globalParams.popUpAction == "saveChangesToggle")) {
            setGlobalParams("isLoading", true);
            const cloneLibraryData = structuredClone(libraryData);
            const libraryUid = cloneLibraryData.uid;
            delete cloneLibraryData.uid;

            const processData = (rawData: typeof bufferQuestion) => {
                console.log(libraryUid)
                let processedData: typeof bufferQuestion = {};
                // assign new question number and library uid
                Object.keys(sortUidObjectByValue(rawData, "id", true)).map((uid, index) => {
                    processedData[uid] = {
                        ...rawData[uid],
                        id: index + 1,
                        library: libraryUid
                    }
                });
                return sortUidObjectByValue(processedData, "id", true);
            }
            
            // update library data
            firestoreUpdate({
                collectionName: "library",
                originalData: {[libraryUid]: cloneLibraryData}, 
                editedData: {[libraryUid]: {
                    ...cloneLibraryData,
                    totalQuestion: Object.keys(bufferQuestion).length
                }}
            });
            
            // update all question data
            firestoreUpdateQuiz({
                originalData: questionData, 
                editedData: processData(bufferQuestion) as typeof bufferQuestion
            }).then(
                (data) => {
                    setGlobalParams("popUpConfirm", false);
                    setGlobalParams("popUpAction", "");
                    setContentInterfaceParams("saveChangesToggle", false);
                    setContentInterfaceParams("logUpdate", data);
                    setContentInterfaceParams("editMode", false);
                }
            );
        };
    }, [globalParams.popUpConfirm]);

    // warn if autosave is off and question numbers added exceed 25
    useEffect(() => {
        if (!autoSaveToggle) {
            if (Object.keys(bufferQuestion).length - Object.keys(questionData).length > 10) {
                setContentInterfaceParams("autoSaveToggle", !autoSaveToggle);
                setGlobalParams("popUp", true);
                setGlobalParams("popUpAction", "saveChangesToggle");
                setGlobalParams("popUpText", "We recommend to save all changes to prevent data loss")
            }
        }
    }, [targetUidScroll]);

    // listen gg sheet import
    useEffect(() => {
        if (contentInterfaceParams.importSheetToggle) {
            if (ggSheetImport !== undefined) {
                setBufferQuestion((prev) => ({
                    ...prev,
                    ...ggSheetImport
                }));
            }
        }
        setContentInterfaceParams("importSheetToggle", false);
    }, [contentInterfaceParams.importSheetToggle]);

    // Filter by search key
    let filteredQuestion: {[key: string]: {[key: string]: any}} = {};
    for (let index = 0; index < Object.values(bufferQuestion).length; index++) {
        // Each content data
        const question: {[key: string]: any} = Object.values(bufferQuestion)[index];
        // Create combination of all content information for search target
        const search_target = JSON.stringify(question);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(contentInterfaceParams.searchKey.toLowerCase())) {
        filteredQuestion[Object.keys(bufferQuestion)[index]] = question;
        }
    }

    const sortedFilteredQuestionData: {[key: string]: {[key: string]: any}} = sortUidObjectByValue(
        filteredQuestion, "id", contentInterfaceParams.sortAscending
    );

    // Render questions and choices
    let elements: Array<React.ReactNode> = [];

    Object.values(sortedFilteredQuestionData).map((question, index) => {
        // get uid as object key
        const uid = Object.keys(sortedFilteredQuestionData)[index];

        // pre-render choices
        const choicesElements: React.ReactNode[] = [];

        const questionChoices: {[key: string]: any}[] = question.choices;
        
        questionChoices.map((choice, choiceIndex) => {
            choicesElements.push(
                <div 
                    className="edit-placeholder flex flex-col gap-4 bg-highlight dark:bg-highlight-dark"
                    key={uid + choiceIndex}>
                    <div className="edit-placeholder">
                        <label className="flex flex-row justify-start items-center">
                            <Icon icon="font" size={16} />
                            <p>Choice text</p>
                        </label>
                        <textarea className="editor-field" key={1 + choiceIndex * questionChoices.length + choiceKeyToggle}
                            onChange={e => onPlaceholderQuestionChoiceChange(uid, choiceIndex, "choiceText", e.target.value)}
                            defaultValue={choice.choiceText}>
                        </textarea>
                    </div>
                    {(bufferQuestion[uid].mode !== "flashcard") && <div className="edit-placeholder">
                        <label className="flex flex-row justify-start items-center">
                            <Icon icon="mcq" size={16} />
                            <p>Choice answer</p>
                        </label>
                        <button className={`toggle-field ${choice.choiceAnswer ? "toggleOn" : "toggleOff"}`}
                            onClick={() => onPlaceholderQuestionChoiceChange(uid, choiceIndex, "choiceAnswer", !choice.choiceAnswer)}
                            defaultValue={choice.choiceAnswer}>
                            {choice.choiceAnswer ? "TRUE" : "FALSE"}
                        </button>
                    </div>}
                    <div className="edit-placeholder">
                        <label className="flex flex-row justify-start items-center">
                            <Icon icon="font" size={16} />
                            <p>Choice back text</p>
                        </label>
                        <textarea className="editor-field" key={1 + choiceIndex * questionChoices.length + choiceKeyToggle}
                            onChange={e => onPlaceholderQuestionChoiceChange(uid, choiceIndex, "choiceBackText", e.target.value)}
                            defaultValue={choice.choiceBackText}>
                        </textarea>
                    </div>
                    <div className="edit-placeholder">
                        <label className="flex flex-row justify-start items-center">
                            <Icon icon="image" size={16} />
                            <p>Choice image URL</p>
                        </label>
                        <input type="text" className="editor-field" key={1 + choiceIndex * questionChoices.length + choiceKeyToggle}
                            onChange={e => onPlaceholderQuestionChoiceChange(uid, choiceIndex, "choiceImage", e.target.value)}
                            defaultValue={choice.choiceImage}>
                        </input>
                    </div>
                    {choice.choiceImage &&
                        <div className="flex flex-col gap-4 pr-4 py-4">
                        <img src={choice.choiceImage} alt="" className="rounded-xl" />
                    </div>}
                    <div className="flex flex-row items-center gap-2 w-full mt-2">
                        <button
                            onClick={() => {handleDuplicateQuestionChoice(uid, choiceIndex)}}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-2 rounded-[8px] border border-highlight dark:border-highlight-dark hover:text-amber hover:border-amber dark:hover:text-amber-dark dark:hover:border-amber-dark font-bold">
                            <Icon icon="copy" size={16} />
                        </button>
                        <button
                            onClick={() => {handleDeleteQuestionChoice(uid, choiceIndex)}}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-2 rounded-[8px] border border-highlight dark:border-highlight-dark hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                            <Icon icon="trash" size={16} />
                        </button>
                        <div className="h-full mx-2 border-r border-border"></div>
                        <button
                            onClick={() => {handleChoicePositionBackward(uid, choiceIndex)}}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-2 rounded-[8px] border border-highlight dark:border-highlight-dark hover:text-pri hover:border-pri dark:hover:text-pri-dark dark:hover:border-pri-dark font-bold">
                            <Icon icon="left" size={16} />
                        </button>
                        <div className="font-bold">
                            {choiceIndex + 1}
                        </div>
                        <button
                            onClick={() => {handleChoicePositionForward(uid, choiceIndex)}}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-2 rounded-[8px] border border-highlight dark:border-highlight-dark hover:text-pri hover:border-pri dark:hover:text-pri-dark dark:hover:border-pri-dark font-bold">
                            <Icon icon="right" size={16} />
                        </button>
                    </div>
                </div>
            );
        });

        choicesElements.push(
            <button
                onClick={() => handleAddQuestionChoice(uid, bufferQuestion[uid].choices.length)}
                className="add-button p-12" key={uid + 999999999}>
                <Icon icon="add" size={36} />
                <p className="mt-4 text-lg font-bold">NEW CHOICE</p>
            </button>
        );

        elements.push(
            <section id={handleFootprintQuestion(uid, "")} className="card-edit" 
                key={uid}>
                <div aria-label="ref" className="absolute"
                    ref={(element) => {elementsRef.current[uid] = element}}
                    style={{top: `calc(-${cursorPosY}px + 80px)`}}></div>
                <article aria-label="question-header" className="flex flex-wrap gap-4 p-4">
                    <div
                        className="flex flex-row justify-start items-center gap-2 font-bold">
                        <button
                            onClick={() => {onPlaceholderQuestionChange(uid, "id", bufferQuestion[uid].id + 1.5)}}
                            className="edit-placeholder flex flex-row justify-start items-center gap-2 font-bold">
                            <label
                                className='text-sm font-semibold rounded-full'>
                                <Icon icon="down" size={18} />
                            </label>
                        </button>
                        <span
                            id='clear-chip'
                            className='text-2xl font-semibold'>
                            {bufferQuestion[uid].id}
                        </span>
                        <button
                            onClick={() => {onPlaceholderQuestionChange(uid, "id", bufferQuestion[uid].id - 1.5)}}
                            className="edit-placeholder flex flex-row justify-start items-center gap-2 font-bold">
                            <label
                                className='text-sm font-semibold rounded-full'>
                                <Icon icon="up" size={18} />
                            </label>
                        </button>
                    </div>
                    <button
                        onClick={() => toggleQuestionMode(uid, bufferQuestion[uid].mode)}
                        id={handleFootprintQuestion(uid, "mode")}
                        className="edit-placeholder flex flex-row justify-start items-center gap-2 px-2 font-bold">
                        <ChipTextColor chipText={bufferQuestion[uid].mode} chipIcon={bufferQuestion[uid].mode} />
                    </button>
                    <div className="flex flex-row gap-4 md:ml-auto">
                        <button
                            onClick={() => {handleDuplicateQuestion(uid)}}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-1 rounded-[8px] border border-border dark:border-border-dark hover:text-amber hover:border-amber dark:hover:text-amber-dark dark:hover:border-amber-dark font-bold">
                            <Icon icon="copy" size={16} />
                            DUPLICATE
                        </button>
                        <button
                            onClick={() => {handleDeleteQuestion(uid)}}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-1 rounded-[8px] border border-border dark:border-border-dark hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                            <Icon icon="trash" size={16} />
                            DELETE
                        </button>
                    </div>
                </article>
                <article aria-label="question-content" className="flex flex-row border-t border-border dark:border-border-dark">
                    <div className="flex flex-col gap-4 w-full p-4">
                        <div id={handleFootprintQuestion(uid, "questionText")} className="edit-placeholder">
                            <label className="flex flex-row justify-start items-center">
                                <Icon icon="h1" size={16} />
                                <p>Question text</p>
                            </label>
                            <textarea className="editor-field"
                                onChange={e => onPlaceholderQuestionChange(uid, "questionText", e.target.value)}
                                defaultValue={bufferQuestion[uid].questionText}>
                            </textarea>
                        </div>
                        <div id={handleFootprintQuestion(uid, "questionSection")} className="edit-placeholder">
                            <label className="flex flex-row justify-start items-center">
                                <Icon icon="card" size={16} />
                                <p>Question section</p>
                            </label>
                            <input type="text" className="editor-field"
                                onChange={e => onPlaceholderQuestionChange(uid, "questionSection", e.target.value)}
                                defaultValue={bufferQuestion[uid].questionSection}>
                            </input>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full p-4">
                        <div id={handleFootprintQuestion(uid, "questionBackText")} className="edit-placeholder">
                            <label className="flex flex-row justify-start items-center">
                                <Icon icon="font" size={16} />
                                <p>Question back text</p>
                            </label>
                            <textarea className="editor-field"
                                onChange={e => onPlaceholderQuestionChange(uid, "questionBackText", e.target.value)}
                                defaultValue={bufferQuestion[uid].questionBackText}>
                            </textarea>
                        </div>  
                        <div id={handleFootprintQuestion(uid, "questionImage")} className="edit-placeholder">
                            <label className="flex flex-row justify-start items-center">
                                <Icon icon="image" size={16} />
                                <p>Question image URL</p>
                            </label>
                            <input type="text" className="editor-field"
                                onChange={e => onPlaceholderQuestionChange(uid, "questionImage", e.target.value)}
                                defaultValue={bufferQuestion[uid].questionImage}>
                            </input>
                        </div>
                    </div>
                    {bufferQuestion[uid].questionImage && 
                        <div className="flex flex-col gap-4 pr-4 py-4">
                            <img src={bufferQuestion[uid].questionImage} alt="" className="rounded-xl" />
                        </div>}
                </article>
                <article aria-label="question-choice" className="-scroll-none flex flex-row gap-4 overflow-x-scroll w-full p-4 border-t border-border dark:border-border-dark">
                    {choicesElements}
                </article>
            </section>
        );
    });

    // question nav
    let same_topic_choice_nav: React.ReactNode[] = [];
    let question_nav: React.ReactNode[] = [];
    
    if (Object.keys(sortedFilteredQuestionData).length > 0) {
        let current_topic: string = Object.values(sortedFilteredQuestionData)[0].questionSection;
        // push the first topic
        question_nav.push(<h5 className="mb-4 px-4" key={current_topic + "0"}>{current_topic ? current_topic : "No section"}</h5>);

        for (let i = 0; i < Object.keys(sortedFilteredQuestionData).length; i++) {
            // get uid
            const uid = Object.keys(sortedFilteredQuestionData)[i];

            // Check topic
            if (current_topic != Object.values(sortedFilteredQuestionData)[i].questionSection) {
                // Push current topic questions
                question_nav.push(
                    <div key={current_topic + "nav" + i} className='pb-4 flex flex-col'>
                        {same_topic_choice_nav}
                    </div>
                );
    
                // Set new topic
                current_topic = Object.values(sortedFilteredQuestionData)[i].questionSection;
                question_nav.push(
                    <h5 className="mb-4 px-4" key={current_topic + i}>{current_topic ? current_topic : "No section"}</h5>
                );
                
                // Reset
                same_topic_choice_nav = [];
            }
    
            same_topic_choice_nav.push(
                <button
                    className="flex flex-row items-center px-4 py-2 border-t border-border dark:border-border-dark hover:bg-black/10 dark:hover:bg-white/10 ease-in-out duration-50"
                    key={i}
                    onClick={() => scrollToRef(uid)}>
                    <p className="font-bold">{i + 1}</p>
                    <TextColor chipText={bufferQuestion[uid].mode.toLocaleUpperCase()[0]} />
                    <p className="ml-2 text-xs whitespace-nowrap overflow-hidden">
                        {bufferQuestion[uid].questionText}
                    </p>
                </button>
            );
        }
    }
    
    same_topic_choice_nav.push(
        <button
            id='card-nav-neu'
            className="flex flex-row items-center justify-center gap-2 m-2"
            key={"add"}
            onClick={() => setContentInterfaceParams("addQuestionToggle", !contentInterfaceParams.addQuestionToggle)}>
            <Icon icon="add" size={16} />
            Add new question
        </button>
    );

    // Push current topic questions, lastly
    question_nav.push(
        <div className='pb-4 flex flex-col' key="add-container">
            {same_topic_choice_nav}
        </div>
    );

    return (
        <div className='flex flex-col'>
            <div id='editor-two-cols-fixed' key='interface'>

                <aside id="quiz-col-scroll-aside" className='-scroll-none relative pt-[90px]' key='interface-aside'>
                    <div className="border-t border-border dark:border-border-dark"></div>
                    <section className="px-2 py-4 flex flex-row items-center">
                        <button 
                            onClick={() => setAutoSaveToggle((prev) => (!prev))}
                            className="controller-menu text-sm">
                            <Icon icon="save" size={16} />
                            AUTOSAVE {autoSaveToggle ? "ON " + autoSaveClock : "OFF"}
                        </button>
                        {autoSaveToggle && <button 
                            onClick={() => toggleAutosaveClock()}
                            className="controller-menu ml-auto text-sm">
                            DEFAULT {defaultAutosaveTime}
                        </button>}
                    </section>
                    <section className='pt-4 h-max overflow-y-scroll' key='interface-aside-section-2'>
                        {question_nav}
                    </section>
                </aside>

                <main id="quiz-col-scroll-main" className='-scroll-none' key='interface-main'>
                    <section className='mt-[90px] m-4' key='interface-aside-section-1'>
                        <h3 className='my-4'>{libraryData.name}</h3>
                    </section>
                    <section className="flex flex-col gap-8 mx-4">
                        {elements}
                    </section>
                </main>
            </div>
            <div className="glass-cover-spread"></div>
            <div className="absolute h-full w-full z-[-30] bg-highlight/90 dark:bg-highlight-dark/90"></div>
            <img src={libraryData.image ? libraryData.image : BG} alt="" height={1000} width={1000} className="fixed z-[-50] w-full h-full object-cover hidden dark:inline dark:brightness-50"/>
        </div>
    );
}
