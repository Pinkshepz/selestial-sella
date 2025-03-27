"use client";

import { useEffect } from "react";

import { useGlobalContext } from "../../global-provider";
import { useInterfaceContext } from './topic-provider';

import LogUpdate from "./components/log-update";
import ConfirmPopUp from "@/app/libs/components/confirm-popup";
import Controller from "./components/controller";

import DisplayView from "./components/display-view";
import EditView from "./components/edit-view";

export default function Interface ({
    courseData,
    topicData,
    libraryData
}: {
    courseData: {[key: string]: any},
    topicData: {[key: string]: {[key: string]: any}},
    libraryData: {[key: string]: any}
}): React.ReactNode {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    useEffect(() => {setGlobalParams("isLoading", false);}, []);

    // connect to interface context
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();
  
    return (
        <>
            <ConfirmPopUp />
            <main className="relative flex flex-col pt-36 mb-16">
                <Controller />
                {(Object.keys(interfaceParams.logUpdate).length > 0)
                    ? <LogUpdate courseData={courseData} />
                    : interfaceParams.editMode
                        ? <EditView courseData={courseData} topicData={topicData} libraryData={libraryData} />
                        : <DisplayView courseData={courseData} topicData={topicData} libraryData={libraryData} />}
            </main>
        </>
    );
}
