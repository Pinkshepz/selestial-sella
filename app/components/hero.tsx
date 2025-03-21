"use client";

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
                <h1 id="brand" className="font-bold text-[16vw] text-[16vw] sm:text-[12vw] cursor-default">AURICLE</h1>
                <strong className=" text-[7vw] sm:text-[3vw] text-[4vw] text-center cursor-default">Gargantuan solution of the medical wisdom.</strong>
            </article>
            <article className="absolute top-0 left-0 right-0 h-full w-full">
                <Particles />
            </article>
        </section>
    );
}
