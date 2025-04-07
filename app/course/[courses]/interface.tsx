"use client";

//// 1.1 Metadata & module & framework
import { useEffect } from "react";
import { usePathname } from "next/navigation";

//// 1.2 Custom React hooks
import { useGlobalContext } from "../../global-provider";
import { useInterfaceContext } from './topic-provider';

//// 1.3 React components
import Course from "@/app/utility/interface/interface-course";
import Library from "@/app/utility/interface/interface-library";

import Controller from "./components/controller";
import DisplayView from "./components/display-view";
import EditView from "./components/topic-edit";
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
    courseData: Course,
    topicData: {[key: string]: {[key: string]: any}},
    libraryData: {[key: string]: Library}
}): React.ReactNode {
    
    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/course/[courses]/*
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();
    
    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    const currentPath = usePathname();

    useEffect(() => {
        setGlobalParams("isLoading", false);
        setGlobalParams("latestPath", currentPath);
    }, []);
  
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
