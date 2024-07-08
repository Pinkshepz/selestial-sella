"use client";

import { useGlobalContext } from "../provider";

import ConfirmPopUp from "@/app/component/confirm-popup";
import Controller from "./component/controller";
import CourseDisplay from "./component/course-display";

export default function Interface ({
    contentData
}: {
    contentData: {[key: string]: {[key: string]: any}},
}) {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    return (
        <>
            <ConfirmPopUp />
            <main className="relative flex flex-col mt-36 pt-2" aria-haspopup={true} aria-disabled={globalParams.popUp}>
                <Controller />
                <CourseDisplay contentData={contentData} />
            </main>
        </>
    );
}
