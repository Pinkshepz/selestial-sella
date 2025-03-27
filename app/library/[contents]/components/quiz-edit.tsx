"use client";

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import metadata from "@/metadata.json";
import { useState, useEffect, useRef } from "react";
import firestoreUpdate from "../../../libs/firestore/firestore-manager";
import firestoreUpdateQuiz from "@/app/libs/firestore/firestore-manager-quiz";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useContentInterfaceContext } from "../content-provider";

//// 1.3 React components
import { ChipTextColor, TextColor } from "@/app/libs/components/chip";

//// 1.4 Utility functions
import makeid from "@/app/libs/function/make-id";
import sortUidObjectByValue from "@/app/libs/function/sort-uid-object-by-value";

//// 1.5 Public and others
import Icon from "@/public/icon";


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================

const BG = "https://media.suara.com/pictures/653x366/2019/12/19/95933-aurora.jpg"; // Default background image


// =========================================================================
// 3. LOCAL COMPONENTS
// =========================================================================

// NONE


// =========================================================================
// 4. EXPORT DEFAULT FUNCTION
// =========================================================================
    
export default function EditorInterface ({
    libraryData,
    questionData
}: {
    libraryData: {[key: string]: string}, // {uid: {library data}}
    questionData: {[key: string]: {[key: string]: any}}, // {uid: {each question}}
}): React.ReactNode {

    //// =========================================================================
    //// A. REACT HOOKS AND HANDLING FUNCTION
    //// =========================================================================

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/[quiz]/*
    const {contentInterfaceParams, setContentInterfaceParams} = useContentInterfaceContext();

    ////// A.III useState storing buffer data (duplicate of original data for live editing)
    const [bufferQuestion, setBufferQuestion] = useState(questionData);

    ////// A.IV Current modality of question for determining editing interface and default modality
    const [currentQuestionModality, setCurrentQuestionModality] = useState("flashcard");

    ////// A.V Current section of question for default section value after adding new question
    const [currentQuestionSection, setCurrentQuestionSection] = useState("");

    ////// A.VI <Toggle> reset all questions id for rearranging after adding, duplicating, deleting and moving question
    const [toggleResetQuestionId, setToggleResetQuestionId] = useState(false);

    ////// A.VII choice key toggle
    const [choiceKeyToggle, setChoiceKeyToggle] = useState(1);

    ////// A.IX ref for elementsEditQuiz
    const elementsRef: {[key: string]: any} = useRef({});

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
        if (toggleResetQuestionId) {
            const processData = (): typeof bufferQuestion => {
                let processedData: typeof bufferQuestion = {};
                // assign new question number and library uid
                Object.keys(sortUidObjectByValue(bufferQuestion, "id", true)).map((uid, index) => {
                    processedData[uid] = {
                        ...bufferQuestion[uid],
                        id: index + 1
                    }
                });
                setToggleResetQuestionId(false);
                return sortUidObjectByValue(processedData, "id", true);
            }
            setBufferQuestion(processData());
        }
    }, [toggleResetQuestionId]);

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
        setToggleResetQuestionId(true);
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
                    mode: currentQuestionModality,
                    libraryFootprint: libraryData.id, // for recover deleted library
                    questionSection: currentQuestionSection,
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
            setToggleResetQuestionId(true);
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
            setCurrentQuestionSection(targetValue);
        }
        // if id change -> reset id
        if (targetKey == "id") {
            setToggleResetQuestionId(true);
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

    // toggle question mode ["singleChoice", "multipleChoice", "flashcard", "binary", "dropdown", "tabular", "completion"]
    const MODE: string[] = ["singleChoice", "multipleChoice", "flashcard"];
    const toggleQuestionMode = (uid: string, currentMode: string): void => {
        const currentIndex: number = MODE.indexOf(currentMode);
        // change to next mode
        onPlaceholderQuestionChange(uid, "mode", MODE[(currentIndex + 1) % MODE.length]);
        setCurrentQuestionModality(MODE[(currentIndex + 1) % MODE.length]);
        return;
    };

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
        if (contentInterfaceParams.autosaveTimer === 0) {
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
                firebaseBranch: "ALPHA",
                collectionName: "library",
                originalData: {[libraryUid]: cloneLibraryData}, 
                editedData: {[libraryUid]: {
                    ...cloneLibraryData,
                    totalQuestion: Object.keys(bufferQuestion).length
                }}
            });
            firestoreUpdate({
                firebaseBranch: "BETA",
                collectionName: "library",
                originalData: {[libraryUid]: cloneLibraryData}, 
                editedData: {[libraryUid]: {
                    ...cloneLibraryData,
                    totalQuestion: Object.keys(bufferQuestion).length
                }}
            });

            // update all question data
            firestoreUpdateQuiz({
                firebaseBranch: "ALPHA",
                originalData: questionData, 
                editedData: processData(bufferQuestion)
            })
            firestoreUpdateQuiz({
                firebaseBranch: "BETA",
                originalData: questionData, 
                editedData: processData(bufferQuestion)
            }).then(
                () => {
                    setGlobalParams("isLoading", false);
                    setContentInterfaceParams("autosaveTimer", contentInterfaceParams.autosaveToggle * 60);
                }
            );
        }
    }, [contentInterfaceParams.autosaveTimer]);

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
                firebaseBranch: "ALPHA",
                collectionName: "library",
                originalData: {[libraryUid]: cloneLibraryData}, 
                editedData: {[libraryUid]: {
                    ...cloneLibraryData,
                    totalQuestion: Object.keys(bufferQuestion).length
                }}
            });
            firestoreUpdate({
                firebaseBranch: "BETA",
                collectionName: "library",
                originalData: {[libraryUid]: cloneLibraryData}, 
                editedData: {[libraryUid]: {
                    ...cloneLibraryData,
                    totalQuestion: Object.keys(bufferQuestion).length
                }}
            });
            
            // update all question data
            firestoreUpdateQuiz({
                firebaseBranch: "ALPHA",
                originalData: questionData, 
                editedData: processData(bufferQuestion) as typeof bufferQuestion
            })
            firestoreUpdateQuiz({
                firebaseBranch: "BETA",
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
        if (contentInterfaceParams.autoSaveToggle < 0) {
            if (Object.keys(bufferQuestion).length - Object.keys(questionData).length > 10) {
                setGlobalParams("popUp", true);
                setGlobalParams("popUpAction", "saveChangesToggle");
                setGlobalParams("popUpText", "We recommend to save all changes to prevent data loss")
            }
        }
    }, [Object.keys(bufferQuestion).length]);

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
    let elementsEditQuiz: React.ReactNode = <></>;

    try {
        const question = sortedFilteredQuestionData[contentInterfaceParams.currentQuizUid];
        const choicesElements: React.ReactNode[] = [];
        const questionChoices: {[key: string]: any}[] = Object.values(question.choices);
        
        questionChoices.map((choice, choiceIndex) => {
            choicesElements.push(
                <div 
                    className="edit-placeholder flex flex-col gap-4 bg-highlight dark:bg-highlight-dark"
                    key={contentInterfaceParams.currentQuizUid + choiceIndex}>
                    <div className="edit-placeholder">
                        <label className="flex flex-row justify-start items-center">
                            <Icon icon="font" size={16} />
                            <p>Choice text</p>
                        </label>
                        <textarea className="editor-field" key={1 + choiceIndex * questionChoices.length + choiceKeyToggle}
                            onChange={e => onPlaceholderQuestionChoiceChange(contentInterfaceParams.currentQuizUid, choiceIndex, "choiceText", e.target.value)}
                            defaultValue={choice.choiceText}>
                        </textarea>
                    </div>
                    {(bufferQuestion[contentInterfaceParams.currentQuizUid].mode !== "flashcard") && <div className="edit-placeholder">
                        <label className="flex flex-row justify-start items-center">
                            <Icon icon="mcq" size={16} />
                            <p>Choice answer</p>
                        </label>
                        <button className={`toggle-field ${choice.choiceAnswer ? "toggleOn" : "toggleOff"}`}
                            onClick={() => onPlaceholderQuestionChoiceChange(contentInterfaceParams.currentQuizUid, choiceIndex, "choiceAnswer", !choice.choiceAnswer)}
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
                            onChange={e => onPlaceholderQuestionChoiceChange(contentInterfaceParams.currentQuizUid, choiceIndex, "choiceBackText", e.target.value)}
                            defaultValue={choice.choiceBackText}>
                        </textarea>
                    </div>
                    <div className="edit-placeholder">
                        <label className="flex flex-row justify-start items-center">
                            <Icon icon="image" size={16} />
                            <p>Choice image URL</p>
                        </label>
                        <input type="text" className="editor-field" key={1 + choiceIndex * questionChoices.length + choiceKeyToggle}
                            onChange={e => onPlaceholderQuestionChoiceChange(contentInterfaceParams.currentQuizUid, choiceIndex, "choiceImage", e.target.value)}
                            defaultValue={choice.choiceImage}>
                        </input>
                    </div>
                    {choice.choiceImage &&
                        <div className="flex flex-col gap-4 pr-4 py-4">
                        <img src={choice.choiceImage} alt="" className="rounded-xl" />
                    </div>}
                    <div className="flex flex-row items-center gap-2 w-full mt-2">
                        <button
                            onClick={() => {handleDuplicateQuestionChoice(contentInterfaceParams.currentQuizUid, choiceIndex)}}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-2 rounded-[8px] border border-highlight dark:border-highlight-dark hover:text-amber hover:border-amber dark:hover:text-amber-dark dark:hover:border-amber-dark font-bold">
                            <Icon icon="copy" size={16} />
                        </button>
                        <button
                            onClick={() => {handleDeleteQuestionChoice(contentInterfaceParams.currentQuizUid, choiceIndex)}}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-2 rounded-[8px] border border-highlight dark:border-highlight-dark hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                            <Icon icon="trash" size={16} />
                        </button>
                        <div className="h-full mx-2 border-r border-border"></div>
                        <button
                            onClick={() => {handleChoicePositionBackward(contentInterfaceParams.currentQuizUid, choiceIndex)}}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-2 rounded-[8px] border border-highlight dark:border-highlight-dark hover:text-pri hover:border-pri dark:hover:text-pri-dark dark:hover:border-pri-dark font-bold">
                            <Icon icon="left" size={16} />
                        </button>
                        <div className="font-bold">
                            {choiceIndex + 1}
                        </div>
                        <button
                            onClick={() => {handleChoicePositionForward(contentInterfaceParams.currentQuizUid, choiceIndex)}}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-2 rounded-[8px] border border-highlight dark:border-highlight-dark hover:text-pri hover:border-pri dark:hover:text-pri-dark dark:hover:border-pri-dark font-bold">
                            <Icon icon="right" size={16} />
                        </button>
                    </div>
                </div>
            );
        });
    
        choicesElements.push(
            <button
                onClick={() => handleAddQuestionChoice(contentInterfaceParams.currentQuizUid, bufferQuestion[contentInterfaceParams.currentQuizUid].choices.length)}
                className="add-button p-12" key={contentInterfaceParams.currentQuizUid + 999999999}>
                <Icon icon="add" size={36} />
                <p className="mt-4 text-lg font-bold">NEW CHOICE</p>
            </button>
        );
    
        elementsEditQuiz = (
            <section id={handleFootprintQuestion(contentInterfaceParams.currentQuizUid, "")} 
                key={contentInterfaceParams.currentQuizUid}>
                <article aria-label="question-header" className="flex flex-wrap gap-4 p-4">
                    <div
                        className="flex flex-row justify-start items-center gap-2 font-bold">
                        <button
                            onClick={() => {onPlaceholderQuestionChange(contentInterfaceParams.currentQuizUid, "id", bufferQuestion[contentInterfaceParams.currentQuizUid].id + 1.5)}}
                            className="edit-placeholder flex flex-row justify-start items-center gap-2 font-bold">
                            <label
                                className='text-sm font-semibold rounded-full'>
                                <Icon icon="down" size={18} />
                            </label>
                        </button>
                        <span
                            id='clear-chip'
                            className='text-2xl font-semibold'>
                            {bufferQuestion[contentInterfaceParams.currentQuizUid].id}
                        </span>
                        <button
                            onClick={() => {onPlaceholderQuestionChange(contentInterfaceParams.currentQuizUid, "id", bufferQuestion[contentInterfaceParams.currentQuizUid].id - 1.5)}}
                            className="edit-placeholder flex flex-row justify-start items-center gap-2 font-bold">
                            <label
                                className='text-sm font-semibold rounded-full'>
                                <Icon icon="up" size={18} />
                            </label>
                        </button>
                    </div>
                    <button
                        onClick={() => toggleQuestionMode(contentInterfaceParams.currentQuizUid, bufferQuestion[contentInterfaceParams.currentQuizUid].mode)}
                        id={handleFootprintQuestion(contentInterfaceParams.currentQuizUid, "mode")}
                        className="edit-placeholder flex flex-row justify-start items-center gap-2 px-2 font-bold">
                        <ChipTextColor chipText={bufferQuestion[contentInterfaceParams.currentQuizUid].mode} chipIcon={bufferQuestion[contentInterfaceParams.currentQuizUid].mode} />
                    </button>
                    <div className="flex flex-row gap-4 md:ml-auto">
                        <button
                            onClick={() => {handleDuplicateQuestion(contentInterfaceParams.currentQuizUid)}}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-1 rounded-[8px] border border-border dark:border-border-dark hover:text-amber hover:border-amber dark:hover:text-amber-dark dark:hover:border-amber-dark font-bold">
                            <Icon icon="copy" size={16} />
                            DUPLICATE
                        </button>
                        <button
                            onClick={() => {handleDeleteQuestion(contentInterfaceParams.currentQuizUid)}}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-1 rounded-[8px] border border-border dark:border-border-dark hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                            <Icon icon="trash" size={16} />
                            DELETE
                        </button>
                    </div>
                </article>
                <article aria-label="question-content" className="flex flex-row border-t border-border dark:border-border-dark">
                    <div className="flex flex-col gap-4 w-full p-4">
                        <div id={handleFootprintQuestion(contentInterfaceParams.currentQuizUid, "questionText")} className="edit-placeholder">
                            <label className="flex flex-row justify-start items-center">
                                <Icon icon="h1" size={16} />
                                <p>Question text</p>
                            </label>
                            <textarea className="editor-field" rows={5}
                                onChange={e => onPlaceholderQuestionChange(contentInterfaceParams.currentQuizUid, "questionText", e.target.value)}
                                defaultValue={bufferQuestion[contentInterfaceParams.currentQuizUid].questionText}>
                            </textarea>
                        </div>
                        <div id={handleFootprintQuestion(contentInterfaceParams.currentQuizUid, "questionSection")} className="edit-placeholder">
                            <label className="flex flex-row justify-start items-center">
                                <Icon icon="card" size={16} />
                                <p>Question section</p>
                            </label>
                            <input type="text" className="editor-field"
                                onChange={e => onPlaceholderQuestionChange(contentInterfaceParams.currentQuizUid, "questionSection", e.target.value)}
                                defaultValue={bufferQuestion[contentInterfaceParams.currentQuizUid].questionSection}>
                            </input>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full p-4">
                        <div id={handleFootprintQuestion(contentInterfaceParams.currentQuizUid, "questionBackText")} className="edit-placeholder">
                            <label className="flex flex-row justify-start items-center">
                                <Icon icon="font" size={16} />
                                <p>Question back text</p>
                            </label>
                            <textarea className="editor-field" rows={5}
                                onChange={e => onPlaceholderQuestionChange(contentInterfaceParams.currentQuizUid, "questionBackText", e.target.value)}
                                defaultValue={bufferQuestion[contentInterfaceParams.currentQuizUid].questionBackText}>
                            </textarea>
                        </div>  
                        <div id={handleFootprintQuestion(contentInterfaceParams.currentQuizUid, "questionImage")} className="edit-placeholder">
                            <label className="flex flex-row justify-start items-center">
                                <Icon icon="image" size={16} />
                                <p>Question image URL</p>
                            </label>
                            <input type="text" className="editor-field"
                                onChange={e => onPlaceholderQuestionChange(contentInterfaceParams.currentQuizUid, "questionImage", e.target.value)}
                                defaultValue={bufferQuestion[contentInterfaceParams.currentQuizUid].questionImage}>
                            </input>
                        </div>
                    </div>
                    {bufferQuestion[contentInterfaceParams.currentQuizUid].questionImage && 
                        <div className="flex flex-col gap-4 pr-4 py-4">
                            <img src={bufferQuestion[contentInterfaceParams.currentQuizUid].questionImage} alt="" className="rounded-xl" />
                        </div>}
                </article>
                <article aria-label="question-choice" className="-scroll-none grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-x-scroll w-full p-4 border-t border-border dark:border-border-dark">
                    {choicesElements}
                </article>
            </section>
        );
    } catch (error) {
        elementsEditQuiz = (
            <div className="my-auto text-textSlate dark:text-textSlate-dark flex flex-col justify-center items-center text-center" key="blank">
                <Icon icon="edit" size={48} />
                <h1>Choose quiz to edit</h1>
            </div>
        );
    }

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
                    className="flex flex-row items-center gap-2 px-4 py-2 border-t border-border dark:border-border-dark hover:bg-black/10 dark:hover:bg-white/10 ease-in-out duration-50"
                    key={i}
                    onClick={() => setContentInterfaceParams("currentQuizUid", uid)}>
                    <p className="font-bold">{i + 1}</p>
                    <TextColor chipText={bufferQuestion[uid].mode.toLocaleUpperCase()[0]} />
                    <p className="text-xs whitespace-nowrap overflow-hidden">
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

            <div id='editor-two-cols-fixed' className='-border-t' key='interface'>

                <aside id="quiz-col-scroll-aside" className='-scroll-none relative -border-r' key='interface-aside'>
                    <strong className="mx-4 mt-4">{`QUIZ ${libraryData.id}`}</strong>
                    <h1 className="mx-4">{libraryData.name.toLocaleUpperCase()}</h1>
                    <section className='pt-4 h-max overflow-y-scroll' key='interface-aside-section-2'>
                        {question_nav}
                    </section>
                </aside>

                <main id="quiz-col-scroll-main" className='overflow-y-auto' key='interface-main'>
                    {elementsEditQuiz}
                </main>
            </div>
            <div className="fixed bottom-0 w-dvw h-dvh z-[-100]">
                <img src={libraryData.image ? libraryData.image : BG} alt="" className="absolute h-full w-full z-[-100]" />
                <div className="absolute h-full w-full z-[-90] bg-highlight/95 dark:bg-highlight-dark/90"></div>
                <div className="glass-cover-spread z-[-80]"></div>
            </div>
        </div>
    );
}
