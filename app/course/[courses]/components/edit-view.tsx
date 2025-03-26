"use client";

import { useState, useEffect, useRef } from "react";

import { useGlobalContext } from "@/app/global-provider";
import { useInterfaceContext } from "../topic-provider";

import firestoreUpdateTopic from "@/app/libs/firestore/firestore-manager-topic";
import sortUidObjectByValue from "@/app/libs/utils/sort-uid-object-by-value";
import { stringToRgb } from "@/app/libs/utils/string-to-rgb";
import { TextColor, ChipTextColor } from "@/app/libs/material/chip";
import makeid from "@/app/libs/utils/make-id";
import Icon from "@/public/icon";
import LastEdited from "@/app/libs/material/last-edited";

export default function EditView ({
    courseData,
    topicData,
    libraryData
}: {
    courseData: {[key: string]: any},
    topicData: {[key: string]: {[key: string]: any}},
    libraryData: {[key: string]: any}
}): React.ReactNode {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // connect to interface context
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();

    // counterpart of content data for editing
    const [bufferTopicData, setBufferTopicData] = useState(topicData);

    // counterpart of content data for editing
    const [searchLibraryKey, setSearchLibraryKey] = useState("");

    // reference of topic object to link library data
    const [topicUidToLinkLibrary, setTopicUidToLinkLibrary] = useState("");

    // target uid to scroll to after id has been already reset
    const [targetUidScroll, setTargetUidScroll] = useState("");

    // last edited uid
    const [lastEditUid, setLastEditUid] = useState("");

    // ref for elements
    const elementsRef: {[key: string]: any} = useRef({});

    // go to ref
    const scrollToRef = (refKey: string): void => {
        try {
            elementsRef.current[refKey].scrollIntoView({
                block: "start",
                behavior: "smooth"
            });
            setTargetUidScroll("");
            return;
        } catch (error) {
            return;
        }
    };

    useEffect(() => {
        if (targetUidScroll !== "") {scrollToRef(targetUidScroll);}
    }, [targetUidScroll]);

    useEffect(() => {
        setInterfaceParams("currentSectionUid", "");
        setInterfaceParams("currentTopicUid", "");
        setInterfaceParams("discardChangesToggle", false);
        setGlobalParams("popUpConfirm", false);
        setGlobalParams("popUpAction", "");
    }, []);

    // discard all changes if toggle
    useEffect(() => {
    if (interfaceParams.discardChangesToggle && 
        globalParams.popUpConfirm &&
        (globalParams.popUpAction === "discardChangesToggle")) {
        setBufferTopicData(topicData);
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
            firestoreUpdateTopic({
                collectionName: "topic",
                originalData: topicData, 
                editedData: bufferTopicData
            }).then(
                (data) => {
                    setInterfaceParams("logUpdate", data);
                    setGlobalParams("popUpConfirm", false);
                    setGlobalParams("popUpAction", "");
                    setInterfaceParams("saveChangesToggle", false);
                    setInterfaceParams("editMode", false);
                }
            );
        }
    }, [globalParams.popUpConfirm]);

    // handle add new topic content
    // 1. contentCard
    const onAddTopicContentCard = (): void => {
        if (!globalParams.popUp) {
            const newUid = makeid(length=20);
            setBufferTopicData((prev) => ({
                ...prev,
                [newUid]: {
                    contentType: "contentCard",
                    courseUid: courseData.uid,
                    topicUid: interfaceParams.currentTopicUid,
                    topicData: {
                        content: {
                            [makeid(length=20)]: {
                                subTopic: "Subtopic A",
                                description: "Description A"
                            }
                        },
                        resource: {
                            [makeid(length=20)]: {
                                name: "Resource A",
                                description: "Description A",
                                icon: "lightbulb"
                            }
                        }
                    }
                }
            }));
            setTargetUidScroll(newUid);
            setLastEditUid(newUid);
        }
    }

    // 2. quizBanner
    const onAddTopicQuizBanner = (): void => {
        if (!globalParams.popUp) {
            const newUid = makeid(length=20);
            setBufferTopicData((prev) => ({
                ...prev,
                [newUid]: {
                    contentType: "quizBanner",
                    courseUid: courseData.uid,
                    topicUid: interfaceParams.currentTopicUid,
                    topicData: {
                        quizUid: ""
                    }
                }
            }));
            setTargetUidScroll(newUid);
            setLastEditUid(newUid);
        }
    }

    // 3. quizCard
    const onAddTopicQuizCard = (): void => {
        if (!globalParams.popUp) {
            const newUid = makeid(length=20);
            setBufferTopicData((prev) => ({
                ...prev,
                [newUid]: {
                    contentType: "quizCard",
                    courseUid: courseData.uid,
                    topicUid: interfaceParams.currentTopicUid,
                    topicData: {
                        quizUid: ""
                    }
                }
            }));
            setTargetUidScroll(newUid);
            setLastEditUid(newUid);
        }
    }

    const onPlaceholderChangeIa = (
        uidI: string, targetKeyI: string, targetKeyII: string, targetValue: any): void => {
        setBufferTopicData((prev) => ({
            ...prev,
            [uidI]: {
                ...prev[uidI],
                [targetKeyI]: {
                    ...prev[uidI][targetKeyI],
                    [targetKeyII]: targetValue
                }
            }
        }));
    };

    const onDeleteUidI = (uidI: string): void => {
        const { [uidI]: {}, ...rest } = bufferTopicData;
        setBufferTopicData(rest);
        setLastEditUid("");
    };

    const onPlaceholderChangeII_Ia = (
        uidI: string, uidII: string, 
        targetKeyI: string, targetKeyIa: string, targetKeyII: string, targetValue: any): void => {
        setBufferTopicData((prev) => ({
            ...prev,
            [uidI]: {
                ...prev[uidI],
                [targetKeyI]: {
                    ...prev[uidI][targetKeyI],
                    [targetKeyIa]: {
                        ...prev[uidI][targetKeyI][targetKeyIa],
                        [uidII]: {
                            ...prev[uidI][targetKeyI][uidII],
                            [targetKeyII]: targetValue
                        }
                    }
                }
            }
        }));
        setLastEditUid(uidI);
    };

    const onDeleteUidII_Ia = (uidI: string, uidII: string, targetKeyI: string, targetKeyII: string): void => {
        const objectTargetII = bufferTopicData[uidI][targetKeyI][targetKeyII]
        const { [uidII]: {}, ...rest } = objectTargetII;
        onPlaceholderChangeIa(uidI, targetKeyI, targetKeyII, rest);
        setLastEditUid("");
    };

    const handleTopicUidToLinkLibrary = (libraryUid: string) => {
        if (topicUidToLinkLibrary !== "") {
            onPlaceholderChangeIa(topicUidToLinkLibrary, "topicData", "quizUid", libraryUid);
            setTopicUidToLinkLibrary("");
            setTargetUidScroll(topicUidToLinkLibrary);
            setLastEditUid(topicUidToLinkLibrary);
        }
    }

    // Filter section data by search key
    let filteredSectionContent: {[key: string]: {[key: string]: any}} = {};
    for (let index = 0; index < Object.values(courseData.section).length; index++) {
        // Each content data
        const sectionContent: typeof courseData.section[string] = Object.values(courseData.section)[index];
        // Create combination of all sectionContent information for search target
        const search_target = JSON.stringify(sectionContent);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
        filteredSectionContent[Object.keys(courseData.section)[index]] = sectionContent;
        }
    }

    const sortedFilteredSectionData: {[key: string]: {[key: string]: any}} = sortUidObjectByValue(
        filteredSectionContent, "sectionId", interfaceParams.sortAscending
    );

    // Filter topic data by search key
    let filteredTopicContent: {[key: string]: {[key: string]: any}} = {};
    for (let index = 0; index < Object.values(bufferTopicData).length; index++) {
        // Each content data
        const topicContent: {[key: string]: any} = Object.values(bufferTopicData)[index];
        // Create combination of all topicContent information for search target
        const search_target = JSON.stringify(topicContent);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
            filteredTopicContent[Object.keys(bufferTopicData)[index]] = topicContent;
        }
    }

    // Filter section data by search key
    let filteredLibraryData: {[key: string]: {[key: string]: any}} = {};
    for (let index = 0; index < Object.values(libraryData).length; index++) {
        // Each content data
        const libraryContent: typeof libraryData[string] = Object.values(libraryData)[index];
        // Create combination of all libraryContent information for search target
        const search_target = JSON.stringify(libraryContent);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(searchLibraryKey.toLowerCase())) {
        filteredLibraryData[Object.keys(libraryData)[index]] = libraryContent;
        }
    }

    const sortedFilteredLibraryData: {[key: string]: {[key: string]: any}} = sortUidObjectByValue(
        filteredLibraryData, "id", interfaceParams.sortAscending
    );

    // Render library search
    let elementLibrarySearch: Array<React.ReactNode> = [];
    Object.keys(sortedFilteredLibraryData).map((librarUid, index) => {
        const library = sortedFilteredLibraryData[librarUid];

        elementLibrarySearch.push(
            <tr key={index} onClick={() => handleTopicUidToLinkLibrary(librarUid)}>
                <td key={index + "1"}>{library.id}</td>
                <td key={index + "2"}>{library.name}</td>
                <td key={index + "3"}>{library.mode}</td>
                <td key={index + "4"}>{library.totalQuestion}</td>
            </tr>
        );
    });

    // Render left-side navigator
    let elementAsideSection: Array<React.ReactNode> = [];
    
    Object.keys(sortedFilteredSectionData).map((sectionUid) => {
    
        // Get individual section data
        const section = sortedFilteredSectionData[sectionUid];
        const sortedSectionTopics: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(section.sectionTopics, "topicId", true);
        let elementAsideSectionTopic: Array<React.ReactNode> = [];

        Object.keys(sortedSectionTopics).map((topicUid) => {
            // Get individual topic data
            const topic = sortedSectionTopics[topicUid];

            elementAsideSectionTopic.push(
                <button onClick={() => {
                    setInterfaceParams("currentSectionUid", sectionUid);
                    setInterfaceParams("currentTopicUid", topicUid);
                }}
                    className="flex flex-row px-2 py-2 gap-2 section-center text-left hover:bg-black/10 hover:dark:bg-white/10" key={"Aside_" + topicUid}>
                    <TextColor chipText={topic.topicId} fontWeight={900} textColor={stringToRgb(section.sectionId)} />
                    <span className="font-semibold text-nowrap overflow-hidden">{topic.topicName}</span>
                </button>
            )
        });

        elementAsideSection.push(
            <div className="flex flex-col mb-4" key={"Aside_" + sectionUid}>
                <div className="flex flex-row px-2 py-2 gap-2 section-center text-left bg-black/5 dark:bg-white/5">
                    <TextColor chipText={section.sectionId} fontWeight={900} />
                    <span className="font-semibold text-nowrap overflow-hidden">{section.sectionName}</span>
                </div>
                <div className="flex flex-col ml-5 -border-l">
                    {elementAsideSectionTopic}
                </div>
            </div>
        );
    });


    // Render right-side main content
    let elementMainSection: React.ReactNode = <></>;

    try {
        const section = sortedFilteredSectionData[interfaceParams.currentSectionUid];
        const topic = section.sectionTopics[interfaceParams.currentTopicUid];

        let elementTopic: {[key: string]: Array<React.ReactNode>} = {contentCard: [], quizBanner: [], quizCard: []};

        Object.keys(filteredTopicContent).map((topicContentUid, index) => {
            const topicContent = filteredTopicContent[topicContentUid];

            // Render topic (match topic data from course and topic collection)
            if (topicContent.topicUid === interfaceParams.currentTopicUid) {

                // contentCard on top
                if (topicContent.contentType === "contentCard") {
                    let elementTopicContentEditor: Array<React.ReactNode> = [];
                    let elementTopicResourceEditor: Array<React.ReactNode> = [];

                    Object.keys(topicContent.topicData.content).map((contentUid, index) => {
                        const content = topicContent.topicData.content[contentUid]
                        elementTopicContentEditor.push(
                            <div className="relative flex flex-row items-center p-2 border-b border-broder/75 dark:border-border-dark/75" key={index}>
                                <textarea rows={1} cols={8} onChange={e => onPlaceholderChangeII_Ia(topicContentUid, contentUid, "topicData", "content", "subTopic", e.target.value)}
                                    className="editor-field w-80 mr-8" value={content.subTopic}></textarea>
                                <textarea rows={1} cols={4} onChange={e => onPlaceholderChangeII_Ia(topicContentUid, contentUid, "topicData", "content", "description", e.target.value)}
                                    className="editor-field w-[540px] mr-8" value={content.description}></textarea>
                                <button
                                    onClick={() => onDeleteUidII_Ia(topicContentUid, contentUid, "topicData", "content")}
                                    className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                                    <Icon icon="trash" size={16} />
                                    <span className="lg:inline hidden">DELETE</span>
                                </button>
                            </div>
                        );
                    });

                    Object.keys(topicContent.topicData.resource).map((resourceUid, index) => {
                        const resource = topicContent.topicData.resource[resourceUid]
                        elementTopicResourceEditor.push(
                            <div className="relative flex flex-row items-center p-2 border-b border-broder/75 dark:border-border-dark/75" key={index}>
                                <textarea rows={1} cols={8} onChange={e => onPlaceholderChangeII_Ia(topicContentUid, resourceUid, "topicData", "resource", "name", e.target.value)}
                                    className="editor-field w-40 mr-8" value={resource.name}></textarea>
                                <textarea rows={1} cols={4} onChange={e => onPlaceholderChangeII_Ia(topicContentUid, resourceUid, "topicData", "resource", "description", e.target.value)}
                                    className="editor-field w-40 mr-8" value={resource.description}></textarea>
                                <textarea rows={1} cols={4} onChange={e => onPlaceholderChangeII_Ia(topicContentUid, resourceUid, "topicData", "resource", "url", e.target.value)}
                                    className="editor-field w-72 mr-8" value={resource.url}></textarea>
                                <Icon icon={resource.icon} size={16}/>
                                <textarea rows={1} cols={4} onChange={e => onPlaceholderChangeII_Ia(topicContentUid, resourceUid, "topicData", "resource", "icon", e.target.value)}
                                    className="editor-field w-40 ml-2 mr-8" value={resource.icon}></textarea>
                                <button
                                    onClick={() => onDeleteUidII_Ia(topicContentUid, resourceUid, "topicData", "resource")}
                                    className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                                    <Icon icon="trash" size={16} />
                                    <span className="lg:inline hidden">DELETE</span>
                                </button>
                            </div>
                        );
                    });

                    elementTopic.contentCard.push(
                        <div key={index}>
                            <div className="px-6 py-4 my-8 flex flex-row gap-4 w-full items-center justify-center bg-black/1 dark:bg-white/5"
                                ref={(element) => {elementsRef.current[topicContentUid] = element}}>
                                <ChipTextColor chipText="CONTENT CARD" chipIcon="table" fontWeight={900} chipBackgroungOpacity={0.1} paddingY={4} />
                                {(lastEditUid === topicContentUid) && <LastEdited />}
                                <div className="w-full -border-b"></div>
                                <button onClick={() => onDeleteUidI(topicContentUid)}
                                    className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                                    <Icon icon="trash" size={16} />
                                    <span className="text-nowrap">DELETE QUIZ BANNER</span>
                                </button>
                            </div>
                            <div className="px-6 flex flex-col gap-8" key={index}>
                                <div className="flex flex-col overflow-x-auto">
                                    {/* Resource editor */}
                                    <div style={{minWidth: "1000px"}} className="flex flex-row items-center font-bold text-nowrap p-2 -border-b rounded-t-xl bg-black/10 dark:bg-white/10">
                                        <span className="w-40 mr-8">Resource Name</span>
                                        <span className="w-40 mr-8">Description</span>
                                        <span className="w-72 mr-8">URL</span>
                                        <span className="w-40 mr-8">Display icon</span>
                                        <button
                                            onClick={() => {
                                                const newUidII = makeid(length=20);
                                                onPlaceholderChangeII_Ia(topicContentUid, newUidII, "topicData", "resource", "name", "")
                                                onPlaceholderChangeII_Ia(topicContentUid, newUidII, "topicData", "resource", "description", "")
                                                onPlaceholderChangeII_Ia(topicContentUid, newUidII, "topicData", "resource", "url", "")
                                                onPlaceholderChangeII_Ia(topicContentUid, newUidII, "topicData", "resource", "icon", "")
                                            }}
                                            className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border hover:text-pri hover:border-pri dark:hover:text-pri-dark dark:hover:border-pri-dark font-bold">
                                            <Icon icon="add" size={16} />
                                            <span className="lg:inline hidden">RESOURCE</span>
                                        </button>
                                    </div>
                                    <div style={{minWidth: "1000px"}} className="flex flex-col">
                                        {elementTopicResourceEditor}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    {/* Content editor */}
                                    <div style={{minWidth: "1000px"}} className="flex flex-row items-center font-bold text-nowrap p-2 -border-b rounded-t-xl bg-black/10 dark:bg-white/10">
                                        <span className="w-80 mr-8">Subtopic</span>
                                        <span className="w-[540px] mr-8">Description</span>
                                        <button
                                            onClick={() => {
                                                const newUidII = makeid(length=20);
                                                onPlaceholderChangeII_Ia(topicContentUid, newUidII, "topicData", "content", "subTopic", "")
                                                onPlaceholderChangeII_Ia(topicContentUid, newUidII, "topicData", "content", "description", "")
                                            }}
                                            className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border hover:text-pri hover:border-pri dark:hover:text-pri-dark dark:hover:border-pri-dark font-bold">
                                            <Icon icon="add" size={16} />
                                            <span className="lg:inline hidden">SUBTOPIC</span>
                                        </button>
                                    </div>
                                    <div style={{minWidth: "1000px"}} className="flex flex-col">
                                        {elementTopicContentEditor}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                // quizBanner on middle
                if (topicContent.contentType === "quizBanner") {
                    elementTopic.quizBanner.push(
                        <div className="px-6 py-4 my-8 flex flex-row gap-4 w-full items-center justify-center bg-black/1 dark:bg-white/5" key={"Header_" + index}
                            ref={(element) => {elementsRef.current[topicContentUid] = element}}>
                            <ChipTextColor chipText="QUIZ BANNER" chipIcon="tag" fontWeight={900} chipBackgroungOpacity={0.1} paddingY={4} />
                            {(lastEditUid === topicContentUid) && <LastEdited />}
                            <div className="w-full -border-b"></div>
                            <button onClick={() => onDeleteUidI(topicContentUid)}
                                className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                                <Icon icon="trash" size={16} />
                                <span className="text-nowrap">DELETE CONTENT CARD</span>
                            </button>
                        </div>
                    );

                    elementTopic.quizBanner.push(
                        <button onClick={() => setTopicUidToLinkLibrary(topicContentUid)} key={"Editor_" + index}
                            className="-hover-bg-200 flex flex-row justify-center items-center gap-2 mx-6 mb-4 px-2 py-2 rounded-[8px] -border hover:text-pri hover:border-pri dark:hover:text-pri-dark dark:hover:border-pri-dark font-bold">
                            <Icon icon="tool" size={16} />
                            <span className="text-lg text-nowrap">CHOOSE REFERENCE LIBRARY</span>
                        </button>
                    );

                    try {
                        const topicLibrary = libraryData[topicContent.topicData.quizUid];
                        elementTopic.quizBanner.push(
                            <div className='-card-hover card mx-6 rounded-md relative flex flex-col text-white' key={"Display_" + index}>
                                <div className='w-full p-4 z-10'>
                                    <p className='font-semibold'>TOPIC PRACTICE</p>
                                    <h3 className='mt-2'>{topicLibrary.name.toLocaleUpperCase()}</h3>
                                    <p className='mt-8 font-semibold'>{topicLibrary.description}</p>
                                    <div className="flex flex-row justify-between items-center w-full mt-4">
                                        <div className='flex flex-row items-center'>
                                            <span id="chip-action-neu">{topicLibrary.mode}</span>
                                            <h5 className="flex flex-row gap-1 ml-2">{topicLibrary.id}</h5>
                                        </div>
                                        <h5 className='ml-1'>{topicLibrary.totalQuestion} Questions</h5>
                                    </div>
                                </div>
                                <div className='absolute top-0 w-full overflow-hidden z-0'>
                                    <img src={topicLibrary.image} alt="" className="h-full w-full object-cover"/>
                                    <div className='absolute top-0 h-full w-full bg-highlight-dark/50 dark:bg-highlight-dark/90'></div>
                                    <div className="glass-cover-card"></div>
                                </div>
                            </div>
                        );
                    } catch (error) {
                        elementTopic.quizBanner.push(
                            <div className="card mx-6 rounded-md relative flex flex-row justify-center items-center text-center gap-4 text-textSlate dark:text-textSlate-dark" key={"Display_" + index}>
                                <Icon icon="false" size={32} />
                                <h1>LIBRARY IS UNAVALIABLE</h1>
                            </div>
                        );
                    }
                }

                // quizCard on bottom
                if (topicContent.contentType === "quizCard") {
                    elementTopic.quizCard.push(
                        <div className="px-6 py-4 my-8 flex flex-row gap-4 w-full items-center justify-center bg-black/1 dark:bg-white/5" key={"Header_" + index}
                            ref={(element) => {elementsRef.current[topicContentUid] = element}}>
                            <ChipTextColor chipText="QUIZ CARD" chipIcon="tag" fontWeight={900} chipBackgroungOpacity={0.1} paddingY={4} />
                            {(lastEditUid === topicContentUid) && <LastEdited />}
                            <div className="w-full -border-b"></div>
                            <button onClick={() => onDeleteUidI(topicContentUid)}
                                className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                                <Icon icon="trash" size={16} />
                                <span className="text-nowrap">DELETE QUIZ CARD</span>
                            </button>
                        </div>
                    );

                    elementTopic.quizCard.push(
                        <button onClick={() => setTopicUidToLinkLibrary(topicContentUid)} key={"Editor_" + index}
                            className="-hover-bg-200 flex flex-row justify-center items-center gap-2 mx-6 mb-4 px-2 py-2 rounded-[8px] -border hover:text-pri hover:border-pri dark:hover:text-pri-dark dark:hover:border-pri-dark font-bold">
                            <Icon icon="tool" size={16} />
                            <span className="text-lg text-nowrap">CHOOSE REFERENCE LIBRARY</span>
                        </button>
                    );

                    try {
                        const topicLibrary = libraryData[topicContent.topicData.quizUid];
                        elementTopic.quizCard.push(
                            <div className='-card-hover card mx-6 rounded-md relative flex flex-col text-white' key={"Display_" + index}>
                                <div className='w-full p-4 z-10'>
                                    <p className='font-semibold'>TOPIC PRACTICE</p>
                                    <h3 className='mt-2'>{topicLibrary.name.toLocaleUpperCase()}</h3>
                                    <p className='mt-8 font-semibold'>{topicLibrary.description}</p>
                                    <div className="flex flex-row justify-between items-center w-full mt-4">
                                        <div className='flex flex-row items-center'>
                                            <span id="chip-action-neu">{topicLibrary.mode}</span>
                                            <h5 className="flex flex-row gap-1 ml-2">{topicLibrary.id}</h5>
                                        </div>
                                        <h5 className='ml-1'>{topicLibrary.totalQuestion} Questions</h5>
                                    </div>
                                </div>
                                <div className='absolute top-0 w-full overflow-hidden z-0'>
                                    <img src={topicLibrary.image} alt="" className="h-full w-full object-cover"/>
                                    <div className='absolute top-0 h-full w-full bg-highlight-dark/50 dark:bg-highlight-dark/90'></div>
                                    <div className="glass-cover-card"></div>
                                </div>
                            </div>
                        );
                    } catch (error) {
                        elementTopic.quizCard.push(
                            <div className="card mx-6 rounded-md relative flex flex-row justify-center items-center text-center gap-4 text-textSlate dark:text-textSlate-dark" key={"Display_" + index}>
                                <Icon icon="false" size={32} />
                                <h1>LIBRARY IS UNAVALIABLE</h1>
                            </div>
                        );
                    }
                }
            }
        })

        elementMainSection = (
            <div className="relative h-dvh-nav-ctrl pb-12">
                {/* Upper console */}
                <div className="flex flex-row items-center p-2 py-2 gap-2 overflow-x-auto -border-b">
                    {(topicUidToLinkLibrary === "") && <button
                        onClick={() => onAddTopicContentCard()}
                        className="controller-menu">
                        <Icon icon="add" size={16} />
                        <p>ADD CONTENT CARD</p>
                    </button>}
                    {(topicUidToLinkLibrary === "") && <button
                        onClick={() => onAddTopicQuizBanner()}
                        className="controller-menu">
                        <Icon icon="add" size={16} />
                        <p>ADD QUIZ BANNER</p>
                    </button>}
                    {(topicUidToLinkLibrary === "") && <button
                        onClick={() => onAddTopicQuizCard()}
                        className="controller-menu">
                        <Icon icon="add" size={16} />
                        <p>ADD QUIZ CARD</p>
                    </button>}
                    <div className="controller-menu">
                        <Icon icon="search" size={16} />
                        <span id="librarySearch" className="input-field"
                            contentEditable={true} suppressContentEditableWarning={true}
                            defaultValue={searchLibraryKey}
                            onInput={e => setSearchLibraryKey(e.currentTarget.textContent!)}>{}
                        </span>
                        {!searchLibraryKey && <span className="absolute left-[34px] z-[-10] text-sm">CHECK LIBRARY</span>}
                        {searchLibraryKey && 
                            <button onClick={() => {
                                setSearchLibraryKey("");
                                document.getElementById("librarySearch")!.textContent = "";
                            }}><Icon icon="xCircle" size={16}/></button>}
                    </div>
                    {(topicUidToLinkLibrary !== "") && <button
                        onClick={() => setTopicUidToLinkLibrary("")}
                        className="controller-menu text-amber dark:text-amber-dark">
                        <Icon icon="xCircle" size={16} />
                        <p>CANCEL</p>
                    </button>}
                </div>

                {/* Editing & display interface */}
                {((searchLibraryKey === "") && (topicUidToLinkLibrary === ""))
                    ? <div className="flex flex-col h-full overflow-y-auto">
                        <div className="flex flex-row items-center px-2 py-3 gap-4 section-center text-left bg-black/5 dark:bg-white/5">
                            <TextColor chipText={section.sectionId} fontWeight={700} fontSize="1.5rem" />
                            <h3 className="font-semibold text-nowrap overflow-hidden">{section.sectionName}</h3>
                        </div>
                        <div className="flex flex-row items-center px-4 py-4 gap-4 section-center text-left -border-b">
                            <TextColor chipText={topic.topicId} fontWeight={700} fontSize="1.25rem" textColor={stringToRgb(section.sectionId)} />
                            <h4 className="font-semibold text-nowrap overflow-hidden">{topic.topicName}</h4>
                        </div>
                        <div className="flex flex-col mb-8">
                            {elementTopic.contentCard}
                            {elementTopic.quizBanner}
                            {elementTopic.quizCard}
                        </div>
                    </div>
                    : <div className="h-full overflow-y-auto">
                        <table className="theme-table">
                            <thead key={"head"}>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Mode</th>
                                    <th>Question</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elementLibrarySearch}
                            </tbody>
                        </table>
                    </div>
                    }
            </div>
        );
    } catch (error) {
        elementMainSection = (
            <div className="my-auto text-textSlate dark:text-textSlate-dark flex flex-col justify-center items-center text-center" key="blank">
                <Icon icon="edit" size={48} />
                <h1>Choose topic to edit</h1>
            </div>
        );
    }

    return (
        <div>
            <div id="two-cols-fixed" className="-border-t">
                <aside aria-label="aside-navigator" id="col-scroll-aside" className="-border-r">
                    <strong className="mx-4 mt-4">{`COURSE ${courseData.id} ┇ ${courseData.abbreviation}`}</strong>
                    <h1 className="mx-4">{courseData.name.toLocaleUpperCase()}</h1>
                    <div className="flex flex-row items-center px-4 my-4">
                        <Icon icon="map" size={16} />
                        <h4 className="ml-2">SECTION & TOPICS</h4>
                    </div>
                    <div className="flex flex-col h-max pb-4 overflow-y-auto">
                        {elementAsideSection}
                    </div>
                </aside>
                <section aria-label="main-display" id="col-scroll-main">
                    {elementMainSection}
                </section>
            </div>
            <div className="fixed bottom-0 w-dvw h-dvh z-[-100]">
                <img src={courseData.image} alt="" className="absolute h-full w-full z-[-100]" />
                <div className="absolute h-full w-full z-[-90] bg-highlight/90 dark:bg-highlight-dark/90"></div>
                <div className="glass-cover-spread z-[-80]"></div>
            </div>
        </div>
    );
}
