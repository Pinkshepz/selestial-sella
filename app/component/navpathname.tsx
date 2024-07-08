'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

export default function NavPathName (): React.ReactNode {
    // Provide interactive path displaying on nav. like we use in folder UI

    // Get pathname e.g. ./SIID256/256-X1
    // And split into array ["", "SIID256", "256-X1"]
    let pathnameSplitted: Array<string> = usePathname().split("/");

    // In case we are in home page: ./
    // The array of pathname is ["", ""]
    // It causes bug, so we gonna pop one "" out
    if (pathnameSplitted[1] == "") {
        pathnameSplitted.pop();
    }

    let pathCollection: Array<React.ReactNode> = [];

    let pathNav: string = "";

    for (let index = 1; index < pathnameSplitted.length; index++) {
        pathNav += '/';
        pathNav += pathnameSplitted[index];
        pathCollection.push(
            <span className='flex items-center justify-center mx-1' key={index}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                </svg>
            </span>
        );
        // Set current page pathname as bold
        if (index == pathnameSplitted.length - 1) {
            pathCollection.push(
                <span className="relative text-md font-bold"
                        key={pathnameSplitted[index]}>
                    {pathnameSplitted[index].charAt(0).toLocaleUpperCase() + pathnameSplitted[index].slice(1)}
                </span>
            );
        } else {
            // Set others as interactive link
            pathCollection.push(
                <span className="-button-line relative text-md"
                        key={pathnameSplitted[index]}>
                    <Link href={pathNav} key={`link ${pathnameSplitted[index]}`}>
                        {pathnameSplitted[index].charAt(0).toLocaleUpperCase() + pathnameSplitted[index].slice(1)}
                    </Link>
                </span>
            );
        }
    }

    return (
        <div className="text-md hidden sm:flex flex-row justify-center items-center" key="navpath">
            {pathCollection}
        </div>
    );
}
