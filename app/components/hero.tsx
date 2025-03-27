"use client";

import metadata from "@/metadata.json";

import { useEffect } from "react";
import { useGlobalContext } from "../global-provider";

import Particles from "./particles";

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
                <strong className=" text-[7vw] sm:text-[3vw] text-[4vw] text-center cursor-default">{metadata.appDescription}</strong>
            </article>
            <article className="absolute top-0 left-0 right-0 h-full w-full">
                <Particles />
            </article>
        </section>
    );
}
