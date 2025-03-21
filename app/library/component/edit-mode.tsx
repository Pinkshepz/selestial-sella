"use client";

import { useState, useEffect } from "react";

import makeid from "../../libs/utils/make-id";
import sortUidObjectByValue from "@/app/libs/utils/sort-uid-object-by-value";
import firestoreUpdate from "../../libs/firestore/firestore-manager";
import Icon from "../../libs/material/icon";
import { useGlobalContext } from "../../global-provider";
import { useInterfaceContext } from "../library-provider";

export default function CardEditor ({
    contentData
}: {
    contentData: {[key: string]: {[key: string]: any}}
}): React.ReactNode {
  // connect to global context
  const {globalParams, setGlobalParams} = useGlobalContext();

  // connect to interface context
  const {interfaceParams, setInterfaceParams} = useInterfaceContext();

  // counterpart of content data for editing
  const [bufferContent, setBufferContent] = useState(contentData);

  // detect footprint and return id="changed"
  const handleFootprint = (uid: string, footprint: string) => {
    try {
        if (Object.keys(contentData).includes(uid)) {
            if (contentData[uid][footprint] === bufferContent[uid][footprint]) {
                return "original"
            } else if (contentData[uid][footprint].toString() === bufferContent[uid][footprint].toString()) {
                return "original"
            } else {
                return "changed"
            }
        } else {
            return "changed-all"
        }
    } catch (error) {
        return "changed-all"
    }
  }

  // discard all changes if toggle
  useEffect(() => {
    if (interfaceParams.discardChangesToggle && 
        globalParams.popUpConfirm &&
        (globalParams.popUpAction === "discardChangesToggle")) {
        setBufferContent(contentData);
        setInterfaceParams("discardChangesToggle", false);
        setGlobalParams("popUpConfirm", false);
        setGlobalParams("popUpAction", "");
    }
  }, [globalParams]);

  // save all changes if toggle 
  useEffect(() => {
    if (interfaceParams.saveChangesToggle &&
        globalParams.popUpConfirm &&
        (globalParams.popUpAction == "saveChangesToggle")) {
        setGlobalParams("isLoading", true);
        firestoreUpdate({
            collectionName: "library",
            originalData: contentData, 
            editedData: bufferContent
        }).then(
            (data) => {
                setGlobalParams("popUpConfirm", false);
                setGlobalParams("popUpAction", "");
                setInterfaceParams("saveChangesToggle", false);
                setInterfaceParams("editMode", false);
                setInterfaceParams("logUpdate", data);
            }
        );
    }
  }, [globalParams.popUpConfirm]);

  // duplicate Library
  const handleDuplicateLibrary = (uid: string): void => {
    const newUid = makeid(length=20);
    setBufferContent((prev) => ({
        ...prev,
        [newUid]: {
            id: bufferContent[uid].id + " copy",
            name: bufferContent[uid].name,
            description: bufferContent[uid].description,
            image: bufferContent[uid].image,
            mode: bufferContent[uid].mode,
            questionShuffle: bufferContent[uid].questionShuffle,
            choiceShuffle: bufferContent[uid].choiceShuffle
        }
    }));
  }

  // handle delete Library
  const handleDeleteLibrary = (uid: string): void => {
    setBufferContent((prev) => {
        if (prev) {
            const { [uid]: {}, ...rest } = prev;
            return rest;
        } else {
            return prev;
        }
    });
  }

  // handle add new Library
  useEffect(() => {
    if (interfaceParams.addLibraryToggle) {
        const newUid = makeid(length=20);
        setBufferContent((prev) => ({
            ...prev,
            [newUid]: {
                id: "",
                name: "",
                description: "",
                image: "",
                mode: "MCQ",
                questionShuffle: false,
                choiceShuffle: false
            }
        }));
        setInterfaceParams("addLibraryToggle", false);
    }
  }, [interfaceParams.addLibraryToggle]);

  // update Library data on placeholder change
  const onPlaceholderChange = (uid: string, targetKey: string, targetValue: any): void => {
    setBufferContent((prev) => ({
        ...prev,
        [uid]: {
            ...prev[uid],
            [targetKey]: targetValue
        }
    }));
  };

  // toggle question mode ["singleChoice", "multipleChoice", "flashcard"]
  const MODE: string[] = ["MCQ", "FLASHCARD", "MIXED"];
  const toggleQuestionMode = (uid: string, currentMode: string): void => {
      const currentIndex: number = MODE.indexOf(currentMode);
      // change to next mode
      onPlaceholderChange(uid, "mode", MODE[(currentIndex + 1) % MODE.length]);
      return;
  }

    // Filter by search key
    let filteredContent: {[key: string]: {[key: string]: any}} = {};
    for (let index = 0; index < Object.values(bufferContent).length; index++) {
        // Each content data
        const content: {[key: string]: any} = Object.values(bufferContent)[index];
        // Create combination of all content information for search target
        const search_target = content["id"] + " " + content["title"] + " " + content["tag"];

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(interfaceParams.searchKey.toLowerCase())) {
        filteredContent[Object.keys(bufferContent)[index]] = content;
        }
    }

    const sortedFilteredContentData: {[key: string]: {[key: string]: string}} = sortUidObjectByValue(
        filteredContent, "id", interfaceParams.sortAscending
    );

  // Render cards
  let elements: Array<React.ReactNode> = [];

  Object.values(sortedFilteredContentData).map((content, index) => {
    // get uid as object key
    const uid = Object.keys(sortedFilteredContentData)[index];

    elements.push(
        // card template
        <article id={handleFootprint(uid, "")} className="card-edit" key={uid}>
            <div className="overflow-hidden">
                {content.image && <img src={content.image} alt="Invalid image" className="h-[25vh]" height={1000} width={1000} />}
            </div>
            <div className="flex flex-col gap-2 p-2">

                <div className="flex flex-row gap-2 my-2 font-bold text-pri dark:text-pri-dark">
                    <Icon icon="barcode" size={16} />
                    <p>{uid}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => {handleDuplicateLibrary(uid)}}
                        className="flex flex-row justify-center items-center gap-2 py-1 rounded-[8px] border border-border dark:border-border-dark hover:text-amber hover:border-amber dark:hover:text-amber-dark dark:hover:border-amber-dark font-bold">
                        <Icon icon="copy" size={16} />
                        DUPLICATE
                    </button>
                    <button
                        onClick={() => {handleDeleteLibrary(uid)}}
                        className="flex flex-row justify-center items-center gap-2 py-1 rounded-[8px] border border-border dark:border-border-dark hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                        <Icon icon="trash" size={16} />
                        DELETE
                    </button>
                </div>

                <div id={handleFootprint(uid, "image")} className="edit-placeholder">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="image" size={16} />
                        <p>Image link</p>
                    </label>
                    <textarea className="editor-field"
                        onChange={e => onPlaceholderChange(uid, "image", e.target.value)}
                        defaultValue={bufferContent[uid].image}>
                    </textarea>
                </div>

                <div id={handleFootprint(uid, "id")} className="edit-placeholder">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="tag" size={16} />
                        <p>ID</p>
                    </label>
                    <textarea className="editor-field"
                        onChange={e => onPlaceholderChange(uid, "id", e.target.value)}
                        defaultValue={bufferContent[uid].id}>
                    </textarea>
                </div>

                <div id={handleFootprint(uid, "name")} className="edit-placeholder">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="h1" size={16} />
                        <p>Library name</p>
                    </label>
                    <textarea className="editor-field"
                        onChange={e => onPlaceholderChange(uid, "name", e.target.value)}
                        defaultValue={bufferContent[uid].name}>
                    </textarea>
                </div>

                <div id={handleFootprint(uid, "description")} className="edit-placeholder">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="font" size={16} />
                        <p>Description</p>
                    </label>
                    <textarea className="editor-field"
                        onChange={e => onPlaceholderChange(uid, "description", e.target.value)}
                        defaultValue={bufferContent[uid].description}>
                    </textarea>
                </div>

                <div id={handleFootprint(uid, "mode")} className="edit-placeholder">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="tag" size={16} />
                        <p>Mode</p>
                    </label>
                    <button className="toggle-field"
                        onClick={() => toggleQuestionMode(uid, bufferContent[uid].mode)}>
                        {bufferContent[uid].mode}
                    </button>
                </div>

                <div id={handleFootprint(uid, "shuffleQuestion")} className="edit-placeholder">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="shuffle" size={16} />
                        <p>Shuffle question</p>
                    </label>
                    <button className={`toggle-field ${bufferContent[uid].shuffleQuestion ? "toggleOn" : "toggleOff"}`}
                        onClick={() => onPlaceholderChange(uid, "shuffleQuestion", !bufferContent[uid].shuffleQuestion)}>
                        {bufferContent[uid].shuffleQuestion ? "TRUE" : "FALSE"}
                    </button>
                </div>

                <div id={handleFootprint(uid, "shuffleChoice")} className="edit-placeholder">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="shuffle" size={16} />
                        <p>Shuffle choice</p>
                    </label>
                    <button className={`toggle-field ${bufferContent[uid].shuffleChoice ? "toggleOn" : "toggleOff"}`}
                        onClick={() => onPlaceholderChange(uid, "shuffleChoice", !bufferContent[uid].shuffleChoice)}
                        defaultValue={bufferContent[uid].shuffleChoice}>
                        {bufferContent[uid].shuffleChoice ? "TRUE" : "FALSE"}
                    </button>
                </div>
            </div>
        </article>
    );
  });

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 mb-4">
        {elements}
    </section>
  );
}
