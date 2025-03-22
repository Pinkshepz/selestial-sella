"use client";

import { useState, useEffect } from "react";

import { useGlobalContext } from "@/app/global-provider";
import { useInterfaceContext } from "../course-provider";

import firestoreUpdate from "@/app/libs/firestore/firestore-manager";
import makeid from "@/app/libs/utils/make-id";
import sortUidObjectByValue from "@/app/libs/utils/sort-uid-object-by-value";
import { TextColor } from "@/app/libs/material/chip";
import Icon from "@/public/icon";

export default function CardEditor ({
    contentData
}: {
    contentData: {[key: string]: {[key: string]: any}}
}): React.ReactNode {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // connect to interface context
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();

    // counterpart of content data for editing
    const [bufferContent, setBufferContent] = useState(contentData);

    // sort mode for course section
    const [sectionSortAscending, setSectionSortAscending] = useState(true);

    // detect footprint and return id="changed"
    const handleFootprint = (uid: string, footprint: string) => {
        try {
            if (Object.keys(contentData).includes(uid)) {
                if (contentData[uid][footprint] === bufferContent[uid][footprint]) {
                    return "original"
                } else if (contentData[uid][footprint].toString() === bufferContent[uid][footprint].toString()) {
                    return "original"
                } else {
                    return "changed"
                }
            } else {
                return "changed-all"
            }
        } catch (error) {
            return "changed-all"
        }
    }

  // discard all changes if toggle
  useEffect(() => {
    if (interfaceParams.discardChangesToggle && 
        globalParams.popUpConfirm &&
        (globalParams.popUpAction === "discardChangesToggle")) {
        setBufferContent(contentData);
        setInterfaceParams("discardChangesToggle", false);
        setGlobalParams("popUpConfirm", false);
        setGlobalParams("popUpAction", "");
    }
  }, [globalParams]);

  // save all changes if toggle 
  useEffect(() => {
    if (interfaceParams.saveChangesToggle &&
        globalParams.popUpConfirm &&
        (globalParams.popUpAction == "saveChangesToggle")) {
            setGlobalParams("isLoading", true);
            firestoreUpdate({
                collectionName: "course",
                originalData: contentData, 
                editedData: bufferContent
            }).then(
                (data) => {
                    setGlobalParams("popUpConfirm", false);
                    setGlobalParams("popUpAction", "");
                    setInterfaceParams("saveChangesToggle", false);
                    setInterfaceParams("editMode", false);
                    setInterfaceParams("logUpdate", data);
                }
            );
        }
  }, [globalParams.popUpConfirm]);

  // duplicate course
  const handleDuplicateCourse = (uid: string): void => {
    if (!globalParams.popUp) {
        const newUid = makeid(length=20);
        setBufferContent((prev) => ({
            ...prev,
            [newUid]: {
                id: bufferContent[uid].id + " copy",
                abbreviation: bufferContent[uid].abbreviation + " copy",
                name: bufferContent[uid].name + " copy",
                description: bufferContent[uid].description,
                image: bufferContent[uid].image,
                tag: bufferContent[uid].tag,
                hidden: bufferContent[uid].hidden,
                section: bufferContent[uid].section
            }
        }));
        setInterfaceParams("currentCourseUid", newUid);
    }
  }

  // handle delete course
  const handleDeleteCourse = (uid: string): void => {
    if (!globalParams.popUp) {
        setBufferContent((prev) => {
            if (prev) {
                const { [uid]: {}, ...rest } = prev;
                return rest;
            } else {
                return prev;
            }
        });
    }
  }

  // handle add new course
  useEffect(() => {
    if (interfaceParams.addCourseToggle && !globalParams.popUp) {
        const newUid = makeid(length=20);
        setBufferContent((prev) => ({
            ...prev,
            [newUid]: {
                id: "99",
                abbreviation: "X",
                name: "NEW COURSE",
                description: "",
                image: "https://st.depositphotos.com/1411161/2534/i/450/depositphotos_25345533-stock-photo-technical-blueprint.jpg",
                tag: [],
                hidden: false,
                section: {[makeid(length=20)]: {
                    sectionId: "A",
                    sectionName: "Section 1",
                    sectionTopics: {
                        [makeid(length=20)]: {
                            topicId: "A1",
                            topicName: "Topic 1.1",
                        },
                        [makeid(length=20)]: {
                            topicId: "A2",
                            topicName: "Topic 1.2",
                        }
                    }
                }}
            }
        }));
        setInterfaceParams("currentCourseUid", newUid);
    }
    setInterfaceParams("addCourseToggle", false);
  }, [interfaceParams.addCourseToggle]);

  // update course data on placeholder change
  const onPlaceholderChangeI = (
    uidI: string, targetKeyI: string, targetValue: any): void => {
    setBufferContent((prev) => ({
        ...prev,
        [uidI]: {
            ...prev[uidI],
            [targetKeyI]: targetValue
        }
    }));
  };

  const onPlaceholderChangeII = (
    uidI: string, uidII: string, 
    targetKeyI: string, targetKeyII: string, targetValue: any): void => {
    setBufferContent((prev) => ({
        ...prev,
        [uidI]: {
            ...prev[uidI],
            [targetKeyI]: {
                ...prev[uidI][targetKeyI],
                [uidII]: {
                    ...prev[uidI][targetKeyI][uidII],
                    [targetKeyII]: targetValue
                }
            }
        }
    }));
  };

  const onDeleteUidII = (uidI: string, uidII: string, targetKeyI: string): void => {
    const objectTargetII = bufferContent[uidI][targetKeyI]
    const { [uidII]: {}, ...rest } = objectTargetII;
    onPlaceholderChangeI(uidI, targetKeyI, rest);
  };

  const onPlaceholderChangeIII = (
    uidI: string, uidII: string, uidIII: string, 
    targetKeyI: string, targetKeyII: string, targetKeyIII: string, targetValue: any): void => {
    setBufferContent((prev) => ({
        ...prev,
        [uidI]: {
            ...prev[uidI],
            [targetKeyI]: {
                ...prev[uidI][targetKeyI],
                [uidII]: {
                    ...prev[uidI][targetKeyI][uidII],
                    [targetKeyII]: {
                        ...prev[uidI][targetKeyI][uidII][targetKeyII],
                        [uidIII]: {
                            ...prev[uidI][targetKeyI][uidII][targetKeyII][uidIII],
                            [targetKeyIII]: targetValue
                        }
                    }
                }
            }
        }
    }));
  };

  const onDeleteUidIII = (uidI: string, uidII: string, uidIII: string, targetKeyI: string, targetKeyII: string): void => {
    const objectTargetIII = bufferContent[uidI][targetKeyI][uidII][targetKeyII]
    const { [uidIII]: {}, ...rest } = objectTargetIII;
    onPlaceholderChangeII(uidI, uidII, targetKeyI, targetKeyII, rest);
  };

    // Filter by search key
    let filteredContent: {[key: string]: {[key: string]: any}} = {};
    for (let index = 0; index < Object.values(bufferContent).length; index++) {
        // Each content data
        const content: {[key: string]: any} = Object.values(bufferContent)[index];
        // Create combination of all content information for search target
        const search_target = JSON.stringify(content);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
        filteredContent[Object.keys(bufferContent)[index]] = content;
        }
    }

    const sortedFilteredContentData: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(
        filteredContent, "id", interfaceParams.sortAscending
    );

    // Render left-side navigator
    let elementAside: Array<React.ReactNode> = [];

    Object.values(sortedFilteredContentData).map((content, index) => {
        // get uid as object key
        const uid = Object.keys(sortedFilteredContentData)[index];

        if (interfaceParams.currentCourseUid == uid) {
            elementAside.push(
                <div className="flex flex-row px-2 py-2 gap-2 content-center text-left bg-black/10 dark:bg-white/10" key={uid}>
                    <TextColor chipText={content.id} fontWeight={900} />
                    <span className="font-semibold text-nowrap overflow-hidden">{content.name}</span>
                    <span className="ml-auto">{content.hidden && <Icon icon="eyeSlash" size={16}/>}</span>
                </div>
            );
        } else {
            elementAside.push(
                <button onClick={() => setInterfaceParams("currentCourseUid", uid)} key={uid}
                    className="flex flex-row px-2 py-2 gap-2 content-center text-left hover:bg-black/10 dark:hover:bg-white/10 ease-in-out duration-50">
                    <TextColor chipText={content.id} fontWeight={900} />
                    <span className="text-nowrap overflow-hidden">{content.name}</span>
                    <span className="ml-auto">{content.hidden && <Icon icon="eyeSlash" size={16}/>}</span>
                </button>
            );
        }
    });

    // Render right-side navigator
    let elementEditor: React.ReactNode = <></>;
    let content = bufferContent[interfaceParams.currentCourseUid];

    try {
        // section interface
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
                    <div className="flex flex-row ml-4" key={sectionTopicUid}>
                        <textarea onChange={e => onPlaceholderChangeIII(interfaceParams.currentCourseUid, sectionUid, sectionTopicUid, "section", "sectionTopics", "topicId", e.target.value)}
                            className="editor-field w-20 mr-8" value={sectionTopicAtUid.topicId}></textarea>
                        <textarea onChange={e => onPlaceholderChangeIII(interfaceParams.currentCourseUid, sectionUid, sectionTopicUid, "section", "sectionTopics", "topicName", e.target.value)}
                            className="editor-field w-96 mr-8" value={sectionTopicAtUid.topicName}></textarea>
                        <button
                            onClick={() => onDeleteUidIII(interfaceParams.currentCourseUid, sectionUid, sectionTopicUid, "section", "sectionTopics")}
                            className="flex flex-row justify-center items-center gap-2 h-[30px] ml-auto px-2 py-1 ml-4 mb-4 rounded-[8px] border border-ter dark:border-ter-dark hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                            <Icon icon="trash" size={16} />
                            <span className="lg:inline hidden">TOPIC</span>
                        </button>
                    </div>
                );
            });

            elementSection.push(
                <div key={sectionUid}>
                    <div className="font-bold text-pri dark:text-pri-dark bg-black/10 dark:bg-white/10 p-2 mb-4 rounded-xl">
                        <textarea onChange={e => onPlaceholderChangeII(interfaceParams.currentCourseUid, sectionUid, "section", "sectionId", e.target.value)}
                            className="editor-field w-20 mr-8" value={sectionAtUid.sectionId}></textarea>
                        <textarea onChange={e => onPlaceholderChangeII(interfaceParams.currentCourseUid, sectionUid, "section", "sectionName", e.target.value)}
                            className="editor-field w-96 mr-8" value={sectionAtUid.sectionName}></textarea>
                    </div>
                    <div className="flex flex-col ml-4 border-l border-broder dark:border-border-dark">
                        <div className="flex flex-row font-bold items-center ml-4 mb-4 border-b border-broder dark:border-border-dark">
                            <span className="w-20 mr-8">Topic ID</span>
                            <span className="w-96 mr-8">Topic Name</span>
                            <button
                                onClick={() => onPlaceholderChangeIII(interfaceParams.currentCourseUid, sectionUid, makeid(length=20), "section", "sectionTopics", "topicId", "N1")}
                                className="flex flex-row justify-center items-center gap-2 h-[30px] ml-auto px-2 py-1 ml-4 mb-4 rounded-[8px] border border-ter dark:border-ter-dark hover:text-pri hover:border-pri dark:hover:text-pri-dark dark:hover:border-pri-dark font-bold">
                                <Icon icon="add" size={16} />
                                <span className="lg:inline hidden">TOPIC</span>
                            </button>
                            <button
                                onClick={() => onDeleteUidII(interfaceParams.currentCourseUid, sectionUid, "section")}
                                className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-4 mb-4 rounded-[8px] border border-ter dark:border-ter-dark hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                                <Icon icon="trash" size={16} />
                                <span className="lg:inline hidden">SECTION</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {elementSectionTopic}
                        </div>
                    </div>
                </div>
            );
        })

        // conbine all interface together
        elementEditor = (
            <div className="flex flex-col gap-2" key={content.uid}>
                <div className="h-56 w-full overflow-hidden">
                    {content.image && <img src={content.image} alt="Invalid image" className="w-full"/>}
                </div>
                <strong className="px-4 mt-4">{`${content.id} ┇ ${content.abbreviation}`}</strong>
                <h1 className="px-4">{content.name}</h1>
                <span className="px-4 mb-4">{content.description}</span>

                <div className="flex flex-row gap-4 p-4 m-0">
                    <div className="flex flex-row gap-2 my-2 font-bold text-pri dark:text-pri-dark">
                        <Icon icon="barcode" size={16} />
                        <p>{interfaceParams.currentCourseUid}</p>
                    </div>
                    <button
                        onClick={() => {onPlaceholderChangeI(interfaceParams.currentCourseUid, "hidden", !content.hidden)}}
                        className="flex flex-row justify-center items-center gap-2 px-2 py-1 ml-auto rounded-[8px] border border-ter dark:border-ter-dark hover:text-pri hover:border-pri dark:hover:text-pri-dark dark:hover:border-pri-dark font-bold">
                        <Icon icon={content.hidden ? "eyeSlash" : "eye"} size={16} />
                        <span className="lg:inline hidden">{content.hidden ? "HIDDEN" : "VISIBLE"}</span>
                    </button>
                    <button
                        onClick={() => {handleDuplicateCourse(interfaceParams.currentCourseUid)}}
                        className="flex flex-row justify-center items-center gap-2 px-2 py-1 rounded-[8px] border border-ter dark:border-ter-dark hover:text-amber hover:border-amber dark:hover:text-amber-dark dark:hover:border-amber-dark font-bold">
                        <Icon icon="copy" size={16} />
                        <span className="lg:inline hidden">DUPLICATE</span>
                    </button>
                    <button
                        onClick={() => {handleDeleteCourse(interfaceParams.currentCourseUid)}}
                        className="flex flex-row justify-center items-center gap-2 px-2 py-1 rounded-[8px] border border-ter dark:border-ter-dark hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                        <Icon icon="trash" size={16} />
                        <span className="lg:inline hidden">DELETE</span>
                    </button>
                </div>

                <div id={handleFootprint(interfaceParams.currentCourseUid, "image")} className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="image" size={16} />
                        <p>Image link</p>
                    </label>
                    <textarea className="editor-field"
                        onChange={e => onPlaceholderChangeI(interfaceParams.currentCourseUid, "image", e.target.value)}
                        value={content.image}>
                    </textarea>
                </div>

                <div id={handleFootprint(interfaceParams.currentCourseUid, "id")} className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="tag" size={16} />
                        <p>ID</p>
                    </label>
                    <textarea className="editor-field"
                        onChange={e => onPlaceholderChangeI(interfaceParams.currentCourseUid, "id", e.target.value)}
                        value={content.id}>
                    </textarea>
                </div>

                <div id={handleFootprint(interfaceParams.currentCourseUid, "abbreviation")} className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="font" size={16} />
                        <p>Abbreviation</p>
                    </label>
                    <textarea className="editor-field"
                        onChange={e => onPlaceholderChangeI(interfaceParams.currentCourseUid, "abbreviation", e.target.value)}
                        value={content.abbreviation}>
                    </textarea>
                </div>

                <div id={handleFootprint(interfaceParams.currentCourseUid, "name")} className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="h1" size={16} />
                        <p>Title name</p>
                    </label>
                    <textarea className="editor-field"
                        onChange={e => onPlaceholderChangeI(interfaceParams.currentCourseUid, "name", e.target.value)}
                        value={content.name}>
                    </textarea>
                </div>

                <div id={handleFootprint(interfaceParams.currentCourseUid, "description")} className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="font" size={16} />
                        <p>Description</p>
                    </label>
                    <textarea className="editor-field"
                        onChange={e => onPlaceholderChangeI(interfaceParams.currentCourseUid, "description", e.target.value)}
                        value={content.description}>
                    </textarea>
                </div>

                <div id={handleFootprint(interfaceParams.currentCourseUid, "tag")} className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="tag" size={16} />
                        <p>Tag</p>
                    </label>
                    <textarea className="editor-field"
                        onChange={e => onPlaceholderChangeI(interfaceParams.currentCourseUid, "tag", e.target.value.split(","))}
                        value={content.tag}>
                    </textarea>
                </div>

                <div id={handleFootprint(interfaceParams.currentCourseUid, "section")} className="edit-placeholder mx-2">
                    <label className="flex flex-row justify-start items-center mb-4">
                        <Icon icon="table" size={16} />
                        <p>Course section</p>
                    </label>
                    <div className="flex flex-row items-center font-bold px-2 mb-4 border-b border-broder dark:border-border-dark">
                        <span className="w-20 mr-8">Section ID</span>
                        <span className="w-96 mr-8">Section Name</span>
                        <button
                            onClick={() => setSectionSortAscending((prev) => !prev)}
                            className="flex flex-row justify-center items-center gap-2 px-2 py-1 ml-auto mb-4 rounded-[8px] border border-ter dark:border-ter-dark hover:text-pri hover:border-pri dark:hover:text-pri-dark dark:hover:border-pri-dark font-bold">
                            <Icon icon="sort" size={16} />
                            {sectionSortAscending ? "A - Z" : "Z - A"}
                        </button>
                        <button
                            onClick={() => {
                                const newUidII = makeid(length=20);
                                onPlaceholderChangeII(interfaceParams.currentCourseUid, newUidII, "section", "sectionTopics", {})
                                onPlaceholderChangeII(interfaceParams.currentCourseUid, newUidII, "section", "sectionId", "N")
                            }}
                            className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-4 mb-4 rounded-[8px] border border-ter dark:border-ter-dark hover:text-pri hover:border-pri dark:hover:text-pri-dark dark:hover:border-pri-dark font-bold">
                            <Icon icon="add" size={16} />
                            <span className="lg:inline hidden">SECTION</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-4">
                        {elementSection}
                    </div>
                    <div className="flex flex-col mt-8 mb-4 color-slate">
                        <span>This course will be displayed in the course warehouse and connects to topics and quiz library</span>
                        <span>{`Last updated ${new Date(new Date(1970, 0, 1).setSeconds(content.latestUpdated.seconds))}`}</span>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        elementEditor = (
            <div className="my-auto text-textSlate dark:text-textSlate-dark flex flex-col justiy-center items-center text-center">
                <Icon icon="add" size={48} />
                <h1>Choose course to edit</h1>
            </div>
        );
    }

    return (
        <div id="two-cols-fixed" className="border-t border-border dark:border-border-dark">
            <aside aria-label="aside-navigator" id="col-scroll-aside" className="w-[25dvw] border-r border-border dark:border-border-dark">
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
