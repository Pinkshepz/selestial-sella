"use client";

import { useEffect } from "react";

import Icon from "@/public/icon";
import { useGlobalContext } from "../../provider"
import { useInterfaceContext } from "../library-provider";

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
                    <button
                        onClick={() => setInterfaceParams("displayToggle", !interfaceParams.displayToggle)}
                        className="controller-menu">
                        <Icon icon={interfaceParams.displayToggle ? "table" : "card"} size={16} />
                        <p>{interfaceParams.displayToggle ? "TABLE" : "CARD"}</p>
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
                    {!interfaceParams.searchKey && <span className="absolute left-[34px] z-[-10] text-sm">SEARCH</span>}
                </div>

                {interfaceParams.editMode && 
                    <button
                        onClick={() => setInterfaceParams("addLibraryToggle", !interfaceParams.addLibraryToggle)}
                        className="controller-menu">
                        <Icon icon="add" size={16} />
                        <p>ADD NEW LIBRARY</p>
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
