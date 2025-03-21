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
            <main className="relative flex flex-col mt-36 pt-2 mb-16">
                <Controller />
                <CourseDisplay contentData={contentData} />
            </main>
        </>
    );
}
