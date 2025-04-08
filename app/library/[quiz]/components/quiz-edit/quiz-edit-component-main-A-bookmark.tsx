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
import makeid from "@/app/utility/function/make-id";
import objectKeyDelete from "@/app/utility/function/object/object-dynamic-delete";


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================

const questionModalities = Object.keys(metadata.questionModality) as unknown as Array<keyof typeof metadata.questionModality>;


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function QuizEditMain_A_Bookmark (): React.ReactNode {

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
    ////// BOOKMARK FX.

    ////// B.IV Function to handle delete question
    const handleDeleteBookmark = (): void => {
        // Delete question uid from library uid array
        setLocalQuizContextParams("bufferLibrary", objectKeyDelete({
            object: processDeleteArrayDataString({
                object: localQuizContextParams.bufferLibrary,
                keysHierachyToTargetObjectUidSequenceArray: ["questionUidOrder"],
                targetValueToDelete: localQuizContextParams.currentQuestionUid
            }),
            keysHierachy: ["bookmark"],
            keyToDelete: localQuizContextParams.currentQuestionUid
        }));

        // Reset current question Uid
        setLocalQuizContextParams("currentQuestionUid", "");
    }

    ////// B.VI Function to move question number up
    const handleMoveUpBookmarkNumber = (): void => {
        setLocalQuizContextParams("bufferLibrary", processSwapArrayDataString({
            object: localQuizContextParams.bufferLibrary,
            keysHierachyToTargetObjectUidSequenceArray: ["questionUidOrder"],
            targetString: localQuizContextParams.currentQuestionUid,
            sequenceMoveUnit: -1
        }));
    }

    ////// B.VII Function to move question number down
    const handleMoveDownBookmarkNumber = (): void => {
        setLocalQuizContextParams("bufferLibrary", processSwapArrayDataString({
            object: localQuizContextParams.bufferLibrary,
            keysHierachyToTargetObjectUidSequenceArray: ["questionUidOrder"],
            targetString: localQuizContextParams.currentQuestionUid,
            sequenceMoveUnit: +1
        }));
    }

    ////// B.VIII Function to add bookmark
    const handleAddBookmark = (): void => {
        const newUid = makeid(20)
        // Insert new bookmark uid into questionUidOrder in front of current question
        setLocalQuizContextParams("bufferLibrary", objectKeyValueUpdate({
            object: processInsertArrayDataString({
                object: localQuizContextParams.bufferLibrary,
                keysHierachyToTargetObjectUidSequenceArray: ["questionUidOrder"],
                targetValueToInsert: `《MARK》 ${newUid}`,
                insertPosition: arrayIndexOf({
                    array: localQuizContextParams.bufferLibrary.questionUidOrder,
                    targetValue: localQuizContextParams.currentQuestionUid
                })
            }),
            keysHierachy: ["bookmark", `《MARK》 ${newUid}`],
            targetValue: "New bookmark"
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

    const ModalityInterfaceMoveBookmark = () => {
        return <div aria-label="main-A-modality-move-question" key="main-A-modality-move-question"
            className="h-16 flex flex-row items-center p-2 -border-r">
            {(questionNumber > 1)
                ? <button onClick={() => handleMoveUpBookmarkNumber()} className="p-2 -hover-bg rounded-full">
                    <Icon icon="up" size={20} />
                </button>
                : <div className="p-2 rounded-full color-slate">
                    <Icon icon="up" size={20} />
                </div>
            }
            <span className="font-black text-3xl text-center min-w-16 px-2">{questionNumber}</span>
            {(questionNumber < totalQuestionCount)
                ? <button onClick={() => handleMoveDownBookmarkNumber()} className="p-2 -hover-bg rounded-full">
                    <Icon icon="down" size={20} />
                </button>
                : <div className="p-2 rounded-full color-slate">
                    <Icon icon="down" size={20} />
                </div>
            }
        </div>
    }

    const ModalityInterfaceButtons = () => {

        return <div aria-label="main-A-modality-interface-buttons" key="main-A-modality-interface-buttons"
            className="ml-auto h-16 flex flex-row items-center gap-4 p-3 -border-l">
            <button onClick={() => handleAddBookmark()}
                className="flex flex-row items-center gap-2 px-3 py-1 -border -button-hover-teal rounded-full">
                <Icon icon="cube" size={16} />
                <span className="font-bold">ADD BOOKMARK</span>
            </button>
            <button aria-label="DELETE-BOOKMARK" onClick={() => {
                setLocalQuizContextParams("currentDeleteButtonRef", "DELETE-BOOKMARK");
                localQuizContextParams.currentDeleteButtonRef == "DELETE-BOOKMARK" && handleDeleteBookmark();
                localQuizContextParams.currentDeleteButtonRef == "DELETE-BOOKMARK" && setLocalQuizContextParams("currentDeleteButtonRef", "");
            }}
                className={`flex flex-row items-center gap-2 px-3 py-1 -border -button-hover-red rounded-full ${
                    localQuizContextParams.currentDeleteButtonRef == "DELETE-BOOKMARK" && "color-red"
                }`}>
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
            <ModalityInterfaceMoveBookmark />
            <ModalityInterfaceButtons />
        </article>
    );
}
