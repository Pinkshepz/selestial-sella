"use client";

import { useState, useEffect } from "react";

import makeid from "../../libs/utils/make-id";
import sortUidObjectByValue from "@/app/libs/utils/sort-uid-object-by-value";
import firestoreUpdate from "../../libs/firestore/firestore-manager";
import Icon from "../../../public/icon";
import { useGlobalContext } from "../../../app/provider";
import { useInterfaceContext } from "../provider";

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
        firestoreUpdate({
            collectionName: "course",
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
  }, [globalParams]);

  // duplicate course
  const handleDuplicateCourse = (uid: string): void => {
    const newUid = makeid(length=20);
    setBufferContent((prev) => ({
        ...prev,
        [newUid]: {
            id: bufferContent[uid].id + " copy",
            name: bufferContent[uid].name,
            description: bufferContent[uid].description,
            image: bufferContent[uid].image,
            tag: bufferContent[uid].tag
        }
    }));
  }

  // handle delete course
  const handleDeleteCourse = (uid: string): void => {
    setBufferContent((prev) => {
        if (prev) {
            const { [uid]: {}, ...rest } = prev;
            return rest;
        } else {
            return prev;
        }
    });
  }

  // handle add new course
  useEffect(() => {
    if (interfaceParams.addCourseToggle) {
        const newUid = makeid(length=20);
        setBufferContent((prev) => ({
            ...prev,
            [newUid]: {
                id: "",
                name: "",
                description: "",
                image: "",
                tag: []
            }
        }));
        setInterfaceParams("addCourseToggle", false);
    }
  }, [interfaceParams.addCourseToggle]);

  // update course data on placeholder change
  const onPlaceholderChange = (uid: string, targetKey: string, targetValue: any): void => {
    setBufferContent((prev) => ({
        ...prev,
        [uid]: {
            ...prev[uid],
            [targetKey]: targetValue
        }
    }));
  };

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
                        onClick={() => {handleDuplicateCourse(uid)}}
                        className="flex flex-row justify-center items-center gap-2 py-1 rounded-[8px] border border-ter dark:border-ter-dark hover:text-amber hover:border-amber dark:hover:text-amber-dark dark:hover:border-amber-dark font-bold">
                        <Icon icon="copy" size={16} />
                        DUPLICATE
                    </button>
                    <button
                        onClick={() => {handleDeleteCourse(uid)}}
                        className="flex flex-row justify-center items-center gap-2 py-1 rounded-[8px] border border-ter dark:border-ter-dark hover:text-red hover:border-red dark:hover:text-red-dark dark:hover:border-red-dark font-bold">
                        <Icon icon="trash" size={16} />
                        DELETE
                    </button>
                </div>

                <div id={handleFootprint(uid, "image")} className="edit-placeholder">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="image" size={16} />
                        <p>Image link</p>
                    </label>
                    <input type="text" className="editor-field"
                        onChange={e => onPlaceholderChange(uid, "image", e.target.value)}
                        defaultValue={bufferContent[uid].image}>
                    </input>
                </div>

                <div id={handleFootprint(uid, "id")} className="edit-placeholder">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="tag" size={16} />
                        <p>ID</p>
                    </label>
                    <input type="text" className="editor-field"
                        onChange={e => onPlaceholderChange(uid, "id", e.target.value)}
                        defaultValue={bufferContent[uid].id}>
                    </input>
                </div>

                <div id={handleFootprint(uid, "name")} className="edit-placeholder">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="h1" size={16} />
                        <p>Title name</p>
                    </label>
                    <input type="text" className="editor-field"
                        onChange={e => onPlaceholderChange(uid, "name", e.target.value)}
                        defaultValue={bufferContent[uid].name}>
                    </input>
                </div>

                <div id={handleFootprint(uid, "description")} className="edit-placeholder">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="font" size={16} />
                        <p>Description</p>
                    </label>
                    <input type="text" className="editor-field"
                        onChange={e => onPlaceholderChange(uid, "description", e.target.value)}
                        defaultValue={bufferContent[uid].description}>
                    </input>
                </div>

                <div id={handleFootprint(uid, "tag")} className="edit-placeholder">
                    <label className="flex flex-row justify-start items-center">
                        <Icon icon="tag" size={16} />
                        <p>Tag</p>
                    </label>
                    <input type="text" className="editor-field"
                        onChange={e => onPlaceholderChange(uid, "tag", e.target.value.split(","))}
                        defaultValue={bufferContent[uid].tag}>
                    </input>
                </div>
                {bufferContent[uid].footprint}
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
