"use client";

// app/library/[quiz]/components/quiz-edit/quiz-edit-component-main-A-modality.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import metadata from "@/metadata.json";
import React from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useLocalQuizContext } from "@/app/library/[quiz]/local-quiz-provider";

//// 1.3 React components
import Library from "@/app/utility/interface/interface-library";
import Question from "@/app/utility/interface/interface-quiz";

import { TextColor } from "@/app/utility/components/chip";

//// 1.4 Utility functions
import { stringToRgb } from "@/app/utility/function/color/string-to-rgb";

import { 
    processDeleteQuestion, processDuplicateQuestion,
    processSwapArrayDataString, processInsertArrayDataString, processDeleteArrayDataString
} from "./quiz-edit-function-general";

import objectKeyValueUpdate from "@/app/utility/function/object/object-dynamic-change";
import objectKeyRetrieve from "@/app/utility/function/object/object-key-retrieve";
import objectUidFill from "@/app/utility/function/object/object-uid-fill";

//// 1.5 Public and others
import Icon from "@/public/icon";
import arrayIndexOf from "@/app/utility/function/array/array-index-of";


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================

const questionModalities = Object.keys(metadata.questionModality) as unknown as Array<keyof typeof metadata.questionModality>;


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function QuizEditMain_A_Modality ({
    libraryData,
    questionDatum
}: {
    libraryData: Library, // {uid: {library data}}
    questionDatum: Question, // Individual question data
}): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/[quiz]/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();

    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// -------------------------------------------------------------------------
    ////// QUESTION FX.

    ////// B.III Function to handle duplicate question
    const handleDuplicateQuestion = (): void => {
        if (Object.keys(localQuizContextParams.bufferQuestion).length < metadata.entityLimit.question) {
            // Duplicate question
            const processedBufferQuestion = processDuplicateQuestion({
                bufferQuestion: localQuizContextParams.bufferQuestion,
                questionUid: localQuizContextParams.currentQuestionUid
            });
            setLocalQuizContextParams("bufferQuestion", processedBufferQuestion.newBufferQuestion);
            
            // Insert new question uid to library uid array
            setLocalQuizContextParams("bufferLibrary", processInsertArrayDataString({
                object: localQuizContextParams.bufferLibrary,
                keysHierachyToTargetObjectUidSequenceArray: ["questionUidOrder"],
                targetValueToInsert: processedBufferQuestion.newQuestionUid,
                insertPosition: arrayIndexOf({
                    array: localQuizContextParams.bufferLibrary.questionUidOrder,
                    targetValue: localQuizContextParams.currentQuestionUid
                }) + 1
            }));
            
            // Set current question Uid
            setLocalQuizContextParams("currentQuestionUid", processedBufferQuestion.newQuestionUid);
        } else {
            setGlobalParams("popUp", true);
            setGlobalParams("popUpAction", "⟨EXCEPTION⟩: entity limit");
            setGlobalParams("popUpText", `Total questions exceeds limit at ${metadata.entityLimit.question} questions per library`);
        }
    }

    ////// B.IV Function to handle delete question
    const handleDeleteQuestion = (): void => {
        // Delete question
        setLocalQuizContextParams("bufferQuestion", processDeleteQuestion({
            bufferQuestion: localQuizContextParams.bufferQuestion,
            questionUid: localQuizContextParams.currentQuestionUid
        }));

        // Delete question uid from library uid array
        setLocalQuizContextParams("bufferLibrary", processDeleteArrayDataString({
            object: localQuizContextParams.bufferLibrary,
            keysHierachyToTargetObjectUidSequenceArray: ["questionUidOrder"],
            targetValueToDelete: localQuizContextParams.currentQuestionUid
        }));

        // Reset current question Uid
        setLocalQuizContextParams("currentQuestionUid", "");
    }

    ////// B.V Function to toggle question modality
    const handleQuestionModalityToggle = (): void => {
        const currentIndex: number = arrayIndexOf<typeof questionModalities[number]>({
            array: questionModalities,
            targetValue: localQuizContextParams.currentQuestionModality
        });
        const newModality = questionModalities[(currentIndex + 1) % questionModalities.length] as typeof questionModalities[number];
        
        // Change to new modality
        let updatedBufferQuestion = objectKeyValueUpdate<typeof localQuizContextParams.bufferQuestion>({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: [localQuizContextParams.currentQuestionUid, "modality"],
            targetValue: newModality
        });

        // Add new modality's questionData if it is not already existed
        if (!Object.keys(objectKeyRetrieve({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: [localQuizContextParams.currentQuestionUid, "questionData"]
        })).includes(newModality)) {
            setLocalQuizContextParams("bufferQuestion",
                objectKeyValueUpdate<typeof updatedBufferQuestion>({
                    object: updatedBufferQuestion,
                    keysHierachy: [localQuizContextParams.currentQuestionUid, "questionData", newModality],
                    targetValue: objectUidFill(metadata.questionModality[newModality].questionDataFormat)
                })
            )
        } else {
            setLocalQuizContextParams("bufferQuestion", updatedBufferQuestion);
        }

        setLocalQuizContextParams("currentQuestionModality", newModality);
        return;
    };

    ////// B.VI Function to move question number up
    const handleMoveUpQuestionNumber = (): void => {
        setLocalQuizContextParams("bufferLibrary", processSwapArrayDataString({
            object: localQuizContextParams.bufferLibrary,
            keysHierachyToTargetObjectUidSequenceArray: ["questionUidOrder"],
            targetString: localQuizContextParams.currentQuestionUid,
            sequenceMoveUnit: -1
        }));
    }

    ////// B.VII Function to move question number down
    const handleMoveDownQuestionNumber = (): void => {
        setLocalQuizContextParams("bufferLibrary", processSwapArrayDataString({
            object: localQuizContextParams.bufferLibrary,
            keysHierachyToTargetObjectUidSequenceArray: ["questionUidOrder"],
            targetString: localQuizContextParams.currentQuestionUid,
            sequenceMoveUnit: +1
        }));
    }

    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    const questionNumber = arrayIndexOf({
        array: localQuizContextParams.bufferLibrary.questionUidOrder,
        targetValue: localQuizContextParams.currentQuestionUid
    }) + 1;
    const totalQuestionCount = localQuizContextParams.bufferLibrary.questionUidOrder.length;

    const ModalityInterfaceMoveQuestion = () => {
        return <div aria-label="main-A-modality-move-question" key="main-A-modality-move-question"
            className="h-16 flex flex-row items-center p-2 -border-r">
            {(questionNumber > 1)
                ? <button onClick={() => handleMoveUpQuestionNumber()} className="p-2 -hover-bg rounded-full">
                    <Icon icon="up" size={20} />
                </button>
                : <div className="p-2 rounded-full color-slate">
                    <Icon icon="up" size={20} />
                </div>
            }
            <span className="font-black text-3xl text-center min-w-16 px-2">{questionNumber}</span>
            {(questionNumber < totalQuestionCount)
                ? <button onClick={() => handleMoveDownQuestionNumber()} className="p-2 -hover-bg rounded-full">
                    <Icon icon="down" size={20} />
                </button>
                : <div className="p-2 rounded-full color-slate">
                    <Icon icon="down" size={20} />
                </div>
            }
        </div>
    }

    const ModalityInterfaceChangeModality = () => {
        return <div aria-label="main-A-modality-change-modality" key="main-A-modality-change-modality"
            className="h-16 flex flex-row items-center p-3 -border-r">
            <button onClick={() => handleQuestionModalityToggle()}
                className="flex flex-row items-center gap-2 px-3 py-1 -border -hover-bg rounded-full">
                <TextColor
                    textColor={stringToRgb(metadata.questionModality[questionDatum.modality].iconColorCode, globalParams.theme)}
                    chipIcon={metadata.questionModality[questionDatum.modality].icon} />
                <span className="font-bold">{questionDatum.modality}</span>
            </button>
        </div>
    }

    const ModalityInterfaceStatusTab = () => {

        return <>
        </>
    }

    const ModalityInterfaceButtons = () => {

        return <div aria-label="main-A-modality-interface-buttons" key="main-A-modality-interface-buttons"
            className="ml-auto h-16 flex flex-row items-center gap-4 p-3 -border-l">
            <button onClick={() => handleDuplicateQuestion()}
                className="flex flex-row items-center gap-2 px-3 py-1 -border -button-hover-amber rounded-full">
                <Icon icon="copy" size={16} />
                <span className="font-bold">DUPLICATE</span>
            </button>
            <button onClick={() => handleDeleteQuestion()}
                className="flex flex-row items-center gap-2 px-3 py-1 -border -button-hover-red rounded-full">
                <Icon icon="trash" size={16} />
                <span className="font-bold">DELETE</span>
            </button>
        </div>
    }


    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    return (
        <article aria-label="main-A-modality" key="main-A-modality" 
            className="min-h-16 flex flex-row items-center -border-b text-nowrap overflow-x-auto -hover-bg-active -prevent-select">
            <ModalityInterfaceMoveQuestion />
            <ModalityInterfaceChangeModality />
            <ModalityInterfaceStatusTab />
            <ModalityInterfaceButtons />
        </article>
    );
}
