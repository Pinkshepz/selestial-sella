"use client";

// app/course/components/course-edit.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import { useState, useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useLocalCourseContext } from "@/app/course/local-course-provider";

//// 1.3 React components
import Course, { defaultCoruse } from "@/app/utility/interface/interface-course";
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

export default function CourseEditor ({
    courseData
}: {
    courseData: {[key: string]: Course}
}): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/course/*
    const {localCourseContextParams, setLocalCourseContextParams} = useLocalCourseContext();

    // counterpart of content data for editing
    const [bufferContent, setBufferContent] = useState(courseData);

    // sort mode for course section
    const [sectionSortAscending, setSectionSortAscending] = useState(true);

    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// -------------------------------------------------------------------------
    ////// GENERAL
    
    ////// B.I useEffect to initially set local context buffer question
    useEffect(() => {
        setLocalCourseContextParams("bufferCourse", courseData);
    }, [])

    ////// B.II Function to set buffer course
    const setBufferCourse = ({
        bufferCourse
    }: {
        bufferCourse: typeof localCourseContextParams.bufferCourse
    }) => {
        setLocalCourseContextParams("bufferCourse", bufferCourse);
    }

    ////// B.III Function to dynamically update object data
    const handleObjectKeyValueUpdate = ({
        keysHierachy,
        targetValue
    }: {
        keysHierachy: string[],
        targetValue: any
    }) => {
        setBufferCourse({
            bufferCourse: objectKeyValueUpdate<typeof bufferContent>({
                object: localCourseContextParams.bufferCourse,
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
            setBufferCourse({
                bufferCourse: objectKeyDelete({
                    object: localCourseContextParams.bufferCourse,
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
        if (localCourseContextParams.discardChangesToggle && 
            globalParams.popUpConfirm &&
            (globalParams.popUpAction === "discardChangesToggle")) {
            setBufferCourse({bufferCourse: courseData});
            setLocalCourseContextParams("discardChangesToggle", false);
            setGlobalParams("popUpConfirm", false);
            setGlobalParams("popUpAction", "");
        }
    }, [globalParams]);
    
    ////// B.VI useEffect to save changes and move to server log page
    useEffect(() => {
        if (localCourseContextParams.saveChangesToggle &&
            globalParams.popUpConfirm &&
            (globalParams.popUpAction == "saveChangesToggle")) {
                setGlobalParams("isLoading", true);
                firestoreUpdate({
                    firebaseBranch: "ALPHA",
                    collectionName: "course",
                    originalData: courseData, 
                    editedData: localCourseContextParams.bufferCourse
                });
                firestoreUpdate({
                    firebaseBranch: "BETA",
                    collectionName: "course",
                    originalData: courseData, 
                    editedData: localCourseContextParams.bufferCourse
                }).then(
                    (data) => {
                        setGlobalParams("popUpConfirm", false);
                        setGlobalParams("popUpAction", "");
                        setLocalCourseContextParams("saveChangesToggle", false);
                        setLocalCourseContextParams("editMode", false);
                        setLocalCourseContextParams("logUpdate", data);
                    }
                );
            }
    }, [globalParams.popUpConfirm]);

    ////// B.VII useEffect to add new course
    useEffect(() => {
        if (localCourseContextParams.addCourseToggle && !globalParams.popUp) {
            const newUid = makeid(length=20);
            handleObjectKeyValueUpdate({
                keysHierachy: [newUid],
                targetValue: objectUidFill(defaultCoruse())
            });
            setLocalCourseContextParams("currentCourseUid", newUid);
        }
        setLocalCourseContextParams("addCourseToggle", false);
    }, [localCourseContextParams.addCourseToggle]);
    
    
    ////// B.VIII useEffect to duplicate course
    const handleDuplicateCourse = (uid: string): void => {
        if (!globalParams.popUp) {
            const newUid = makeid(length=20);
            handleObjectKeyValueUpdate({
                keysHierachy: [newUid],
                targetValue: {
                    ...localCourseContextParams.bufferCourse[uid],
                    id: localCourseContextParams.bufferCourse[uid].id + " copy",
                    abbreviation: localCourseContextParams.bufferCourse[uid].abbreviation + " copy",
                    name: localCourseContextParams.bufferCourse[uid].name + " copy",
                }
            });
            setLocalCourseContextParams("currentCourseUid", newUid);
        }
    }


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    ////// C.I Filter by search key
    let filteredContent: {[key: string]: Course} = {};
    for (let index = 0; index < Object.values(localCourseContextParams.bufferCourse).length; index++) {
        // Each course data
        const course = Object.values<Course>(localCourseContextParams.bufferCourse)[index];
        // Create combination of all course information for search target
        const search_target = JSON.stringify(course);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(localCourseContextParams.searchKey.toLowerCase())) {
            filteredContent[Object.keys(localCourseContextParams.bufferCourse)[index]] = course;
        }
    }

    const sortedFilteredContentData: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(
        filteredContent, "id", localCourseContextParams.sortAscending
    );

    ////// C.II Render left-side navigator
    let elementAside: Array<React.ReactNode> = [];

    Object.keys(sortedFilteredContentData).map((courseUid) => {
        const eachCourseData =sortedFilteredContentData[courseUid];

        if (localCourseContextParams.currentCourseUid == courseUid) {
            elementAside.push(
                <div className="flex flex-row px-2 py-2 gap-2 content-center text-left -hover-bg-active" key={courseUid}>
                    <TextColor chipText={eachCourseData.id} fontWeight={900} />
                    <span className="font-semibold text-nowrap overflow-hidden">{eachCourseData.name}</span>
                    <span className="ml-auto">{eachCourseData.hidden && <Icon icon="eyeSlash" size={16}/>}</span>
                </div>
            );
        } else {
            elementAside.push(
                <button onClick={() => setLocalCourseContextParams("currentCourseUid", courseUid)} key={courseUid}
                    className="flex flex-row px-2 py-2 gap-2 items-center text-left -hover-bg">
                    <TextColor chipText={eachCourseData.id} fontWeight={900} />
                    <span className="text-nowrap overflow-hidden">{eachCourseData.name}</span>
                    <span className="ml-auto">{eachCourseData.hidden && <Icon icon="eyeSlash" size={16}/>}</span>
                </button>
            );
        }
    });

    ////// C.III Render right-side main interface
    let elementEditor: React.ReactNode = <></>;
    let content = localCourseContextParams.bufferCourse[localCourseContextParams.currentCourseUid];

    try {
        // Section interface
        let elementSection: React.ReactNode[] = [];

        const sortedFilteredSectionData: {[key: string]: {[key: string]: any}} = sortUidObjectByValue(
            content.section, "sectionId", sectionSortAscending
        );

        Object.keys(sortedFilteredSectionData).map((sectionUid) => {
            let elementSectionTopic: React.ReactNode[] = [];
            const sectionAtUid = content.section[sectionUid];

            const sortedFilteredSectionTopicData: {[key: string]: {[key: string]: any}} = sortUidObjectByValue(
                content.section[sectionUid].sectionTopics, "topicId", true
            );
    
            Object.keys(sortedFilteredSectionTopicData).map((sectionTopicUid) => {
                const sectionTopicAtUid = content.section[sectionUid].sectionTopics[sectionTopicUid];
                elementSectionTopic.push(
                    <div className="flex flex-row items-center ml-4 -border-b" key={sectionTopicUid}>
                        <textarea rows={1} onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localCourseContextParams.currentCourseUid, "section", sectionUid, "sectionTopics", sectionTopicUid, "topicId"],
                            targetValue: e.target.value
                        })}
                            className="editor-field w-20 mr-8" value={sectionTopicAtUid.topicId}></textarea>
                        <textarea rows={1} onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localCourseContextParams.currentCourseUid, "section", sectionUid, "sectionTopics", sectionTopicUid, "topicName"],
                            targetValue: e.target.value
                        })}
                            className="editor-field w-96 mr-8" value={sectionTopicAtUid.topicName}></textarea>
                        <button
                            onClick={() => handleObjectKeyDelete({
                                keysHierachy: [localCourseContextParams.currentCourseUid, "section", sectionUid, "sectionTopics"],
                                keyToDelete: sectionTopicUid
                            })}
                            className="flex flex-row justify-center items-center gap-2 h-[30px] ml-auto px-2 py-1 ml-4 my-2 rounded-[8px] -border -button-hover-red font-bold">
                            <Icon icon="trash" size={16} />
                            <span className="lg:inline hidden">TOPIC</span>
                        </button>
                    </div>
                );
            });

            elementSection.push(
                <div key={sectionUid}>
                    <div className="font-bold text-pri dark:text-pri-dark bg-black/10 dark:bg-white/10 p-2 rounded-t-lg">
                        <textarea rows={1} onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localCourseContextParams.currentCourseUid, "section", sectionUid, "sectionId"],
                            targetValue: e.target.value
                        })}
                            className="editor-field w-20 mr-8" value={sectionAtUid.sectionId}></textarea>
                        <textarea rows={1} onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localCourseContextParams.currentCourseUid, "section", sectionUid, "sectionName"],
                            targetValue: e.target.value
                        })}
                            className="editor-field w-96 mr-8" value={sectionAtUid.sectionName}></textarea>
                    </div>
                    <div className="flex flex-col overflow-x-auto ml-4 -border-l">
                        <div style={{minWidth: "700px"}} className="flex flex-row font-bold items-center ml-4 py-2 -border-b">
                            <span className="w-20 mr-8">ID</span>
                            <span className="w-96 mr-8">Topic Name</span>
                            <button
                                onClick={() => {
                                    const newSectionTopicUid = makeid(length=20)
                                    handleObjectKeyValueUpdate({
                                        keysHierachy: [localCourseContextParams.currentCourseUid, "section", sectionUid, "sectionTopics", newSectionTopicUid, "topicId"],
                                        targetValue: "NEW"
                                    });
                                }
                            }
                                className="flex flex-row justify-center items-center gap-2 h-[30px] ml-auto px-2 py-1 ml-4 rounded-[8px] -border -button-hover-pri font-bold">
                                <Icon icon="add" size={16} />
                                <span className="lg:inline hidden">TOPIC</span>
                            </button>
                            <button
                                onClick={() => handleObjectKeyDelete({
                                    keysHierachy: [localCourseContextParams.currentCourseUid, "section"],
                                    keyToDelete: sectionUid
                                })}
                                className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-4 rounded-[8px] -border -button-hover-red font-bold">
                                <Icon icon="trash" size={16} />
                                <span className="lg:inline hidden">SECTION</span>
                            </button>
                        </div>
                        <div style={{minWidth: "700px"}} className="flex flex-col">
                            {elementSectionTopic}
                        </div>
                    </div>
                </div>
            );
        })

        // Conbine all interface together
        elementEditor = (
            <div className="flex flex-col gap-2" key={content.uid}>
                <div className="h-56 w-full overflow-hidden">
                    {content.image && <img src={content.image} alt="Invalid image" className="w-full"/>}
                </div>
                <strong className="px-4 mt-4">{`${content.id} ┇ ${content.abbreviation}`}</strong>
                <h1 className="px-4">{content.name}</h1>
                <span className="px-4 mb-4">{content.description}</span>

                <div className="flex flex-row gap-4 p-4 m-0">
                    <div className="flex flex-row gap-2 my-2 font-bold color-pri">
                        <Icon icon="barcode" size={16} />
                        <p>{localCourseContextParams.currentCourseUid}</p>
                    </div>
                    <button
                        onClick={() => {handleObjectKeyValueUpdate({
                            keysHierachy: [localCourseContextParams.currentCourseUid, "hidden"],
                            targetValue: !content.hidden
                        })}}
                        className="flex flex-row justify-center items-center gap-2 px-2 py-1 ml-auto rounded-[8px] -border -button-hover-pri font-bold">
                        <Icon icon={content.hidden ? "eyeSlash" : "eye"} size={16} />
                        <span className="lg:inline hidden">{content.hidden ? "HIDDEN" : "VISIBLE"}</span>
                    </button>
                    <button
                        onClick={() => {handleDuplicateCourse(localCourseContextParams.currentCourseUid)}}
                        className="flex flex-row justify-center items-center gap-2 px-2 py-1 rounded-[8px] -border -button-hover-amber font-bold">
                        <Icon icon="copy" size={16} />
                        <span className="lg:inline hidden">DUPLICATE</span>
                    </button>
                    <button
                        onClick={() => handleObjectKeyDelete({
                            keysHierachy: [],
                            keyToDelete: localCourseContextParams.currentCourseUid
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
                            keysHierachy: [localCourseContextParams.currentCourseUid, "image"],
                            targetValue: e.target.value
                        })}
                        value={content.image}>
                    </textarea>
                </div>

                <div className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="tag" size={16} />
                        <p>ID</p>
                    </label>
                    <textarea rows={1} className="editor-field"
                        onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localCourseContextParams.currentCourseUid, "id"],
                            targetValue: e.target.value
                        })}
                        value={content.id}>
                    </textarea>
                </div>

                <div className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="font" size={16} />
                        <p>Abbreviation</p>
                    </label>
                    <textarea rows={1} className="editor-field"
                        onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localCourseContextParams.currentCourseUid, "abbreviation"],
                            targetValue: e.target.value
                        })}
                        value={content.abbreviation}>
                    </textarea>
                </div>

                <div className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="h1" size={16} />
                        <p>Title name</p>
                    </label>
                    <textarea rows={1} className="editor-field"
                        onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localCourseContextParams.currentCourseUid, "name"],
                            targetValue: e.target.value
                        })}
                        value={content.name}>
                    </textarea>
                </div>

                <div className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="font" size={16} />
                        <p>Description</p>
                    </label>
                    <textarea rows={1} className="editor-field"
                        onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localCourseContextParams.currentCourseUid, "description"],
                            targetValue: e.target.value
                        })}
                        value={content.description}>
                    </textarea>
                </div>

                <div className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="tag" size={16} />
                        <p>Tag</p>
                    </label>
                    <textarea rows={1} className="editor-field"
                        onChange={e => handleObjectKeyValueUpdate({
                            keysHierachy: [localCourseContextParams.currentCourseUid, "tag"],
                            targetValue: e.target.value.split(",")
                        })}
                        value={content.tag}>
                    </textarea>
                </div>

                <div className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center mb-4">
                        <Icon icon="table" size={16} />
                        <p>Course section</p>
                    </label>
                    <div className="flex flex-row items-center font-bold p-2 mb-4 -border-b">
                        <span className="w-20 mr-8">ID</span>
                        <span className="w-96 mr-8">Section Name</span>
                        <button
                            onClick={() => setSectionSortAscending((prev) => !prev)}
                            className="flex flex-row justify-center items-center text-nowrap gap-2 px-2 py-1 ml-auto rounded-[8px] -border -button-hover-pri font-bold">
                            <Icon icon="sort" size={16} />
                            {sectionSortAscending ? "A - Z" : "Z - A"}
                        </button>
                        <button
                            onClick={() => {
                                const newUidII = makeid(length=20);
                                handleObjectKeyValueUpdate({
                                    keysHierachy: [localCourseContextParams.currentCourseUid, "section", newUidII],
                                    targetValue: objectUidFill(defaultCoruse().section["#UID-1"])
                                });
                            }}
                            className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-4 rounded-[8px] -border -button-hover-pri font-bold">
                            <Icon icon="add" size={16} />
                            <span className="lg:inline hidden">SECTION</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-4">
                        {elementSection}
                    </div>
                    <div className="flex flex-col mt-8 mb-4 color-slate">
                        <span>This course will be displayed in the course warehouse and connects to topics and quiz library</span>
                        <span>{`Last updated ${new Date(new Date(1970, 0, 1).setSeconds(content.lastEdited / 1000))}`}</span>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        elementEditor = (
            <div className="my-auto color-slate flex flex-col justiy-center items-center text-center">
                <Icon icon="add" size={48} />
                <h1>Choose course to edit</h1>
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
