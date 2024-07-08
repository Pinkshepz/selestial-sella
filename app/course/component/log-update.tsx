"use client";

import { useRouter } from "next/navigation";

import { useInterfaceContext } from "../provider";
import Icon from "@/public/icon";

export default function LogUpdate () {

    // connect to interface context
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();

    const log: {[key: string]: string[]} = interfaceParams.logUpdate;

    // Filter by search key
    let filteredContent: {[key: string]: {[key: string]: any}} = {};
    for (let index = 0; index < Object.values(log).length; index++) {
        // Each content data
        const content: {[key: string]: any} = Object.values(log)[index];
        // Create combination of all content information for search target
        const search_target = content[0] + " " + content[1] + " " + content[2];

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
        filteredContent[Object.keys(log)[index]] = content;
        }
    }

    const router = useRouter();
    
    let tableContent: React.ReactNode[] = [];

    Object.values(filteredContent).map((log, index) => {
        const uid: string = Object.keys(filteredContent)[index];
        tableContent.push(
            <tr key={uid}>
                <td key={uid + "1"}>{uid}</td>
                <td key={uid + "2"}>{log[0].toLocaleUpperCase()}</td>
                <td key={uid + "3"}>{log[1]}</td>
                <td key={uid + "4"}>{log[2]}</td>
            </tr>
        )
    })

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
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            <button
                onClick={() => {
                    setInterfaceParams("logUpdate", {});
                }}
                id="theme-button">
                <Icon icon="out" size={24}></Icon>
                Back to course
            </button>
        </section>
    )
}
