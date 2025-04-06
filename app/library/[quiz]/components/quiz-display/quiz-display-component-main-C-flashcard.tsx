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
import { ChipTextColor, TextColor } from "@/app/utility/components/chip";
import stringToHex from "@/app/utility/function/color/string-to-rgb";


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function QuizDisplayMain_C_CARD (): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/[quiz]/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();
    

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
    const handleFlipCard = ({
        bufferQuestion,
        questionUid,
        cardUid
    }: {
        bufferQuestion: {[key: string]: QuestionAction},
        questionUid: string,
        cardUid: string
    }): void => {
        setLocalQuizContextParams("bufferQuestion", objectKeyValueUpdate({
            object: bufferQuestion,
            keysHierachy: [questionUid, "questionData", "FLASHCARD", "questionCards", cardUid, "flipped"],
            targetValue: !objectKeyRetrieve({
                object: bufferQuestion,
                keysHierachy: [questionUid, "questionData", "FLASHCARD", "questionCards", cardUid, "flipped"]
            })
        }));   
    }


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    const questionChoicesElements: React.ReactNode[] = [];
    const allCardsUid: string[] = currentQuestionData.questionCardsUidSequence;

    allCardsUid.map((cardUid) => {
        const cardContent = currentQuestionData.questionCards[cardUid];
        questionChoicesElements.push(
            <div aria-label="choice-card" 
                onClick={() => cardContent.cardAllowFlipped && handleFlipCard({
                    bufferQuestion: localQuizContextParams.bufferQuestion,
                    questionUid: localQuizContextParams.currentQuestionUid,
                    cardUid: cardUid})}
                key={cardUid} className={`flex flex-col -border-half rounded-xl pb-4 -prevent-select ${
                    cardContent.cardAllowFlipped ? "-hover-bg-active-half cursor-pointer" : "-hover-bg-half"}`}
                style={
                    cardContent.cardAllowFlipped
                        //  Flip card
                        ? cardContent.flipped
                            //  Flipped (back)
                            ? {border: `solid 1px ${stringToHex("M", globalParams.theme)}aa`, backgroundColor: `${stringToHex("M", globalParams.theme)}07`}
                            //  Unflipped (front)
                            : {border: `solid 1px ${stringToHex("A", globalParams.theme)}aa`, backgroundColor: `${stringToHex("A", globalParams.theme)}07`}
                        //  Cloud card
                        : {border: `solid 1px ${stringToHex("K", globalParams.theme)}aa`, backgroundColor: `${stringToHex("K", globalParams.theme)}07`}
                }>
                <div aria-label="card-header" className="flex flex-row items-center w-full px-4 pt-4">
                    <div className="-hover-bg-active-half -border rounded-lg">{
                        cardContent.cardAllowFlipped
                        //  Flip card
                        ? cardContent.flipped
                            //  Flipped (back)
                            ? <TextColor chipText="FLIP CARD BACK" chipIcon="circle-fill" textStringForColor="M" opacity={0.9} />
                            //  Unflipped (front)
                            : <TextColor chipText="FLIP CARD FRONT" chipIcon="circle" textStringForColor="A" opacity={0.9} />
                        //  Cloud card
                        : <TextColor chipText="CLOUD CARD" chipIcon="cloud" textStringForColor="K" opacity={0.9} />
                        }
                    </div>
                </div>
                {
                    cardContent.flipped
                        ? <div aria-label="card-back-text" className="flex flex-col gap-2 max-h-36 mx-4 my-8 px-1 font-black text-xl rounded-xl text-nowrap overflow-x-auto">
                            {cardContent.cardBackText && <AuricleText inputText={cardContent.cardBackText} />}
                        </div>
                        : <div aria-label="card-front-text" className="flex flex-col gap-2 max-h-36 mx-4 my-8 px-1 font-black text-xl rounded-xl text-nowrap overflow-x-auto">
                        {cardContent.cardFrontText && <AuricleText inputText={cardContent.cardFrontText} />}
                </div>
                }
            </div>
        );
    })

    const CARDInterface = (
        <div aria-label="mcq-C1-choice-overview" key="mcq-C1-choice-overview"
            className="h-full flex flex-col">
            <p className="mx-4 mt-8 mb-2 p-1 font-bold text-md color-slate -border-b-half">FLASHCARD TO INTERACT; CLOUD CARD IS STATIC, WHILE FLIP CARD CAN BE FLIPPED</p>
            { (allCardsUid.length === 0)
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
                {CARDInterface}
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
