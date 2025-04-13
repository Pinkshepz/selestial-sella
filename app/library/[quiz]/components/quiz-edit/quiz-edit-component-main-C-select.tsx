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
import objectKeyDelete from "@/app/utility/function/object/object-dynamic-delete";
import objectKeyRetrieve from "@/app/utility/function/object/object-key-retrieve";

import { processSwapArrayDataString, processInsertArrayDataString, processDeleteArrayDataString } from "./quiz-edit-function-general";

import arrayIndexOf from "@/app/utility/function/array/array-index-of";
import { stringToRgb } from "@/app/utility/function/color/string-to-rgb";

//// 1.5 Public and others
import Icon from "@/public/icon";
import { ChipTextColor } from "@/app/utility/components/chip";
import makeid from "@/app/utility/function/make-id";


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================

const propertyDataUidSequenceMap = {
    questionColumns: "columnsDataUidSequence",
    questionRows: "rowsDataUidSequence"
}


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function QuizEditMain_C_SELECT (): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/[quiz]/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();

    ////// A.III useState focused row uid
    const [currentRowOrColumnUid, setCurrentRowOrColumnUid] = useState("");

    ////// A.IV useState focused row uid
    const [currentPropertyUid, setCurrentPropertyUid] = useState("");

    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS & COMPONENT
    //// -------------------------------------------------------------------------

    const rootKeysHierachy: string[] = [
        localQuizContextParams.currentQuestionUid,
        "questionData",
        localQuizContextParams.currentQuestionModality,
        
    ];

    const allRowsUid: string[] = objectKeyRetrieve({
        object: localQuizContextParams.bufferQuestion,
        keysHierachy: [...rootKeysHierachy, "questionRows", "rowsDataUidSequence"]
    });

    const allColumnsUid: string[] = objectKeyRetrieve({
        object: localQuizContextParams.bufferQuestion,
        keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsDataUidSequence"]
    });

    const selectColumnLimit: number = metadata.entityLimit.selectColumn;
    const selectColumnPropertyLimit: number = metadata.entityLimit.selectColumnProperty;
    const selectColumnPropertyTextLengthLimit: number = metadata.entityLimit.selectColumnPropertyTextLength;
    const selectRowLimit: number = metadata.entityLimit.selectRow;

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

    ////// B.Ic Function to set currentRowOrColumnUid and reset currentPropertyUid
    const handleSetCurrentRowOrColumnUid = (uid: string) => {
        setCurrentRowOrColumnUid(uid);
        setCurrentPropertyUid("");
    }

    ////// B.IIb Function to add bold text (Auricle text)
    const handleBoldText = ({
        keysHierachy
    }: {
        keysHierachy: string[]
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: keysHierachy,
        targetValue: objectKeyRetrieve({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: keysHierachy}) + " ⟪B⟫ "
    });

    ////// B.IIc Function to add highlighted text (Auricle text)
    const handleHighlightText = ({
        keysHierachy
    }: {
        keysHierachy: string[]
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: keysHierachy,
        targetValue: objectKeyRetrieve({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: keysHierachy}) + " 【H】 "
    });

    ////// B.IId Function to add italic text (Auricle text)
    const handleItalicText = ({
        keysHierachy
    }: {
        keysHierachy: string[]
    }): void => handleQuestionKeyValueUpdate({
        keysHierachy: keysHierachy,
        targetValue: objectKeyRetrieve({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: keysHierachy}) + " ❬I❭ "
    });

    ////// B.IIIa Function to decrement axis value number
    const handleDecrementAxisNumber = ({
        axisProperty,
        axisPropertyDataUid
    }: {
        axisProperty: keyof typeof propertyDataUidSequenceMap,
        axisPropertyDataUid: string
    }): void => {
        setLocalQuizContextParams("bufferQuestion", processSwapArrayDataString({
            object: localQuizContextParams.bufferQuestion,
            keysHierachyToTargetObjectUidSequenceArray: [
                localQuizContextParams.currentQuestionUid, "questionData",
                localQuizContextParams.currentQuestionModality, axisProperty, propertyDataUidSequenceMap[axisProperty]],
            targetString: axisPropertyDataUid,
            sequenceMoveUnit: -1
        }));
    }

    ////// B.IIIb Function to increment axis value number down
    const handleIncrementAxisNumber = ({
        axisProperty,
        axisPropertyDataUid
    }: {
        axisProperty: keyof typeof propertyDataUidSequenceMap,
        axisPropertyDataUid: string
    }): void => {
        setLocalQuizContextParams("bufferQuestion", processSwapArrayDataString({
            object: localQuizContextParams.bufferQuestion,
            keysHierachyToTargetObjectUidSequenceArray: [
                localQuizContextParams.currentQuestionUid, "questionData",
                localQuizContextParams.currentQuestionModality, axisProperty, propertyDataUidSequenceMap[axisProperty]],
            targetString: axisPropertyDataUid,
            sequenceMoveUnit: +1
        }));
    }


    ////// -------------------------------------------------------------------------
    ////// ROW FX.

    const handleAddRow = (): void => {
        if (allRowsUid.length < selectRowLimit) {
            const newUid = makeid(20);
            setLocalQuizContextParams("bufferQuestion", objectKeyValueUpdate({
                object: processInsertArrayDataString({
                    object: localQuizContextParams.bufferQuestion,
                    keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionRows", "rowsDataUidSequence"],
                    targetValueToInsert: newUid,
                    insertPosition: -1
                }),
                keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", newUid],
                targetValue: metadata.questionModality.SELECT.questionDataFormat.questionRows.rowsData["#UID-7"]
            }));
            setCurrentRowOrColumnUid(newUid);
        } else {
            setGlobalParams("popUp", true);
            setGlobalParams("popUpAction", "⟨EXCEPTION⟩: entity limit");
            setGlobalParams("popUpText", `Total rows exceeds limit at ${selectRowLimit} rows per select table`);
        }
    }

    const handleDuplicateRow = (): void => {
        if (allRowsUid.length < selectRowLimit) {
            const newUid = makeid(20);
            const duplicateTarget = objectKeyRetrieve({
                object: localQuizContextParams.bufferQuestion,
                keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", currentRowOrColumnUid]
            });

            setLocalQuizContextParams("bufferQuestion", objectKeyValueUpdate({
                object: processInsertArrayDataString({
                    object: localQuizContextParams.bufferQuestion,
                    keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionRows", "rowsDataUidSequence"],
                    targetValueToInsert: newUid,
                    insertPosition: arrayIndexOf({
                        array: allRowsUid,
                        targetValue: currentRowOrColumnUid,
                        indexIfError: -2
                    }) + 1
                }),
                keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", newUid],
                targetValue: objectKeyValueUpdate({
                    object: duplicateTarget,
                    keysHierachy: ["rowText"],
                    targetValue: `Copy of ${duplicateTarget.rowText}`
                })
            }));
            setCurrentRowOrColumnUid(newUid);
        } else {
            setGlobalParams("popUp", true);
            setGlobalParams("popUpAction", "⟨EXCEPTION⟩: entity limit");
            setGlobalParams("popUpText", `Total rows exceeds limit at ${selectRowLimit} rows per select table`);
        }
    }

    const handleDeleteRow = (): void => {
        // Delete currentRowOrColumnUid from table row key and uid array
        let processedQuestion =  objectKeyDelete({
            object: processDeleteArrayDataString({
                object: localQuizContextParams.bufferQuestion,
                keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionRows", "rowsDataUidSequence"],
                targetValueToDelete: currentRowOrColumnUid
            }),
            keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData"],
            keyToDelete: currentRowOrColumnUid
        });

        setLocalQuizContextParams("bufferQuestion", processedQuestion);
        setCurrentRowOrColumnUid("");
    }

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
        }) + 1) % (allPropertiesUid.length + 1)] as typeof allPropertiesUid[number] ?? "";

        handleQuestionKeyValueUpdate({
            keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", rowUid, "rowAnswer", columnUid],
            targetValue: newProperty
        });
    }


    ////// -------------------------------------------------------------------------
    ////// PROPERTY FX.

    const handleAddColumn = (): void => {
        try {
            if (allColumnsUid.length < selectColumnLimit) {
                const newUid = makeid(20);
                setLocalQuizContextParams("bufferQuestion", objectKeyValueUpdate({
                    object: processInsertArrayDataString({
                        object: localQuizContextParams.bufferQuestion,
                        keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionColumns", "columnsDataUidSequence"],
                        targetValueToInsert: newUid,
                        insertPosition: arrayIndexOf({
                            array: allColumnsUid,
                            targetValue: currentRowOrColumnUid,
                            indexIfError: -2
                        }) + 1
                    }),
                    keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", newUid],
                    targetValue: metadata.questionModality.SELECT.questionDataFormat.questionColumns.columnsData["#UID-1"]
                }));
                setCurrentRowOrColumnUid(newUid);
            } else {
                setGlobalParams("popUp", true);
                setGlobalParams("popUpAction", "⟨EXCEPTION⟩: entity limit");
                setGlobalParams("popUpText", `Total columns exceeds limit at ${selectColumnLimit} columns per select table`);
            }
        } catch (error) {null}
    }

    const handleDuplicateColumn = (): void => {
        try {
            if (allColumnsUid.length < selectColumnLimit) {
                const newUid = makeid(20);
                let duplicateTarget = structuredClone(objectKeyRetrieve({
                    object: localQuizContextParams.bufferQuestion,
                    keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid]
                }));
    
                // Copy property and set new Uid
                Object.keys(duplicateTarget.columnSelect).map((propertyUid) => {
                    duplicateTarget.columnSelect[makeid(20)] = structuredClone(duplicateTarget.columnSelect[propertyUid]);
                    delete duplicateTarget.columnSelect[propertyUid];
                })
    
                setLocalQuizContextParams("bufferQuestion", objectKeyValueUpdate({
                    object: processInsertArrayDataString({
                        object: localQuizContextParams.bufferQuestion,
                        keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionColumns", "columnsDataUidSequence"],
                        targetValueToInsert: newUid,
                        insertPosition: arrayIndexOf({
                            array: allColumnsUid,
                            targetValue: currentRowOrColumnUid,
                            indexIfError: -2
                        }) + 1
                    }),
                    keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", newUid],
                    targetValue: duplicateTarget
                }));
                setCurrentRowOrColumnUid(newUid);
            } else {
                setGlobalParams("popUp", true);
                setGlobalParams("popUpAction", "⟨EXCEPTION⟩: entity limit");
                setGlobalParams("popUpText", `Total columns exceeds limit at ${selectColumnLimit} columns per select table`);
            }
        } catch (error) {null}
    }

    const handleDeleteColumn = (): void => {
        // Delete currentRowOrColumnUid from table column key and uid array
        let processedQuestion =  objectKeyDelete({
            object: processDeleteArrayDataString({
                object: localQuizContextParams.bufferQuestion,
                keysHierachyToTargetObjectUidSequenceArray: [...rootKeysHierachy, "questionColumns", "columnsDataUidSequence"],
                targetValueToDelete: currentRowOrColumnUid
            }),
            keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData"],
            keyToDelete: currentRowOrColumnUid
        });
        
        // Also, delete each row's column property connection
        allRowsUid.map((rowUid) => {
            processedQuestion = objectKeyDelete({
                object: processedQuestion,
                keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", rowUid, "rowAnswer", currentRowOrColumnUid],
                keyToDelete: currentRowOrColumnUid
            });
        });

        setLocalQuizContextParams("bufferQuestion", processedQuestion);
        setCurrentRowOrColumnUid("");
    }

    const handleAddColumnProperty = (): void => {
        if (allPropertiesUid.length < selectColumnPropertyLimit) {
            const newUid = makeid(20);
            handleQuestionKeyValueUpdate({
                keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect", newUid],
                targetValue: metadata.questionModality.SELECT.questionDataFormat.questionColumns.columnsData["#UID-1"].columnSelect["#UID-3"]
            });
            setCurrentPropertyUid(newUid);
        } else {
            setGlobalParams("popUp", true);
            setGlobalParams("popUpAction", "⟨EXCEPTION⟩: entity limit");
            setGlobalParams("popUpText", `Total property exceeds limit at ${selectColumnPropertyLimit} properties per select column`);
        }
    }

    const handleDeleteProperty = () => {
        // Delete currentPropertyUid from column's property anf row property connection
        setLocalQuizContextParams("bufferQuestion", JSON.parse(JSON.stringify(objectKeyDelete({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect"],
            keyToDelete: currentPropertyUid
        })).replace(currentPropertyUid, "")));
        setCurrentPropertyUid("");
    }

    const handleAssignPropertyIcon = ({
        icon
    }: {
        icon: string
    }): void => {
        setLocalQuizContextParams("bufferQuestion", objectKeyValueUpdate({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect", currentPropertyUid, "propertyIcon"],
            targetValue: icon
        }));
    }

    const handleAssignPropertyColorCode = ({
        colorCode
    }: {
        colorCode: string
    }): void => {
        setLocalQuizContextParams("bufferQuestion", objectKeyValueUpdate({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect", currentPropertyUid, "propertyColorCode"],
            targetValue: colorCode
        }));
    }

    
    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------
    
    ////// C.I Assemble tabular interface
    let elementRows: React.ReactNode[] = []

    //////// C.Ia Render table property header
    let elementsHeader: React.ReactNode[] = [<th aria-label="table-header-blank" key={0} onClick={() => {handleSetCurrentRowOrColumnUid("DEFAULT")}} className="w-48 -border-r"></th>]

    allColumnsUid.map((columnUid, propertyIndex) => {
        elementsHeader.push(
            <th aria-label="table-header-property" key={columnUid} onClick={() => handleSetCurrentRowOrColumnUid(columnUid)}
                className={`min-w-48 max-w-96 -border-l-half ${(currentRowOrColumnUid === columnUid) ? "-hover-bg-active" : "-hover-bg cursor-pointer"}`}>
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
            const connectedPropertyUid = objectKeyRetrieve({
                object: localQuizContextParams.bufferQuestion,
                keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", rowUid, "rowAnswer", columnUid]
            });

            const matrixData = objectKeyRetrieve({
                object: localQuizContextParams.bufferQuestion,
                keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", columnUid, "columnSelect", connectedPropertyUid]
            });

            elementRowPropertyAnswer.push(
                <td aria-label="table-row-property" key={columnUid} className="-border-l-half p-3 cursor-pointer"
                onClick={() => (currentRowOrColumnUid === rowUid) && handleToggleRowPropertyValue({rowUid: rowUid, columnUid: columnUid, currentProperty: connectedPropertyUid})}>
                    <button>
                        {matrixData 
                            ? <ChipTextColor chipText={matrixData.propertyText} chipIcon={matrixData.propertyIcon} textStringForColor={matrixData.propertyColorCode ? matrixData.propertyColorCode : matrixData.propertyText} chipBackgroundOpacity={0.6} />
                            : <span className="font-bold color-slate">BLANK CELL</span>}
                    </button>
                </td>
            );
        });

        elementRows.push(
            <tr key={rowUid} onClick={() => handleSetCurrentRowOrColumnUid(rowUid)}
            className={`py-2 rounded-xl -border-t-half ${(rowUid === currentRowOrColumnUid) ? "-hover-bg-active" : "-hover-bg -hover-bg-active-half cursor-pointer"}`}>
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
            <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -hover-bg-active-half -border-b overflow-x-auto">
                <Icon icon="table" size={24} />
                <p className="font-black text-lg mr-4">TABULAR STRUCTURE</p>
                <button onClick={() => handleAddColumn()}
                    className="flex flex-row items-center gap-2 ml-auto px-3 py-2 -border -button-hover-pri rounded-xl">
                    <Icon icon="squares-plus" size={18} />
                    <span className="font-bold">ADD COLUMN</span>
                </button>
                <button onClick={() => handleAddRow()}
                    className="flex flex-row items-center gap-2 px-3 py-2 -border -button-hover-pri rounded-xl">
                    <Icon icon="squares-plus" size={18} />
                    <span className="font-bold">ADD ROW</span>
                </button>
            </div>
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

    const allPropertiesUid = allColumnsUid.includes(currentRowOrColumnUid) 
        ? Object.keys(objectKeyRetrieve({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect"]
        }))
        : []

    allPropertiesUid.length && allPropertiesUid.map((propertyUid) => {
        const matrixData = objectKeyRetrieve({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect", propertyUid]
        });

        elementPropertiesChip.push(
                (propertyUid === currentPropertyUid)
                ? <div key={propertyUid} className="p-2 -hover-bg-active rounded-xl">
                    <ChipTextColor chipText={matrixData.propertyText} chipIcon={matrixData.propertyIcon} textStringForColor={matrixData.propertyColorCode ? matrixData.propertyColorCode : matrixData.propertyText}
                        chipBackgroundOpacity={0.6} />
                </div>
                : <button key={propertyUid} onClick={() => setCurrentPropertyUid(propertyUid)} className="p-2 -hover-bg rounded-xl">
                    <ChipTextColor chipText={matrixData.propertyText} chipIcon={matrixData.propertyIcon} textStringForColor={matrixData.propertyColorCode ? matrixData.propertyColorCode : matrixData.propertyText}
                        chipBackgroundOpacity={0.6} />
                </button>
            )
    })

    //////// C.II Table property interface
    const selectTabularPropertyInterface = (
        <div aria-label="select-C1-property-interface" key="select-C1-property-interface"
            className="h-full flex flex-col gap-4">

            <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap overflow-x-auto -prevent-select">
                <div className="flex flex-row items-center gap-2 px-3 py-2 -hover-bg-active rounded-xl">
                    <Icon icon="cube" size={24}/>
                    <span className="font-black text-lg">TABULAR COLUMN</span>
                </div>
                {(arrayIndexOf({array: allColumnsUid, targetValue: currentRowOrColumnUid}) > 0)
                    ? <button onClick={() => handleDecrementAxisNumber({axisProperty: "questionColumns", axisPropertyDataUid: currentRowOrColumnUid})} 
                        className="p-2 -hover-bg rounded-full">
                        <Icon icon="left" size={20} />
                    </button>
                    : <div className="p-2 rounded-full color-slate">
                        <Icon icon="left" size={20} />
                    </div>
                }
                <p className="w-4 text-center font-bold text-lg text-left">
                    {arrayIndexOf({array: allColumnsUid, targetValue: currentRowOrColumnUid}) + 1}
                </p>
                {(arrayIndexOf({array: allColumnsUid, targetValue: currentRowOrColumnUid}) + 1 < allColumnsUid.length)
                    ? <button onClick={() => handleIncrementAxisNumber({axisProperty: "questionColumns", axisPropertyDataUid: currentRowOrColumnUid})} 
                        className="p-2 -hover-bg rounded-full">
                        <Icon icon="right" size={20} />
                    </button>
                    : <div className="p-2 rounded-full color-slate">
                        <Icon icon="down" size={20} />
                    </div>
                }
                <button onClick={() => handleDuplicateColumn()}
                    className="flex flex-row items-center gap-2 ml-auto px-3 py-2 -border -button-hover-amber rounded-xl">
                    <Icon icon="copy" size={18} />
                    <span className="font-bold">DUPLICATE</span>
                </button>
                <button aria-label="DELETE-COLUMN" onClick={() => {
                    setLocalQuizContextParams("currentDeleteButtonRef", "DELETE-COLUMN");
                    localQuizContextParams.currentDeleteButtonRef == "DELETE-COLUMN" && handleDeleteColumn();
                    localQuizContextParams.currentDeleteButtonRef == "DELETE-COLUMN" && setLocalQuizContextParams("currentDeleteButtonRef", "");
                }}
                    className={`flex flex-row items-center gap-2 px-3 py-2 -border -button-hover-red rounded-xl ${
                        localQuizContextParams.currentDeleteButtonRef == "DELETE-COLUMN" && "color-red"
                    }`}>
                    <Icon icon="trash" size={16} />
                    <span className="font-bold">DELETE COLUMN</span>
                </button>
            </div>

            <div aria-label="property-text" className="-hover-bg-active-half mx-4 p-4 font-bold rounded-xl overflow-x-auto">
                <p className="text-xs color-slate mb-2">PROPERTY TEXT</p>
                <textarea rows={1} className="p-4 -border rounded-xl w-full"
                    onChange={e => handleQuestionKeyValueUpdate({
                            keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnText"],
                            targetValue: e.target.value})}
                    value={objectKeyRetrieve({
                        object: localQuizContextParams.bufferQuestion,
                        keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnText"]})}>
                </textarea>
            </div>

            <div className="flex flex-col gap-4 mx-4 -border rounded-xl">
                <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half overflow-x-auto">
                    <Icon icon="squares-2x2" size={24} />
                    <p className="font-black text-lg mr-auto">PROPERTY COLLECTION</p>
                    {currentPropertyUid &&
                        <button aria-label="DELETE-PROPERTY" onClick={() => {
                            setLocalQuizContextParams("currentDeleteButtonRef", "DELETE-PROPERTY");
                            localQuizContextParams.currentDeleteButtonRef == "DELETE-PROPERTY" && handleDeleteProperty();
                            localQuizContextParams.currentDeleteButtonRef == "DELETE-PROPERTY" && setLocalQuizContextParams("currentDeleteButtonRef", "");
                        }}
                            className={`flex flex-row items-center gap-2 px-3 py-2 -border -button-hover-red rounded-xl ${
                                localQuizContextParams.currentDeleteButtonRef == "DELETE-PROPERTY" && "color-red"
                            }`}>
                            <Icon icon="trash" size={16} />
                            <span className="font-bold">DELETE PROPERTY</span>
                        </button>
                    }
                    <button onClick={() => handleAddColumnProperty()}
                        className="flex flex-row items-center gap-2 px-3 py-2 -border -button-hover-pri rounded-xl">
                        <Icon icon="squares-plus" size={18} />
                        <span className="font-bold">ADD PROPERTY</span>
                    </button>
                </div>
                <div className="flex flex-wrap gap-4 p-4 justify-start items-center text-nowrap -hover-bg-active-half overflow-x-auto">
                    {(elementPropertiesChip.length > 0)
                        ? elementPropertiesChip.reverse()
                        : <AddPropertyToEdit />}
                </div>
                {(currentPropertyUid && allColumnsUid.includes(currentRowOrColumnUid))
                    ? <div className="flex flex-col gap-4 px-4">
                        <div aria-label="property-text" className="-hover-bg-active-half p-4 font-bold rounded-xl overflow-x-auto">
                            <p className="text-xs color-slate mb-2">{`PROPERTY TEXT: LIMIT AT ${selectColumnPropertyTextLengthLimit} CHARACTERS (${objectKeyRetrieve({
                                    object: localQuizContextParams.bufferQuestion,
                                    keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect", currentPropertyUid, "propertyText"]}
                                ).length}/${selectColumnPropertyTextLengthLimit})`}</p>
                            <textarea rows={1} className="w-full p-4 -border rounded-xl"
                                onChange={e => {if (e.target.value.length <= selectColumnPropertyTextLengthLimit) {
                                    handleQuestionKeyValueUpdate({
                                        keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect", currentPropertyUid, "propertyText"],
                                        targetValue: e.target.value
                                    })
                                } else {
                                    setGlobalParams("popUp", true);
                                    setGlobalParams("popUpAction", "⟨EXCEPTION⟩: entity limit");
                                    setGlobalParams("popUpText", `Property text length exceeds limit at ${selectColumnPropertyTextLengthLimit} characters`);
                                }
                                }}
                                value={objectKeyRetrieve({
                                    object: localQuizContextParams.bufferQuestion,
                                    keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect", currentPropertyUid, "propertyText"]})}>
                            </textarea>
                        </div>
                        <div aria-label="property-text" className="-hover-bg-active-half p-4 font-bold rounded-xl overflow-x-auto">
                            <p className="text-xs color-slate mb-2">PROPERTY ICON</p>
                            <div className="flex flex-wrap gap-2">
                                {objectKeyRetrieve({
                                    object: localQuizContextParams.bufferQuestion,
                                    keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect", currentPropertyUid, "propertyIcon"]})
                                ? <button key={0} onClick={() => handleAssignPropertyIcon({icon: ""})} className="px-2 py-1 color-slate -border -hover-bg rounded-xl">
                                    <p className="text-sm">No icon</p>
                                </button>
                                : <div key={0} className="px-2 py-1 color-amber -border -hover-bg-active rounded-xl">
                                    <p className="text-sm">No icon</p>
                                </div>
                                }
                                {Object.values(metadata.questionModality.SELECT.propertyIcons).map((icon) => 
                                    objectKeyRetrieve({
                                        object: localQuizContextParams.bufferQuestion,
                                        keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect", currentPropertyUid, "propertyIcon"]}) === icon
                                    ? <div key={icon} className="p-1 color-amber -border -hover-bg-active rounded-xl">
                                        <Icon icon={icon} size={20} />
                                    </div>
                                    : <button key={icon} onClick={() => handleAssignPropertyIcon({icon: icon})} className="p-1 color-slate -border -hover-bg rounded-xl">
                                        <Icon icon={icon} size={20} />
                                    </button>)
                                }
                            </div>
                        </div>
                        <div aria-label="property-text" className="-hover-bg-active-half mb-4 p-4 font-bold rounded-xl overflow-x-auto">
                            <p className="text-xs color-slate mb-2">PROPERTY COLOR</p>
                            <div className="flex flex-wrap items-center gap-2">
                                {objectKeyRetrieve({
                                        object: localQuizContextParams.bufferQuestion,
                                        keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect", currentPropertyUid, "propertyColorCode"]}) === ""
                                    ? <div key={0} className="px-2 py-1 color-amber -border -hover-bg-active rounded-xl">
                                        <p className="text-sm">AUTO color</p>
                                    </div>
                                    : <button key={0} onClick={() => handleAssignPropertyColorCode({colorCode: ""})} className="px-2 py-1 -border -hover-bg rounded-xl">
                                        <p className="text-sm">AUTO color</p>
                                    </button>

                                }
                                {Object.values(metadata.questionModality.SELECT.propertyColorCodes).map((colorCode) => {
                                    const color = stringToRgb(colorCode, globalParams.theme)

                                    return (objectKeyRetrieve({
                                        object: localQuizContextParams.bufferQuestion,
                                        keysHierachy: [...rootKeysHierachy, "questionColumns", "columnsData", currentRowOrColumnUid, "columnSelect", currentPropertyUid, "propertyColorCode"]}) === colorCode
                                    ? <div key={colorCode} className="p-0.5 border-2 border-amber dark:border-amber-dark rounded-full">
                                        <div 
                                            className="p-1 h-6 w-6 color-slate -border rounded-xl"
                                            style={{backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.75)`}}></div>
                                    </div>
                                    : <button key={colorCode} onClick={() => handleAssignPropertyColorCode({colorCode: colorCode})} 
                                        className="m-1 p-1 h-6 w-6 color-slate -border rounded-xl"
                                        style={{backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.75)`}}></button>)
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    : <ChoosePropertyToEdit />
                }
            </div>
        </div>
    )

    //////// C.III Table row interface
    const selectTabularRowInterface = (
        <div aria-label="select-C1-row-interface" key="select-C1-row-interface"
            className="h-full flex flex-col -border-b">
            <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap overflow-x-auto -prevent-select">
                <div className="flex flex-row items-center gap-2 px-3 py-2 -hover-bg-active rounded-xl">
                    <Icon icon="card" size={24}/>
                    <span className="font-black text-lg">TABULAR ROW</span>
                </div>
                {(arrayIndexOf({array: allRowsUid, targetValue: currentRowOrColumnUid}) > 0)
                    ? <button onClick={() => handleDecrementAxisNumber({axisProperty: "questionRows", axisPropertyDataUid: currentRowOrColumnUid})} 
                        className="p-2 -hover-bg rounded-full">
                        <Icon icon="up" size={20} />
                    </button>
                    : <div className="p-2 rounded-full color-slate">
                        <Icon icon="up" size={20} />
                    </div>
                }
                <p className="w-4 text-center font-bold text-lg text-left">
                    {arrayIndexOf({array: allRowsUid, targetValue: currentRowOrColumnUid}) + 1}
                </p>
                {(arrayIndexOf({array: allRowsUid, targetValue: currentRowOrColumnUid}) + 1 < allRowsUid.length)
                    ? <button onClick={() => handleIncrementAxisNumber({axisProperty: "questionRows", axisPropertyDataUid: currentRowOrColumnUid})} 
                        className="p-2 -hover-bg rounded-full">
                        <Icon icon="down" size={20} />
                    </button>
                    : <div className="p-2 rounded-full color-slate">
                        <Icon icon="down" size={20} />
                    </div>
                }
                <button onClick={() => handleDuplicateRow()}
                    className="flex flex-row items-center gap-2 ml-auto px-3 py-2 -border -button-hover-amber rounded-xl">
                    <Icon icon="squares-plus" size={18} />
                    <span className="font-bold">DUPLICATE ROW</span>
                </button>
                <button aria-label="DELETE-ROW" onClick={() => {
                    setLocalQuizContextParams("currentDeleteButtonRef", "DELETE-ROW");
                    localQuizContextParams.currentDeleteButtonRef == "DELETE-ROW" && handleDeleteRow();
                    localQuizContextParams.currentDeleteButtonRef == "DELETE-ROW" && setLocalQuizContextParams("currentDeleteButtonRef", "");
                }}
                    className={`flex flex-row items-center gap-2 px-3 py-2 -border -button-hover-red rounded-xl ${
                        localQuizContextParams.currentDeleteButtonRef == "DELETE-ROW" && "color-red"
                    }`}>
                    <Icon icon="trash" size={16} />
                    <span className="font-bold">DELETE ROW</span>
                </button>
            </div>
            <div className="flex flex-col gap-4 m-4 -border rounded-xl">
                <div className="h-16 flex flex-row gap-2 px-4 justify-start items-center text-nowrap -border-b -hover-bg-active-half overflow-x-auto">
                    <Icon icon="font" size={24} />
                    <p className="font-black text-lg mr-auto">ROW TEXT</p>
                </div>
                <div className="flex flex-row items-center gap-4 mx-4 overflow-auto">
                    <button onClick={() => handleBoldText({keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", currentRowOrColumnUid, "rowText"]})}
                        className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -hover-bg">
                        <Icon icon="bold" size={16} /><p className="font-bold text-md text-nowrap">Add bold text</p>
                    </button>
                    <button onClick={() => handleHighlightText({keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", currentRowOrColumnUid, "rowText"]})}
                        className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -hover-bg">
                        <Icon icon="card" size={16} /><p className="font-bold text-md text-nowrap">Add highlight text</p>
                    </button>
                    <button onClick={() => handleItalicText({keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", currentRowOrColumnUid, "rowText"]})}
                        className="flex flex-row items-center gap-2 px-3 py-2 -border rounded-xl -hover-bg">
                        <Icon icon="italic" size={16} /><p className="font-bold text-md text-nowrap">Add italic text</p>
                    </button>
                </div>
                <textarea rows={1} className="mx-4 p-4 -border rounded-xl"
                    onChange={e => handleQuestionKeyValueUpdate({
                        keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", currentRowOrColumnUid, "rowText"],
                        targetValue: e.target.value
                    })}
                    value={objectKeyRetrieve({
                        object: localQuizContextParams.bufferQuestion,
                        keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", currentRowOrColumnUid, "rowText"]
                    })}>
                </textarea>
                <div aria-label="choice-preview-comment" className="-hover-bg-active-half mx-4 mb-4 p-4 font-bold rounded-xl overflow-x-auto">
                    <p className="text-xs color-slate mb-2">CHOICE COMMENT PREVIEW</p>
                    <AuricleText inputText={objectKeyRetrieve({
                        object: localQuizContextParams.bufferQuestion,
                        keysHierachy: [...rootKeysHierachy, "questionRows", "rowsData", currentRowOrColumnUid, "rowText"]
                    })} />
                </div>
            </div>
        </div>
    )


    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    return (
        <article aria-label="main-B-header" key="main-B-header" className="relative flex flex-col -border-b pb-12">
            {selectTabularStructure}
            {allColumnsUid.includes(currentRowOrColumnUid) && selectTabularPropertyInterface}
            {allRowsUid.includes(currentRowOrColumnUid) && selectTabularRowInterface}
            {(!allColumnsUid.includes(currentRowOrColumnUid)) && (!allRowsUid.includes(currentRowOrColumnUid)) && <ChooseTabularCellToEdit />}
        </article>
    );
}

// =========================================================================
// 4. LOCAL COMPONENTS
// =========================================================================

const AddTabularToEdit = () => (
    <div className="w-full my-12 text-textSlate dark:text-textSlate-dark flex flex-col justify-center items-center text-center" key="blank">
        <Icon icon="squares-plus" size={48} />
        <h1>Add table property or row to edit</h1>
    </div>
);

const ChooseTabularCellToEdit = () => (
    <div className="w-full mt-12 text-textSlate dark:text-textSlate-dark flex flex-col justify-center items-center text-center" key="blank">
        <Icon icon="edit" size={48} />
        <h1>Choose table property or row to edit</h1>
    </div>
);

const ChoosePropertyToEdit = () => (
    <div className="w-full my-12 text-textSlate dark:text-textSlate-dark flex flex-col justify-center items-center text-center" key="blank">
        <Icon icon="squares-2x2" size={48} />
        <h1>Choose property to edit</h1>
    </div>
);

const AddPropertyToEdit = () => (
    <div className="w-full my-12 text-textSlate dark:text-textSlate-dark flex flex-col justify-center items-center text-center" key="blank">
        <Icon icon="squares-plus" size={48} />
        <h1>Add new property to edit</h1>
    </div>
);
