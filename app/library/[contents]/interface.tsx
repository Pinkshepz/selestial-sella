"use client";

import { useEffect } from "react";

import { useGlobalContext } from "@/app/global-provider";
import { useContentInterfaceContext } from "./content-provider";

import ConfirmPopUp from "@/app/libs/components/confirm-popup";
import SettingInterface from './components/setting';
import QuizInterface from "./components/quiz";
import EditorInterface from "./components/quiz-edit";
import ControllerEdit from "./components/controller-edit";
import LogUpdate from "./components/log-update";
import ErrorMessage from "@/app/libs/components/error";
import sortUidObjectByValue from "@/app/libs/function/sort-uid-object-by-value";

import uidObjectToArray from "@/app/libs/function/uid-object-to-array";

export default function Interface ({
    libraryData,
    questionData
}: {
    libraryData: {[key: string]: string}, // {library data}
    questionData: {[key: string]: {[key: string]: any}} // {uid: {each question}}
}) {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // Connect to contentInterfaceContext
    const {contentInterfaceParams, setContentInterfaceParams} = useContentInterfaceContext();

    useEffect(() => {
        setGlobalParams("isLoading", false);
    }, []);

    const processData = (rawData: typeof questionData) => {
        let processedData: typeof questionData = {};
        // assign new question number and library uid
        Object.keys(sortUidObjectByValue(rawData, "id", true)).map((uid, index) => {
            processedData[uid] = {
                ...rawData[uid],
                choices: []
            };
            (rawData[uid].choices as {}[]).map((choice, index) => {
                processedData[uid].choices.push({
                    ...choice,
                    "selected": false
                });
            });
        });
        return uidObjectToArray(processedData);
    }

    if (Object.keys(contentInterfaceParams.logUpdate).length > 0) {
        return (
            <>
                <ControllerEdit />
                <ConfirmPopUp />
                <LogUpdate />
            </>
        );
    } else if (contentInterfaceParams.editMode) {
        return (
            <>
                <ControllerEdit />
                <ConfirmPopUp />
                <EditorInterface
                    libraryData={libraryData}
                    questionData={questionData} />
            </>
        );
    } else {
        try {
            return (
            <>
                <ConfirmPopUp />
                <main className="relative flex flex-col mt-14">
                    {(contentInterfaceParams.pageSwitch == false) && 
                    <SettingInterface
                        libraryData={libraryData}
                        questionData={uidObjectToArray(questionData)} />}
        
                    {(contentInterfaceParams.pageSwitch == true) && 
                    <>
                        <QuizInterface
                        libraryData={libraryData}
                        questionData={processData(questionData)} />
                    </>
                    }
                    <div className="glass-cover-spread"></div>
                </main>
            </>
        );
        } catch (error) {
            return (
                <ErrorMessage
                    errorMessage={""}
                    errorCode={"serverNotResponse"}
                    previousRoute="/library"
                />
            );
        }
    }
}
