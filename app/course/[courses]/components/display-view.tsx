"use client";

//// 1.1 Metadata & module & framework
import Link from "next/link";
import { useState, useRef } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useInterfaceContext } from "./../topic-provider";

//// 1.3 React components
import { TextColor } from "@/app/utility/components/chip";

//// 1.4 Utility functions
import sortUidObjectByValue from "@/app/utility/function/object/sort-uid-object-by-value";
import stringToHex, { stringToRgb } from "@/app/utility/function/color/string-to-rgb";

//// 1.5 Public and others
import Icon from "@/public/icon";


export default function DisplayView ({
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

    // target uid to scroll to after id has been already reset
    const [targetUidScroll, setTargetUidScroll] = useState("");

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

    const sortedFilteredSectionData: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(
        filteredSectionContent, "sectionId", interfaceParams.sortAscending
    );

    // Filter topic data by search key
    let filteredTopicContent: {[key: string]: {[key: string]: any}} = {};
    for (let index = 0; index < Object.values(topicData).length; index++) {
        // Each content data
        const topicContent: {[key: string]: any} = Object.values(topicData)[index];
        // Create combination of all topicContent information for search target
        const search_target = JSON.stringify(topicContent);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
            filteredTopicContent[Object.keys(topicData)[index]] = topicContent;
        }
    }

    // Render left-side navigator
    let elementAsideSection: Array<React.ReactNode> = [];
    
    Object.keys(sortedFilteredSectionData).map((sectionUid, index) => {
    
        // Get individual section data
        const section = courseData.section[sectionUid];

        let elementAsideSectionTopic: Array<React.ReactNode> = [];

        Object.keys(sortUidObjectByValue(section.sectionTopics, "topicId", true)).map((topicUid, index) => {
            // Get individual topic data
            const topic = section.sectionTopics[topicUid];

            elementAsideSectionTopic.push(
                <button onClick={() => scrollToRef(topicUid)}
                    className="flex flex-row px-2 py-2 gap-2 section-center text-left hover:bg-black/10 hover:dark:bg-white/10" key={"Aside_" + topicUid}>
                    <TextColor chipText={topic.topicId} fontWeight={900} textColor={stringToRgb(section.sectionId)} />
                    <span className="font-semibold text-nowrap overflow-hidden">{topic.topicName}</span>
                </button>
            )
        });

        elementAsideSection.push(
            <div className="flex flex-col mb-4" key={"Aside_" + sectionUid}>
                <button onClick={() => scrollToRef(sectionUid)}
                    className="flex flex-row px-2 py-2 gap-2 section-center text-left bg-black/5 dark:bg-white/5 hover:bg-black/10 hover:dark:bg-white/10">
                    <TextColor chipText={section.sectionId} fontWeight={900} />
                    <span className="font-semibold text-nowrap overflow-hidden">{section.sectionName}</span>
                </button>
                <div className="flex flex-col ml-5 border-l border-broder dark:border-border-dark">
                    {elementAsideSectionTopic}
                </div>
            </div>
        );
    });


    // Render right-side main content
    let elementMainSection: Array<React.ReactNode> = [];
    
    Object.keys(sortedFilteredSectionData).map((sectionUid, index) => {
    
        // Get individual section data
        const section = courseData.section[sectionUid];

        let elementMainSectionTopic: Array<React.ReactNode> = [];

        const sortedSectionTopics = sortUidObjectByValue(section.sectionTopics, "topicId", true);

        Object.keys(sortedSectionTopics).map((topicUid, index) => {
            // Get individual topic data
            const topic = section.sectionTopics[topicUid];

            let elementTopic: {[key: string]: Array<React.ReactNode>} = {contentCard: [], quizBanner: [], quizCard: []};

            Object.values(filteredTopicContent).map((topicContent) => {
                // Render topic (match topic data from course and topic collection)
                if (topicContent.topicUid === topicUid) {

                    // contentCard on top
                    if (topicContent.contentType === "contentCard") {
                        try {
                            let elementTopicContent: Array<React.ReactNode> = [];
                            let elementTopicResource: Array<React.ReactNode> = [];

                            Object.keys(topicContent.topicData.content).map((contentUid, index) => {
                                const resource = topicContent.topicData.content[contentUid]
                                elementTopicContent.push(
                                    <article className="p-2" key={index}>
                                        <h5 className="pb-2 border-b border-broder dark:border-border-dark">{resource.subTopic}</h5>
                                        <p className="mt-2 color-slate">{resource.description}</p>
                                    </article>
                                );
                            });

                            Object.keys(topicContent.topicData.resource).map((resourceUid, index) => {
                                const resource = topicContent.topicData.resource[resourceUid]
                                elementTopicResource.push(
                                    <a href={resource.url} target="_blank" className="card rounded-md flex-row justify-center p-2 hover:bg-black/10 hover:dark:bg-white/10" key={index}>
                                        <span className="flex flex-row items-center justify-center px-1" style={{color: stringToHex(section.sectionId)}}><Icon icon={resource.icon} size={24}/></span>
                                        <div className="mx-2">
                                            <h5>{resource.name}</h5>
                                            <p className="color-slate">{resource.description}</p>
                                        </div>
                                    </a>
                                );
                            });

                            let outcomes_columns
                            if (elementTopicContent.length == 1) {
                                outcomes_columns = 'grid grid-cols-1 gap-2';
                            }
                            else if (elementTopicContent.length == 2) {
                                outcomes_columns = 'grid grid-cols-1 lg:grid-cols-2 gap-2';
                            }
                            else if (elementTopicContent.length == 3) {
                                outcomes_columns = 'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2';
                            }
                            else {
                                outcomes_columns = 'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-2';
                            }

                            elementTopic.contentCard.push(
                                <div className="flex flex-col gap-8" key={topicUid}>
                                    <div className="flex flex-wrap gap-4">
                                        {elementTopicResource}
                                    </div>
                                    <div className={outcomes_columns}>
                                        {elementTopicContent}
                                    </div>
                                </div>
                            );
                        } catch (error) {null};
                    }

                    // quizBanner on middle
                    if (topicContent.contentType === "quizBanner") {
                        try {
                            const topicLibrary = libraryData[topicContent.topicData.quizUid];
                            elementTopic.quizBanner.push(
                                <Link href={{ pathname: "./library/[contents]" }} as={`/library/${topicLibrary.id}`}
                                    onClick={() => setGlobalParams("isLoading", true)}
                                    className='-card-hover card rounded-md relative flex flex-col text-white' key={topicUid}>
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
                                </Link>
                            );
                        } catch (error) {null}
                    }

                    // quizCard on bottom
                    if (topicContent.contentType === "quizCard") {
                        try {
                            const topicLibrary = libraryData[topicContent.topicData.quizUid];
                            elementTopic.quizCard.push(
                                <Link href={{ pathname: "./library/[contents]" }} as={`/library/${topicLibrary.id}`}
                                    onClick={() => setGlobalParams("isLoading", true)}
                                    className='-card-hover card rounded-md relative flex flex-col text-white' key={topicUid}>
                                    <div className='w-full p-4 z-10'>
                                        <p className='font-semibold'>PRACTICE</p>
                                        <h3 className="mt-2">{topicLibrary.name.toLocaleUpperCase()}</h3>
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
                                </Link>
                            );
                        } catch (error) {null}
                    }
                }
            })

            elementMainSectionTopic.push(
                <div className="flex flex-col my-2" key={"Main_" + topicUid}
                    ref={(element) => {elementsRef.current[topicUid] = element}}>
                    <div className="flex flex-row items-center px-4 py-2 mb-4 gap-4 section-center text-left">
                        <TextColor chipText={topic.topicId} fontWeight={700} fontSize="1.25rem" textColor={stringToRgb(section.sectionId)} />
                        <h4 className="font-semibold text-nowrap overflow-hidden">{topic.topicName}</h4>
                    </div>
                    <div className="flex flex-col gap-8 ml-6 pb-8 border-b border-broder/50 dark:border-border-dark/50">
                        {elementTopic.contentCard}
                        {elementTopic.quizBanner}
                        <div className="grid xl:grid-cols-2 gap-4">
                            {elementTopic.quizCard}
                        </div>
                    </div>
                </div>
            )
        });

        elementMainSection.push(
            <div className="flex flex-col mb-4" key={"Main_" + sectionUid}
                ref={(element) => {elementsRef.current[sectionUid] = element}}>
                <div className="flex flex-row items-center px-2 py-2 gap-2 section-center text-left bg-black/5 dark:bg-white/5">
                    <TextColor chipText={section.sectionId} fontWeight={700} fontSize="1.5rem" />
                    <h3 className="font-semibold text-nowrap overflow-hidden">{section.sectionName}</h3>
                </div>
                <div className="flex flex-col mx-5 border-l border-broder dark:border-border-dark">
                    {elementMainSectionTopic}
                </div>
            </div>
        );
    });


    return (
        <div>
            <div id="two-cols-fixed" className="border-t border-border dark:border-border-dark">
                <aside aria-label="aside-navigator" id="col-scroll-aside" className="border-r border-border dark:border-border-dark">
                    <strong className="mx-4 mt-4">{`COURSE ${courseData.id} ┇ ${courseData.abbreviation}`}</strong>
                    <h1 className="mx-4">{courseData.name.toLocaleUpperCase()}</h1>
                    <span className="mx-4 mb-8 color-slate">{courseData.description}</span>
                    <div className="flex flex-row items-center px-4 mb-4">
                        <Icon icon="map" size={16} />
                        <h4 className="ml-2">SECTION & TOPICS</h4>
                    </div>
                    <div className="flex flex-col h-max pb-4 overflow-y-auto">
                        {elementAsideSection}
                    </div>
                </aside>
                <section aria-label="main-display" id="col-scroll-main" className="overflow-y-auto">
                    {elementMainSection}
                </section>
            </div>
            <div className="fixed bottom-0 w-dvw h-dvh z-[-100]">
                <img src={courseData.image} alt="" className="absolute h-full w-full z-[-100]" />
                <div className="absolute h-full w-full z-[-90] bg-highlight/95 dark:bg-highlight-dark/90"></div>
                <div className="glass-cover-spread z-[-80]"></div>
            </div>
        </div>
    );
}
