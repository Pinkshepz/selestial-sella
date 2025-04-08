"use client";

// app/library/[quiz]/components/quiz-edit/quiz-edit-component-main-C-mcq.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import metadata from "@/metadata.json";
import React, { useState } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useLocalQuizContext } from "@/app/library/[quiz]/local-quiz-provider";

//// 1.3 React components
import AuricleText from "@/app/utility/components/auricleText";

//// 1.4 Utility functions
import objectKeyValueUpdate from "@/app/utility/function/object/object-dynamic-change";
import objectKeyDelete from "@/app/utility/function/object/object-dynamic-delete";
import objectKeyRetrieve from "@/app/utility/function/object/object-key-retrieve";

import { processSwapArrayDataString, processInsertArrayDataString, processDeleteArrayDataString } from "./quiz-edit-function-general";
import { processAddQuestionChoice, processDuplicateQuestionChoice, processToggleChoiceAnswer } from "./quiz-edit-function-mcq";

import arrayIndexOf from "@/app/utility/function/array/array-index-of";

//// 1.5 Public and others
import Icon from "@/public/icon";
import { ChipTextColor } from "@/app/utility/components/chip";


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function QuizEditMain_C_MCQ (): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/[quiz]/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();

    ////// A.III useState current focused choice uid
    const [currentChoiceUid, setCurrentChoiceUid] = useState("");

    ////// A.IV useState toggle card display: grid or flex-row
    const [choiceCardView, toggleChoiceCardView] = useState(true);
    

    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS & COMPONENT
    //// -------------------------------------------------------------------------

    const rootKeysHierachy: string[] = [
        localQuizContextParams.currentQuestionUid,
        "questionData",
        localQuizContextParams.currentQuestionModality
    ];

    const currentQuestionData = objectKeyRetrieve({
        object: localQuizContextParams.bufferQuestion,
        keysHierachy: rootKeysHierachy
    });

    const currentChoiceData = objectKeyRetrieve({
        object: localQuizContextParams.bufferQuestion,
        keysHierachy: [...rootKeysHierachy, "questionChoices", currentChoiceUid]
    });

    const choiceLimit: number = metadata.entityLimit.choice;

    ////// -------------------------------------------------------------------------
    ////// GENERAL

    ////// B.I Function to dynamically update object dataX
    const handleQuestionKeyValueUpdate = ({
        keysHierachy, // [key_1, key_2, key_3, ..., key_n]
        targetValue // Newly assigned value of key_n
    }: {
        keysHierachy: string[],
        targetValue: any
    }): void => {
        try {
            setLocalQuizContextParams("bufferQuestion", objectKeyValueUpdate({
                object: localQuizContextParams.bufferQuestion,
                keysHierachy: keysHierachy,
                targetValue:  targetValue
            }));
        } catch (error) {null}
    }

    ////// B.IIa Function to add new line (Auricle text)
    const handleAddNewLine = ({
        choiceUid,
        choiceDataProperty
    }: {
        choiceUid: string,
        choiceDataProperty: "choiceText" | "choiceAnswer" | "choiceComment"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, "questionChoices", choiceUid, choiceDataProperty],
        targetValue: currentChoiceData[choiceDataProperty] + " \\n "
    });

    ////// B.IIb Function to add bold text (Auricle text)
    const handleBoldText = ({
        choiceUid,
        choiceDataProperty
    }: {
        choiceUid: string,
        choiceDataProperty: "choiceText" | "choiceAnswer" | "choiceComment"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, "questionChoices", choiceUid, choiceDataProperty],
        targetValue: currentChoiceData[choiceDataProperty] + " ⟪B⟫ "
    });

    ////// B.IIc Function to add highlighted text (Auricle text)
    const handleHighlightText = ({
        choiceUid,
        choiceDataProperty
    }: {
        choiceUid: string,
        choiceDataProperty: "choiceText" | "choiceAnswer" | "choiceComment"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, "questionChoices", choiceUid, choiceDataProperty],
        targetValue: currentChoiceData[choiceDataProperty] + " 【H】 "
    });

    ////// B.IId Function to add italic text (Auricle text)
    const handleItalicText = ({
        choiceUid,
        choiceDataProperty
    }: {
        choiceUid: string,
        choiceDataProperty: "choiceText" | "choiceAnswer" | "choiceComment"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, "questionChoices", choiceUid, choiceDataProperty],
        targetValue: currentChoiceData[choiceDataProperty] + " ❬I❭ "
    });

    ////// -------------------------------------------------------------------------
    ////// CHOICE FX.

    ////// B.VI Function to move choice number up
    const handleMoveUpChoiceNumber = ({choiceUid}: {choiceUid: string}): void => {
        setLocalQuizContextParams("bufferQuestion", processSwapArrayDataString({
            object: localQuizContextParams.bufferQuestion,
            keysHierachyToTargetObjectUidSequenceArray: [
                localQuizContextParams.currentQuestionUid, "questionData",
                localQuizContextParams.currentQuestionModality, "questionChoicesUidSequence"],
            targetString: choiceUid,
            sequenceMoveUnit: -1
        }));
    }

    ////// B.VII Function to move choice number down
    const handleMoveDownChoiceNumber = ({choiceUid}: {choiceUid: string}): void => {
        setLocalQuizContextParams("bufferQuestion", processSwapArrayDataString({
            object: localQuizContextParams.bufferQuestion,
            keysHierachyToTargetObjectUidSequenceArray: [
                localQuizContextParams.currentQuestionUid, "questionData",
                localQuizContextParams.currentQuestionModality, "questionChoicesUidSequence"],
            targetString: choiceUid,
            sequenceMoveUnit: +1
        }));
    }

    ////// B.VIII Function to add new choice
    const handleAddChoice = (): void => {
        if (Object.keys(currentQuestionData.questionChoices).length < choiceLimit) {
            // Add question choice
            const processedBufferQuestion = processAddQuestionChoice({
                bufferQuestion: localQuizContextParams.bufferQuestion,
                questionUid: localQuizContextParams.currentQuestionUid,
                questionModality: localQuizContextParams.currentQuestionModality
            });
            
            // Insert new choice uid to questionChoicesUidSequence
            // If this is the first choice, assign true answer to it (FOR BEST-ANSWER ONLY)
            if ((allChoicesUid.length === 0)  && (localQuizContextParams.currentQuestionModality === "BEST-ANSWER")) {setLocalQuizContextParams("bufferQuestion", processToggleChoiceAnswer({
                bufferQuestion: processInsertArrayDataString({
                    object: processedBufferQuestion.newBufferQuestion,
                    keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionChoicesUidSequence"],
                    targetValueToInsert: processedBufferQuestion.newChoiceUid,
                    insertPosition: arrayIndexOf({
                        array: currentQuestionData.questionChoicesUidSequence,
                        targetValue: currentChoiceUid,
                        indexIfError: -2
                    }) + 1
                }),
                questionModality: localQuizContextParams.currentQuestionModality,
                questionUid: localQuizContextParams.currentQuestionUid,
                choiceUid: processedBufferQuestion.newChoiceUid}))
            } else setLocalQuizContextParams("bufferQuestion", processInsertArrayDataString({
                object: processedBufferQuestion.newBufferQuestion,
                keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionChoicesUidSequence"],
                targetValueToInsert: processedBufferQuestion.newChoiceUid,
                insertPosition: arrayIndexOf({
                    array: currentQuestionData.questionChoicesUidSequence,
                    targetValue: currentChoiceUid,
                    indexIfError: -2
                }) + 1
            }));
    
            // Set current choice Uid
            setCurrentChoiceUid(processedBufferQuestion.newChoiceUid);
        } else {
            setGlobalParams("popUp", true);
            setGlobalParams("popUpAction", "⟨EXCEPTION⟩: entity limit");
            setGlobalParams("popUpText", `Total choices exceeds limit at ${choiceLimit} choices per MCQ question`);
        }
    }

    ////// B.IX Function to duplicate choice
    const handleDuplicateChoice = ({choiceUid}: {choiceUid: string}): void => {
        if (Object.keys(currentQuestionData.questionChoices).length < choiceLimit) {
            // Duplicate question choice
            const processedBufferQuestion = processDuplicateQuestionChoice({
                bufferQuestion: localQuizContextParams.bufferQuestion,
                questionUid: localQuizContextParams.currentQuestionUid,
                questionModality: localQuizContextParams.currentQuestionModality,
                choiceUid: choiceUid
            });
            
            // Check if duplicated choice answer is true or not (FOR BEST-ANSWER ONLY)
            // If true choice is duplicated, make sure that there is only one choice true
            if ((objectKeyRetrieve({
                object: localQuizContextParams.bufferQuestion,
                keysHierachy: [...rootKeysHierachy, "questionChoices", choiceUid, "choiceAnswer"]
            })) && (localQuizContextParams.currentQuestionModality === "BEST-ANSWER")) {
                // Insert new choice uid to questionChoicesUidSequence and reset answer
                setLocalQuizContextParams("bufferQuestion", processToggleChoiceAnswer({
                    bufferQuestion: processInsertArrayDataString({
                        object: processedBufferQuestion.newBufferQuestion,
                        keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionChoicesUidSequence"],
                        targetValueToInsert: processedBufferQuestion.newChoiceUid,
                        insertPosition: arrayIndexOf({
                            array: currentQuestionData.questionChoicesUidSequence,
                            targetValue: choiceUid
                        }) + 1
                    }),
                    questionModality: localQuizContextParams.currentQuestionModality,
                    questionUid: localQuizContextParams.currentQuestionUid,
                    choiceUid: choiceUid}));
            } else setLocalQuizContextParams("bufferQuestion", processInsertArrayDataString({
                object: processedBufferQuestion.newBufferQuestion,
                keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionChoicesUidSequence"],
                targetValueToInsert: processedBufferQuestion.newChoiceUid,
                insertPosition: arrayIndexOf({
                    array: currentQuestionData.questionChoicesUidSequence,
                    targetValue: choiceUid
                }) + 1
            }));

            // Set current choice Uid
            setCurrentChoiceUid(processedBufferQuestion.newChoiceUid);
        } else {
            setGlobalParams("popUp", true);
            setGlobalParams("popUpAction", "⟨EXCEPTION⟩: entity limit");
            setGlobalParams("popUpText", `Total choices exceeds limit at ${choiceLimit} choices per MCQ question`);
        }
    }

    ////// B.X Function to delete choice
    const handleDeleteChoice = ({choiceUid}: {choiceUid: string}): void => {
        // Delete choice
        const processedBufferQuestion = objectKeyDelete({
            object: processDeleteArrayDataString({
                object: localQuizContextParams.bufferQuestion,
                keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionChoicesUidSequence"],
                targetValueToDelete: choiceUid
            }),
            keysHierachy: [...rootKeysHierachy, "questionChoices"],
            keyToDelete: choiceUid
        });

        // Check if deleted choice answer is true or not (FOR BEST-ANSWER ONLY)
        // If true choice is deleted, try assigning true to other choice
        if ((objectKeyRetrieve({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: [...rootKeysHierachy, "questionChoices", choiceUid, "choiceAnswer"]
        })) && (localQuizContextParams.currentQuestionModality === "BEST-ANSWER")) {
            // Assign new true answer to first choice if applicable
            const otherChoicesUid = Object.keys(objectKeyRetrieve({
                object: processedBufferQuestion,
                keysHierachy: [...rootKeysHierachy, "questionChoices"]
            }));
            if (otherChoicesUid.length > 0) {
                setLocalQuizContextParams("bufferQuestion", processToggleChoiceAnswer({
                    bufferQuestion: processedBufferQuestion,
                    questionModality: localQuizContextParams.currentQuestionModality,
                    questionUid: localQuizContextParams.currentQuestionUid,
                    choiceUid: otherChoicesUid[0]}
                ));
            } else setLocalQuizContextParams("bufferQuestion", processedBufferQuestion);
        } else setLocalQuizContextParams("bufferQuestion", processedBufferQuestion);

        // Reset current choice Uid
        setCurrentChoiceUid("");
    }


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    const questionChoicesElements: React.ReactNode[] = [];
    const allChoicesUid: string[] = currentQuestionData.questionChoicesUidSequence;

    allChoicesUid.map((choiceUid, choiceIndex) => {
        const choiceContent = currentQuestionData.questionChoices[choiceUid];
        questionChoicesElements.push(
            <div aria-label="mcq-C1-choice-card-individual" 
                onClick={() => setCurrentChoiceUid(choiceUid)}
                key={choiceUid} className={`flex flex-col gap-4 -border rounded-xl pb-4 -prevent-select ${
                    (currentChoiceUid === choiceUid) ? "-hover-bg-active" : "cursor-pointer -hover-bg-half"
                } ${
                    choiceCardView && "min-w-72 max-w-[25dvw]"
                }`}>
                <div aria-label="choice-header" className="flex flex-row p-4 -border-b">
                    <div aria-label="choice-number" className="flex flex-row items-center gap-2">
                        {(choiceIndex > 0)
                            ? <button onClick={() => handleMoveUpChoiceNumber({choiceUid: choiceUid})} className="p-2 -hover-bg rounded-full">
                                <Icon icon="left" size={16} />
                            </button>
                            : <div className="p-2 rounded-full color-slate">
                                <Icon icon="left" size={16} />
                            </div>
                        }
                        <span className="font-black text-xl text-center min-w-4 px-1">{choiceIndex + 1}</span>
                        {(choiceIndex + 1 < allChoicesUid.length)
                            ? <button onClick={() => handleMoveDownChoiceNumber({choiceUid: choiceUid})} className="p-2 -hover-bg rounded-full">
                                <Icon icon="right" size={16} />
                            </button>
                            : <div className="p-2 rounded-full color-slate">
                                <Icon icon="right" size={16} />
                            </div>
                        }
                    </div>
                    <div aria-label="choice-answer" className="flex flex-row items-center ml-auto">
                        <button onClick={() => (currentChoiceUid === choiceUid) && setLocalQuizContextParams("bufferQuestion", processToggleChoiceAnswer({
                            bufferQuestion: localQuizContextParams.bufferQuestion,
                            questionModality: localQuizContextParams.currentQuestionModality,
                            questionUid: localQuizContextParams.currentQuestionUid,
                            choiceUid: choiceUid}))} className="ml-auto">
                            {choiceContent.choiceAnswer
                                ? <ChipTextColor chipText="TRUE" chipIcon="true" textStringForColor="K" />
                                : <ChipTextColor chipText="FALSE" chipIcon="false" textStringForColor="G" />}
                        </button>
                    </div>
                </div>
                <div aria-label="choice-preview-text" className="-hover-bg-active-half flex flex-col gap-2 max-h-36 mx-4 p-3 font-bold rounded-xl text-nowrap overflow-x-auto">
                    <p className="text-xs color-slate">CHOICE TEXT</p>
                    {choiceContent.choiceText && <AuricleText inputText={choiceContent.choiceText} />}
                </div>
                <div aria-label="choice-preview-comment" className="-hover-bg-active-half flex flex-col gap-2 max-h-36 mx-4 p-3 font-bold rounded-xl text-nowrap overflow-x-auto">
                    <p className="text-xs color-slate">CHOICE COMMENT</p>
                    {choiceContent.choiceComment && <AuricleText inputText={choiceContent.choiceComment} />}
                </div>
            </div>
        );
    });

    const MCQInterfaceChoiceOverview = (
        <div aria-label="mcq-C1-choice-overview" key="mcq-C1-choice-overview"
            className="h-full flex flex-col -border-b">
            <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half overflow-x-auto -prevent-select">
                <Icon icon="true" size={24} />
                <p className="font-black text-lg">QUESTION CHOICE</p>
                <button onClick={() => toggleChoiceCardView((prev) => (!prev))}
                    className="flex flex-row items-center gap-2 ml-auto px-3 py-2 -border -button-hover-pri rounded-xl">
                    {choiceCardView
                        ? <><Icon icon="code-bracket-square" size={20} /><span className="font-bold">SLIDE VIEW</span></>
                        : <><Icon icon="squares-2x2" size={20} /><span className="font-bold">GRID VIEW</span></>
                    }
                </button>
                <button onClick={() => handleAddChoice()}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border -button-hover-pri rounded-xl">
                    <Icon icon="squares-plus" size={18} />
                    <span className="font-bold">ADD NEW CHOICE</span>
                </button>
            </div>
            { (allChoicesUid.length === 0)
                ? <AddChoiceToEdit />
                : <div className={`items-start gap-4 w-full p-4 overflow-x-auto ${
                    choiceCardView
                        ? "flex flex-row"
                        : "grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3"
                }`}>
                    {questionChoicesElements}
                </div>
            }
        </div>
    );

    const MCQInterfaceChoiceButtons = (
        <div aria-label="mcq-C1-choice-buttons" key="mcq-C1-choice-buttons" className="flex flex-row items-center gap-4 px-4 pt-4 text-nowrap overflow-x-auto -prevent-select">
            {(currentChoiceData === undefined)
                ? <ChooseChoiceToEdit />
                : <>
                    <div className="flex flex-row items-center gap-2 px-3 py-2 -hover-bg-active rounded-xl">
                        <Icon icon="card" size={24}/>
                        <span className="font-black text-lg">CHOICE {allChoicesUid.indexOf(currentChoiceUid) + 1}</span>
                    </div>
                    <button onClick={() => handleDuplicateChoice({choiceUid: currentChoiceUid})}
                        className="flex flex-row items-center gap-2 ml-auto px-3 py-2 -border -button-hover-amber rounded-xl">
                        <Icon icon="copy" size={16} />
                        <span className="font-bold">DUPLICATE</span>
                    </button>
                    <button aria-label="DELETE-CHOICE" onClick={() => {
                        setLocalQuizContextParams("currentDeleteButtonRef", "DELETE-CHOICE");
                        localQuizContextParams.currentDeleteButtonRef == "DELETE-CHOICE" && handleDeleteChoice({choiceUid: currentChoiceUid});
                        localQuizContextParams.currentDeleteButtonRef == "DELETE-CHOICE" && setLocalQuizContextParams("currentDeleteButtonRef", "");
                    }}
                        className={`flex flex-row items-center gap-2 px-3 py-2 -border -button-hover-red rounded-xl ${
                            localQuizContextParams.currentDeleteButtonRef == "DELETE-CHOICE" && "color-red"
                        }`}>
                        <Icon icon="trash" size={16} />
                        <span className="font-bold">DELETE CHOICE</span>
                    </button>
                </>
            }
        </div>
    );

    const MCQInterfaceChoiceText = (
        <div aria-label="mcq-C1-choice-text" key="mcq-C1-choice-text"
            className="h-full flex flex-col">
            {(currentChoiceData === undefined)
                ? null
                : <div className="flex flex-col gap-4 mx-4 mt-4 -border rounded-xl">
                    <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half overflow-x-auto -prevent-select">
                        <Icon icon="font" size={24} />
                        <p className="font-black text-md mr-auto">CHOICE TEXT</p>
                    </div>
                    <div className="flex flex-row items-center gap-4 mx-4 overflow-auto -scroll-none">
                        <button onClick={() => handleAddNewLine({choiceUid: currentChoiceUid, choiceDataProperty: "choiceText"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="paragraph" size={16} /><p className="font-bold text-md text-nowrap">NEW LINE</p>
                        </button>
                        <button onClick={() => handleBoldText({choiceUid: currentChoiceUid, choiceDataProperty: "choiceText"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="bold" size={16} /><p className="font-bold text-md text-nowrap">BOLD TEXT</p>
                        </button>
                        <button onClick={() => handleHighlightText({choiceUid: currentChoiceUid, choiceDataProperty: "choiceText"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="card" size={16} /><p className="font-bold text-md text-nowrap">HIGHLIGHT TEXT</p>
                        </button>
                        <button onClick={() => handleItalicText({choiceUid: currentChoiceUid, choiceDataProperty: "choiceText"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="italic" size={16} /><p className="font-bold text-md text-nowrap">ITALIC TEXT</p>
                        </button>
                    </div>
                    <textarea rows={3} className="editor-fieldk mx-4 p-4 -border rounded-xl"
                        onChange={e => handleQuestionKeyValueUpdate({
                            keysHierachy: [...rootKeysHierachy, "questionChoices", currentChoiceUid, "choiceText"],
                            targetValue: e.target.value
                        })}
                        value={currentChoiceData.choiceText}>
                    </textarea>
                    <div aria-label="choice-preview-text" className="-hover-bg-active-half mx-4 mb-4 p-4 font-bold rounded-xl overflow-x-auto -prevent-select">
                        <p className="text-xs color-slate mb-2">CHOICE TEXT PREVIEW</p>
                        <AuricleText inputText={currentChoiceData.choiceText} />
                    </div>
                </div>
            }
        </div>
    );

    const MCQInterfaceChoiceComment = (
        <div aria-label="mcq-C1-choice-comment" key="mcq-C1-choice-comment"
            className="h-full flex flex-col -border-b">
            {(currentChoiceData === undefined)
                ? null
                : <div className="flex flex-col gap-4 m-4 -border rounded-xl">
                    <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half overflow-x-auto -prevent-select">
                        <Icon icon="card" size={24} />
                        <p className="font-black text-lg mr-auto">CHOICE COMMENT</p>
                    </div>
                    <div className="flex flex-row items-center gap-4 mx-4 overflow-auto -scroll-none">
                        <button onClick={() => handleAddNewLine({choiceUid: currentChoiceUid, choiceDataProperty: "choiceComment"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="paragraph" size={16} /><p className="font-bold text-md text-nowrap">NEW LINE</p>
                        </button>
                        <button onClick={() => handleBoldText({choiceUid: currentChoiceUid, choiceDataProperty: "choiceComment"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="bold" size={16} /><p className="font-bold text-md text-nowrap">BOLD TEXT</p>
                        </button>
                        <button onClick={() => handleHighlightText({choiceUid: currentChoiceUid, choiceDataProperty: "choiceComment"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="card" size={16} /><p className="font-bold text-md text-nowrap">HIGHLIGHT TEXT</p>
                        </button>
                        <button onClick={() => handleItalicText({choiceUid: currentChoiceUid, choiceDataProperty: "choiceComment"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="italic" size={16} /><p className="font-bold text-md text-nowrap">ITALIC TEXT</p>
                        </button>
                    </div>
                    <textarea rows={3} className="mx-4 mb-4 p-4 -border rounded-xl"
                        onChange={e => handleQuestionKeyValueUpdate({
                            keysHierachy: [...rootKeysHierachy, "questionChoices", currentChoiceUid, "choiceComment"],
                            targetValue: e.target.value
                        })}
                        value={currentChoiceData.choiceComment}>
                    </textarea>
                    <div aria-label="choice-preview-comment" className="-hover-bg-active-half mx-4 mb-4 p-4 font-bold rounded-xl overflow-x-auto -prevent-select">
                        <p className="text-xs color-slate mb-2">CHOICE COMMENT PREVIEW</p>
                        <AuricleText inputText={currentChoiceData.choiceComment} />
                    </div>
                </div>
            }
        </div>
    );


    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    return (
        <article aria-label="main-B-header" key="main-B-header" className="relative flex flex-col -border-b pb-12">
            {MCQInterfaceChoiceOverview}
            {MCQInterfaceChoiceButtons}
            {MCQInterfaceChoiceText}
            {MCQInterfaceChoiceComment}
        </article>
    );
}

// =========================================================================
// 4. LOCAL COMPONENTS
// =========================================================================

const AddChoiceToEdit = () => (
    <div className="w-full my-12 text-textSlate dark:text-textSlate-dark flex flex-col justify-center items-center text-center" key="blank">
        <Icon icon="squares-plus" size={48} />
        <h1>Add new choice to edit</h1>
    </div>
);

const ChooseChoiceToEdit = () => (
    <div className="w-full my-12 text-textSlate dark:text-textSlate-dark flex flex-col justify-center items-center text-center" key="blank">
        <Icon icon="edit" size={48} />
        <h1>Choose choice to edit</h1>
    </div>
);
