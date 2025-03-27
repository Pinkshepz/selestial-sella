"use client";

import { useEffect } from "react";

import { useGlobalContext } from "@/app/global-provider";
import { useInterfaceContext } from "../topic-provider";

import sortUidObjectByValue from "@/app/libs/function/sort-uid-object-by-value";
import Icon from "@/public/icon";

export default function LogUpdate ({
    courseData
}: {
    courseData: {[key: string]: any}
}): React.ReactNode {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // connect to interface context
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();

    useEffect(() => {
        setGlobalParams("isLoading", false);
    }, []);

    // Get all topic from courseData
    let topicNameList: {[key: string]: string} = {};
    let topicIdList: {[key: string]: string} = {};

    Object.keys(courseData.section).map((sectionUid) => {
        Object.keys(courseData.section[sectionUid].sectionTopics).map((topicUid) => {
            topicNameList[topicUid] = courseData.section[sectionUid].sectionTopics[topicUid].topicName;
            topicIdList[topicUid] = courseData.section[sectionUid].sectionTopics[topicUid].topicId;
        })
    });

    const log: {[key: string]: {[key: string]: any}} = interfaceParams.logUpdate;

    // Filter by search key
    let filteredContent: {[key: string]: {[key: string]: any}} = {};
    for (let index = 0; index < Object.values(log).length; index++) {
        // Each content data
        const content: {[key: string]: any} = Object.values(log)[index];
        // Create combination of all content information for search target
        const search_target = content.action + " " + content.id + " " + content.name;

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
        filteredContent[Object.keys(log)[index]] = content;
        }
    };

    const sortedFilteredContentData: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(
        filteredContent, "id", interfaceParams.sortAscending
    );
    
    let tableContent: React.ReactNode[] = [];

    const actionMap = {
        WRITE: "text-pri dark:text-pri-dark",
        EDIT: "text-amber dark:text-amber-dark",
        DELETE: "text-sec dark:text-sec-dark",
        REMAIN: "text-ter dark:text-ter-dark"
    };

    Object.values(sortedFilteredContentData).map((log, index) => {
        const uid: string = Object.keys(filteredContent)[index];
        tableContent.push(
            <tr key={index}>
                <td key={uid + "1"}>{uid}</td>
                <td className={"font-bold " + actionMap[log.action.toLocaleUpperCase() as keyof typeof actionMap]}
                    key={uid + "2"}>{log.action.toLocaleUpperCase()}</td>
                <td key={uid + "3"}>{topicIdList[log.topicUid]}</td>
                <td key={uid + "4"}>{topicNameList[log.topicUid]}</td>
                <td className="font-bold" key={uid + "5"}>{log.type}</td>
                <td key={uid + "6"}>{log.error}</td>
            </tr>
        );
    });

    return (
        <section className="flex flex-col justify-center items-center">
                <h1>Server log summary</h1>
                <table className="theme-table m-12">
                    <thead key={"head"}>
                        <tr>
                            <th>UID</th>
                            <th>Action</th>
                            <th>Topic Id</th>
                            <th>Topic name</th>
                            <th>Content type</th>
                            <th>Error</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            <button
                onClick={() => {
                    setInterfaceParams("logUpdate", {});
                    setGlobalParams("isLoading", true);
                    if (window !== undefined) {
                        window.location.reload();
                    }
                }}
                className="fixed bottom-16 left-0 right-0 mx-auto"
                id="theme-button">
                <Icon icon="out" size={24}></Icon>
                Back to course
            </button>
        </section>
    );
}
