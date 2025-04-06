"use client";

// app/library/[quiz]/components/quiz-edit/quiz-edit-component-main-C-mcq.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import React, { useState, useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useLocalQuizContext } from "@/app/library/[quiz]/local-quiz-provider";

//// 1.3 React components
import QuestionAction from "@/app/utility/interface/interface-quiz";

import AuricleText from "@/app/utility/components/auricleText";

//// 1.4 Utility functions
import objectKeyValueUpdate from "@/app/utility/function/object/object-dynamic-change";
import objectKeyRetrieve from "@/app/utility/function/object/object-key-retrieve";

//// 1.5 Public and others
import Icon from "@/public/icon";
import { ChipTextColor } from "@/app/utility/components/chip";
import stringToHex from "@/app/utility/function/color/string-to-rgb";


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function QuizDisplayMain_C_MCQ (): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/[quiz]/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();

    ////// A.III useState to count totalSelectedChoice
    const [totalSelectedChoice, setTotalSelectedChoice] = useState(0);
    

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

    ////// B.IIa Function to handle choice selection
    const handleSelectChoice = ({
        bufferQuestion,
        questionModality,
        questionUid,
        choiceUid
    }: {
        bufferQuestion: {[key: string]: QuestionAction},
        questionModality: "BEST-ANSWER" | "MULTIPLE-ANSWER",
        questionUid: string,
        choiceUid: string
    }): typeof bufferQuestion => {
        if (questionModality === "MULTIPLE-ANSWER") {
            return objectKeyValueUpdate({
                object: bufferQuestion,
                keysHierachy: [questionUid, "questionData", questionModality, "questionChoices", choiceUid, "selected"],
                targetValue: !objectKeyRetrieve({
                    object: bufferQuestion,
                    keysHierachy: [questionUid, "questionData", questionModality, "questionChoices", choiceUid, "selected"]
                })
            });
        } else if (questionModality === "BEST-ANSWER") {
            let processedBufferQuestion = bufferQuestion;
    
            // Firstly, turn all choices answer false
            objectKeyRetrieve({
                object: bufferQuestion,
                keysHierachy: [questionUid, "questionData", questionModality, "questionChoicesUidSequence"]
            }).map((eachChoiceUid: string) => {
                processedBufferQuestion = objectKeyValueUpdate({
                    object: processedBufferQuestion,
                    keysHierachy: [questionUid, "questionData", questionModality, "questionChoices", eachChoiceUid, "selected"],
                    targetValue: false
                });
            });
    
            return objectKeyValueUpdate({
                object: processedBufferQuestion,
                keysHierachy: [questionUid, "questionData", questionModality, "questionChoices", choiceUid, "selected"],
                targetValue: true
            });
        } else return bufferQuestion
    }

    useEffect(() => {
        Object.keys(currentQuestionData.questionChoices).map((choiceUid) => {
            try {
                if (currentQuestionData.questionChoices[choiceUid].selected) {setTotalSelectedChoice((prev) => (prev + 1))}
            } catch (error) {null}
        })
    }, [localQuizContextParams.bufferQuestion])
    
    ////// B.IIb Function to handle choice grading
    const handleGradeChoice = () => {}

    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    const questionChoicesElements: React.ReactNode[] = [];
    const allChoicesUid: string[] = currentQuestionData.questionChoicesUidSequence;

    allChoicesUid.map((choiceUid) => {
        const choiceContent = currentQuestionData.questionChoices[choiceUid];
        questionChoicesElements.push(
            <div aria-label="choice-card" 
                onClick={() => !currentQuestionData.graded && setLocalQuizContextParams("bufferQuestion", handleSelectChoice({
                    bufferQuestion: localQuizContextParams.bufferQuestion,
                    questionModality: localQuizContextParams.currentQuestionModality,
                    questionUid: localQuizContextParams.currentQuestionUid,
                    choiceUid: choiceUid}))}
                key={choiceUid} className={`flex flex-col -border rounded-xl pb-4 -prevent-select ${
                    choiceContent.selected ? "-hover-bg-active-half" : "cursor-pointer -hover-bg-half"}`}
                style={
                        currentQuestionData.graded
                        //  Graded
                        ? (totalSelectedChoice || (localQuizContextParams.currentQuestionModality === "MULTIPLE-ANSWER"))
                            //  At least one answer selected or modality is "MULTIPLE-ANSWER"
                            ? choiceContent.selected 
                                // Show result of selected choice
                                ? (choiceContent.selected === choiceContent.choiceAnswer)
                                    // CORRECT ANSWER
                                    ? {border: `solid 2px ${stringToHex("K", globalParams.theme)}aa`, backgroundColor: `${stringToHex("K", globalParams.theme)}07`}
                                    // INCORRECT ANSWER
                                    : {border: `solid 2px ${stringToHex("G", globalParams.theme)}aa`, backgroundColor: `${stringToHex("G", globalParams.theme)}07`}
                                // Show choice with true answer
                                : choiceContent.choiceAnswer 
                                    ? {border: `solid 2px ${stringToHex("A", globalParams.theme)}aa`, backgroundColor: `${stringToHex("A", globalParams.theme)}07`}
                                    : {margin: "1px"}
                                
                            //  No answer selected -> show choice with true answer
                            : choiceContent.choiceAnswer
                                ? {border: `solid 2px ${stringToHex("A", globalParams.theme)}aa`, backgroundColor: `${stringToHex("A", globalParams.theme)}07`}
                                : {margin: "1px"}

                        //  Not graded
                        : choiceContent.selected
                            ? localQuizContextParams.currentQuestionModality === "MULTIPLE-ANSWER"
                                ? {border: `solid 2px ${stringToHex("L", globalParams.theme)}aa`, backgroundColor: `${stringToHex("L", globalParams.theme)}07`}
                                : {border: `solid 2px ${stringToHex("K", globalParams.theme)}aa`, backgroundColor: `${stringToHex("K", globalParams.theme)}07`}
                            : {margin: "1px"}
                }>
                <div aria-label="choice-header" className="flex flex-row p-4">
                    <div aria-label="choice-answer" className="flex flex-row items-center">{
                            currentQuestionData.graded
                                //  Graded
                                ? (totalSelectedChoice || (localQuizContextParams.currentQuestionModality === "MULTIPLE-ANSWER"))
                                    //  At least one answer selected or modality is "MULTIPLE-ANSWER"
                                    ? <div className="ml-auto">
                                        {choiceContent.selected 
                                            // Show result of selected choice
                                            ? (choiceContent.selected === choiceContent.choiceAnswer)
                                                ? <ChipTextColor chipText="CORRECT" chipIcon="true" textStringForColor="K" />
                                                : <ChipTextColor chipText="INCORRECT" chipIcon="false" textStringForColor="G" />
                                            // Show choice with true answer
                                            : choiceContent.choiceAnswer 
                                                ? <ChipTextColor chipText="MISSED ANSWER" chipIcon="exclamation" textStringForColor="A" />
                                                : <div className="flex flex-row gap-2 items-center px-2 font-bold color-slate -border-half rounded-lg text-nowrap">
                                                    <Icon icon="circle" size={16}/>N/A
                                                </div>
                                        }
                                    </div>
                                    //  No answer selected -> show choice with true answer
                                    : choiceContent.choiceAnswer
                                        ? <ChipTextColor chipText="QUESTION ANSWER" chipIcon="true" textStringForColor="A" />
                                        : <div className="flex flex-row gap-2 items-center px-2 font-bold color-slate -border-half rounded-lg text-nowrap">
                                            <Icon icon="circle" size={16}/>N/A
                                        </div>

                                //  Not graded
                                : <div>
                                {choiceContent.selected
                                    ? localQuizContextParams.currentQuestionModality === "MULTIPLE-ANSWER"
                                        ? <ChipTextColor chipText="MULTIPLE SELECTED" chipIcon="squares-2x2" textStringForColor="L" />
                                        : <ChipTextColor chipText="BEST SELECTED" chipIcon="circle-fill" textStringForColor="K" />
                                    : <div className="flex flex-row gap-2 items-center px-2 font-bold color-slate -border-half rounded-lg text-nowrap">
                                        <Icon icon="circle" size={16}/>~
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div aria-label="choice-text" className="flex flex-col gap-2 max-h-36 mx-4 px-1 font-black text-xl rounded-xl text-nowrap overflow-x-auto">
                    {choiceContent.choiceText && <AuricleText inputText={choiceContent.choiceText} />}
                </div>
                {currentQuestionData.graded && choiceContent.choiceComment && <div aria-label="choice-comment" className="flex flex-col gap-2 max-h-36 mx-4 mt-4 px-1 font-bold rounded-xl text-nowrap overflow-x-auto">
                    <p className="text-xs color-slate">CHOICE COMMENT</p>
                    <AuricleText inputText={choiceContent.choiceComment} />
                </div>}
            </div>
        );
    })

    const MCQInterfaceChoiceOverview = (
        <div aria-label="mcq-C1-choice-overview" key="mcq-C1-choice-overview"
            className="h-full flex flex-col">
            {localQuizContextParams.currentQuestionModality === "BEST-ANSWER"
                ? <p className="mx-4 mt-8 mb-2 p-1 font-bold text-md color-slate -border-b-half">SELECT ONE CHOICE</p>
                : <p className="mx-4 mt-8 mb-2 p-1 font-bold text-md color-slate -border-b-half">SELECT MULTIPLE CHOICES</p>
            }
            { (allChoicesUid.length === 0)
                ? <NoChoice />
                : <div className={"grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 items-start gap-8 w-full p-4 overflow-x-auto"}>
                    {questionChoicesElements}
                </div>
            }
        </div>
    );



    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    try {
        return (
            <article aria-label="main-B-header" key="main-B-header" className="relative flex flex-col pb-12">
                {MCQInterfaceChoiceOverview}
            </article>
        );
    } catch (error) {null}
}

// =========================================================================
// 4. LOCAL COMPONENTS
// =========================================================================

const NoChoice = () => (
    <div className="w-full my-12 text-textSlate dark:text-textSlate-dark flex flex-col justify-center items-center text-center" key="blank">
        <Icon icon="exclamation" size={48} />
        <h1>Oops! Something went wrong with these choices</h1>
    </div>
);
