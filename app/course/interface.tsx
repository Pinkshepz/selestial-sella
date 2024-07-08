"use client";

import { useGlobalContext } from "../provider";

import ConfirmPopUp from "@/app/component/confirm-popup";
import Controller from "./component/controller";
import CourseDisplay from "./component/course-display";

const backgroundImageUrl = "https://plus.unsplash.com/premium_photo-1675440682547-d3be56f91621?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c25vdyUyMGZvcmVzdHxlbnwwfHwwfHx8MA%3D%3D";

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
            <main className="relative flex flex-col mt-44 sm:mt-36 pt-4 sm:pt-2" aria-haspopup={true} aria-disabled={globalParams.popUp}>
                <Controller />
                <CourseDisplay contentData={contentData} />
            </main>
            <div className="glass-cover z-[-100]"></div>
            <img className="background-image" src={backgroundImageUrl} alt="" />
        </>
    );
}
