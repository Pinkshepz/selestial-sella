"use client";

import { useGlobalContext } from "../provider";

export default function Loading (): React.ReactNode {
    // access global data
    const {globalParams, setGlobalParams} = useGlobalContext();

    if (globalParams.isLoading) {
        return (
            <section aria-label="loading" className="glass-cover-screen flex flex-col justify-center items-center">
                <h1 className="text-black dark:text-white">Loading...</h1>
            </section>
        );
    }
}
