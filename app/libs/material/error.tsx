"use client";

import Link from "next/link";
import React from "react";
import Icon from "@/public/icon";

const ErrorMessage = ({
    errorMessage, 
    errorCode,
    previousRoute
}: {
    errorMessage: any,
    errorCode: any,
    previousRoute: string
}): React.ReactNode => {
    return (
        <main className="flex flex-col h-[95dvh] px-8 justify-center items-center gap-16">
            <section className="flex flex-col justify-center items-center gap-8">
                <Icon icon="bug" size={99}></Icon>
                <span id="pri-chip">
                    <h2>{errorCode}</h2>
                </span>
                <h2>{errorMessage}</h2>
            </section>
            <section>
                <Link id="theme-button" href={previousRoute}>
                    <Icon icon={"out"} size={28}></Icon>
                    <h4>Go back</h4>
                </Link>
            </section>
        </main>
    );
}

export default ErrorMessage;
