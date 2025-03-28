"use client";

//// 1.1 Metadata & module & framework
import { useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "../global-provider";

//// 1.3 React components
import Controller from "./components/controller";
import CourseDisplay from "./components/course-display";

import ConfirmPopUp from "@/app/utility/components/confirm-popup";

//// 1.4 Utility functions
////     N/A

//// 1.5 Public and others
////     N/A


export default function Interface ({
    contentData
}: {
    contentData: {[key: string]: {[key: string]: any}},
}) {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    useEffect(() => {
        setGlobalParams("isLoading", false);
    }, []);

    return (
        <>
            <ConfirmPopUp />
            <main className="relative flex flex-col pt-36 mb-16" aria-haspopup={true} aria-disabled={globalParams.popUp}>
                <Controller />
                <CourseDisplay contentData={contentData} />
            </main>
        </>
    );
}
