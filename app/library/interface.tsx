"use client";

import { useEffect } from "react";

import { useGlobalContext } from "../global-provider";

import ConfirmPopUp from "@/app/libs/material/confirm-popup";
import Controller from "./components/controller";
import CourseDisplay from "./components/course-display";

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
            <main className="relative flex flex-col mt-36 mb-16" aria-haspopup={true} aria-disabled={globalParams.popUp}>
                <Controller />
                <h1 className="px-4 mb-12">Miscellaneous Content Library</h1>
                <CourseDisplay contentData={contentData} />
            </main>
        </>
    );
}
