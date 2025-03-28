"use client";

//// 1.1 Metadata & module & framework
import { useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "../../global-provider";
import { useInterfaceContext } from './topic-provider';

//// 1.3 React components
import Controller from "./components/controller";
import DisplayView from "./components/display-view";
import EditView from "./components/edit-view";
import LogUpdate from "./components/log-update";

//// 1.4 Utility functions
import ConfirmPopUp from "@/app/utility/components/confirm-popup";

//// 1.5 Public and others
////     N/A



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
