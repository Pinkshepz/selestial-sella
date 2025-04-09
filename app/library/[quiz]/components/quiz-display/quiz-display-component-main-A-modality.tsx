"use client";

// app/library/[quiz]/components/quiz-display/quiz-display-component-main-A-modality.tsx

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
import QuestionAction from "@/app/utility/interface/interface-quiz";

import { TextColor } from "@/app/utility/components/chip";

//// 1.4 Utility functions
import { stringToRgb } from "@/app/utility/function/color/string-to-rgb";

//// 1.5 Public and others
import arrayIndexOf from "@/app/utility/function/array/array-index-of";
import Icon from "@/public/icon";
import objectKeyValueUpdate from "@/app/utility/function/object/object-dynamic-change";


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function QuizDisplayMain_A_Modality (): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/[quiz]/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();

    const totalQuestion: number = localQuizContextParams.bufferLibrary.questionUidOrder.length;
    const questionNumber: number = arrayIndexOf({
        array: localQuizContextParams.bufferLibrary.questionUidOrder,
        targetValue: localQuizContextParams.currentQuestionUid});


    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    try {
        return (
            <article aria-label="main-A-modality" key="main-A-modality" 
                className="-smooth-appear min-h-16 px-4 flex flex-row items-center gap-4 -border-b text-nowrap overflow-x-auto -prevent-select">
                    <button onClick={() => setLocalQuizContextParams("asideHidden", !localQuizContextParams.asideHidden)}
                        className="p-2 -hover-bg rounded-xl">
                        <Icon icon="map" size={20} />
                    </button>
                    
                    <div className="flex flex-row items-center gap-1 px-2 py-1 -hover-bg-active-half rounded-lg">
                        <span className="mr-1 font-bold">QUESTION</span>
                        <span className="font-black">{questionNumber + 1}</span>
                        <span>┇</span>
                        <span className="font-black">{totalQuestion}</span>
                    </div>
    
                    <div className="flex flex-row items-center gap-2 px-2 py-1 -hover-bg-active-half rounded-lg">
                        <TextColor
                            textColor={stringToRgb(metadata.questionModality[localQuizContextParams.currentQuestionModality as keyof typeof metadata.questionModality].iconColorCode, globalParams.theme)}
                            chipIcon={metadata.questionModality[localQuizContextParams.currentQuestionModality as keyof typeof metadata.questionModality].icon} />
                        <span className="font-bold">{localQuizContextParams.currentQuestionModality as keyof typeof metadata.questionModality}</span>
                    </div>

                    <button className="flex flex-row items-center ml-auto px-2 py-1 -hover-bg-active-half rounded-lg"
                        onClick={() => setLocalQuizContextParams("bufferQuestion", objectKeyValueUpdate({
                            object: localQuizContextParams.bufferQuestion,
                            keysHierachy: [localQuizContextParams.currentQuestionUid],
                            targetValue: localQuizContextParams.bufferQuestion[localQuizContextParams.currentQuestionUid]
                        }))}>
                        <span className="mr-1 font-bold">CLEAR ANSWER</span>
                    </button>
    
                    <div className="flex flex-row items-center gap-2 px-2 py-1 -hover-bg-active-half rounded-lg">
                        <Icon icon="rocket" size={16} />
                        <div className="flex flex-row items-center gap-1 font-bold">
                            <span className="mr-2">PROGRESS</span>
                            <span>{`${Math.round(100 * (JSON.stringify(localQuizContextParams.bufferQuestion).split("graded").length - 1) / totalQuestion)}`}%</span>
                        </div>
                    </div>
            </article>
        );
    } catch (error) {null}
}
