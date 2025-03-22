"use client";

import { useState, useEffect } from "react";

import { useGlobalContext } from "@/app/global-provider";
import { useInterfaceContext } from "./../topic-provider";

import sortUidObjectByValue from "@/app/libs/utils/sort-uid-object-by-value";
import { stringToRgb } from "@/app/libs/utils/string-to-rgb";
import { TextColor } from "@/app/libs/material/chip";
import Icon from "@/public/icon";

export default function DisplayView ({
    courseData,
    courseTopicData
}: {
    courseData: {[key: string]: any},
    courseTopicData: {[key: string]: {[key: string]: any}}
}): React.ReactNode {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // connect to interface context
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();

    // sort mode for course section
    const [sectionSortAscending, setSectionSortAscending] = useState(true);

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
    for (let index = 0; index < Object.values(courseTopicData).length; index++) {
        // Each content data
        const topicContent: {[key: string]: any} = Object.values(courseTopicData)[index];
        // Create combination of all topicContent information for search target
        const search_target = JSON.stringify(topicContent);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
        filteredTopicContent[Object.keys(courseTopicData)[index]] = topicContent;
        }
    }

    const sortedFilteredTopicData: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(
        filteredTopicContent, "topicId", interfaceParams.sortAscending
    );

    // Render left-side navigator
    let elementAsideSection: Array<React.ReactNode> = [];
    
    Object.values(sortedFilteredSectionData).map((section: typeof courseData.section, index) => {
    
        // Get sectionUid as object key
        const sectionUid = Object.keys(courseData.section)[index];

        let elementAsideSectionTopic: Array<React.ReactNode> = [];

        Object.values(sortUidObjectByValue(section.sectionTopics, "topicId", true)).map((topic: typeof section.sectionTopics, index) => {
            // Get topicUid as object key
            const topicUid = Object.keys(section.sectionTopics)[index];

            elementAsideSectionTopic.push(
                <div className="flex flex-row px-2 py-2 gap-2 section-center text-left hover:bg-black/10 hover:dark:bg-white/10" key={"Aside_" + topicUid}>
                    <TextColor chipText={topic.topicId} fontWeight={900} textColor={stringToRgb(section.sectionId)} />
                    <span className="font-semibold text-nowrap overflow-hidden">{topic.topicName}</span>
                </div>
            )
        });

        elementAsideSection.push(
            <div className="flex flex-col mb-4" key={"Aside_" + sectionUid}>
                <div className="flex flex-row px-2 py-2 gap-2 section-center text-left bg-black/5 dark:bg-white/5 hover:bg-black/10 hover:dark:bg-white/10">
                    <TextColor chipText={section.sectionId} fontWeight={900} />
                    <span className="font-semibold text-nowrap overflow-hidden">{section.sectionName}</span>
                </div>
                <div className="flex flex-col ml-5 border-l border-broder dark:border-border-dark">
                    {elementAsideSectionTopic}
                </div>
            </div>
        );
    });


    // Render right-side main content
    let elementMainSection: Array<React.ReactNode> = [];
    
    Object.values(sortedFilteredSectionData).map((section: typeof courseData.section, index) => {
    
        // Get sectionUid as object key
        const sectionUid = Object.keys(courseData.section)[index];

        let elementMainSectionTopic: Array<React.ReactNode> = [];

        Object.values(sortUidObjectByValue(section.sectionTopics, "topicId", true)).map((topic: typeof section.sectionTopics, index) => {
            // Get topicUid as object key
            const topicUid = Object.keys(section.sectionTopics)[index];

            let elementTopic: Array<React.ReactNode> = [];

            elementTopic.push(
                <div>ABC</div>
            );

            elementMainSectionTopic.push(
                <div className="flex flex-col my-2" key={"Main_" + topicUid}>
                    <div className="flex flex-row items-center px-4 py-2 mb-4 gap-4 section-center text-left">
                        <TextColor chipText={topic.topicId} fontWeight={700} fontSize="1.25rem" textColor={stringToRgb(section.sectionId)} />
                        <h4 className="font-semibold text-nowrap overflow-hidden">{topic.topicName}</h4>
                    </div>
                    <div className="flex flex-col ml-6 pb-6 border-b border-broder/50 dark:border-border-dark/50">
                        {elementTopic}
                    </div>
                </div>
            )
        });

        elementMainSection.push(
            <div className="flex flex-col mb-4" key={"Main_" + sectionUid}>
                <div className="flex flex-row items-center px-2 py-2 gap-2 section-center text-left bg-black/5 dark:bg-white/5">
                    <TextColor chipText={section.sectionId} fontWeight={700} fontSize="1.5rem" />
                    <h3 className="font-semibold text-nowrap overflow-hidden">{section.sectionName}</h3>
                </div>
                <div className="flex flex-col ml-5 border-l border-broder dark:border-border-dark">
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
                <div className="absolute h-full w-full z-[-90] bg-highlight/90 dark:bg-highlight-dark/90"></div>
                <div className="glass-cover-spread z-[-80]"></div>
            </div>
        </div>
    );
}
