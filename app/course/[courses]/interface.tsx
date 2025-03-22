"use client";

import { useEffect } from "react";

import { useGlobalContext } from "../../global-provider";
import { useInterfaceContext } from './topic-provider';

import ConfirmPopUp from "@/app/libs/material/confirm-popup";
import Controller from "./components/controller";

import sortUidObjectByValue from '@/app/libs/utils/sort-uid-object-by-value';

import DisplayView from "./components/display-view";

export default function Interface ({
    courseData,
    courseTopicData
}: {
    courseData: {[key: string]: any},
    courseTopicData: {[key: string]: {[key: string]: any}}
}): React.ReactNode {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    useEffect(() => {setGlobalParams("isLoading", false);}, []);

    // connect to interface context
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();
  
    // Filter by search key
    let filteredContent: {[key: string]: {[key: string]: string}} = {};
    for (let index = 0; index < Object.values(courseData).length; index++) {
        // Each content data
        const content: {[key: string]: string} = Object.values(courseData)[index];
        // Create combination of all content information for search target
        const search_target = JSON.stringify(content);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
            filteredContent[Object.keys(courseData)[index]] = content;
        }
    }

    const sortedFilteredContentData: {
        [key: string]: {[key: string]: string}
    } = sortUidObjectByValue(filteredContent, "id", interfaceParams.sortAscending)

    return (
        <>
            <ConfirmPopUp />
            <main className="relative flex flex-col mt-36 mb-16">
                <Controller />
                <DisplayView courseData={courseData} courseTopicData={courseTopicData} />
                {/* {(Object.keys(interfaceParams.logUpdate).length > 0)
                    ? <LogUpdate />
                    : interfaceParams.editMode
                        ? <CardEditor contentData={contentData} />
                        : <DisplayView contentData={sortedFilteredContentData} />} */}
            </main>
        </>
    );
}
