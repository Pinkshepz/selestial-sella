"use client";

// app/library/components/library-edit.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import { useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useLocalLibraryContext } from "@/app/library/local-library-provider";

//// 1.3 React components
import Library, { defaultLibrary } from "@/app/utility/interface/interface-library";
import { TextColor } from "@/app/utility/components/chip";

//// 1.4 Utility functions
import firestoreUpdate from "@/app/utility/firestore/firestore-manager-library";
import makeid from "@/app/utility/function/make-id";
import sortUidObjectByValue from "@/app/utility/function/object/sort-uid-object-by-value";

import objectKeyValueUpdate from "@/app/utility/function/object/object-dynamic-change";
import objectKeyDelete from "@/app/utility/function/object/object-dynamic-delete";

//// 1.5 Public and others
////     N/A

// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

import Icon from "@/public/icon";
import objectUidFill from "@/app/utility/function/object/object-uid-fill";

export default function LibraryEditor ({
    libraryData
}: {
    libraryData: {[key: string]: Library}
}): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/*
    const {localLibraryContextParams, setLocalLibraryContextParams} = useLocalLibraryContext();
    

    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// -------------------------------------------------------------------------
    ////// GENERAL
    
    ////// B.I useEffect to initially set local context buffer question
    useEffect(() => {
        setLocalLibraryContextParams("bufferLibrary", libraryData);
    }, [])

    ////// B.II Function to set buffer library
    const setBufferLibrary = ({
        bufferLibrary
    }: {
        bufferLibrary: typeof localLibraryContextParams.bufferLibrary
    }) => {
        setLocalLibraryContextParams("bufferLibrary", bufferLibrary);
    }

    ////// B.III Function to dynamically update object data
    const handleObjectKeyValueUpdate = ({
        keysHierachy,
        targetValue
    }: {
        keysHierachy: string[],
        targetValue: any
    }) => {
        setBufferLibrary({
            bufferLibrary: objectKeyValueUpdate<typeof libraryData>({
                object: localLibraryContextParams.bufferLibrary,
                keysHierachy: keysHierachy,
                targetValue: targetValue
            })
        });
    }

    ////// B.IV Function to dynamically delete object data
    const handleObjectKeyDelete = ({
        keysHierachy, // [key_1, key_2, key_3, ..., key_n]
        keyToDelete // Newly assigned value of key_n
    }: {
        keysHierachy: string[],
        keyToDelete: string
    }): void => {
        try {
            setBufferLibrary({
                bufferLibrary: objectKeyDelete({
                    object: localLibraryContextParams.bufferLibrary,
                    keysHierachy: keysHierachy,
                    keyToDelete:  keyToDelete
                })
            });
        } catch (error) {null}
    }

    ////// -------------------------------------------------------------------------
    ////// COURSE FX.

    ////// B.V useEffect to discard changes
    useEffect(() => {
        if (localLibraryContextParams.discardChangesToggle && 
            globalParams.popUpConfirm &&
            (globalParams.popUpAction === "discardChangesToggle")) {
            setBufferLibrary({bufferLibrary: libraryData});
            setLocalLibraryContextParams("discardChangesToggle", false);
            setGlobalParams("popUpConfirm", false);
            setGlobalParams("popUpAction", "");
        }
    }, [globalParams]);
    
    ////// B.VI useEffect to save changes and move to server log page
    useEffect(() => {
        if (localLibraryContextParams.saveChangesToggle &&
            globalParams.popUpConfirm &&
            (globalParams.popUpAction == "saveChangesToggle")) {
                setGlobalParams("isLoading", true);
                firestoreUpdate({
                    firebaseBranch: "ALPHA",
                    collectionName: "library",
                    originalData: libraryData, 
                    editedData: localLibraryContextParams.bufferLibrary
                });
                firestoreUpdate({
                    firebaseBranch: "BETA",
                    collectionName: "library",
                    originalData: libraryData, 
                    editedData: localLibraryContextParams.bufferLibrary
                }).then(
                    (data) => {
                        setGlobalParams("popUpConfirm", false);
                        setGlobalParams("popUpAction", "");
                        setLocalLibraryContextParams("saveChangesToggle", false);
                        setLocalLibraryContextParams("editMode", false);
                        setLocalLibraryContextParams("logUpdate", data);
                    }
                );
            }
    }, [globalParams.popUpConfirm]);

    ////// B.VII useEffect to add new library
    useEffect(() => {
        if (localLibraryContextParams.addLibraryToggle && !globalParams.popUp) {
            const newUid = makeid(length=20);
            handleObjectKeyValueUpdate({
                keysHierachy: [newUid],
                targetValue: objectUidFill(defaultLibrary({newUid: newUid}))
            });
            setLocalLibraryContextParams("currentLibraryUid", newUid);
        }
        setLocalLibraryContextParams("addLibraryToggle", false);
    }, [localLibraryContextParams.addLibraryToggle]);
    
    
    ////// B.VIII useEffect to duplicate library
    const handleDuplicateLibrary = (uid: string): void => {
        if (!globalParams.popUp) {
            const newUid = makeid(length=20);
            handleObjectKeyValueUpdate({
                keysHierachy: [newUid],
                targetValue: {
                    ...localLibraryContextParams.bufferLibrary[uid],
                    id: localLibraryContextParams.bufferLibrary[uid].id + " copy",
                    name: localLibraryContextParams.bufferLibrary[uid].name + " copy",
                }
            });
            setLocalLibraryContextParams("currentLibraryUid", newUid);
        }
    }


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    ////// C.I Filter by search key
    let filteredContent: {[key: string]: Library} = {};
    for (let index = 0; index < Object.values(localLibraryContextParams.bufferLibrary).length; index++) {
        // Each library data
        const library = Object.values<Library>(localLibraryContextParams.bufferLibrary)[index];
        // Create combination of all library information for search target
        const search_target = JSON.stringify(library);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(localLibraryContextParams.searchKey.toLowerCase())) {
            filteredContent[Object.keys(localLibraryContextParams.bufferLibrary)[index]] = library;
        }
    }

    const sortedFilteredContentData: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(
        filteredContent, "id", localLibraryContextParams.sortAscending
    );

    ////// C.II Render left-side navigator
    let elementAside: Array<React.ReactNode> = [];

    Object.keys(sortedFilteredContentData).map((libraryUid) => {
        const eachLibraryData =sortedFilteredContentData[libraryUid];

        if (localLibraryContextParams.currentLibraryUid == libraryUid) {
            elementAside.push(
                <div className="flex flex-row px-2 py-2 gap-2 content-center text-left -hover-bg-active" key={libraryUid}>
                    <span className="text-nowrap">
                        <TextColor chipText={eachLibraryData.id} fontWeight={900} />
                    </span>
                    <span className="font-semibold text-nowrap overflow-hidden">{eachLibraryData.name}</span>
                    <span className="ml-auto">{eachLibraryData.hidden && <Icon icon="eyeSlash" size={16}/>}</span>
                </div>
            );
        } else {
            elementAside.push(
                <button onClick={() => setLocalLibraryContextParams("currentLibraryUid", libraryUid)} key={libraryUid}
                    className="flex flex-row px-2 py-2 gap-2 items-center text-left -hover-bg">
                    <span className="text-nowrap">
                        <TextColor chipText={eachLibraryData.id} fontWeight={900} />
                    </span>
                    <span className="text-nowrap overflow-hidden">{eachLibraryData.name}</span>
                    <span className="ml-auto">{eachLibraryData.hidden && <Icon icon="eyeSlash" size={16}/>}</span>
                </button>
            );
        }
    });

    ////// C.III Render right-side main interface
    let elementEditor: React.ReactNode = <></>;
    let eachLibrary = localLibraryContextParams.bufferLibrary[localLibraryContextParams.currentLibraryUid];

    try {
        // Conbine all interface together
        elementEditor = (
            <div className="flex flex-col gap-2" key={eachLibrary.uid}>
                {eachLibrary.image && <div className="h-56 w-full overflow-hidden">
                    <img src={eachLibrary.image} alt="Invalid image" className="w-full"/>
                </div>}
                <strong className="px-4 mt-4">{`${eachLibrary.id}`}</strong>
                <h1 className="px-4">{eachLibrary.name}</h1>
                <span className="px-4 mb-4">{eachLibrary.description}</span>

                <div className="flex flex-row gap-4 p-4 m-0">
                    <div className="flex flex-row gap-2 my-2 font-bold color-pri">
                        <Icon icon="barcode" size={16} />
                        <p>{localLibraryContextParams.currentLibraryUid}</p>
                    </div>
                    <button
                        onClick={() => {handleObjectKeyValueUpdate({
                            keysHierachy: [localLibraryContextParams.currentLibraryUid, "hidden"],
                            targetValue: !eachLibrary.hidden
                        })}}
                        className="flex flex-row justify-center items-center gap-2 px-2 py-1 ml-auto rounded-[8px] -border -button-hover-pri font-bold">
                        <Icon icon={eachLibrary.hidden ? "eyeSlash" : "eye"} size={16} />
                        <span className="lg:inline hidden">{eachLibrary.hidden ? "HIDDEN" : "VISIBLE"}</span>
                    </button>
                    <button
                        onClick={() => {handleDuplicateLibrary(localLibraryContextParams.currentLibraryUid)}}
                        className="flex flex-row justify-center items-center gap-2 px-2 py-1 rounded-[8px] -border -button-hover-amber font-bold">
                        <Icon icon="copy" size={16} />
                        <span className="lg:inline hidden">DUPLICATE</span>
                    </button>
                    <button
                        onClick={() => handleObjectKeyDelete({
                            keysHierachy: [],
                            keyToDelete: localLibraryContextParams.currentLibraryUid
                        })}
                        className="flex flex-row justify-center items-center gap-2 px-2 py-1 rounded-[8px] -border -button-hover-red font-bold">
                        <Icon icon="trash" size={16} />
                        <span className="lg:inline hidden">DELETE</span>
                    </button>
                </div>

                <div className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="image" size={16} />
                        <p>Image link</p>
                    </label>
                    <textarea rows={1} className="editor-field"
                        onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localLibraryContextParams.currentLibraryUid, "image"],
                            targetValue: e.target.value
                        })}
                        value={eachLibrary.image}>
                    </textarea>
                </div>

                <div className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="tag" size={16} />
                        <p>ID</p>
                    </label>
                    <textarea rows={1} className="editor-field"
                        onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localLibraryContextParams.currentLibraryUid, "id"],
                            targetValue: e.target.value
                        })}
                        value={eachLibrary.id}>
                    </textarea>
                </div>

                <div className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="h1" size={16} />
                        <p>Title name</p>
                    </label>
                    <textarea rows={1} className="editor-field"
                        onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localLibraryContextParams.currentLibraryUid, "name"],
                            targetValue: e.target.value
                        })}
                        value={eachLibrary.name}>
                    </textarea>
                </div>

                <div className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="font" size={16} />
                        <p>Description</p>
                    </label>
                    <textarea rows={1} className="editor-field"
                        onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localLibraryContextParams.currentLibraryUid, "description"],
                            targetValue: e.target.value
                        })}
                        value={eachLibrary.description}>
                    </textarea>
                </div>

                <div className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="tag" size={16} />
                        <p>Tag</p>
                    </label>
                    <textarea rows={1} className="editor-field"
                        onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localLibraryContextParams.currentLibraryUid, "tag"],
                            targetValue: e.target.value.split(",")
                        })}
                        value={eachLibrary.tag}>
                    </textarea>
                </div>

                <div className="flex flex-row mx-2">
                    <div className="edit-placeholder mx-2">
                        <label className="flex flex-row justify-start items-center">
                            <Icon icon="tag" size={16} />
                            <p>Allow question shuffle</p>
                        </label>
                        <button onClick={() => handleObjectKeyValueUpdate({
                            keysHierachy: [localLibraryContextParams.currentLibraryUid, "allowShuffleQuestion"],
                            targetValue: !eachLibrary.allowShuffleQuestion})}
                            className="mt-4 p-2 rounded-lg -hover-bg">
                            {eachLibrary.allowShuffleQuestion 
                                ? <h5 className="mr-1 mt-0 font-bold color-pri after:bg-pri">ENABLED</h5> 
                                : <h5 className="mr-1 mt-0 font-bold">DISABLED</h5>}
                        </button>
                    </div>
                    <div className="edit-placeholder mx-2">
                        <label className="flex flex-row justify-start items-center">
                            <Icon icon="tag" size={16} />
                            <p>Allow MCQ choice shuffle</p>
                        </label>
                        <button onClick={() => handleObjectKeyValueUpdate({
                            keysHierachy: [localLibraryContextParams.currentLibraryUid, "allowShuffleChoice"],
                            targetValue: !eachLibrary.allowShuffleChoice})}
                            className="mt-4 p-2 rounded-lg -hover-bg">
                            {eachLibrary.allowShuffleChoice
                                ? <h5 className="mr-1 mt-0 font-bold text-pri after:bg-pri">ENABLED</h5> 
                                : <h5 className="mr-1 mt-0 font-bold">DISABLED</h5>}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col mx-2 mt-8 mb-4 color-slate">
                    <span>This course will be displayed in the course warehouse and connects to topics and quiz library</span>
                    <span>{`Last updated ${new Date(new Date(1970, 0, 1).setSeconds(eachLibrary.lastEdited / 1000))}`}</span>
                </div>

            </div>
        );
    } catch (error) {
        elementEditor = (
            <div className="my-auto text-textSlate dark:text-textSlate-dark flex flex-col justiy-center items-center text-center">
                <Icon icon="add" size={48} />
                <h1>Choose library to edit</h1>
            </div>
        );
    }


    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    return (
        <div id="two-cols-fixed" className="-border-t">
            <aside aria-label="aside-navigator" id="col-scroll-aside" className="w-[25dvw] -border-r">
                <div className="flex flex-row gap-4 px-4"><h1>COURSE</h1><h1>EDITOR</h1></div>
                <div className="px-4 pt-2 pb-4 flex flex-row items-center">
                    <Icon icon="true" size={16}></Icon>
                    <span className="pl-2 font-bold">TOTAL {elementAside.length} COURSES</span>
                </div>
                <div className="flex flex-col h-max pb-4 overflow-y-auto">
                    {elementAside}
                </div>
            </aside>
            <section aria-label="main-editor" id="col-scroll-main" className="overflow-y-auto">
                {elementEditor}
            </section>
        </div>
    );
}
