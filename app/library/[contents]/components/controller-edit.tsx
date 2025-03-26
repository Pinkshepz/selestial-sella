"use client";

import { useState, useEffect } from "react";

import Icon from "@/public/icon";
import { useContentInterfaceContext } from "../content-provider";
import { useGlobalContext } from "../../../global-provider"

export default function ControllerEdit () {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // connect to interface context
    const {contentInterfaceParams, setContentInterfaceParams} = useContentInterfaceContext();

    const handleSearchKeyChange = (searchKey: string) => {
        setContentInterfaceParams("searchKey", searchKey);
    }

    // Manage autosave mechanism in the editmode
    const CLOCK: number[] = [-1, 1, 2, 5, 10];
    const defaultCLOCK = CLOCK[3];

    const toggleAutosaveClock = (): void => {
        const currentIndex: number = CLOCK.indexOf(contentInterfaceParams.autosaveToggle);
        // change to next clock option
        setContentInterfaceParams("autosaveToggle", CLOCK[(currentIndex + 1) % CLOCK.length]);
        setContentInterfaceParams("autosaveTimer", CLOCK[(currentIndex + 1) % CLOCK.length] * 60);
        return;
    };

    // autosave clock countdown
    const [time, setTime] = useState(Date.now());

    // run autosave clock
    useEffect(() => {
        if (contentInterfaceParams.autosaveTimer > 0) {
            const interval = setInterval(() => setTime(Date.now()), 1000);
            setContentInterfaceParams("autosaveTimer", contentInterfaceParams.autosaveTimer - 1);
            return () => {
                clearInterval(interval);
            };
        }
    }, [time, contentInterfaceParams.autosaveToggle]);

    // manage editing mode on and off
    useEffect(() => {
        if (globalParams.popUpConfirm &&
            (globalParams.popUpAction.toString().includes("turnEditMode"))) {
            setContentInterfaceParams("editMode", !contentInterfaceParams.editMode);
            setContentInterfaceParams("autosaveToggle", defaultCLOCK);
            setGlobalParams("popUpConfirm", false);
            setGlobalParams("popUpAction", "");
        }
    }, [globalParams]);

    return (
        <section className="controller-area">
            <div className="controller-island">

                {!contentInterfaceParams.editMode && (Object.keys(contentInterfaceParams.logUpdate).length === 0) &&
                    <button
                        onClick={() => {
                            setGlobalParams("isLoading", true);
                            if (window !== undefined) {
                                window.location.reload();
                            }
                        }}
                        className="controller-menu">
                        <Icon icon="left" size={16} />
                        <p>BACK TO QUIZ PAGE</p>
                    </button>
                }

                {(Object.keys(contentInterfaceParams.logUpdate).length > 0) &&
                    <button
                        onClick={() => {
                            setContentInterfaceParams("logUpdate", {});
                            setGlobalParams("isLoading", true);
                            if (window !== undefined) {
                                window.location.reload();
                            }
                        }}
                        className="controller-menu">
                        <Icon icon="left" size={16} />
                        <p>BACK TO QUIZ PAGE</p>
                    </button>
                }

                {contentInterfaceParams.editMode && <button
                    onClick={() => {
                        setContentInterfaceParams("discardChangesToggle", !contentInterfaceParams.discardChangesToggle);
                        setGlobalParams("popUp", true);
                        setGlobalParams("popUpAction", "discardChangesToggle");
                        setGlobalParams("popUpText", "Discard all changes, your question data will be recovered to the original one");
                    }}
                    className="controller-menu">
                    <Icon icon="trash" size={16} />
                    <p>DISCARD CHANGES</p>
                </button>}

                {contentInterfaceParams.editMode && <button
                    onClick={() => setContentInterfaceParams("sortAscending", !contentInterfaceParams.sortAscending)}
                    className="controller-menu">
                    <Icon icon="sort" size={16} />
                    <p>{contentInterfaceParams.sortAscending ? "0 - 9" : "9 - 0"}</p>
                </button>}

                <div className="controller-menu">
                    <Icon icon="search" size={16} />
                    <span className="input-field"
                        contentEditable={true} suppressContentEditableWarning={true}
                        onInput={e => handleSearchKeyChange(e.currentTarget.textContent!)}>
                    </span>
                    {!contentInterfaceParams.searchKey && <span className="absolute left-[34px] z-[-10] text-sm">SEARCH QUIZ</span>}
                </div>

                {contentInterfaceParams.editMode && <button
                    onClick={() => setContentInterfaceParams("addQuestionToggle", !contentInterfaceParams.addQuestionToggle)}
                    className="controller-menu">
                    <Icon icon="add" size={16} />
                    <p>ADD NEW QUESTION</p>
                </button>}

                {contentInterfaceParams.editMode && <button
                    onClick={() => {
                        setContentInterfaceParams("saveChangesToggle", !contentInterfaceParams.saveChangesToggle)
                        setGlobalParams("popUp", true);
                        setGlobalParams("popUpAction", "saveChangesToggle");
                        setGlobalParams("popUpText", "Save all recent changes. All data will be permanently updated");
                    }}
                    className="controller-menu">
                    <Icon icon="save" size={16} />
                    <p>SAVE CHANGES</p>
                </button>}

                {contentInterfaceParams.editMode && <button
                    onClick={() => toggleAutosaveClock()}
                    className={`controller-menu ${(contentInterfaceParams.autosaveTimer <= 30) && (contentInterfaceParams.autosaveTimer >= 0) && (contentInterfaceParams.autosaveTimer % 2 == 0) && "text-amber dark:text-amber-dark"}`}>
                    {(contentInterfaceParams.autosaveToggle < 0)  ? <Icon icon="xCircle" size={16} /> : <Icon icon="true" size={16} />}
                    <p>{(contentInterfaceParams.autosaveToggle < 0) 
                        ? `AUTOSAVE OFF` 
                        : (contentInterfaceParams.autosaveTimer < 60)
                            ? `AUTOSAVE IN ${contentInterfaceParams.autosaveTimer} SEC`
                            : `AUTOSAVE IN ${Math.round(contentInterfaceParams.autosaveTimer / 60)} MIN`}</p>
                </button>}

                {contentInterfaceParams.editMode && <button
                    onClick={() => {
                        setGlobalParams("popUp", true);
                        setGlobalParams("popUpAction", contentInterfaceParams.editMode ? "turnEditModeOff" : "turnEditModeOn");
                        setGlobalParams("popUpText", contentInterfaceParams.editMode ? 
                            "Turn editing mode off. All unsaved changes will be ignored" : 
                            `Turn editing mode on as ${globalParams.user.displayName}`)
                    }}
                    className="controller-menu">
                    <Icon icon={contentInterfaceParams.editMode ? "edit" : "map"} size={16} />
                    <p>{contentInterfaceParams.editMode ? "EXIT EDIT MODE" : "ENTER EDIT MODE"}</p>
                </button>}
            </div>
        </section>
    );
}
