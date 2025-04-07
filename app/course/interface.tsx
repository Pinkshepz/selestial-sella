"use client";

// app/course/interface.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import { useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useLocalCourseContext } from './local-course-provider';

//// 1.3 React components
import Course from "@/app/utility/interface/interface-course";

import CourseEditor from './components/course-edit';
import CardView from './components/display-card';
import Controller from "./components/controller";
import LogUpdate from './components/log-update';
import TableView from './components/display-table';

import ConfirmPopUp from "@/app/utility/components/confirm-popup";

//// 1.4 Utility functions
import sortUidObjectByValue from '@/app/utility/function/object/sort-uid-object-by-value';

//// 1.5 Public and others
////     N/A


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function Interface ({
    courseData
}: {
    courseData: {[key: string]: Course}
}): React.ReactNode {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/course/*
    const {localCourseContextParams, setLocalCourseContextParams} = useLocalCourseContext();
    
    
    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// B.I Turn off loading cover
    useEffect(() => {setGlobalParams("isLoading", false);}, []);


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    ////// C.I Filter by search key
    let filteredContent: {[key: string]: Course} = {};
    for (let index = 0; index < Object.values(courseData).length; index++) {
        // Each content data
        const content = Object.values<Course>(courseData)[index];
        // Create combination of all content information for search target
        const search_target = JSON.stringify(content);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(localCourseContextParams.searchKey.toLowerCase())) {
            filteredContent[Object.keys(courseData)[index]] = content;
        }
    }

    const sortedFilteredContentData = sortUidObjectByValue<Course>(filteredContent, "id", localCourseContextParams.sortAscending)

    return <>
        <ConfirmPopUp />
        <main className="relative flex flex-col pt-36 mb-16">
            <Controller />
            {(Object.keys(localCourseContextParams.logUpdate).length > 0)
                ? <LogUpdate />
                : localCourseContextParams.editMode
                    ? <CourseEditor courseData={courseData} />
                    : localCourseContextParams.displayToggle
                        ? <TableView courseData={sortedFilteredContentData} />
                        : <CardView courseData={sortedFilteredContentData} />}
        </main>
    </>;
}
