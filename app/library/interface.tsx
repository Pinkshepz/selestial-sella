"use client";

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import { useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useLocalLibraryContext } from "@/app/library/local-library-provider";

//// 1.3 React components
import Library from "@/app/utility/interface/interface-library";

import LibraryEditor from './components/library-edit';
import CardView from './components/library-display-card';
import Controller from "./components/controller";
import LogUpdate from './components/log-update';
import TableView from './components/library-display-table';

import ConfirmPopUp from "@/app/utility/components/confirm-popup";

//// 1.4 Utility functions
import sortUidObjectByValue from '@/app/utility/function/object/sort-uid-object-by-value';

//// 1.5 Public and others
////     N/A


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function Interface ({
    libraryData
}: {
    libraryData: {[key: string]: Library}
}): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/*
    const {localLibraryContextParams, setLocalLibraryContextParams} = useLocalLibraryContext();
    

    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// B.I Turn off loading cover
    useEffect(() => {setGlobalParams("isLoading", false);}, []);
    


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    ////// C.I Filter by search key
    let filteredContent: {[key: string]: Library} = {};
    for (let index = 0; index < Object.values(libraryData).length; index++) {
        // Each content data
        const content = Object.values<Library>(libraryData)[index];
        // Create combination of all content information for search target
        const search_target = JSON.stringify(content);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(localLibraryContextParams.searchKey.toLowerCase())) {
            filteredContent[Object.keys(libraryData)[index]] = content;
        }
    }

    const sortedFilteredContentData = sortUidObjectByValue<Library>(filteredContent, "id", localLibraryContextParams.sortAscending)

    return <>
        <ConfirmPopUp />
        <main className="relative flex flex-col pt-36 mb-16">
            <Controller />
            {(Object.keys(localLibraryContextParams.logUpdate).length > 0)
                ? <LogUpdate />
                : localLibraryContextParams.editMode
                    ? <LibraryEditor libraryData={libraryData} />
                    : localLibraryContextParams.displayToggle
                        ? <TableView libraryData={sortedFilteredContentData} />
                        : <CardView libraryData={sortedFilteredContentData} />}
        </main>
    </>;
}
