"use client";

//// 1.1 Metadata & module & framework
import { useEffect } from "react";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useLocalQuizContext } from "./local-quiz-provider";

//// 1.3 React components
import Library from "@/app/utility/interface/interface-library";
import Question from "@/app/utility/interface/interface-quiz";

import ConfirmPopUp from "@/app/utility/components/confirm-popup";
import ErrorMessage from "@/app/utility/components/error";

import SettingInterface from './components/quiz-buffer/setting';
import ControllerDisplay from "./components/quiz-display/quiz-display-controller";
import QuizDisplayInterface from "./components/quiz-display/quiz-display";
import ControllerEdit from "./components/quiz-edit/quiz-edit-controller";
import QuizEditorInterface from "./components/quiz-edit/quiz-edit";
import LogUpdate from "./components/quiz-buffer/log-update";

//// 1.4 Utility functions
import uidObjectToArray from "@/app/utility/function/object/uid-object-to-array";

//// 1.5 Public and others
////     N/A


export default function Interface ({
    libraryData,
    questionData
}: {
    libraryData: Library, // {library data}
    questionData: {[key: string]: Question} // {uid: {each question}}
}) {

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/quiz/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();


    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    useEffect(() => {
        setGlobalParams("isLoading", false);
    }, []);

    if (Object.keys(localQuizContextParams.logUpdate).length > 0) {
        return (
            <>
                <ControllerEdit libraryData={libraryData} questionData={questionData} />
                <ConfirmPopUp />
                <LogUpdate />
            </>
        );
    } else if (localQuizContextParams.editMode) {
        return (
            <>
                <ControllerEdit libraryData={libraryData} questionData={questionData} />
                <ConfirmPopUp />
                <QuizEditorInterface
                    libraryData={libraryData}
                    questionData={questionData} />
            </>
        );
    } else {
        try {
            return (
            <>
                <ConfirmPopUp />
                <main className="relative flex flex-col">
                    {(localQuizContextParams.pageSwitch == false) && 
                    <SettingInterface
                        libraryData={libraryData}
                        questionData={uidObjectToArray(questionData)} />}
        
                    {(localQuizContextParams.pageSwitch == true) && 
                    <>
                        <ControllerDisplay />
                        <QuizDisplayInterface
                            libraryData={libraryData}
                            questionData={questionData} />
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
