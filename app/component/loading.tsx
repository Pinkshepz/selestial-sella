"use client";

import "./loading.css";

import { useGlobalContext } from "../provider";

export default function Loading (): React.ReactNode {
    // access global data
    const {globalParams, setGlobalParams} = useGlobalContext();

    if (globalParams.isLoading) {
        return (
            <section aria-label="loading" className="glass-cover-screen flex flex-col justify-center items-center">
                <div className="loader"></div>
                <h1 className="mt-8 text-black dark:text-white">Please wait...</h1>
            </section>
        );
    }
}
