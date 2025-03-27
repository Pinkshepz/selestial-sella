"use client";

import { useEffect } from "react";

import { useGlobalContext } from "../global-provider";
import { useInterfaceContext } from './course-provider';

import ConfirmPopUp from "@/app/libs/components/confirm-popup";
import Controller from "./components/controller";

import sortUidObjectByValue from '@/app/libs/function/sort-uid-object-by-value';

import TableView from './components/display-table';
import CardView from './components/display-card';
import CardEditor from './components/edit-view';
import LogUpdate from './components/log-update';

export default function Interface ({
    contentData
}: {
    contentData: {[key: string]: {[key: string]: any}}
}): React.ReactNode {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    useEffect(() => {setGlobalParams("isLoading", false);}, []);

    // connect to interface context
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();
  
    // Filter by search key
    let filteredContent: {[key: string]: {[key: string]: string}} = {};
    for (let index = 0; index < Object.values(contentData).length; index++) {
        // Each content data
        const content: {[key: string]: string} = Object.values(contentData)[index];
        // Create combination of all content information for search target
        const search_target = JSON.stringify(content);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
            filteredContent[Object.keys(contentData)[index]] = content;
        }
    }

    const sortedFilteredContentData: {
        [key: string]: {[key: string]: string}
    } = sortUidObjectByValue(filteredContent, "id", interfaceParams.sortAscending)

    return (
        <>
            <ConfirmPopUp />
            <main className="relative flex flex-col pt-36 mb-16">
                <Controller />
                {(Object.keys(interfaceParams.logUpdate).length > 0)
                    ? <LogUpdate />
                    : interfaceParams.editMode
                        ? <CardEditor contentData={contentData} />
                        : interfaceParams.displayToggle
                            ? <TableView contentData={sortedFilteredContentData} />
                            : <CardView contentData={sortedFilteredContentData} />}
            </main>
        </>
    );
}
