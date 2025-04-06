"use client";

//// 1.1 Metadata & module & framework
import { useEffect } from "react";
import Link from "next/link";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider"
import { useLocalLibraryContext } from "@/app/library/local-library-provider";

//// 1.3 React components
////     N/A

//// 1.4 Utility functions
////     N/A

//// 1.5 Public and others
import Icon from "@/public/icon";


export default function Controller () {
    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/*
    const {localLibraryContextParams, setLocalLibraryContextParams} = useLocalLibraryContext();


    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    const handleSearchKeyChange = (searchKey: string) => {
        setLocalLibraryContextParams("searchKey", searchKey);
    }

    // manage editing mode on and off
    useEffect(() => {
        if (globalParams.popUpConfirm &&
            (globalParams.popUpAction.toString().includes("turnEditMode"))) {
            setLocalLibraryContextParams("editMode", !localLibraryContextParams.editMode)
            setGlobalParams("popUpConfirm", false);
            setGlobalParams("popUpAction", "");
        }
    }, [globalParams]);


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    let controllerMenu: React.ReactNode[] = [];

    if (!localLibraryContextParams.editMode && (Object.keys(localLibraryContextParams.logUpdate).length === 0)) {
        controllerMenu.push(
            <Link key="C1"
                href={"/"} 
                onClick={() => setGlobalParams("isLoading", true)}
                className="controller-menu">
                <Icon icon="left" size={16} />
                <p>BACK TO HOME</p>
            </Link>
        );
    
        controllerMenu.push(
            <button key="C2"
                onClick={() => setLocalLibraryContextParams("displayToggle", !localLibraryContextParams.displayToggle)}
                className="controller-menu">
                <Icon icon={localLibraryContextParams.displayToggle ? "table" : "image"} size={16} />
                <p>{localLibraryContextParams.displayToggle ? "TABLE" : "GALLERY"}</p>
            </button>
        );
    }
        

    controllerMenu.push(
        <div key="C3" className="controller-menu">
            <Icon icon="search" size={16} />
            <span className="input-field"
                contentEditable={true} suppressContentEditableWarning={true}
                onInput={e => handleSearchKeyChange(e.currentTarget.textContent!)}>
            </span>
            {!localLibraryContextParams.searchKey && <span className="absolute left-[34px] z-[-10] text-sm">SEARCH LIBRARY</span>}
        </div>
    );
        

    if (Object.keys(localLibraryContextParams.logUpdate).length > 0) {
        controllerMenu.push(
            <button key="C4"
                onClick={() => {
                    setLocalLibraryContextParams("logUpdate", {});
                    setGlobalParams("isLoading", true);
                    if (window !== undefined) {
                        window.location.reload();
                    }
                }}
                className="controller-menu">
                <Icon icon="left" size={16} />
                <p>BACK TO LIBRARY</p>
            </button>
        )
    }

    if (localLibraryContextParams.editMode) {
        controllerMenu.push(
            <button key="C5a"
                onClick={() => setLocalLibraryContextParams("sortAscending", !localLibraryContextParams.sortAscending)}
                className="controller-menu">
                <Icon icon="sort" size={16} />
                <p>{localLibraryContextParams.sortAscending ? "0 - 9" : "9 - 0"}</p>
            </button>
        );

        controllerMenu.push(
            <button key="C5b"
                onClick={() => setLocalLibraryContextParams("addLibraryToggle", !localLibraryContextParams.addLibraryToggle)}
                className="controller-menu">
                <Icon icon="add" size={16} />
                <p>ADD NEW LIBRARY</p>
            </button>
        );

        controllerMenu.push(
            <button key="C5c"
                onClick={() => {
                    setGlobalParams("popUpConfirm", false);
                    setLocalLibraryContextParams("discardChangesToggle", !localLibraryContextParams.discardChangesToggle);
                    setGlobalParams("popUp", true);
                    setGlobalParams("popUpAction", "discardChangesToggle");
                    setGlobalParams("popUpText", "Discard all changes, your library data will be recovered to the original one");
                }}
                className="controller-menu">
                <Icon icon="trash" size={16} />
                <p>DISCARD CHANGES</p>
            </button>
        );

        controllerMenu.push(
            <button key="C5d"
                onClick={() => {
                    setGlobalParams("popUpConfirm", false);
                    setLocalLibraryContextParams("saveChangesToggle", !localLibraryContextParams.saveChangesToggle)
                    setGlobalParams("popUp", true);
                    setGlobalParams("popUpAction", "saveChangesToggle");
                    setGlobalParams("popUpText", "Save all recent changes. All data will be permanently updated")
                }}
                className="controller-menu">
                <Icon icon="save" size={16} />
                <p>SAVE CHANGES</p>
            </button>
        );
    }

    if (Object.keys(localLibraryContextParams.logUpdate).length === 0) {
        controllerMenu.push(
            <button key="C6"
                onClick={() => {
                    setGlobalParams("popUp", true);
                    setGlobalParams("popUpAction", localLibraryContextParams.editMode ? "turnEditModeOff" : "turnEditModeOn");
                    setGlobalParams("popUpText", localLibraryContextParams.editMode ? 
                        "Turn editing mode off. All unsaved changes will be ignored" : 
                        `Turn editing mode on`)
                }}
                className="controller-menu">
                <Icon icon={localLibraryContextParams.editMode ? "edit" : "map"} size={16} />
                <p>{localLibraryContextParams.editMode ? "EXIT EDIT MODE" : "ENTER EDIT MODE"}</p>
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
