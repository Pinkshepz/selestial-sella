"use client";

//// 1.1 Metadata & module & framework
import { useEffect } from "react";
import Link from "next/link";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider"
import { useLocalCourseContext } from "@/app/course/local-course-provider";

//// 1.3 React components
////     N/A

//// 1.4 Utility functions
////     N/A

//// 1.5 Public and others
import Icon from "@/public/icon";
import makeid from "@/app/utility/function/make-id";


export default function Controller () {
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

    const handleSearchKeyChange = (searchKey: string) => {
        setLocalCourseContextParams("searchKey", searchKey);
    }

    // Manage editing mode on and off
    useEffect(() => {
        if (globalParams.popUpConfirm &&
            (globalParams.popUpAction.toString().includes("turnEditMode"))) {
            setLocalCourseContextParams("editMode", !localCourseContextParams.editMode)
            setGlobalParams("popUpConfirm", false);
            setGlobalParams("popUpAction", "");
        }
    }, [globalParams]);


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    let controllerMenu: React.ReactNode[] = [];

    if (!localCourseContextParams.editMode && (Object.keys(localCourseContextParams.logUpdate).length === 0)) {
        controllerMenu.push(
            <Link
                href={"/"} 
                onClick={() => setGlobalParams("isLoading", true)}
                className="controller-menu -smooth-appear">
                <Icon icon="left" size={16} />
                <p>BACK TO HOME</p>
            </Link>
        );
    
        controllerMenu.push(
            <button
                onClick={() => setLocalCourseContextParams("displayToggle", !localCourseContextParams.displayToggle)}
                className="controller-menu -smooth-appear">
                <Icon icon={localCourseContextParams.displayToggle ? "table" : "image"} size={16} />
                <p>{localCourseContextParams.displayToggle ? "TABLE" : "GALLERY"}</p>
            </button>
        );
    }
        

    controllerMenu.push(
        <div className="controller-menu -smooth-appear">
            <Icon icon="search" size={16} />
            <span className="input-field"
                contentEditable={true} suppressContentEditableWarning={true}
                onInput={e => handleSearchKeyChange(e.currentTarget.textContent!)}>
            </span>
            {!localCourseContextParams.searchKey && <span className="absolute left-[34px] z-[-10] text-sm">SEARCH COURSE</span>}
        </div>
    );
        

    if (Object.keys(localCourseContextParams.logUpdate).length > 0) {
        controllerMenu.push(
            <button
                onClick={() => {
                    setLocalCourseContextParams("logUpdate", {});
                    setGlobalParams("isLoading", true);
                    if (window !== undefined) {
                        window.location.reload();
                    }
                }}
                className="controller-menu -smooth-appear">
                <Icon icon="left" size={16} />
                <p>BACK TO COURSES</p>
            </button>
        )
    }

    if (localCourseContextParams.editMode) {
        controllerMenu.push(
            <button
                onClick={() => setLocalCourseContextParams("sortAscending", !localCourseContextParams.sortAscending)}
                className="controller-menu -smooth-appear">
                <Icon icon="sort" size={16} />
                <p>{localCourseContextParams.sortAscending ? "0 - 9" : "9 - 0"}</p>
            </button>
        );

        controllerMenu.push(
            <button
                onClick={() => setLocalCourseContextParams("addCourseToggle", !localCourseContextParams.addCourseToggle)}
                className="controller-menu -smooth-appear">
                <Icon icon="add" size={16} />
                <p>ADD NEW COURSE</p>
            </button>
        );

        controllerMenu.push(
            <button
                onClick={() => {
                    setGlobalParams("popUpConfirm", false);
                    setLocalCourseContextParams("discardChangesToggle", !localCourseContextParams.discardChangesToggle);
                    setGlobalParams("popUp", true);
                    setGlobalParams("popUpAction", "discardChangesToggle");
                    setGlobalParams("popUpText", "Discard all changes, your course data will be recovered to the original one");
                }}
                className="controller-menu -smooth-appear">
                <Icon icon="trash" size={16} />
                <p>DISCARD CHANGES</p>
            </button>
        );

        controllerMenu.push(
            <button
                onClick={() => {
                    setGlobalParams("popUpConfirm", false);
                    setLocalCourseContextParams("saveChangesToggle", !localCourseContextParams.saveChangesToggle)
                    setGlobalParams("popUp", true);
                    setGlobalParams("popUpAction", "saveChangesToggle");
                    setGlobalParams("popUpText", "Save all recent changes. All data will be permanently updated")
                }}
                className="controller-menu -smooth-appear">
                <Icon icon="save" size={16} />
                <p>SAVE CHANGES</p>
            </button>
        );
    }

    if (Object.keys(localCourseContextParams.logUpdate).length === 0) {
        controllerMenu.push(
            <button
                onClick={() => {
                    setGlobalParams("popUpConfirm", false);
                    setGlobalParams("popUp", true);
                    setGlobalParams("popUpAction", localCourseContextParams.editMode ? "turnEditModeOff" : "turnEditModeOn");
                    setGlobalParams("popUpText", localCourseContextParams.editMode ? 
                        "Turn editing mode off. All unsaved changes will be ignored" : 
                        `Turn editing mode on`)
                }}
                className="controller-menu -smooth-appear">
                <Icon icon={!localCourseContextParams.editMode ? "edit" : "map"} size={16} />
                <p>{localCourseContextParams.editMode ? "EXIT EDIT MODE" : "ENTER EDIT MODE"}</p>
            </button>
        );
    }


    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    return (
        <section className="controller-area">
            <div className="controller-island">
                {controllerMenu}
            </div>
        </section>
    );
}
