"use client";

// app/library/[quiz]/components/quiz-edit/quiz-edit-component-aside.tsx

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
import { UnformattedAuricleText } from "@/app/utility/components/auricleText";

//// 1.4 Utility functions
import { stringToRgb } from "@/app/utility/function/color/string-to-rgb";
import Icon from "@/public/icon";

//// 1.5 Public and others
//// N/A


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default React.memo(function QuizEditAside ({
    libraryData,
    questionData
}: {
    libraryData: Library, // {uid: {library data}}
    questionData: {[key: string]: Question}, // {uid: {each question}}
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

    //// N/A


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    ////// C.I Assembly each question data into navigation data rows
    let elementQuizAside: React.ReactNode[] = [];

    const alllQuestionUid = localQuizContextParams.bufferLibrary.questionUidOrder as string[];
    
    alllQuestionUid.map((eachQuestionUid, index) => {
        // Catch for bookmark uid first
        if (eachQuestionUid.startsWith("《")) {
            elementQuizAside.push(
                <button key={eachQuestionUid} onClick={() => {
                    setLocalQuizContextParams("currentQuestionUid", eachQuestionUid);
                    setLocalQuizContextParams("currentQuestionModality", "");
                }}
                className="flex flex-row items-center gap-2 w-full p-4 -border-y -hover-bg -prevent-select">
                    <p className={`font-bold text-left color-slate ${(index < 100) ? "min-w-4" : "min-w-8"}`}>{index + 1}</p>
                    <span className="mx-2 color-slate"><Icon icon="cube" size={16} /></span>
                    <div className="font-black color-pri text-nowrap overflow-hidden">
                        {localQuizContextParams.bufferLibrary.bookmark[eachQuestionUid].toLocaleUpperCase()}
                    </div>
                </button>
            );
        } else if (Object.keys(questionData).includes(eachQuestionUid)) {
            // Manage typical question uid and filter that uid from both library and course are corresponded
            const eachQuestionData = questionData[eachQuestionUid].questionData[questionData[eachQuestionUid].modality];
    
            if (eachQuestionUid === localQuizContextParams.currentQuestionUid) {
                elementQuizAside.push(
                    <div key={eachQuestionUid}
                        className="flex flex-row items-center gap-2 w-full px-4 py-2 -border-b -hover-bg-active">
                        <p className={`font-bold text-left color-slate ${(index < 100) ? "min-w-4" : "min-w-8"}`}>{index + 1}</p>
                        <TextColor 
                            textColor={stringToRgb(metadata.questionModality[questionData[eachQuestionUid].modality].iconColorCode, globalParams.theme)} 
                            chipIcon={metadata.questionModality[questionData[eachQuestionUid].modality].icon} />
                        <div className="font-bold whitespace-nowrap overflow-hidden">
                            <UnformattedAuricleText inputText={eachQuestionData!.questionText} />
                        </div>
                    </div>
                );
            } else {
                elementQuizAside.push(
                    <button key={eachQuestionUid} onClick={() => {
                        setLocalQuizContextParams("currentQuestionUid", eachQuestionUid);
                        setLocalQuizContextParams("currentQuestionModality", localQuizContextParams.bufferQuestion[eachQuestionUid].modality);
                    }}
                        className="flex flex-row items-center gap-2 w-full px-4 py-2 -border-b -hover-bg">
                        <p className={`font-bold text-left color-slate ${(index < 100) ? "min-w-4" : "min-w-8"}`}>{index + 1}</p>
                        <TextColor 
                            textColor={stringToRgb(metadata.questionModality[questionData[eachQuestionUid].modality].iconColorCode, globalParams.theme)} 
                            chipIcon={metadata.questionModality[questionData[eachQuestionUid].modality].icon} />
                        <div className="font-bold whitespace-nowrap overflow-hidden">
                            <UnformattedAuricleText inputText={eachQuestionData!.questionText} />
                        </div>
                    </button>
                );
            }
        }
    });

    
    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    return (
        <aside aria-label="aside-navigation-quiz" key="aside-navigation" id="quiz-col-scroll-aside" className="w-[320px] relative flex flex-col -border-r -prevent-select">
            <strong className="mx-4 mt-4">{`QUIZ ${libraryData.id}`}</strong>
            <h1 className="mx-4 max-h-28 overflow-auto">{libraryData.name.toLocaleUpperCase()}</h1>
            <div className="mt-4 h-full overflow-y-scroll -border-t">
                {elementQuizAside}
            </div>
        </aside>
    );
})
