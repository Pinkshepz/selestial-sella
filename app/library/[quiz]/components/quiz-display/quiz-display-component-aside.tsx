"use client";

// app/library/[quiz]/components/quiz-display/quiz-display-component-aside.tsx

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
import { UniversalQuestionModality_Action } from "@/app/utility/interface/interface-quiz";

import { TextColor } from "@/app/utility/components/chip";
import { UnformattedAuricleText } from "@/app/utility/components/auricleText";

//// 1.4 Utility functions
import { stringToRgb } from "@/app/utility/function/color/string-to-rgb";

//// 1.5 Public and others
import Icon from "@/public/icon";


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default React.memo(function QuizDisplayAside ({
    libraryData,
    questionData
}: {
    libraryData: Library, // {uid: {library data}}
    questionData: {[key: string]: QuestionAction}, // {uid: {each question}}
}): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/[quiz]/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();


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
                <div key={eachQuestionUid}
                    className="flex flex-row items-center gap-2 w-full p-4 -border-y -hover-bg-active-half -prevent-select">
                    <p className={`font-bold text-left color-slate ${(index < 100) ? "min-w-4" : "min-w-8"}`}>{index + 1}</p>
                    <span className="mx-2 color-pri"><Icon icon="cube" size={16} /></span>
                    <div className="font-black color-pri text-nowrap overflow-hidden">
                        {localQuizContextParams.bufferLibrary.bookmark[eachQuestionUid].toLocaleUpperCase()}
                    </div>
                </div>
            );
        } else if (Object.keys(questionData).includes(eachQuestionUid)) {
            const eachQuestionData = questionData[eachQuestionUid].questionData[questionData[eachQuestionUid].modality] as UniversalQuestionModality_Action;
        
            if (eachQuestionUid === localQuizContextParams.currentQuestionUid) {
                elementQuizAside.push(
                    <div key={eachQuestionUid}
                        className="flex flex-row items-center gap-2 w-full px-4 py-2 -border-b-half -hover-bg-active -prevent-select">
                        <p className={`font-bold text-left color-slate ${(index < 100) ? "min-w-4" : "min-w-8"}`}>{index + 1}</p>
                        <TextColor 
                            textColor={eachQuestionData!.graded
                                ? stringToRgb(metadata.questionModality[questionData[eachQuestionUid].modality].iconColorCode, globalParams.theme)
                                : {r: 128, g: 128, b: 128}}
                            chipIcon={metadata.questionModality[questionData[eachQuestionUid].modality].icon} />
                        <div className="font-bold text-nowrap overflow-hidden">
                            <UnformattedAuricleText inputText={eachQuestionData!.questionText} />
                        </div>
                    </div>
                );
            } else {
                elementQuizAside.push(
                    <button key={eachQuestionUid} onClick={() => {
                        setLocalQuizContextParams("currentQuestionUid", eachQuestionUid);
                        setLocalQuizContextParams("currentQuestionUid", eachQuestionUid);
                        setLocalQuizContextParams("currentQuestionModality", localQuizContextParams.bufferQuestion[eachQuestionUid].modality);
                        (localQuizContextParams.screenWidth <= 1100) && setLocalQuizContextParams("asideHidden", !localQuizContextParams.asideHidden);
                    }}
                        className="flex flex-row items-center gap-2 w-full px-4 py-2 -border-b-half -hover-bg -prevent-select">
                        <p className={`font-bold text-left color-slate ${(index < 100) ? "min-w-4" : "min-w-8"}`}>{index + 1}</p>
                        <TextColor 
                            textColor={eachQuestionData!.graded
                                ? stringToRgb(metadata.questionModality[questionData[eachQuestionUid].modality].iconColorCode, globalParams.theme)
                                : {r: 128, g: 128, b: 128}}
                            chipIcon={metadata.questionModality[questionData[eachQuestionUid].modality].icon} />
                        <div className="font-bold text-nowrap overflow-hidden">
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

    try {
        return (
            <>
                <strong className="mx-4 mt-4 -prevent-select">{`QUIZ ${libraryData.id}`}</strong>
                <h2 className={`mx-4 mt-3 h-fit max-h-36 overflow-auto -prevent-select ${(localQuizContextParams.screenWidth <= 1100) && "text-nowrap"}`}>{libraryData.name.toLocaleUpperCase()}</h2>
                <div className="mt-4 h-full overflow-y-scroll -border-t">
                    {elementQuizAside}
                </div>
            </>
        );
    } catch (error) {null}
});
