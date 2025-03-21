"use client";

import Link from "next/link";
import { useGlobalContext } from "../global-provider";
import Icon from "@/app/libs/material/icon";

export default function HomeStats ({
    courseCount,
    libraryCount,
    contentCount
}: {
    courseCount: number,
    libraryCount: number,
    contentCount: number
}): React.ReactNode {
    // access global data
    const {globalParams, setGlobalParams} = useGlobalContext();

    return (
        <section className="relative h-[100dvh]">
            <article className="flex flex-col gap-8 w-full px-8 py-8">
                <h1 className="mx-auto mt-12 text-4xl text-center">{"Place where all stars and planets align."}</h1>
                <p className="mx-8 sm:mx-12 lg:mx-24 text-center text-lg color-slate">{"Explore tons of learning materials. Discover collection of documents, external materials and array of practices in each course. Also, all avaliable recall or practice question set are readily accessed in library. Let's make hard topics easy to learn and memorize :D"}</p>
                <div className="flex flex-col sm:flex-row justify-evenly items-center gap-8 my-12">
                    <div className="flex flex-col justify-center items-center gap-4">
                        <h1 className="pixellet text-5xl">{courseCount}</h1>
                        <h2 className="text-center">Avaliable courses</h2>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4">
                        <h1 className="pixellet text-5xl">{libraryCount}</h1>
                        <h2 className="text-center">Question Sets</h2>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4">
                        <h1 className="pixellet text-5xl">{contentCount}</h1>
                        <h2 className="text-center">Practice Questions</h2>
                    </div>
                </div>
            </article>
        </section>
    );
}
