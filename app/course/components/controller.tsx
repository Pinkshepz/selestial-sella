"use client";

//// 1.1 Metadata & module & framework
import Link from "next/link";
import { useEffect } from "react";

//// 1.2 Custom React hooks

//// 1.3 React components
import { useGlobalContext } from "@/app/global-provider"
import { useInterfaceContext } from "../course-provider";

//// 1.4 Utility functions
////     N/A

//// 1.5 Public and others
import Icon from "@/public/icon";


export default function Controller () {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // connect to interface context
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();

    const handleSearchKeyChange = (searchKey: string) => {
        setInterfaceParams("searchKey", searchKey);
    }

    // manage editing mode on and off
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
                        href={"/"} 
                        onClick={() => setGlobalParams("isLoading", true)}
                        className="controller-menu">
                        <Icon icon="left" size={16} />
                        <p>BACK TO HOME</p>
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
                        className="controller-menu">
                        <Icon icon="left" size={16} />
                        <p>BACK TO COURSES</p>
                    </button>
                }

                {!interfaceParams.editMode && (Object.keys(interfaceParams.logUpdate).length === 0) &&
                    <button
                        onClick={() => setInterfaceParams("displayToggle", !interfaceParams.displayToggle)}
                        className="controller-menu">
                        <Icon icon={interfaceParams.displayToggle ? "table" : "image"} size={16} />
                        <p>{interfaceParams.displayToggle ? "TABLE" : "GALLERY"}</p>
                    </button>
                }

                {!interfaceParams.editMode &&
                    <button
                        onClick={() => setInterfaceParams("sortAscending", !interfaceParams.sortAscending)}
                        className="controller-menu">
                        <Icon icon="sort" size={16} />
                        <p>{interfaceParams.sortAscending ? "0 - 9" : "9 - 0"}</p>
                    </button>
                }

                <div className="controller-menu">
                    <Icon icon="search" size={16} />
                    <span className="input-field"
                        contentEditable={true} suppressContentEditableWarning={true}
                        onInput={e => handleSearchKeyChange(e.currentTarget.textContent!)}>
                    </span>
                    {!interfaceParams.searchKey && <span className="absolute left-[34px] z-[-10] text-sm">SEARCH COURSE</span>}
                </div>

                {interfaceParams.editMode && 
                    <button
                        onClick={() => setInterfaceParams("addCourseToggle", !interfaceParams.addCourseToggle)}
                        className="controller-menu">
                        <Icon icon="add" size={16} />
                        <p>ADD NEW COURSE</p>
                    </button>
                }

                {interfaceParams.editMode && 
                    <button
                        onClick={() => {
                            setInterfaceParams("discardChangesToggle", !interfaceParams.discardChangesToggle);
                            setGlobalParams("popUp", true);
                            setGlobalParams("popUpAction", "discardChangesToggle");
                            setGlobalParams("popUpText", "Discard all changes, your course data will be recovered to the original one");
                        }}
                        className="controller-menu">
                        <Icon icon="trash" size={16} />
                        <p>DISCARD CHANGES</p>
                    </button>
                }

                {interfaceParams.editMode && 
                    <button
                        onClick={() => {
                            setInterfaceParams("saveChangesToggle", !interfaceParams.saveChangesToggle)
                            setGlobalParams("popUp", true);
                            setGlobalParams("popUpAction", "saveChangesToggle");
                            setGlobalParams("popUpText", "Save all recent changes. All data will be permanently updated")
                        }}
                        className="controller-menu">
                        <Icon icon="save" size={16} />
                        <p>SAVE CHANGES</p>
                    </button>
                }

                {(Object.keys(interfaceParams.logUpdate).length === 0) &&
                    <button
                        onClick={() => {
                            setGlobalParams("popUp", true);
                            setGlobalParams("popUpAction", interfaceParams.editMode ? "turnEditModeOff" : "turnEditModeOn");
                            setGlobalParams("popUpText", interfaceParams.editMode ? 
                                "Turn editing mode off. All unsaved changes will be ignored" : 
                                `Turn editing mode on`)
                        }}
                        className="controller-menu">
                        <Icon icon={interfaceParams.editMode ? "edit" : "map"} size={16} />
                        <p>{interfaceParams.editMode ? "EXIT EDIT MODE" : "ENTER EDIT MODE"}</p>
                    </button>}

            </div>
        </section>
    );
}
