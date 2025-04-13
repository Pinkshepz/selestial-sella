"use client";

// app/library/[quiz]/components/quiz-edit/quiz-edit-component-main-B-header.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import React, { useState, useEffect } from "react";

//// 1.2 Custom React hooks
import { useLocalQuizContext } from "@/app/library/[quiz]/local-quiz-provider";

//// 1.3 React components
import AuricleText from "@/app/utility/components/auricleText";

//// 1.4 Utility functions
import objectKeyValueUpdate from "@/app/utility/function/object/object-dynamic-change";
import objectKeyRetrieve from "@/app/utility/function/object/object-key-retrieve";

//// 1.5 Public and others
import Icon from "@/public/icon";
import { ChipTextColor } from "@/app/utility/components/chip";


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function QuizEditMain_B_Header (): React.ReactNode {

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

    ////// A.III useState toggle showing only questionText
    const [showOnlyQuestionText, setShowOnlyQuestionText] = useState(true);
    
    
    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS & COMPONENT
    //// -------------------------------------------------------------------------

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
        questionDataProperty
    }: {
        questionDataProperty: "questionText" | "questionComment"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, questionDataProperty],
        targetValue: currentQuestionData[questionDataProperty] + " \\n "
    });

    ////// B.IIb Function to add bold text (Auricle text)
    const handleBoldText = ({
        questionDataProperty
    }: {
        questionDataProperty: "questionText" | "questionComment"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, questionDataProperty],
        targetValue: currentQuestionData[questionDataProperty] + " ⟪B⟫ "
    });

    ////// B.IIc Function to add highlighted text (Auricle text)
    const handleHighlightText = ({
        questionDataProperty
    }: {
        questionDataProperty: "questionText" | "questionComment"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, questionDataProperty],
        targetValue: currentQuestionData[questionDataProperty] + " 【H】 "
    });

    ////// B.IId Function to add italic text (Auricle text)
    const handleItalicText = ({
        questionDataProperty
    }: {
        questionDataProperty: "questionText" | "questionComment"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, questionDataProperty],
        targetValue: currentQuestionData[questionDataProperty] + " ❬I❭ "
    });

    ////// B.IIe Function to add cloud text (Auricle text)
    const handleCloudText = ({
        questionDataProperty
    }: {
        questionDataProperty: "questionText" | "questionComment"
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: [...rootKeysHierachy, questionDataProperty],
        targetValue: currentQuestionData[questionDataProperty] + "⎨C⎬"
    });

    ////// B.III Component to fetch web preview
    const FetchComponent = ({ url }: { url: string }) => {
        const [data, setData] = useState<string | null>(null);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | null>(null);
      
        useEffect(() => {
          const fetchData = async () => {
            try {
              setLoading(true);
              const response = await fetch(url);
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              const textData = await response.text();
              setData(textData);
            } catch (err: any) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          };
      
          fetchData();
        }, [url]); // Runs when URL changes
      
        if (loading) return <ChipTextColor chipIcon="gear" chipText={`LOADING...`} textStringForColor="2" />;
        if (error) return <ChipTextColor chipIcon="exclamation" chipText={`ERROR: ${error}`} textStringForColor="G" />;
      
        return <ChipTextColor chipIcon="true" chipText="VALID URL" textStringForColor="K" />;
    };


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    const HeaderInterfaceQuestionText = (
        <div aria-label="main-B-modality-question-text" key="main-B-modality-question-text"
            className="h-full flex flex-col gap-4 pb-12 -border-b">
            <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half -prevent-select">
                <Icon icon="font" size={24} />
                <p className="font-black text-lg mr-auto">QUESTION TEXT</p>
                <button onClick={() => setShowOnlyQuestionText((prev) => (!prev))}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                    <Icon icon={showOnlyQuestionText ? "font" : "true"} size={16} />
                    <p className="font-bold text-md text-nowrap">
                        {showOnlyQuestionText ? "QUESTION TEXT ONLY" : "EXPAND ALL OPTIONS"}
                    </p>
                </button>
            </div>
            <div className="flex flex-row items-center gap-4 mx-4 overflow-auto -scroll-none">
                <button onClick={() => handleAddNewLine({questionDataProperty: "questionText"})}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                    <Icon icon="paragraph" size={16} /><p className="font-bold text-md text-nowrap">NEW LINE</p>
                </button>
                <button onClick={() => handleBoldText({questionDataProperty: "questionText"})}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                    <Icon icon="bold" size={16} /><p className="font-bold text-md text-nowrap">BOLD TEXT</p>
                </button>
                <button onClick={() => handleHighlightText({questionDataProperty: "questionText"})}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                    <Icon icon="card" size={16} /><p className="font-bold text-md text-nowrap">HIGHLIGHT TEXT</p>
                </button>
                <button onClick={() => handleItalicText({questionDataProperty: "questionText"})}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                    <Icon icon="italic" size={16} /><p className="font-bold text-md text-nowrap">ITALIC TEXT</p>
                </button>
                <button onClick={() => handleCloudText({questionDataProperty: "questionText"})}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -button-hover-pri">
                    <Icon icon="cloud" size={16} /><p className="font-bold text-md text-nowrap">Add CloudNine®</p>
                </button>
            </div>
            <textarea rows={localQuizContextParams.currentQuestionModality === "WORD-CLOUD" ? 5 : 12} className="editor-fieldk mx-4 my-1 p-4 -border rounded-xl"
                onChange={e => handleQuestionKeyValueUpdate({
                    keysHierachy: [...rootKeysHierachy, "questionText"],
                    targetValue: e.target.value
                })}
                value={currentQuestionData.questionText}>
            </textarea>
            <div className="-hover-bg-active-half mx-4 my-1 p-4 font-bold rounded-xl -prevent-select">
                <p className="text-xs color-slate mb-2">TEXT PREVIEW</p>
                <AuricleText inputText={currentQuestionData.questionText} />
            </div>
        </div>
    );

    const HeaderInterfaceQuestionComment = (
        <div aria-label="main-B-modality-question-comment" key="main-B-modality-question-comment"
        className="h-full flex flex-col gap-4 pb-12 -border-b">
            <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half -prevent-select overflow-x-auto">
                <Icon icon="card" size={24} />
                <p className="font-black text-lg -prevent-select">QUESTION COMMENT</p>
            </div>
            <div className="flex flex-row items-center gap-4 mx-4 overflow-auto -scroll-none">
                <button onClick={() => handleAddNewLine({questionDataProperty: "questionComment"})}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -hover-bg">
                    <Icon icon="paragraph" size={16} /><p className="font-bold text-md text-nowrap">NEW LINE</p>
                </button>
                <button onClick={() => handleBoldText({questionDataProperty: "questionComment"})}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -hover-bg">
                    <Icon icon="bold" size={16} /><p className="font-bold text-md text-nowrap">BOLD TEXT</p>
                </button>
                <button onClick={() => handleHighlightText({questionDataProperty: "questionComment"})}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -hover-bg">
                    <Icon icon="card" size={16} /><p className="font-bold text-md text-nowrap">HIGHLIGHT TEXT</p>
                </button>
                <button onClick={() => handleItalicText({questionDataProperty: "questionComment"})}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -hover-bg">
                    <Icon icon="italic" size={16} /><p className="font-bold text-md text-nowrap">ITALIC TEXT</p>
                </button>
                <button onClick={() => handleCloudText({questionDataProperty: "questionComment"})}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -hover-bg">
                    <Icon icon="cloud" size={16} /><p className="font-bold text-md text-nowrap">CloudNine®</p>
                </button>
            </div>
            <textarea rows={3} className="editor-fieldk my-1 mx-4 p-4 -border rounded-xl"
                onChange={e => handleQuestionKeyValueUpdate({
                    keysHierachy: [...rootKeysHierachy, "questionComment"],
                    targetValue: e.target.value
                })}
                value={currentQuestionData.questionComment}>
            </textarea>
            <div className="-hover-bg-active-half my-1 mx-4 p-4 font-bold rounded-xl -prevent-select -prevent-select">
                <p className="text-xs color-slate mb-2">TEXT PREVIEW</p>
                <AuricleText inputText={currentQuestionData.questionComment} />
            </div>
        </div>
    );

    const HeaderInterfaceQuestionImage = (
        <div aria-label="main-B-modality-question-image" key="main-B-modality-question-image"
            className="flex flex-col pb-12 -border-b">
            <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half -prevent-select overflow-x-auto">
                <Icon icon="image" size={24} />
                <p className="font-black text-lg -prevent-select">QUESTION IMAGE URL</p>
            </div>
            <div className="flex flex-row">
                <div className="flex flex-col w-full">
                    <p className="text-xs color-slate mx-4 mt-4 -prevent-select">IMAGE ASIDE QUESTION</p>
                    <textarea rows={1} className="m-4 p-4 -border rounded-xl"
                        onChange={e => handleQuestionKeyValueUpdate({
                            keysHierachy: [...rootKeysHierachy, "questionImageUrl"],
                            targetValue: e.target.value
                        })}
                        value={currentQuestionData.questionImageUrl}>
                    </textarea>
                </div>
                {currentQuestionData.questionImageUrl && 
                    <div className="overflow-hidden w-[25dvw] p-4">
                        <img className="rounded-xl" src={currentQuestionData.questionImageUrl} alt="" />
                    </div>
                }
            </div>
        </div>
    );

    const HeaderInterfaceQuestionResourceUrl = (
        <div aria-label="main-B-modality-question-resource" key="main-B-modality-question-resource"
            className="flex flex-col pb-12 -border-b">
            <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half -prevent-select overflow-x-auto">
                <Icon icon="lightbulb" size={24} />
                <p className="font-black text-lg -prevent-select">QUESTION RESOURCE URL</p>
                {currentQuestionData.questionResourceUrl && 
                    <div className="flex flex-col overflow-auto max-h-24 ml-auto -prevent-select">
                        <FetchComponent url={currentQuestionData.questionResourceUrl} />
                    </div>
                }
            </div>
            <div className="flex flex-row">
                <div className="flex flex-col w-full">
                    <p className="text-xs color-slate mx-4 mt-4 -prevent-select">REFERENCE LINK FOR FURTHER READING</p>
                    <textarea rows={1} className="m-4 p-4 -border rounded-xl"
                        onChange={e => handleQuestionKeyValueUpdate({
                            keysHierachy: [...rootKeysHierachy, "questionResourceUrl"],
                            targetValue: e.target.value})}
                        value={currentQuestionData.questionResourceUrl}>
                    </textarea>
                </div>
            </div>
        </div>
    );


    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    return (
        <article aria-label="main-B-header" key="main-B-header" className="relative flex flex-col">
            {HeaderInterfaceQuestionText}
            {(currentQuestionData.questionComment !== undefined) && !showOnlyQuestionText && HeaderInterfaceQuestionComment}
            {(currentQuestionData.questionImageUrl !== undefined) && !showOnlyQuestionText && HeaderInterfaceQuestionImage}
            {(currentQuestionData.questionResourceUrl !== undefined) && !showOnlyQuestionText && HeaderInterfaceQuestionResourceUrl}
        </article>
    );
}
