"use client";

// app/library/components/library-header.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import { useEffect } from "react";
import Link from "next/link";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useLocalLibraryContext } from "@/app/library/local-library-provider";

//// 1.3 React components
import Library, { defaultLibrary } from "@/app/utility/interface/interface-library";
import { ChipTextColor } from "@/app/utility/components/chip";

//// 1.4 Utility functions
import firestoreUpdate from "@/app/utility/firestore/firestore-manager-library";

import { stringToRgb } from "@/app/utility/function/color/string-to-rgb";
import makeid from "@/app/utility/function/make-id";
import objectUidFill from "@/app/utility/function/object/object-uid-fill";
import sortUidObjectByValue from "@/app/utility/function/object/sort-uid-object-by-value";

import objectKeyValueUpdate from "@/app/utility/function/object/object-dynamic-change";
import objectKeyDelete from "@/app/utility/function/object/object-dynamic-delete";

//// 1.5 Public and others
import Icon from "@/public/icon";


export default function LibraryHeader () {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/*
    const {localLibraryContextParams, setLocalLibraryContextParams} = useLocalLibraryContext();

    return (
        <section className="-border-t">
            <h1 className="m-4 pt-4">QUIZ LIBRARY</h1>
            <Link href={{ pathname: "./library/[quiz]" }} as={`/library/${"buffet"}`}
                onClick={() => {
                    setGlobalParams("isLoading", true);
                }}
                className={`-smooth-appear relative overflow-hidden -hover-bg -border rounded-xl relative flex flex-col mx-4 my-8 text-white`}>
                <div className="w-full p-4 z-10">
                    <ChipTextColor chipText="SPECIAL" textStringForColor="K" chipBackgroundOpacity={0.5} />
                    <h3 className="max-h-[52px] overflow-hidden mt-4 font-black">AURICLE BUFFET</h3>
                    <p className="max-h-[36px] overflow-hidden mt-8 font-semibold">Randomly recall questions from every corner of the Auricle</p>
                </div>
                <div className="absolute top-0 w-full overflow-hidden z-0">
                    <img src={"https://cdn.shopify.com/s/files/1/0657/3100/2634/files/papier-peint-bulles-eclat-lumineux-et-couleurs-vives_c97c03dd-94c4-4e8d-8a9c-f973e9176e9c.png?v=1730291372"} alt="" className="h-full w-full object-cover"/>
                    <div className="absolute top-0 h-full w-full bg-black/80"></div>
                    <div className="glass-cover-card"></div>
                </div>
            </Link>
        </section>
    );
}