"use client";

import { useEffect } from "react";

import Icon from "@/public/icon";
import { useContentInterfaceContext } from "../content-provider";
import { useGlobalContext } from "../../../provider"

export default function ContentController () {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // connect to interface context
    const {contentInterfaceParams, setContentInterfaceParams} = useContentInterfaceContext();

    const handleSearchKeyChange = (searchKey: string) => {
        setContentInterfaceParams("searchKey", searchKey);
    }

    // manage editing mode on and off
    useEffect(() => {
        if (globalParams.popUpConfirm &&
            (globalParams.popUpAction.toString().includes("turnEditMode"))) {
            setContentInterfaceParams("editMode", !contentInterfaceParams.editMode)
            setGlobalParams("popUpConfirm", false);
            setGlobalParams("popUpAction", "");
        }
    }, [globalParams]);

    return (
        <section className="controller-area">
            <div className="controller-island">

                <button
                    onClick={() => {}}
                    className="controller-menu">
                    <Icon icon="table" size={16} />
                    <p>IMPORT GGSHEET</p>
                </button>

                <button
                    onClick={() => {}}
                    className="controller-menu">
                    <Icon icon="card" size={16} />
                    <p>CARD VIEW</p>
                </button>

                <div className="controller-menu">
                    <Icon icon="search" size={16} />
                    <span className="input-field"
                        contentEditable={true} suppressContentEditableWarning={true}
                        onInput={e => handleSearchKeyChange(e.currentTarget.textContent!)}>
                    </span>
                    {!contentInterfaceParams.searchKey && <span className="absolute left-[34px] z-[-10] text-sm">SEARCH</span>}
                </div>

                <button
                    onClick={() => setContentInterfaceParams("addQuestionToggle", !contentInterfaceParams.addQuestionToggle)}
                    className="controller-menu">
                    <Icon icon="add" size={16} />
                    <p>ADD NEW QUESTION</p>
                </button>

                <button
                    onClick={() => {
                        setContentInterfaceParams("discardChangesToggle", !contentInterfaceParams.discardChangesToggle);
                        setGlobalParams("popUp", true);
                        setGlobalParams("popUpAction", "discardChangesToggle");
                        setGlobalParams("popUpText", "Discard all changes, your course data will be recovered to the original one");
                    }}
                    className="controller-menu">
                    <Icon icon="trash" size={16} />
                    <p>DISCARD CHANGES</p>
                </button>

                <button
                    onClick={() => {
                        setContentInterfaceParams("saveChangesToggle", !contentInterfaceParams.saveChangesToggle)
                        setGlobalParams("popUp", true);
                        setGlobalParams("popUpAction", "saveChangesToggle");
                        setGlobalParams("popUpText", "Save all recent changes. All data will be permanently updated")
                    }}
                    className="controller-menu">
                    <Icon icon="save" size={16} />
                    <p>SAVE CHANGES</p>
                </button>

                <button
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
                </button>

            </div>
        </section>
    );
}
