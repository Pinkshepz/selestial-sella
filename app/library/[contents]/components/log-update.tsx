"use client";

//// 1.1 Metadata & module & framework
import { useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useContentInterfaceContext } from "../content-provider";

//// 1.3 React components
////     N/A

//// 1.4 Utility functions
////     N/A

//// 1.5 Public and others
import Icon from "@/public/icon";


export default function LogUpdate () {

    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // connect to interface context
    const {contentInterfaceParams, setContentInterfaceParams} = useContentInterfaceContext();

    useEffect(() => {
        setGlobalParams("isLoading", false);
    }, []);

    const log: {[key: string]: {[key: string]: any}} = contentInterfaceParams.logUpdate;

    // Filter by search key
    let filteredContent: {[key: string]: {[key: string]: any}} = {};
    for (let index = 0; index < Object.values(log).length; index++) {
        // Each content data
        const content: {[key: string]: any} = Object.values(log)[index];
        // Create combination of all content information for search target
        const search_target = content.action + " " + content.id + " " + content.name;

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(contentInterfaceParams.searchKey.toLowerCase())) {
        filteredContent[Object.keys(log)[index]] = content;
        }
    };
    
    let tableContent: React.ReactNode[] = [];

    const actionMap = {
        WRITE: "text-pri dark:text-pri-dark",
        EDIT: "text-amber dark:text-amber-dark",
        DELETE: "text-sec dark:text-sec-dark",
        REMAIN: "text-ter dark:text-ter-dark"
    };

    Object.values(filteredContent).map((log, index) => {
        const uid: string = Object.keys(filteredContent)[index];
        tableContent.push(
            <tr key={uid}>
                <td key={uid + "1"}>{uid}</td>
                <td className={"font-bold " + actionMap[log.action.toLocaleUpperCase() as keyof typeof actionMap]}
                    key={uid + "2"}>{log.action.toLocaleUpperCase()}</td>
                <td className="font-bold text-center" key={uid + "3"}>{log.id}</td>
                <td className="font-bold" key={uid + "4"}>{log.name}</td>
                <td key={uid + "5"}>{log.error}</td>
            </tr>
        );
    });

    return (
        <section className="flex flex-col justify-center items-center mt-44 mb-16">
            <h1>Server log summary</h1>
            <table className="theme-table m-12">
                <thead key={"head"}>
                    <tr>
                        <th>UID</th>
                        <th>Action</th>
                        <th>NO.</th>
                        <th>Question</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
            <button
                onClick={() => {
                    setContentInterfaceParams("logUpdate", {});
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
