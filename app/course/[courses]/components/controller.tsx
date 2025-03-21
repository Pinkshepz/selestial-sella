"use client";

import { useEffect } from "react";
import Link from "next/link";

import Icon from "@/public/icon";
import { useGlobalContext } from "../../../global-provider"
import { useTopicInterfaceContext } from "./../topic-provider";

export default function Controller () {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // connect to interface context
    const {topicInterfaceParams, setTopicInterfaceParams} = useTopicInterfaceContext();

    const handleSearchKeyChange = (searchKey: string) => {
        setTopicInterfaceParams("searchKey", searchKey);
    }

    // manage editing mode on and off
    useEffect(() => {
        if (globalParams.popUpConfirm &&
            (globalParams.popUpAction.toString().includes("turnEditMode"))) {
            setTopicInterfaceParams("editMode", !topicInterfaceParams.editMode)
            setGlobalParams("popUpConfirm", false);
            setGlobalParams("popUpAction", "");
        }
    }, [globalParams]);

    return (
        <section className="controller-area">
            <div className="controller-island">

                {!topicInterfaceParams.editMode &&
                    <Link
                        href={"/course"} 
                        onClick={() => setGlobalParams("isLoading", true)}
                        className="controller-menu">
                        <Icon icon="left" size={16} />
                        <p>BACK TO COURSES</p>
                    </Link>
                }

                {!topicInterfaceParams.editMode && (Object.keys(topicInterfaceParams.logUpdate).length === 0) &&
                    <button
                        onClick={() => setTopicInterfaceParams("displayToggle", !topicInterfaceParams.displayToggle)}
                        className="controller-menu">
                        <Icon icon={topicInterfaceParams.displayToggle ? "table" : "image"} size={16} />
                        <p>{topicInterfaceParams.displayToggle ? "TABLE" : "GALLERY"}</p>
                    </button>
                }

                {!topicInterfaceParams.editMode &&
                    <button
                        onClick={() => setTopicInterfaceParams("sortAscending", !topicInterfaceParams.sortAscending)}
                        className="controller-menu">
                        <Icon icon="sort" size={16} />
                        <p>{topicInterfaceParams.sortAscending ? "0 - 9" : "9 - 0"}</p>
                    </button>
                }

                <div className="controller-menu">
                    <Icon icon="search" size={16} />
                    <span className="input-field"
                        contentEditable={true} suppressContentEditableWarning={true}
                        onInput={e => handleSearchKeyChange(e.currentTarget.textContent!)}>
                    </span>
                    {!topicInterfaceParams.searchKey && <span className="absolute left-[34px] z-[-10] text-sm">SEARCH</span>}
                </div>

                {topicInterfaceParams.editMode && 
                    <button
                        onClick={() => setTopicInterfaceParams("addCourseToggle", !topicInterfaceParams.addCourseToggle)}
                        className="controller-menu">
                        <Icon icon="add" size={16} />
                        <p>ADD NEW COURSE</p>
                    </button>
                }

                {topicInterfaceParams.editMode && 
                    <button
                        onClick={() => {
                            setTopicInterfaceParams("discardChangesToggle", !topicInterfaceParams.discardChangesToggle);
                            setGlobalParams("popUp", true);
                            setGlobalParams("popUpAction", "discardChangesToggle");
                            setGlobalParams("popUpText", "Discard all changes, your course data will be recovered to the original one");
                        }}
                        className="controller-menu">
                        <Icon icon="trash" size={16} />
                        <p>DISCARD CHANGES</p>
                    </button>
                }

                {topicInterfaceParams.editMode && 
                    <button
                        onClick={() => {
                            setTopicInterfaceParams("saveChangesToggle", !topicInterfaceParams.saveChangesToggle)
                            setGlobalParams("popUp", true);
                            setGlobalParams("popUpAction", "saveChangesToggle");
                            setGlobalParams("popUpText", "Save all recent changes. All data will be permanently updated")
                        }}
                        className="controller-menu">
                        <Icon icon="save" size={16} />
                        <p>SAVE CHANGES</p>
                    </button>
                }

                {(Object.keys(topicInterfaceParams.logUpdate).length === 0) &&
                    <button
                        onClick={() => {
                            setGlobalParams("popUp", true);
                            setGlobalParams("popUpAction", topicInterfaceParams.editMode ? "turnEditModeOff" : "turnEditModeOn");
                            setGlobalParams("popUpText", topicInterfaceParams.editMode ? 
                                "Turn editing mode off. All unsaved changes will be ignored" : 
                                `Turn editing mode on`)
                        }}
                        className="controller-menu">
                        <Icon icon={topicInterfaceParams.editMode ? "edit" : "map"} size={16} />
                        <p>{topicInterfaceParams.editMode ? "EXIT EDIT MODE" : "ENTER EDIT MODE"}</p>
                    </button>}

            </div>
        </section>
    );
}
