"use client";

// =========================================================================
// 1. IMPORT

//// 1.1 Metadata & module & framework
import { useState, useEffect, useRef } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useInterfaceContext } from "../topic-provider";

//// 1.3 React components
import Course from "@/app/utility/interface/interface-course";
import Library from "@/app/utility/interface/interface-library";

import LastEdited from "@/app/utility/components/last-edited";
import { TextColor, ChipTextColor } from "@/app/utility/components/chip";

//// 1.4 Utility functions
import firestoreUpdateTopic from "@/app/utility/firestore/firestore-manager-topic";
import makeid from "@/app/utility/function/make-id";
import objectKeyDelete from "@/app/utility/function/object/object-dynamic-delete";
import objectKeyValueUpdate from "@/app/utility/function/object/object-dynamic-change";
import sortUidObjectByValue from "@/app/utility/function/object/sort-uid-object-by-value";
import { stringToRgb } from "@/app/utility/function/color/string-to-rgb";

//// 1.5 Public and others
import Icon from "@/public/icon";
// =========================================================================


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
//// N/A
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION

export default function EditView ({
    courseData,
    topicData,
    libraryData
}: {
    courseData: Course,
    topicData: {[key: string]: {[key: string]: any}},
    libraryData: {[key: string]: Library}
}): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/[quiz]/*
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();

    ////// A.III useState storing buffer data (duplicate of original data for live editing)
    const [bufferTopicData, setBufferTopicData] = useState(topicData);

    console.log(bufferTopicData);

    ////// A.IV useState storing search key for library
    const [searchLibraryKey, setSearchLibraryKey] = useState("");

    ////// A.V useState storing uid of library for linking to topic resource data
    const [topicUidToLinkLibrary, setTopicUidToLinkLibrary] = useState("");
    
    ////// A.VI useState refering last edited topic uid
    const [lastEditUid, setLastEditUid] = useState("");
    
    ////// A.VII useRef storing elements reference
    const elementsRef: {[key: string]: any} = useRef({});

    ////// A.VIII useState pointing ref of element for scrolling
    const [targetUidScroll, setTargetUidScroll] = useState("");

    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// B.I Default useEffect to set variables action onload
    useEffect(() => {
        setInterfaceParams("currentSectionUid", "");
        setInterfaceParams("currentTopicUid", "");
        setInterfaceParams("discardChangesToggle", false);
        setGlobalParams("popUpConfirm", false);
        setGlobalParams("popUpAction", "");
    }, []);

    ////// B.II Function and useEffect for scrolling to target ref [A.VII & A.VIII]
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

    //// -------------------------------------------------------------------------

    ////// B.III useEffect: discards all changes if toggled
    useEffect(() => {
    if (interfaceParams.discardChangesToggle && 
        globalParams.popUpConfirm &&
        (globalParams.popUpAction === "discardChangesToggle")) {
        setBufferTopicData(topicData);
        setInterfaceParams("discardChangesToggle", false);
        setGlobalParams("popUpConfirm", false);
        setGlobalParams("popUpAction", "");
    }
    }, [globalParams.popUpConfirm]);

    ////// B.IV useEffect: saves all changes if toggled
    useEffect(() => {
    if (interfaceParams.saveChangesToggle &&
        globalParams.popUpConfirm &&
        (globalParams.popUpAction == "saveChangesToggle")) {
            setGlobalParams("isLoading", true);
            firestoreUpdateTopic({
                firebaseBranch: "ALPHA",
                collectionName: "topic",
                originalData: topicData, 
                editedData: bufferTopicData
            });
            firestoreUpdateTopic({
                firebaseBranch: "BETA",
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

    //// -------------------------------------------------------------------------

    ////// B.V Function to add new topic content
    //////// 1. contentCard
    const handleAddTopicContentCard = (): void => {
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

    //////// 2. quizBanner
    const handleAddTopicQuizBanner = (): void => {
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

    //////// 3. quizCard
    const handleAddTopicQuizCard = (): void => {
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

    //// -------------------------------------------------------------------------

    ////// B.VI Function to dynamically update object data
    const handleObjectKeyValueUpdate = ({
        keysHierachy, // [key_1, key_2, key_3, ..., key_n]
        targetValue // Newly assigned value of key_n
    }: {
        keysHierachy: string[],
        targetValue: any
    }) => {
        try {
            setBufferTopicData((prev) => objectKeyValueUpdate({
                object: prev,
                keysHierachy: keysHierachy,
                targetValue:  targetValue
            }) as typeof prev)
        } catch (error) {null}
    }

    ////// B.VII Function to dynamically delete object data
    const handleObjectKeyDelete = ({
        keysHierachy, // [key_1, key_2, key_3, ..., key_n]
        keyToDelete // Newly assigned value of key_n
    }: {
        keysHierachy: string[],
        keyToDelete: string
    }) => {
        try {
            setBufferTopicData((prev) => objectKeyDelete({
                object: prev,
                keysHierachy: keysHierachy,
                keyToDelete:  keyToDelete
            }) as typeof prev)
        } catch (error) {null}
    }

    //// -------------------------------------------------------------------------

    ////// B.VIII Function to handle linking library uid to topic resource content
    const handleTopicUidToLinkLibrary = (libraryUid: string) => {
        if (topicUidToLinkLibrary !== "") {
            handleObjectKeyValueUpdate({keysHierachy: [topicUidToLinkLibrary, "topicData", "quizUid"], targetValue: libraryUid});
            setTopicUidToLinkLibrary("");
            setTargetUidScroll(topicUidToLinkLibrary);
            setLastEditUid(topicUidToLinkLibrary);
        }
    }


    //// -------------------------------------------------------------------------
    //// C. DATA PROCESSING
    //// -------------------------------------------------------------------------

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
                {/* <td key={index + "3"}>{library.mode}</td> */}
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
                    <TextColor chipText={topic.topicId} fontWeight={900} textColor={stringToRgb(section.sectionId, globalParams.theme)} />
                    <span className="font-semibold text-nowrap overflow-hidden">{topic.topicName}</span>
                </button>
            )
        });

        elementAsideSection.push(
            <div className="flex flex-col mb-4" key={"Aside_" + sectionUid}>
                <div className="flex flex-row px-2 py-2 gap-2 section-center text-left -hover-bg-active">
                <ChipTextColor chipText={section.sectionId} fontWeight={900} textColor={stringToRgb(section.sectionId, globalParams.theme)} />
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
                                <textarea rows={1} cols={8} onChange={e => handleObjectKeyValueUpdate({keysHierachy: [topicContentUid, "topicData", "content", contentUid, "subTopic"], targetValue: e.target.value})}
                                    className="editor-field w-80 mr-8" value={content.subTopic}></textarea>
                                <textarea rows={1} cols={4} onChange={e => handleObjectKeyValueUpdate({keysHierachy: [topicContentUid, "topicData", "content", contentUid, "description"], targetValue: e.target.value})}
                                    className="editor-field w-[540px] mr-8" value={content.description}></textarea>
                                <button
                                    onClick={() => handleObjectKeyDelete({keysHierachy: [topicContentUid, "topicData", "content"], keyToDelete: contentUid})}
                                    className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border -button-hover-red font-bold">
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
                                <textarea rows={1} cols={8} onChange={e => handleObjectKeyValueUpdate({keysHierachy: [topicContentUid, "topicData", "resource", resourceUid, "name"], targetValue: e.target.value})}
                                    className="editor-field w-40 mr-8" value={resource.name}></textarea>
                                <textarea rows={1} cols={4} onChange={e => handleObjectKeyValueUpdate({keysHierachy: [topicContentUid, "topicData", "resource", resourceUid, "description"], targetValue: e.target.value})}
                                    className="editor-field w-40 mr-8" value={resource.description}></textarea>
                                <textarea rows={1} cols={4} onChange={e => handleObjectKeyValueUpdate({keysHierachy: [topicContentUid, "topicData", "resource", resourceUid, "url"], targetValue: e.target.value})}
                                    className="editor-field w-72 mr-8" value={resource.url}></textarea>
                                <Icon icon={resource.icon} size={16}/>
                                <textarea rows={1} cols={4} onChange={e => handleObjectKeyValueUpdate({keysHierachy: [topicContentUid, "topicData", "resource", resourceUid, "icon"], targetValue: e.target.value})}
                                    className="editor-field w-40 ml-2 mr-8" value={resource.icon}></textarea>
                                <button
                                    onClick={() => handleObjectKeyDelete({keysHierachy: [topicContentUid, "topicData", "resource"], keyToDelete: resourceUid})}
                                    className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border -button-hover-red font-bold">
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
                                <ChipTextColor chipText="CONTENT CARD" chipIcon="table" fontWeight={900} chipBackgroundOpacity={0.1} paddingY={4} />
                                {(lastEditUid === topicContentUid) && <LastEdited />}
                                <div className="w-full -border-b"></div>
                                <button onClick={() => handleObjectKeyDelete({keysHierachy: [], keyToDelete: topicContentUid})}
                                    className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border -button-hover-red font-bold">
                                    <Icon icon="trash" size={16} />
                                    <span className="text-nowrap">DELETE QUIZ BANNER</span>
                                </button>
                            </div>
                            <div className="px-6 flex flex-col gap-8" key={index}>
                                <div className="flex flex-col overflow-x-auto">
                                    {/* Resource editor */}
                                    <div style={{minWidth: "1000px"}} className="flex flex-row items-center font-bold text-nowrap p-2 -border-b rounded-t-xl -hover-bg-active">
                                        <span className="w-40 mr-8">Resource Name</span>
                                        <span className="w-40 mr-8">Description</span>
                                        <span className="w-72 mr-8">URL</span>
                                        <span className="w-40 mr-8">Display icon</span>
                                        <button
                                            onClick={() => {
                                                const newUidII = makeid(length=20);
                                                handleObjectKeyValueUpdate({keysHierachy: [topicContentUid, "topicData", "resource", newUidII, "name"], targetValue: ""})
                                                handleObjectKeyValueUpdate({keysHierachy: [topicContentUid, "topicData", "resource", newUidII, "description"], targetValue: ""})
                                                handleObjectKeyValueUpdate({keysHierachy: [topicContentUid, "topicData", "resource", newUidII, "url"], targetValue: ""})
                                                handleObjectKeyValueUpdate({keysHierachy: [topicContentUid, "topicData", "resource", newUidII, "icon"], targetValue: ""})
                                            }}
                                            className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border -button-hover-pri font-bold">
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
                                    <div style={{minWidth: "1000px"}} className="flex flex-row items-center font-bold text-nowrap p-2 -border-b rounded-t-xl -hover-bg-active">
                                        <span className="w-80 mr-8">Subtopic</span>
                                        <span className="w-[540px] mr-8">Description</span>
                                        <button
                                            onClick={() => {
                                                const newUidII = makeid(length=20);
                                                handleObjectKeyValueUpdate({keysHierachy: [topicContentUid, "topicData", "content", newUidII, "subTopic"], targetValue: ""})
                                                handleObjectKeyValueUpdate({keysHierachy: [topicContentUid, "topicData", "content", newUidII, "description"], targetValue: ""})
                                            }}
                                            className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border -button-hover-pri font-bold">
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
                            <ChipTextColor chipText="QUIZ BANNER" chipIcon="tag" fontWeight={900} chipBackgroundOpacity={0.1} paddingY={4} />
                            {(lastEditUid === topicContentUid) && <LastEdited />}
                            <div className="w-full -border-b"></div>
                            <button onClick={() => handleObjectKeyDelete({keysHierachy: [], keyToDelete: topicContentUid})}
                                className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border -button-hover-red font-bold">
                                <Icon icon="trash" size={16} />
                                <span className="text-nowrap">DELETE CONTENT CARD</span>
                            </button>
                        </div>
                    );

                    elementTopic.quizBanner.push(
                        <button onClick={() => setTopicUidToLinkLibrary(topicContentUid)} key={"Editor_" + index}
                            className="-hover-bg flex flex-row justify-center items-center gap-2 mx-6 mb-4 px-2 py-2 rounded-[8px] -border -button-hover-pri font-bold">
                            <Icon icon="tool" size={16} />
                            <span className="text-lg text-nowrap">CHOOSE REFERENCE LIBRARY</span>
                        </button>
                    );

                    try {
                        const topicLibrary = libraryData[topicContent.topicData.quizUid];
                        elementTopic.quizBanner.push(
                            <div className={`relative overflow-hidden mx-6 -hover-bg -border rounded-xl flex flex-col ${(topicLibrary.image) && "text-white"}`} key={"Display_" + index}>
                                <div className='w-full p-4 z-10'>
                                    <ChipTextColor chipText="TOPIC PRACTICE" textStringForColor="Q" />
                                    <h4 className="max-h-[48px] overflow-hidden mt-2 font-black">{topicLibrary.name.toLocaleUpperCase()}</h4>
                                    <p className='max-h-[36px] overflow-hidden mt-8 font-semibold'>{topicLibrary.description}</p>
                                    <div className="flex flex-row justify-between items-center w-full mt-4">
                                        <div className='flex flex-row items-center'>
                                            <h5 className="flex flex-row gap-1 px-2 py-1 -hover-bg-active rounded-xl">{topicLibrary.id}</h5>
                                        </div>
                                        <h5 className='ml-1'>{`${topicLibrary.questionUidOrder.length} QUESTION${(topicLibrary.questionUidOrder.length > 1) ? "S" : ""}`}</h5>
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
                            <div className="card mx-6 rounded-md relative flex flex-row justify-center items-center text-center gap-4 color-slate" key={"Display_" + index}>
                                <Icon icon="false" size={32} />
                                <h1>LIBRARY IS UNAVALIABLE</h1>
                            </div>
                        );
                    }
                }

                // quizCard on bottom
                if (topicContent.contentType === "quizCard") {
                    elementTopic.quizCard.push(
                        <div className="px-6 py-4 my-8 flex flex-row gap-4 w-full items-center justify-center -hover-bg-active" key={"Header_" + index}
                            ref={(element) => {elementsRef.current[topicContentUid] = element}}>
                            <ChipTextColor chipText="QUIZ CARD" chipIcon="tag" fontWeight={900} chipBackgroundOpacity={0.1} paddingY={4} />
                            {(lastEditUid === topicContentUid) && <LastEdited />}
                            <div className="w-full -border-b"></div>
                            <button onClick={() => handleObjectKeyDelete({keysHierachy: [], keyToDelete: topicContentUid})}
                                className="flex flex-row justify-center items-center gap-2 h-[30px] px-2 py-1 ml-auto rounded-[8px] -border -button-hover-red font-bold">
                                <Icon icon="trash" size={16} />
                                <span className="text-nowrap">DELETE QUIZ CARD</span>
                            </button>
                        </div>
                    );

                    elementTopic.quizCard.push(
                        <button onClick={() => setTopicUidToLinkLibrary(topicContentUid)} key={"Editor_" + index}
                            className="-hover-bg flex flex-row justify-center items-center gap-2 mx-6 mb-4 px-2 py-2 rounded-[8px] -border -button-hover-pri font-bold">
                            <Icon icon="tool" size={16} />
                            <span className="text-lg text-nowrap">CHOOSE REFERENCE LIBRARY</span>
                        </button>
                    );

                    try {
                        const topicLibrary = libraryData[topicContent.topicData.quizUid];
                        elementTopic.quizCard.push(
                            <div className={`relative overflow-hidden mx-6 -hover-bg -border rounded-xl flex flex-col ${(topicLibrary.image) && "text-white"}`} key={"Display_" + index}>
                                <div className='w-full p-4 z-10'>
                                    <ChipTextColor chipText="PRACTICE" textStringForColor="Q" />
                                    <h4 className="max-h-[48px] overflow-hidden mt-2 font-black">{topicLibrary.name.toLocaleUpperCase()}</h4>
                                    <p className='max-h-[36px] overflow-hidden mt-8 font-semibold'>{topicLibrary.description}</p>
                                    <div className="flex flex-row justify-between items-center w-full mt-4">
                                        <div className='flex flex-row items-center'>
                                            <h5 className="flex flex-row gap-1 px-2 py-1 -hover-bg-active rounded-xl">{topicLibrary.id}</h5>
                                        </div>
                                        <h5 className='ml-1'>{`${topicLibrary.questionUidOrder.length} QUESTION${(topicLibrary.questionUidOrder.length > 1) ? "S" : ""}`}</h5>
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
                            <div className="card mx-6 rounded-md relative flex flex-row justify-center items-center text-center gap-4 color-slate" key={"Display_" + index}>
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
                        onClick={() => handleAddTopicContentCard()}
                        className="controller-menu">
                        <Icon icon="add" size={16} />
                        <p>ADD CONTENT CARD</p>
                    </button>}
                    {(topicUidToLinkLibrary === "") && <button
                        onClick={() => handleAddTopicQuizBanner()}
                        className="controller-menu">
                        <Icon icon="add" size={16} />
                        <p>ADD QUIZ BANNER</p>
                    </button>}
                    {(topicUidToLinkLibrary === "") && <button
                        onClick={() => handleAddTopicQuizCard()}
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
                        className="controller-menu color-amber">
                        <Icon icon="xCircle" size={16} />
                        <p>CANCEL</p>
                    </button>}
                </div>

                {/* Editing & display interface */}
                {((searchLibraryKey === "") && (topicUidToLinkLibrary === ""))
                    ? <div className="flex flex-col h-full overflow-y-auto">
                        <div className="flex flex-row items-center px-4 py-4 gap-4 section-center text-left -hover-bg-active">
                        <ChipTextColor chipText={section.sectionId} fontWeight={900} textColor={stringToRgb(section.sectionId, globalParams.theme)} />
                            <h3 className="font-semibold text-nowrap overflow-hidden">{section.sectionName}</h3>
                        </div>
                        <div className="flex flex-row items-center px-4 py-4 gap-4 section-center text-left -border-b">
                        <ChipTextColor chipText={topic.topicId} fontWeight={900} textColor={stringToRgb(section.sectionId, globalParams.theme)} chipBackgroundOpacity={0.1} />
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
                                    {/* <th>Mode</th> */}
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
            <div className="my-auto color-slate flex flex-col justify-center items-center text-center" key="blank">
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
                    <h2 className="m-4">{courseData.name.toLocaleUpperCase()}</h2>
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
            <div key={interfaceParams.themeToggle ? "A" : "B"} className="fixed bottom-0 w-dvw h-dvh z-[-100]">
                <img src={courseData.image} alt="" className="absolute h-full w-full z-[-100]" />
                <div className={`absolute h-full w-full z-[-90] ${interfaceParams.themeToggle ? "bg-white/[0.95] dark:bg-black/[0.87]" : "bg-highlight/90 dark:bg-highlight-dark/90"}`}></div>
                <div className="glass-cover-spread z-[-80]"></div>
            </div>
        </div>
    );
}
// =========================================================================


// =========================================================================
// 4. LOCAL COMPONENTS
// =========================================================================


