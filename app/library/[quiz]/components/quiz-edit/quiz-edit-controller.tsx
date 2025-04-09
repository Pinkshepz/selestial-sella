"use client";

//// 1.1 Metadata & module & framework
import metadata from "@/metadata.json";
import { useState, useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider"
import { useLocalQuizContext } from "@/app/library/[quiz]/local-quiz-provider";

//// 1.3 React components
import Library from "@/app/utility/interface/interface-library";
import Question from "@/app/utility/interface/interface-quiz";

//// 1.4 Utility functions
import firestoreUpdate from "@/app/utility/firestore/firestore-manager-library";
import firestoreUpdateQuiz from "@/app/utility/firestore/firestore-manager-quiz";
import { processAddQuestion, processInsertArrayDataString } from "./quiz-edit-function-general";
import arrayIndexOf from "@/app/utility/function/array/array-index-of";

//// 1.5 Public and others
import Icon from "@/public/icon";


export default function ControllerEdit ({
    libraryData,
    questionData
}: {
    libraryData: Library,
    questionData: {[key: string]: Question}, // {uid: {each question}}
}) {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // connect to interface context
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();

    const [autosaveToggle, setAutosaveToggle] = useState(metadata.autosaveMinuteClocks[2]);
    const [autosaveTimer, setAutosaveTimer] = useState(300);

    const handleSearchKeyChange = (searchKey: string) => {
        setLocalQuizContextParams("searchKey", searchKey);
    }

    // Manage autosave mechanism in the editmode
    const CLOCK: number[] = metadata.autosaveMinuteClocks;
    const defaultCLOCK = CLOCK[3];

    const toggleAutosaveClock = (): void => {
        const currentIndex: number = CLOCK.indexOf(autosaveToggle);
        // change to next clock option
        setAutosaveToggle(CLOCK[(currentIndex + 1) % CLOCK.length]);
        setAutosaveTimer(CLOCK[(currentIndex + 1) % CLOCK.length] * 60);
        return;
    };

    // autosave clock countdown
    const [time, setTime] = useState(Date.now());

    // run autosave clock
    useEffect(() => {
        if (autosaveTimer > 0) {
            const interval = setInterval(() => setTime(Date.now()), 1000);
            setAutosaveTimer(autosaveTimer - 1);
            return () => {
                clearInterval(interval);
            };
        }
    }, [time, autosaveToggle]);

    ////// B.VIII useEffect to run autosave
    useEffect(() => {
        if (autosaveTimer === 0) {
            console.log("A");
            setGlobalParams("isLoading", true);
            const libraryUid = libraryData.uid
            
            // Update library data
            firestoreUpdate({
                firebaseBranch: "ALPHA",
                collectionName: "library",
                originalData: {[libraryUid!]: libraryData}, 
                editedData: {[libraryUid!]: localQuizContextParams.bufferLibrary}
            });
            firestoreUpdate({
                firebaseBranch: "BETA",
                collectionName: "library",
                originalData: {[libraryUid!]: libraryData}, 
                editedData: {[libraryUid!]: localQuizContextParams.bufferLibrary}
            });
            
            // Update all question data
            firestoreUpdateQuiz({
                firebaseBranch: "ALPHA",
                originalData: questionData, 
                editedData: localQuizContextParams.bufferQuestion
            })
            firestoreUpdateQuiz({
                firebaseBranch: "BETA",
                originalData: questionData, 
                editedData: localQuizContextParams.bufferQuestion
            }).then(
                () => {
                    setGlobalParams("isLoading", false);
                    setAutosaveTimer(autosaveToggle * 60);
                    setTime(Date.now());
                }
            );
        }
    }, [autosaveTimer]);

    // manage editing mode on and off
    useEffect(() => {
        if (globalParams.popUpConfirm &&
            (globalParams.popUpAction.toString().includes("turnEditMode"))) {
            setLocalQuizContextParams("editMode", !localQuizContextParams.editMode);
            setAutosaveToggle(defaultCLOCK);
            setGlobalParams("popUpConfirm", false);
            setGlobalParams("popUpAction", "");
        }
    }, [globalParams]);

    return (
        <section className="controller-area">
            <div className="controller-island">

                {!localQuizContextParams.editMode && (Object.keys(localQuizContextParams.logUpdate).length === 0) &&
                    <button
                        onClick={() => {
                            setGlobalParams("isLoading", true);
                            if (window !== undefined) {
                                window.location.reload();
                            }
                        }}
                        className="controller-menu -smooth-appear">
                        <Icon icon="left" size={16} />
                        <p>BACK TO QUIZ PAGE</p>
                    </button>
                }

                {(Object.keys(localQuizContextParams.logUpdate).length > 0) &&
                    <button
                        onClick={() => {
                            setLocalQuizContextParams("logUpdate", {});
                            setGlobalParams("isLoading", true);
                            if (window !== undefined) {
                                window.location.reload();
                            }
                        }}
                        className="controller-menu -smooth-appear">
                        <Icon icon="left" size={16} />
                        <p>BACK TO QUIZ PAGE</p>
                    </button>
                }

                {localQuizContextParams.editMode && 
                    <button
                        onClick={() => {
                            setGlobalParams("popUpConfirm", false);
                            setLocalQuizContextParams("discardChangesToggle", !localQuizContextParams.discardChangesToggle);
                            setGlobalParams("popUp", true);
                            setGlobalParams("popUpAction", "discardChangesToggle");
                            setGlobalParams("popUpText", "Discard all changes, your question data will be recovered to the original one");
                        }}
                        className="controller-menu -smooth-appear">
                        <Icon icon="trash" size={16} />
                        <p>DISCARD CHANGES</p>
                    </button>
                }

                {localQuizContextParams.editMode && 
                    <button
                        onClick={() => setLocalQuizContextParams("sortAscending", !localQuizContextParams.sortAscending)}
                        className="controller-menu -smooth-appear">
                        <Icon icon="sort" size={16} />
                        <p>{localQuizContextParams.sortAscending ? "0 - 9" : "9 - 0"}</p>
                    </button>
                }

                <div className="controller-menu -smooth-appear">
                    <Icon icon="search" size={16} />
                    <span className="input-field" id="quizSearch"
                        contentEditable={true} suppressContentEditableWarning={true}
                        onInput={e => handleSearchKeyChange(e.currentTarget.textContent!)}>
                    </span>
                    {!localQuizContextParams.searchKey && <span className="absolute left-[34px] z-[-10] text-sm">SEARCH QUIZ</span>}
                </div>

                {localQuizContextParams.editMode && 
                    <button
                        onClick={() => {
                            if (Object.keys(localQuizContextParams.bufferQuestion).length < metadata.entityLimit.question) {
                                const processedBufferQuestion = processAddQuestion({
                                    questionModality: localQuizContextParams.currentQuestionModality,
                                    bufferQuestion: localQuizContextParams.bufferQuestion,
                                    libraryUid: libraryData.uid!
                                });
                                setLocalQuizContextParams("bufferQuestion", processedBufferQuestion.newBufferQuestion);
                                setLocalQuizContextParams("bufferLibrary", processInsertArrayDataString({
                                    object: localQuizContextParams.bufferLibrary,
                                    keysHierachyToTargetObjectUidSequenceArray: ["questionUidOrder"],
                                    targetValueToInsert: processedBufferQuestion.newQuestionUid,
                                    insertPosition: localQuizContextParams.currentQuestionUid 
                                        ? arrayIndexOf({array:localQuizContextParams.bufferLibrary.questionUidOrder, targetValue: localQuizContextParams.currentQuestionUid, indexIfError: -2}) + 1
                                        : -1
                                }));
                                setLocalQuizContextParams("currentQuestionUid", processedBufferQuestion.newQuestionUid);
                                setLocalQuizContextParams("searchKey", "");
                                document.getElementById("quizSearch")!.textContent = "";
                            } else {
                                setGlobalParams("popUp", true);
                                setGlobalParams("popUpAction", "⟨EXCEPTION⟩: entity limit");
                                setGlobalParams("popUpText", `Total questions exceeds limit at ${metadata.entityLimit.question} questions per library`);
                            }
                        }}
                        className="controller-menu -smooth-appear">
                        <Icon icon="add" size={16} />
                        <p>ADD NEW QUESTION</p>
                    </button>
                }

                {localQuizContextParams.editMode && 
                    <button
                        onClick={() => {
                            setGlobalParams("popUpConfirm", false);
                            setLocalQuizContextParams("saveChangesToggle", !localQuizContextParams.saveChangesToggle)
                            setGlobalParams("popUp", true);
                            setGlobalParams("popUpAction", "saveChangesToggle");
                            setGlobalParams("popUpText", "Save all recent changes. All data will be permanently updated");
                        }}
                        className="controller-menu -smooth-appear">
                        <Icon icon="save" size={16} />
                        <p>SAVE CHANGES</p>
                    </button>
                }

                {localQuizContextParams.editMode && 
                    <button
                        onClick={() => toggleAutosaveClock()}
                        className={`controller-menu -smooth-appear ${(autosaveTimer <= 30) && (autosaveTimer >= 0) && (autosaveTimer % 2 == 0) && "text-amber dark:text-amber-dark"}`}>
                        {(autosaveToggle < 0)  ? <Icon icon="xCircle" size={16} /> : <Icon icon="true" size={16} />}
                        <p>{(autosaveToggle < 0) 
                            ? `AUTOSAVE OFF` 
                            : (autosaveTimer < 60)
                                ? `AUTOSAVE IN ${autosaveTimer} SEC`
                                : `AUTOSAVE IN ${Math.round(autosaveTimer / 60)} MIN`}</p>
                    </button>
                }

                {localQuizContextParams.editMode &&
                    <button
                        onClick={() => {
                            setGlobalParams("popUp", true);
                            setGlobalParams("popUpAction", localQuizContextParams.editMode ? "turnEditModeOff" : "turnEditModeOn");
                            setGlobalParams("popUpText", localQuizContextParams.editMode ? 
                                "Turn editing mode off. All unsaved changes will be ignored" : 
                                `Turn editing mode on as ${globalParams.user.displayName}`)
                        }}
                        className="controller-menu -smooth-appear">
                        <Icon icon={!localQuizContextParams.editMode ? "edit" : "map"} size={16} />
                        <p>{localQuizContextParams.editMode ? "EXIT EDIT MODE" : "ENTER EDIT MODE"}</p>
                    </button>
                }
                
                <button className="controller-menu -smooth-appear" 
                    onClick={() => setLocalQuizContextParams("themeToggle", !localQuizContextParams.themeToggle)}>
                    <Icon icon={localQuizContextParams.themeToggle ? "wind" : "sparkles"} size={16} />
                   <p>{localQuizContextParams.themeToggle ? "JET BLACK THEME" : "MIDNIGHT BLUE THEME"}</p>
                </button>

            </div>
        </section>
    );
}
