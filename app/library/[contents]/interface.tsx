"use client";

import { useEffect } from "react";

import { useGlobalContext } from "@/app/provider";
import { useContentInterfaceContext } from "./content-provider";

import ConfirmPopUp from "@/app/component/confirm-popup";
import SettingInterface from './components/setting';
import QuizInterface from "./components/quiz";
import EditorInterface from "./components/quiz-edit";
import ContentController from "./components/controller";
import LogUpdate from "./components/log-update";
import ErrorMessage from "@/app/component/error";
import sortUidObjectByValue from "@/app/libs/utils/sort-uid-object-by-value";

import uidObjectToArray from "@/app/libs/utils/uid-object-to-array";

const DEFAULT_BG = 'https://images.newscientist.com/wp-content/uploads/2022/08/08121245/SEI_117967799.jpg';

export default function Interface ({
    libraryData,
    questionData,
    ggSheetImport
}: {
    libraryData: {[key: string]: string}, // {uid: {library data}}
    questionData: {[key: string]: {[key: string]: any}} // {uid: {each question}}
    ggSheetImport: {[key: string]: {[key: string]: any}} | undefined // {uid: {each question}}
}) {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // Connect to contentInterfaceContext
    const {contentInterfaceParams, setContentInterfaceParams} = useContentInterfaceContext();

    useEffect(() => {
        setGlobalParams("isLoading", false);
    }, []);

    if (Object.keys(contentInterfaceParams.logUpdate).length !== 0) {
        return (
            <>
                <ContentController />
                <ConfirmPopUp />
                <LogUpdate />
            </>
        );
    } else if (contentInterfaceParams.editMode) {
        return (
            <>
                <ContentController />
                <ConfirmPopUp />
                <EditorInterface
                    libraryData={libraryData}
                    questionData={questionData}
                    ggSheetImport={ggSheetImport} />
            </>
        );
    } else {
        try {
            return (
            <>
                <ConfirmPopUp />
                <main className="relative flex flex-col h-[100dvh] w-full">
                    {(contentInterfaceParams.pageSwitch == false) && 
                    <SettingInterface
                        libraryData={libraryData}
                        questionData={uidObjectToArray(questionData)} />}
        
                    {(contentInterfaceParams.pageSwitch == true) && 
                    <QuizInterface
                        libraryData={libraryData}
                        questionData={uidObjectToArray(sortUidObjectByValue(
                            questionData, "id", true
                        ))} />}
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
