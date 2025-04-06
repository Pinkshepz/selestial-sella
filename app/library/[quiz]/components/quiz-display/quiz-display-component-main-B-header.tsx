"use client";

// app/library/[quiz]/components/quiz-edit/quiz-edit-component-main-B-header.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import React from "react";

//// 1.2 Custom React hooks
import { useLocalQuizContext } from "@/app/library/[quiz]/local-quiz-provider";

//// 1.3 React components
import AuricleText from "@/app/utility/components/auricleText";

//// 1.4 Utility functions
import objectKeyRetrieve from "@/app/utility/function/object/object-key-retrieve";

import { TextColor } from "@/app/utility/components/chip";

//// 1.5 Public and others


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function QuizDisplayMain_B_Header (): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect local context: /app/library/[quiz]/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();

    ////// A.II Constant to easily access current question data
    const rootKeysHierachy: string[] = [
        localQuizContextParams.currentQuestionUid,
        "questionData",
        localQuizContextParams.currentQuestionModality
    ];

    const currentQuestionData = objectKeyRetrieve({
        object: localQuizContextParams.bufferQuestion,
        keysHierachy: rootKeysHierachy
    });


    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    try {
        return (
            <article aria-label="main-B-header" key="main-B-header" className="relative flex flex-col">
                <div className="flex flex-col items-start gap-4 px-4">
                    <div className="w-full mt-4 font-bold rounded-xl -border -prevent-select overflow-hidden">
                        <p className="text-xs color-slate p-4 -hover-bg-active-half">QUESTION</p>
                        <div className="px-4 pb-6 text-xl -hover-bg-active-half">
                            <AuricleText inputText={currentQuestionData.questionText} />
                        </div>
                        {currentQuestionData.questionResourceUrl && 
                            <div className="flex flex-col overflow-auto w-full p-4 -border-t -prevent-select">
                                <a href={currentQuestionData.questionResourceUrl} target="blank" className="w-fit p-1 -border rounded-lg -hover-bg"><TextColor chipText="REFERENCE RESOURCES" chipIcon="lightbulb" textStringForColor="K" opacity={0.9} /></a>
                            </div>
                        }
                    </div>
                    {currentQuestionData.questionImageUrl && 
                        <div className="overflow-hidden w-[50%] p-4">
                            <img className="rounded-xl" src={currentQuestionData.questionImageUrl} alt="" />
                        </div>
                    }
                </div>
                {currentQuestionData.graded && currentQuestionData.questionComment && 
                    <div className="-hover-bg-active-half mx-4 mt-4 p-4 font-bold rounded-xl -prevent-select -prevent-select">
                        <p className="text-xs color-slate mb-2">QUESTION COMMENT</p>
                        <AuricleText inputText={currentQuestionData.questionComment} />
                    </div>}
            </article>
        );
    } catch (error) {null}
}
