"use client";

import { useState, useEffect } from "react";

import { useGlobalContext } from "@/app/global-provider";
import { useTopicInterfaceContext } from "./topic-provider";

import Icon from "@/public/icon";
import Controller from "./components/controller";
import ConfirmPopUp from "@/app/libs/material/confirm-popup";

import sortUidObjectByValue from "@/app/libs/utils/sort-uid-object-by-value";
import TopicDisplay from "./components/topic-display";

export default function Interface ({
    courseData,
    courseTopicData
}: {
    courseData: {[key: string]: string}, // {library data}
    courseTopicData: {[key: string]: {[key: string]: any}} // {uid: {each question}}
}) {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // Connect to contentInterfaceContext
    const {topicInterfaceParams, setTopicInterfaceParams} = useTopicInterfaceContext();

    // Search bar value
    const [searchKey, setSearchKey] = useState("");

    // Filter by search key
    let filteredContent: {[key: string]: {[key: string]: string}} = {};
    for (let index = 0; index < Object.values(courseTopicData).length; index++) {
        // Each content data
        const content: {[key: string]: string} = Object.values(courseTopicData)[index];
        // Create combination of all content information for search target
        const search_target = content["id"] + " " + content["name"] + " " + content["tag"];

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(topicInterfaceParams.searchKey.toLowerCase())) {
            filteredContent[Object.keys(courseTopicData)[index]] = content;
        }
    }
    
    const sortedFilteredContentData: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(
    filteredContent, "id", topicInterfaceParams.sortAscending
    )

    const ALT_IMAGE = "https://idsb.tmgrup.com.tr/ly/uploads/images/2020/11/11/71386.jpg"

    useEffect(() => {
        setGlobalParams("isLoading", false);
    }, []);

    return (
        <>
            <ConfirmPopUp />
            <main className="relative flex flex-col mt-36 pt-2 mb-16">
                <Controller />
                {/* <TopicDisplay courseTopicData={courseTopicData} /> */}
            </main>
        </>
    );
}
