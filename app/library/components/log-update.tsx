"use client";

//// 1.1 Metadata & module & framework
import { useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useLocalLibraryContext } from "@/app/library/local-library-provider";

//// 1.3 React components
////     N/A

//// 1.4 Utility functions
import sortUidObjectByValue from "@/app/utility/function/object/sort-uid-object-by-value";

//// 1.5 Public and others
import Icon from "@/public/icon";


export default function LogUpdate (): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/course/*
    const {localLibraryContextParams, setLocalLibraryContextParams} = useLocalLibraryContext();


    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// B.I Turn off loading cover
    useEffect(() => {
        setGlobalParams("isLoading", false);
    }, []);

    
    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------
    const log: {[key: string]: {[key: string]: any}} = localLibraryContextParams.logUpdate;

    // Filter by search key
    let filteredContent: {[key: string]: {[key: string]: any}} = {};
    for (let index = 0; index < Object.values(log).length; index++) {
        // Each content data
        const content: {[key: string]: any} = Object.values(log)[index];
        // Create combination of all content information for search target
        const search_target = content.action + " " + content.id + " " + content.name;

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(localLibraryContextParams.searchKey.toLowerCase())) {
        filteredContent[Object.keys(log)[index]] = content;
        }
    };

    const sortedFilteredContentData: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(
        filteredContent, "id", localLibraryContextParams.sortAscending
    );
    
    let tableContent: React.ReactNode[] = [];

    const actionMap = {
        WRITE: "color-pri",
        EDIT: "color-amber",
        DELETE: "color-red",
        REMAIN: "color-slate"
    };

    Object.values(sortedFilteredContentData).map((log, index) => {
        const uid: string = Object.keys(filteredContent)[index];
        tableContent.push(
            <tr key={uid}>
                <td key={uid + "1"}>{uid}</td>
                <td className={"font-bold " + actionMap[log.action.toLocaleUpperCase() as keyof typeof actionMap]}
                    key={uid + "2"}>{log.action.toLocaleUpperCase()}</td>
                <td className="font-bold" key={uid + "3"}>{log.id}</td>
                <td key={uid + "4"}>{log.name}</td>
                <td key={uid + "5"}>{log.error}</td>
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
                            <th>ID</th>
                            <th>Name</th>
                            <th>Error</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            <button
                onClick={() => {
                    setLocalLibraryContextParams("logUpdate", {});
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
