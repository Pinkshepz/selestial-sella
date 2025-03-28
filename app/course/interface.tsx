"use client";

//// 1.1 Metadata & module & framework
import { useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useInterfaceContext } from './course-provider';

//// 1.3 React components
import CardEditor from './components/edit-view';
import CardView from './components/display-card';
import Controller from "./components/controller";
import LogUpdate from './components/log-update';
import TableView from './components/display-table';

import ConfirmPopUp from "@/app/utility/components/confirm-popup";

//// 1.4 Utility functions
import sortUidObjectByValue from '@/app/utility/function/object/sort-uid-object-by-value';

//// 1.5 Public and others
////     N/A


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
