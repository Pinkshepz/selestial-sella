"use client";

import "@/app/styles/loading.css";

import { useGlobalContext } from "../../global-provider";

export default function Loading (): React.ReactNode {
    // access global data
    const {globalParams, setGlobalParams} = useGlobalContext();

    if (globalParams.isLoading) {
        return (
            <section aria-label="loading" className="absolute top-0 left-0 z-[1000] h-dvh w-dvw glass-cover-screen flex flex-col justify-center items-center">
                <div className="loader"></div>
                <h1 className="mt-8 text-black dark:text-white">Loading</h1>
            </section>
        );
    }
}
