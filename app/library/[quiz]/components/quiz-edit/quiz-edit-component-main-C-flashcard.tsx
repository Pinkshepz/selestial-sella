"use client";

// app/library/[quiz]/components/quiz-edit/quiz-edit-component-main-C-flashcard.tsx

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
import { processAddQuestionCard, processDuplicateQuestionCard } from "./quiz-edit-function-flashcard";

import arrayIndexOf from "@/app/utility/function/array/array-index-of";
import { stringToRgb } from "@/app/utility/function/color/string-to-rgb";

//// 1.5 Public and others
import Icon from "@/public/icon";
import { ChipTextColor, TextColor } from "@/app/utility/components/chip";


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function QuizEditMain_C_FLASHCARD (): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/[quiz]/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();

    ////// A.III useState current focused card uid
    const [currentCardUid, setCurrentCardUid] = useState("");

    ////// A.IV useState toggle card display: grid or flex-row
    const [cardView, toggleCardView] = useState(true);
    

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

    const currentCardData = objectKeyRetrieve({
        object: localQuizContextParams.bufferQuestion,
        keysHierachy: [...rootKeysHierachy, "questionCards", currentCardUid]
    });

    const cardLimit: number = metadata.entityLimit.card;

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
        cardUid,
        cardDataProperty
    }: {
        cardUid: string,
        cardDataProperty: "cardFrontText" | "cardBackText"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, "questionCards", cardUid, cardDataProperty],
        targetValue: currentCardData[cardDataProperty] + " \\n "
    });

    ////// B.IIb Function to add bold text (Auricle text)
    const handleBoldText = ({
        cardUid,
        cardDataProperty
    }: {
        cardUid: string,
        cardDataProperty: "cardFrontText" | "cardBackText"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, "questionCards", cardUid, cardDataProperty],
        targetValue: currentCardData[cardDataProperty] + " ⟪B⟫ "
    });

    ////// B.IIc Function to add highlighted text (Auricle text)
    const handleHighlightText = ({
        cardUid,
        cardDataProperty
    }: {
        cardUid: string,
        cardDataProperty: "cardFrontText" | "cardBackText"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, "questionCards", cardUid, cardDataProperty],
        targetValue: currentCardData[cardDataProperty] + " 【H】 "
    });

    ////// B.IId Function to add italic text (Auricle text)
    const handleItalicText = ({
        cardUid,
        cardDataProperty
    }: {
        cardUid: string,
        cardDataProperty: "cardFrontText" | "cardBackText"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, "questionCards", cardUid, cardDataProperty],
        targetValue: currentCardData[cardDataProperty] + " ❬I❭ "
    });
    
    ////// B.IIe Function to add cloud text (Auricle text)
    const handleCloudText = ({
        cardUid,
        cardDataProperty
    }: {
        cardUid: string,
        cardDataProperty: "cardFrontText" | "cardBackText"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, "questionCards", cardUid, cardDataProperty],
        targetValue: currentCardData[cardDataProperty] + " ⎨C⎬ "
    });

    ////// B.III Function to move card number up
    const handleMoveUpCardNumber = ({cardUid}: {cardUid: string}): void => {
        setLocalQuizContextParams("bufferQuestion", processSwapArrayDataString({
            object: localQuizContextParams.bufferQuestion,
            keysHierachyToTargetObjectUidSequenceArray: [
                localQuizContextParams.currentQuestionUid, "questionData",
                localQuizContextParams.currentQuestionModality, "questionCardsUidSequence"],
            targetString: cardUid,
            sequenceMoveUnit: -1
        }));
    }

    ////// B.IV Function to move card number down
    const handleMoveDownCardNumber = ({cardUid}: {cardUid: string}): void => {
        setLocalQuizContextParams("bufferQuestion", processSwapArrayDataString({
            object: localQuizContextParams.bufferQuestion,
            keysHierachyToTargetObjectUidSequenceArray: [
                localQuizContextParams.currentQuestionUid, "questionData",
                localQuizContextParams.currentQuestionModality, "questionCardsUidSequence"],
            targetString: cardUid,
            sequenceMoveUnit: +1
        }));
    }

    ////// B.V Function to add card
    const handleAddCard = (): void => {
        if (Object.keys(currentQuestionData.questionCards).length < cardLimit) {
            // Add question card
            const processedBufferQuestion = processAddQuestionCard({
                bufferQuestion: localQuizContextParams.bufferQuestion,
                questionUid: localQuizContextParams.currentQuestionUid
            });
            
            // Insert new card uid to questionCardsUidSequence
            setLocalQuizContextParams("bufferQuestion", processInsertArrayDataString({
                object: processedBufferQuestion.newBufferQuestion,
                keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionCardsUidSequence"],
                targetValueToInsert: processedBufferQuestion.newCardUid,
                insertPosition: arrayIndexOf({
                    array: currentQuestionData.questionCardsUidSequence,
                    targetValue: currentCardUid,
                    indexIfError: -2
                }) + 1
            }));
    
            // Set current card Uid
            setCurrentCardUid(processedBufferQuestion.newCardUid);
        } else {
            setGlobalParams("popUp", true);
            setGlobalParams("popUpAction", "⟨EXCEPTION⟩: entity limit");
            setGlobalParams("popUpText", `Total cards exceeds limit at ${cardLimit} cards per MCQ question`);
        }
    }

    ////// B.VI Function to duplicate card
    const handleDuplicateCard = ({cardUid}: {cardUid: string}): void => {
        if (Object.keys(currentQuestionData.questionCards).length < cardLimit) {
            // Duplicate question card
            const processedBufferQuestion = processDuplicateQuestionCard({
                bufferQuestion: localQuizContextParams.bufferQuestion,
                questionUid: localQuizContextParams.currentQuestionUid,
                cardUid: cardUid
            });
            
            setLocalQuizContextParams("bufferQuestion", processInsertArrayDataString({
                object: processedBufferQuestion.newBufferQuestion,
                keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionCardsUidSequence"],
                targetValueToInsert: processedBufferQuestion.newCardUid,
                insertPosition: arrayIndexOf({
                    array: currentQuestionData.questionCardsUidSequence,
                    targetValue: cardUid
                }) + 1
            }));

            // Set current card Uid
            setCurrentCardUid(processedBufferQuestion.newCardUid);
        } else {
            setGlobalParams("popUp", true);
            setGlobalParams("popUpAction", "⟨EXCEPTION⟩: entity limit");
            setGlobalParams("popUpText", `Total cards exceeds limit at ${cardLimit} cards per MCQ question`);
        }
    }

    ////// B.VII Function to delete card
    const handleDeleteCard = ({cardUid}: {cardUid: string}): void => {
        // Delete card
        setLocalQuizContextParams("bufferQuestion", objectKeyDelete({
            object: processDeleteArrayDataString({
                object: localQuizContextParams.bufferQuestion,
                keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionCardsUidSequence"],
                targetValueToDelete: cardUid
            }),
            keysHierachy: [...rootKeysHierachy, "questionCards"],
            keyToDelete: cardUid
        }));

        // Reset current card Uid
        setCurrentCardUid("");
    }

    ////// B.VIII Function to toggle card allowFlipped property
    const handleToggleCardAllowFlipped = ({cardUid}: {cardUid: string}): void => {
        handleQuestionKeyValueUpdate({
            keysHierachy: [...rootKeysHierachy, "questionCards", cardUid, "cardAllowFlipped"],
            targetValue: !objectKeyRetrieve({
                object: localQuizContextParams.bufferQuestion,
                keysHierachy: [...rootKeysHierachy, "questionCards", cardUid, "cardAllowFlipped"],
            })
        });
    }


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    const questionCardsElements: React.ReactNode[] = [];
    const allCardsUid: string[] = currentQuestionData.questionCardsUidSequence;

    allCardsUid.map((cardUid, cardIndex) => {
        const cardContent = currentQuestionData.questionCards[cardUid];
        questionCardsElements.push(
            <div aria-label="mcq-C1-card-card-individual" 
                onClick={() => setCurrentCardUid(cardUid)}
                key={cardUid} className={`flex flex-col gap-4 -border rounded-xl pb-4 -prevent-select ${
                    (currentCardUid === cardUid) ? "-hover-bg-active" : "cursor-pointer -hover-bg-half"
                } ${
                    cardView && "min-w-96 max-w-[25dvw]"
                }`}>
                <div aria-label="card-header" className="flex flex-row p-4 -border-b">
                    <div aria-label="card-number" className="flex flex-row items-center gap-2">
                        {(cardIndex > 0)
                            ? <button onClick={() => handleMoveUpCardNumber({cardUid: cardUid})} className="p-2 -hover-bg rounded-full">
                                <Icon icon="left" size={16} />
                            </button>
                            : <div className="p-2 rounded-full color-slate">
                                <Icon icon="left" size={16} />
                            </div>
                        }
                        <span className="font-black text-xl text-center min-w-4 px-1">{cardIndex + 1}</span>
                        {(cardIndex + 1 < allCardsUid.length)
                            ? <button onClick={() => handleMoveDownCardNumber({cardUid: cardUid})} className="p-2 -hover-bg rounded-full">
                                <Icon icon="right" size={16} />
                            </button>
                            : <div className="p-2 rounded-full color-slate">
                                <Icon icon="right" size={16} />
                            </div>
                        }
                    </div>
                    <button onClick={() => {(currentCardUid === cardUid) && handleToggleCardAllowFlipped({cardUid: cardUid})}}
                        className="flex flex-row items-center gap-2 ml-auto">
                        {objectKeyRetrieve({
                            object: localQuizContextParams.bufferQuestion,
                            keysHierachy: [...rootKeysHierachy, "questionCards", cardUid, "cardAllowFlipped"]})
                            ? <>
                                <ChipTextColor chipText="FLIP CARD" chipIcon="twoSide" textColor={stringToRgb("G", globalParams.theme)} />
                            </>
                            : <>
                                <ChipTextColor chipText="CLOUD CARD" chipIcon="cloud" textColor={stringToRgb("K", globalParams.theme)} />
                            </>
                        }
                    </button>
                </div>
                <div aria-label="card-preview-text" className="-hover-bg-active-half flex flex-col gap-2 max-h-36 mx-4 p-3 font-bold rounded-xl text-nowrap overflow-x-auto">
                    <p className="text-xs color-slate">CARD FRONT TEXT</p>
                    {cardContent.cardFrontText && <AuricleText inputText={cardContent.cardFrontText} />}
                </div>
                {objectKeyRetrieve({
                    object: localQuizContextParams.bufferQuestion,
                    keysHierachy: [...rootKeysHierachy, "questionCards", cardUid, "cardAllowFlipped"]})
                    && <>
                        <div aria-label="card-preview-comment" className="-hover-bg-active-half flex flex-col gap-2 max-h-36 mx-4 p-3 font-bold rounded-xl text-nowrap overflow-x-auto">
                            <p className="text-xs color-slate">CARD BACK TEXT</p>
                            {cardContent.cardBackText && <AuricleText inputText={cardContent.cardBackText} />}
                        </div>
                    </>
                }
            </div>
        );
    })

    const MCQInterfaceCardOverview = (
        <div aria-label="mcq-C1-card-overview" key="mcq-C1-card-overview"
            className="h-full flex flex-col -border-b">
            <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half overflow-x-auto -prevent-select">
                <Icon icon="true" size={24} />
                <p className="font-black text-lg">QUESTION CARD</p>
                <button onClick={() => toggleCardView((prev) => (!prev))}
                    className="flex flex-row items-center gap-2 ml-auto px-3 py-2 -border -button-hover-pri rounded-xl">
                    {cardView
                        ? <><Icon icon="code-bracket-square" size={20} /><span className="font-bold">SLIDE VIEW</span></>
                        : <><Icon icon="squares-2x2" size={20} /><span className="font-bold">GRID VIEW</span></>
                    }
                </button>
                <button onClick={() => handleAddCard()}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border -button-hover-pri rounded-xl">
                    <Icon icon="squares-plus" size={18} />
                    <span className="font-bold">ADD NEW CARD</span>
                </button>
            </div>
            { (allCardsUid.length === 0)
                ? <AddCardToEdit />
                : <div className={`items-start gap-4 w-full p-4 overflow-x-auto ${
                    cardView
                        ? "flex flex-row"
                        : "grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3"
                }`}>
                    {questionCardsElements}
                </div>
            }
        </div>
    );

    const MCQInterfaceCardButtons = (
        <div aria-label="mcq-C1-card-buttons" key="mcq-C1-card-buttons" className="flex flex-row items-center gap-4 px-4 pt-4 text-nowrap overflow-x-auto -prevent-select">
            {(currentCardData === undefined)
                ? <ChooseCardToEdit />
                : <>
                    <div className="flex flex-row items-center gap-2 px-3 py-2 -hover-bg-active rounded-xl">
                        <Icon icon="card" size={24}/>
                        <span className="font-bold">CARD {allCardsUid.indexOf(currentCardUid) + 1}</span>
                    </div>
                    <button onClick={() => handleToggleCardAllowFlipped({cardUid: currentCardUid})}
                        className="flex flex-row items-center gap-2 px-3 py-2 -border -hover-bg rounded-xl">
                        {objectKeyRetrieve({
                            object: localQuizContextParams.bufferQuestion,
                            keysHierachy: [...rootKeysHierachy, "questionCards", currentCardUid, "cardAllowFlipped"]})
                            ? <>
                                <TextColor chipIcon="twoSide" textColor={stringToRgb("G", globalParams.theme)} />
                                <span className="font-bold">FLIP CARD</span>
                            </>
                            : <>
                                <TextColor chipIcon="cloud" textColor={stringToRgb("K", globalParams.theme)} />
                                <span className="font-bold">CLOUD CARD</span>
                            </>
                        }
                    </button>
                    <button onClick={() => handleDuplicateCard({cardUid: currentCardUid})}
                        className="flex flex-row items-center gap-2 ml-auto px-3 py-2 -border -button-hover-amber rounded-xl">
                        <Icon icon="copy" size={16} />
                        <span className="font-bold">DUPLICATE</span>
                    </button>
                    <button onClick={() => handleDeleteCard({cardUid: currentCardUid})}
                        className="flex flex-row items-center gap-2 px-3 py-2 -border -button-hover-red rounded-xl">
                        <Icon icon="trash" size={16} />
                        <span className="font-bold">DELETE</span>
                    </button>
                </>
            }
        </div>
    )

    const MCQInterfaceCardFrontText = (
        <div aria-label="mcq-C1-card-text" key="mcq-C1-card-text"
            className="h-full flex flex-col">
            {(currentCardData === undefined)
                ? null
                : <div className="flex flex-col gap-4 mx-4 mt-4 -border rounded-xl">
                    <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half overflow-x-auto -prevent-select">
                        <Icon icon="font" size={24} />
                        <p className="font-black text-lg mr-auto">CARD FRONT TEXT</p>
                    </div>
                    <div className="flex flex-row items-center gap-4 mx-4 overflow-auto -scroll-none -prevent-select">
                        <button onClick={() => handleAddNewLine({cardUid: currentCardUid, cardDataProperty: "cardFrontText"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="paragraph" size={16} /><p className="font-bold text-md text-nowrap">NEW LINE</p>
                        </button>
                        <button onClick={() => handleBoldText({cardUid: currentCardUid, cardDataProperty: "cardFrontText"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="bold" size={16} /><p className="font-bold text-md text-nowrap">BOLD TEXT</p>
                        </button>
                        <button onClick={() => handleHighlightText({cardUid: currentCardUid, cardDataProperty: "cardFrontText"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="card" size={16} /><p className="font-bold text-md text-nowrap">HIGHLIGHT TEXT</p>
                        </button>
                        <button onClick={() => handleItalicText({cardUid: currentCardUid, cardDataProperty: "cardFrontText"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="italic" size={16} /><p className="font-bold text-md text-nowrap">ITALIC TEXT</p>
                        </button>
                        {!objectKeyRetrieve({
                            object: localQuizContextParams.bufferQuestion,
                            keysHierachy: [...rootKeysHierachy, "questionCards", currentCardUid, "cardAllowFlipped"]}) 
                            && <button onClick={() => handleCloudText({cardUid: currentCardUid, cardDataProperty: "cardFrontText"})}
                                className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                                <Icon icon="cloud" size={16} /><p className="font-bold text-md text-nowrap">CloudNine®</p>
                            </button>}
                    </div>
                    <textarea rows={3} className="editor-fieldk mx-4 p-4 -border rounded-xl"
                        onChange={e => handleQuestionKeyValueUpdate({
                            keysHierachy: [...rootKeysHierachy, "questionCards", currentCardUid, "cardFrontText"],
                            targetValue: e.target.value
                        })}
                        value={currentCardData.cardFrontText}>
                    </textarea>
                    <div aria-label="card-preview-text" className="-hover-bg-active-half mx-4 mb-4 p-4 font-bold rounded-xl overflow-x-auto -prevent-select">
                        <p className="text-xs color-slate mb-2">CARD TEXT PREVIEW</p>
                        <AuricleText inputText={currentCardData.cardFrontText} />
                    </div>
                </div>
            }
        </div>
    );

    const MCQInterfaceCardBackText = (
        <div aria-label="mcq-C1-card-comment" key="mcq-C1-card-comment"
            className="h-full flex flex-col -border-b">
            {(currentCardData === undefined)
                ? null
                : <div className="flex flex-col gap-4 m-4 -border rounded-xl">
                    <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half overflow-x-auto -prevent-select">
                        <Icon icon="card" size={24} />
                        <p className="font-black text-lg mr-auto">CARD BACK TEXT</p>
                    </div>
                    <div className="flex flex-row items-center gap-4 mx-4 overflow-auto -scroll-none -prevent-select">
                        <button onClick={() => handleAddNewLine({cardUid: currentCardUid, cardDataProperty: "cardBackText"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="paragraph" size={16} /><p className="font-bold text-md text-nowrap">NEW LINE</p>
                        </button>
                        <button onClick={() => handleBoldText({cardUid: currentCardUid, cardDataProperty: "cardBackText"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="bold" size={16} /><p className="font-bold text-md text-nowrap">BOLD TEXT</p>
                        </button>
                        <button onClick={() => handleHighlightText({cardUid: currentCardUid, cardDataProperty: "cardBackText"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="card" size={16} /><p className="font-bold text-md text-nowrap">HIGHLIGHT TEXT</p>
                        </button>
                        <button onClick={() => handleItalicText({cardUid: currentCardUid, cardDataProperty: "cardBackText"})}
                            className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                            <Icon icon="italic" size={16} /><p className="font-bold text-md text-nowrap">ITALIC TEXT</p>
                        </button>
                    </div>
                    <textarea rows={3} className="mx-4 mb-4 p-4 -border rounded-xl"
                        onChange={e => handleQuestionKeyValueUpdate({
                            keysHierachy: [...rootKeysHierachy, "questionCards", currentCardUid, "cardBackText"],
                            targetValue: e.target.value
                        })}
                        value={currentCardData.cardBackText}>
                    </textarea>
                    <div aria-label="card-preview-comment" className="-hover-bg-active-half mx-4 mb-4 p-4 font-bold rounded-xl overflow-x-auto -prevent-select">
                        <p className="text-xs color-slate mb-2">CARD COMMENT PREVIEW</p>
                        <AuricleText inputText={currentCardData.cardBackText} />
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
            {MCQInterfaceCardOverview}
            {MCQInterfaceCardButtons}
            {MCQInterfaceCardFrontText}
            {objectKeyRetrieve({
                object: localQuizContextParams.bufferQuestion,
                keysHierachy: [...rootKeysHierachy, "questionCards", currentCardUid, "cardAllowFlipped"]}) 
                && MCQInterfaceCardBackText}
        </article>
    );
}

// =========================================================================
// 4. LOCAL COMPONENTS
// =========================================================================

const AddCardToEdit = () => (
    <div className="w-full my-12 text-textSlate dark:text-textSlate-dark flex flex-col justify-center items-center text-center" key="blank">
        <Icon icon="squares-plus" size={48} />
        <h1>Add new card to edit</h1>
    </div>
);

const ChooseCardToEdit = () => (
    <div className="w-full mt-12 text-textSlate dark:text-textSlate-dark flex flex-col justify-center items-center text-center" key="blank">
        <Icon icon="edit" size={48} />
        <h1>Choose card to edit</h1>
    </div>
);
