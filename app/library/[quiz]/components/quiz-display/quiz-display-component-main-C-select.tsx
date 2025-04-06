"use client";

// app/library/[quiz]/components/quiz-edit/quiz-edit-component-main-C-select.tsx

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
import objectKeyRetrieve from "@/app/utility/function/object/object-key-retrieve";

import arrayIndexOf from "@/app/utility/function/array/array-index-of";
import stringToHex from "@/app/utility/function/color/string-to-rgb";

//// 1.5 Public and others
import { TextColor, ChipTextColor } from "@/app/utility/components/chip";


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function QuizDisplayMain_C_SELECT (): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/[quiz]/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();

    ////// A.III useState focused row uid
    const [currentColumnUid, setCurrentColumnUid] = useState("");

    ////// A.IV useState focused row uid
    const [currentRowUid, setCurrentRowUid] = useState("");

    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS & COMPONENT
    //// -------------------------------------------------------------------------

    const rootKeysHierachy: string[] = [
        localQuizContextParams.currentQuestionUid,
        "questionData",
        localQuizContextParams.currentQuestionModality,
        
    ];

    const questionData = objectKeyRetrieve({
        object: localQuizContextParams.bufferQuestion,
        keysHierachy: rootKeysHierachy
    });

    const allRowsUid: string[] = objectKeyRetrieve({
        object: localQuizContextParams.bufferQuestion,
        keysHierachy: [...rootKeysHierachy, "questionRows", "rowsDataUidSequence"]
    });

    const allColumnsUid: string[] = objectKeyRetrieve({
        object: localQuizContextParams.bufferQuestion,
        keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsDataUidSequence"]
    });

    ////// -------------------------------------------------------------------------
    ////// GENERAL

    ////// B.Ia Function to dynamically update object data
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

    ////// -------------------------------------------------------------------------
    ////// ROW PROPERTY FX.

    const handleToggleRowPropertyValue = ({
        rowUid, 
        columnUid, 
        currentProperty
    }: {rowUid: string, 
        columnUid: string, 
        currentProperty: string

    }) => {
        const allPropertiesUid = allColumnsUid.includes(columnUid) 
        ? Object.keys(objectKeyRetrieve({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", columnUid, "columnSelect"]
        })).reverse()
        : []
        const newProperty = allPropertiesUid[(arrayIndexOf({
            array: allPropertiesUid, targetValue: currentProperty
        }) + 1) % allPropertiesUid.length] as typeof allPropertiesUid[number];
        
        handleQuestionKeyValueUpdate({
            keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", rowUid, "rowSelect", columnUid],
            targetValue: newProperty
        });
    }

    const handleSetRowPropertyValue = ({
        rowUid, 
        columnUid, 
        currentProperty
    }: {rowUid: string, 
        columnUid: string, 
        currentProperty: string

    }) => {
        handleQuestionKeyValueUpdate({
            keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", rowUid, "rowSelect", columnUid],
            targetValue: currentProperty
        });
    }

    
    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------
    
    ////// C.I Assemble tabular interface
    let elementRows: React.ReactNode[] = []

    //////// C.Ia Render table property header
    let elementsHeader: React.ReactNode[] = [<th aria-label="table-header-blank" key={0} onClick={() => {setCurrentColumnUid("DEFAULT")}} className="w-48 -border-r"></th>]

    allColumnsUid.map((columnUid, propertyIndex) => {
        elementsHeader.push(
            <th aria-label="table-header-property" key={columnUid} onClick={() => setCurrentColumnUid(columnUid)}
                className={`min-w-48 max-w-96 -border-l-half`}>
                <div className="flex flex-row gap-4 m-3 text-left">
                    <p className="color-slate">{propertyIndex + 1}</p>
                    <p>{objectKeyRetrieve({
                        object: localQuizContextParams.bufferQuestion,
                        keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", columnUid, "columnText"]})}
                    </p>
                </div>
            </th>
        );
    });
    
    //////// C.Ib Render rows
    allRowsUid.map((rowUid, rowIndex) => {
        
        //////// C.Ic Render property columns
        let elementRowPropertyAnswer: React.ReactNode[] = [];

        allColumnsUid.map((columnUid) => {
            const answerPropertyUid = objectKeyRetrieve({
                object: localQuizContextParams.bufferQuestion,
                keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", rowUid, "rowAnswer", columnUid]
            });

            const defaultPropertyUid = Object.keys(objectKeyRetrieve({
                object: localQuizContextParams.bufferQuestion,
                keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", columnUid, "columnSelect"]
            }))[0];

            const selectedPropertyUid = objectKeyRetrieve({
                object: localQuizContextParams.bufferQuestion,
                keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", rowUid, "rowSelect", columnUid]
            }) ?? defaultPropertyUid;

            const matrixDataAnswer = objectKeyRetrieve({
                object: localQuizContextParams.bufferQuestion,
                keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", columnUid, "columnSelect", answerPropertyUid]
            });

            const matrixDataSelected = objectKeyRetrieve({
                object: localQuizContextParams.bufferQuestion,
                keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", columnUid, "columnSelect", selectedPropertyUid]
            });

            matrixDataAnswer 
                ? elementRowPropertyAnswer.push(
                    <td aria-label="table-row-property" key={columnUid} className={`-border-l-half p-3 ${
                        // Ungraded
                        !questionData.graded && (currentRowUid === rowUid) && (currentColumnUid === columnUid)
                            ? "-hover-bg-active"
                            : "-hover-bg"
                    }`} style={
                        // Graded
                        questionData.graded
                            ? (selectedPropertyUid === answerPropertyUid)
                                // CORRECT ANSWER
                                ? {backgroundColor: `${stringToHex("K", globalParams.theme)}28`}
                                // INCORRECT ANSWER
                                : {backgroundColor: `${stringToHex("G", globalParams.theme)}28`}
                            : {cursor: "pointer"}
                    }
                    onClick={() => {
                        if ((currentRowUid === rowUid) && (currentColumnUid === columnUid) && (!questionData.graded)) {
                            handleToggleRowPropertyValue({rowUid: rowUid, columnUid: columnUid, currentProperty: selectedPropertyUid});
                        } else {
                            setCurrentColumnUid(columnUid);
                            setCurrentRowUid(rowUid);
                        }}}>
                        {
                            !questionData.graded
                                // Ungraded
                                ? <ChipTextColor chipText={matrixDataSelected.propertyText} chipIcon={matrixDataSelected.propertyIcon} 
                                    textStringForColor={matrixDataSelected.propertyColorCode ? matrixDataSelected.propertyColorCode : matrixDataSelected.propertyText} 
                                    chipBackgroundOpacity={0.6} />

                                // Graded
                                : selectedPropertyUid === answerPropertyUid
                                    // CORRECT ANSWER
                                    ? <ChipTextColor chipText={matrixDataSelected.propertyText} chipIcon={matrixDataSelected.propertyIcon} 
                                        textStringForColor={matrixDataSelected.propertyColorCode ? matrixDataSelected.propertyColorCode : matrixDataSelected.propertyText} 
                                        chipBackgroundOpacity={0.6} />
                                    // INCORRECT ANSWER
                                    : <div className="flex flex-col justify-start items-start">
                                        <div className="w-fit p-0.5 -border -hover-bg-active rounded-lg">
                                            <TextColor chipText={matrixDataSelected.propertyText} chipIcon={matrixDataSelected.propertyIcon} 
                                                textStringForColor={matrixDataSelected.propertyColorCode ? matrixDataSelected.propertyColorCode : matrixDataSelected.propertyText} />
                                        </div>
                                        <p className="mt-4 mb-2 p-1 font-bold text-md color-slate -border-b-half">CORRECT ANSWER IS</p>
                                        <ChipTextColor chipText={matrixDataAnswer.propertyText} chipIcon={matrixDataAnswer.propertyIcon} 
                                            textStringForColor={matrixDataAnswer.propertyColorCode ? matrixDataAnswer.propertyColorCode : matrixDataAnswer.propertyText} 
                                            chipBackgroundOpacity={0.6} />
                                    </div>
                        }
                    </td>)
                : elementRowPropertyAnswer.push(
                <td aria-label="table-row-property" key={columnUid} className="-border-l-half p-3 cursor-pointer">
                    <span className="font-bold color-slate">BLANK CELL</span>
                </td>);
        });

        elementRows.push(
            <tr key={rowUid}
            className={`py-2 rounded-xl -border-t-half`}>
                <td className="-border-r">
                    <div aria-label="row-number" className="flex flex-row items-center gap-4 font-bold text-left m-3">
                        <p className="color-slate">{rowIndex + 1}</p>
                        <AuricleText inputText={objectKeyRetrieve({
                            object: localQuizContextParams.bufferQuestion,
                            keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", rowUid, "rowText"]
                        })} />
                    </div>
                </td>
                {elementRowPropertyAnswer}
            </tr>
        );
    });

    //////// C.I Table structure
    const selectTabularStructure = (
        <div aria-label="select-C1-tabular-structure" key="select-C1-tabular-structure"
            className="h-full flex flex-col">
            <p className="mx-4 mt-8 mb-2 p-1 font-bold text-md color-slate -border-b-half">TOGGLE ROW-COLUMN PROPERTY</p>
            <div className="m-4 -border rounded-xl overflow-x-auto">
                <table className="-border-r text-nowrap -prevent-select">
                    <thead>
                        <tr className="-border-b -hover-bg-active-half">
                            {elementsHeader}
                        </tr>
                    </thead>
                    <tbody>{elementRows}</tbody>
                </table>
            </div>
        </div>
    );

    //////// C.IIa List of properties
    let elementPropertiesChip: React.ReactNode[] = [];

    const allPropertiesUid = allColumnsUid.includes(currentColumnUid) 
        ? Object.keys(objectKeyRetrieve({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentColumnUid, "columnSelect"]
        }))
        : [];

    allPropertiesUid.length && allPropertiesUid.map((propertyUid) => {
        const matrixData = objectKeyRetrieve({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentColumnUid, "columnSelect", propertyUid]
        });

        elementPropertiesChip.push(
            <button key={propertyUid} className="p-2 -hover-bg rounded-xl"
            onClick={() => handleSetRowPropertyValue({rowUid: currentRowUid, columnUid: currentColumnUid, currentProperty: propertyUid})}>
                <ChipTextColor chipText={matrixData.propertyText} chipIcon={matrixData.propertyIcon} textStringForColor={matrixData.propertyColorCode ? matrixData.propertyColorCode : matrixData.propertyText}
                    chipBackgroundOpacity={0.6} />
            </button>
        );
    });

    const selectTabularPropertyChip = (
        <div className="mt-8 -hover-bg-active-half">
            <p className="mt-4 mx-4 mb-2 p-1 font-bold text-md color-slate -border-b-half">AVALIABLE PROPERTIES</p>
            <div className="flex flex-wrap gap-4 p-4 justify-start items-center text-nowrap overflow-x-auto">
                {(elementPropertiesChip.length > 0)
                    && elementPropertiesChip}
            </div>
        </div>
    )


    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    return (
        <article aria-label="main-B-header" key="main-B-header" className="relative flex flex-col pb-12">
            {selectTabularStructure}
            {selectTabularPropertyChip}
        </article>
    );
}
