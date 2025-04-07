"use client";

//// 1.1 Metadata & module & framework
import { useEffect } from "react";
import Link from "next/link";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider"
import { useInterfaceContext } from "./../topic-provider";

//// 1.3 React components

//// 1.4 Utility functions

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
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();

    const handleSearchKeyChange = (searchKey: string) => {
        setInterfaceParams("searchKey", searchKey);
    }


    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    // Manage editing mode on and off
    useEffect(() => {
        if (globalParams.popUpConfirm &&
            (globalParams.popUpAction.toString().includes("turnEditMode"))) {
            setInterfaceParams("editMode", !interfaceParams.editMode)
            setGlobalParams("popUpConfirm", false);
            setGlobalParams("popUpAction", "");
        }
    }, [globalParams]);

    return (
        <section className="controller-area">
            <div className="controller-island">

                {!interfaceParams.editMode && (Object.keys(interfaceParams.logUpdate).length === 0) &&
                    <Link
                        href={"/course"}
                        onClick={() => setGlobalParams("isLoading", true)}
                        className="controller-menu -smooth-appear">
                        <Icon icon="left" size={16} />
                        <p>BACK TO COURSES</p>
                    </Link>
                }

                {(Object.keys(interfaceParams.logUpdate).length > 0) &&
                    <button
                        onClick={() => {
                            setInterfaceParams("logUpdate", {});
                            setGlobalParams("isLoading", true);
                            if (window !== undefined) {
                                window.location.reload();
                            }
                        }}
                        className="controller-menu -smooth-appear">
                        <Icon icon="left" size={16} />
                        <p>BACK TO COURSE</p>
                    </button>
                }

                {!interfaceParams.editMode &&
                    <button
                        onClick={() => setInterfaceParams("sortAscending", !interfaceParams.sortAscending)}
                     className="controller-menu -smooth-appear">
                        <Icon icon="sort" size={16} />
                        <p>{interfaceParams.sortAscending ? "0 - 9" : "9 - 0"}</p>
                    </button>
                }

                <div className="controller-menu -smooth-appear">
                    <Icon icon="search" size={16} />
                    <span className="input-field"
                        contentEditable={true} suppressContentEditableWarning={true}
                        onInput={e => handleSearchKeyChange(e.currentTarget.textContent!)}>
                    </span>
                    {!interfaceParams.searchKey && <span className="absolute left-[34px] z-[-10] text-sm">SEARCH TOPIC</span>}
                </div>

                {interfaceParams.editMode && 
                    <button
                        onClick={() => {
                            setGlobalParams("popUpConfirm", false);
                            setInterfaceParams("discardChangesToggle", !interfaceParams.discardChangesToggle);
                            setGlobalParams("popUp", true);
                            setGlobalParams("popUpAction", "discardChangesToggle");
                            setGlobalParams("popUpText", "Discard all changes, your course data will be recovered to the original one");
                        }}
                        className="controller-menu -smooth-appear">
                        <Icon icon="trash" size={16} />
                        <p>DISCARD CHANGES</p>
                    </button>
                }

                {interfaceParams.editMode && 
                    <button
                    onClick={() => {
                        setGlobalParams("popUpConfirm", false);
                        setInterfaceParams("saveChangesToggle", !interfaceParams.saveChangesToggle)
                        setGlobalParams("popUp", true);
                        setGlobalParams("popUpAction", "saveChangesToggle");
                        setGlobalParams("popUpText", "Save all recent changes. All data will be permanently updated")
                    }}
                    className="controller-menu -smooth-appear">
                        <Icon icon="save" size={16} />
                        <p>SAVE CHANGES</p>
                    </button>
                }

                {
                    <button className="controller-menu -smooth-appear" 
                        onClick={() => setInterfaceParams("themeToggle", !interfaceParams.themeToggle)}>
                        <Icon icon={interfaceParams.themeToggle ? "wind" : "sparkles"} size={16} />
                        <p>{interfaceParams.themeToggle ? "JET BLACK THEME" : "MIDNIGHT BLUE THEME"}</p>
                    </button>
                }

                {(Object.keys(interfaceParams.logUpdate).length === 0) &&
                    <button
                        onClick={() => {
                            setGlobalParams("popUpConfirm", false);
                            setGlobalParams("popUp", true);
                            setGlobalParams("popUpAction", interfaceParams.editMode ? "turnEditModeOff" : "turnEditModeOn");
                            setGlobalParams("popUpText", interfaceParams.editMode ? 
                                "Turn editing mode off. All unsaved changes will be ignored" : 
                                `Turn editing mode on`)
                        }}
                        className="controller-menu -smooth-appear">
                        <Icon icon={!interfaceParams.editMode ? "edit" : "map"} size={16} />
                        <p>{interfaceParams.editMode ? "EXIT EDIT MODE" : "ENTER EDIT MODE"}</p>
                    </button>}
            </div>
        </section>
    );
}
