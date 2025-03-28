"use client";

//// 1.1 Metadata & module & framework
import metadata from "@/metadata.json";
import { useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "../global-provider";

//// 1.3 React components
import Particles from "./particles";

//// 1.4 Utility functions

//// 1.5 Public and others


export default function Hero (): React.ReactNode {

    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    useEffect(() => {
        setGlobalParams("isLoading", false);
    }, []);

    return (
        // render hero banner
        <section className="relative h-[100dvh]">
            <article className="flex flex-col h-full w-full justify-center items-center">
                <h1 id="brand" className="font-black text-[16vw] text-[16vw] sm:text-[12vw] cursor-default">{metadata.appName}</h1>
                <strong className="text-[7vw] sm:text-[3vw] text-[4vw] text-center cursor-default">{metadata.appDescription}</strong>
                <strong className="absolute left-10 bottom-10">Version 1.9.30</strong>
            </article>
            <article className="absolute top-0 left-0 right-0 h-full w-full">
                <Particles />
            </article>
        </section>
    );
}
