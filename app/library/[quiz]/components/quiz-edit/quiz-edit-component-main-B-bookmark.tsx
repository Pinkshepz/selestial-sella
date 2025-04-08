"use client";

// app/library/[quiz]/components/quiz-edit/quiz-edit-component-main-B-bookmark.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import React from "react";

//// 1.2 Custom React hooks
import { useLocalQuizContext } from "@/app/library/[quiz]/local-quiz-provider";

//// 1.3 React components

//// 1.4 Utility functions
import objectKeyValueUpdate from "@/app/utility/function/object/object-dynamic-change";

//// 1.5 Public and others
import Icon from "@/public/icon";


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function QuizEditMain_B_Bookmark (): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect local context: /app/library/[quiz]/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();
    

    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    const HeaderInterfaceBookmarkText = (
        <div aria-label="main-B-modality-question-text" key="main-B-modality-question-text"
            className="h-full flex flex-col gap-4 pb-12 -border-b">
            <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half -prevent-select">
                <Icon icon="font" size={24} />
                <p className="font-black text-lg mr-auto">BOOKMARK TEXT</p>
            </div>
            <textarea rows={3} className="editor-fieldk mx-4 my-1 p-4 -border rounded-xl"
                onChange={e => setLocalQuizContextParams("bufferLibrary", 
                    objectKeyValueUpdate({
                        object: localQuizContextParams.bufferLibrary,
                        keysHierachy: ["bookmark", localQuizContextParams.currentQuestionUid],
                        targetValue: e.target.value
                    })
                )}
                value={localQuizContextParams.bufferLibrary.bookmark[localQuizContextParams.currentQuestionUid]}>
            </textarea>
        </div>
    );


    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    return (
        <article aria-label="main-B-bookmark" key="main-B-bookmark" className="relative flex flex-col">
            {HeaderInterfaceBookmarkText}
        </article>
    );
}
