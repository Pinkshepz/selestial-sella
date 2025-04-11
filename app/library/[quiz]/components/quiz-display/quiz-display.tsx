"use client";

// app/library/[contents]/components/quiz-edit/quiz-edit.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import { useEffect } from "react";
import Image from "next/image";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useLocalQuizContext } from "@/app/library/[quiz]/local-quiz-provider";

//// 1.3 React components
import Library from "@/app/utility/interface/interface-library";
import QuestionAction from "@/app/utility/interface/interface-quiz";

import QuizDisplayAside from "./quiz-display-component-aside";
import QuizDisplayMain_A_Modality from "./quiz-display-component-main-A-modality";
import QuizDisplayMain_B_Header from "./quiz-display-component-main-B-header";
import QuizDisplayMain_C_MCQ from "./quiz-display-component-main-C-mcq";
import QuizDisplayMain_C_CARD from "./quiz-display-component-main-C-flashcard";
import QuizDisplayMain_C_SELECT from "./quiz-display-component-main-C-select";
import ConsoleDisplay from "./quiz-display-console";

//// 1.4 Utility functions
import sortUidObjectByValue from "@/app/utility/function/object/sort-uid-object-by-value";

//// 1.5 Public and others
import Icon from "@/public/icon";
import BG from "@/public/images/aurora.png"; // Default background image


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

// <MAIN> QUIZ-DISPLAY
// -> <ASIDE> QUIZ-DISPLAY-ASIDE
// -> <SECTION> QUIZ-DISPLAY-MAIN
// -> -> <ARTICLE> QUESTION MODALITY SELECT
// -> -> <ARTICLE> QUESTION INTERFACE
// -> -> <ARTICLE> CHOICE / COMPONENT INTERFACE

export default function QuizDisplayInterface ({
    libraryData,
    questionData,
    buffetMode
}: {
    libraryData: Library, // {uid: {library data}}
    questionData: {[key: string]: QuestionAction}, // {uid: {each question}}
    buffetMode: boolean
}): React.ReactNode {

    // console.log("RENDER QUIZ-EDIT")

    //// -------------------------------------------------------------------------
    //// A. LOCAL CONSTANTS & CONSTANT-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// A.I Connect global context: /app/*
    const {globalParams, setGlobalParams} = useGlobalContext();

    ////// A.II Connect local context: /app/library/[quiz]/*
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();

    //// -------------------------------------------------------------------------
    //// B. LOCAL FUNCTIONS & FUNCTION-RELATED REACT HOOKS
    //// -------------------------------------------------------------------------

    ////// -------------------------------------------------------------------------
    ////// GENERAL
    
    ////// B.I useEffect to initially set local context buffer question
    useEffect(() => {
        setLocalQuizContextParams("bufferQuestion", questionData);
    }, []);

    ////// B.II useEffect to initially set local context buffer library
    useEffect(() => {
        setLocalQuizContextParams("bufferLibrary", libraryData);
    }, []);

    ////// B.III Go to the first question
    ////// If go to bookmark -> skip -> fint out next question instead
    useEffect(() => {
        for (let i = 0; i < 100; i++) {
            try {
                setLocalQuizContextParams("currentQuestionUid", libraryData.questionUidOrder[i]);
                setLocalQuizContextParams("currentQuestionModality", questionData[libraryData.questionUidOrder[i]].modality);
                break;
            } catch (error) {null}}
    }, []);

    ////// B.IV useEffect to discard changes
    useEffect(() => {
        if (localQuizContextParams.discardChangesToggle && 
            globalParams.popUpConfirm &&
            (globalParams.popUpAction === "discardChangesToggle")) {
                setLocalQuizContextParams("bufferQuestion", questionData);
                for (let i = 0; i < 100; i++) {
                    try {
                        setLocalQuizContextParams("currentQuestionUid", libraryData.questionUidOrder[i]);
                        setLocalQuizContextParams("currentQuestionModality", questionData[libraryData.questionUidOrder[i]].modality);
                        break;
                    } catch (error) {null}
                }
                setLocalQuizContextParams("discardChangesToggle", false);
                setGlobalParams("popUpConfirm", false);
                setGlobalParams("popUpAction", "");
            }
        }, [globalParams.popUpConfirm]);


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    ////// C.I Filter by search key
    let filteredQuestion: {[key: string]: QuestionAction} = {};
    for (let index = 0; index < Object.values(localQuizContextParams.bufferQuestion).length; index++) {
        // Each content data
        const question: QuestionAction = Object.values<QuestionAction>(localQuizContextParams.bufferQuestion)[index];
        // Create combination of all content information for search target
        const search_target = JSON.stringify(question);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(localQuizContextParams.searchKey.toLowerCase())) {
            filteredQuestion[Object.keys(localQuizContextParams.bufferQuestion)[index]] = question;
        }
    }

    ////// C.II Then, sort filtered content
    const sortedFilteredQuestionData: {[key: string]: QuestionAction} = sortUidObjectByValue(
        filteredQuestion, "id", localQuizContextParams.sortAscending
    );

    ////// C.III Render main editing interface
    let elementsEditQuiz: React.ReactNode = <></>;

    if (Object.keys(sortedFilteredQuestionData).includes(localQuizContextParams.currentQuestionUid)) {
        // Assemble each sub-components
        elementsEditQuiz = <section aria-label="main-quiz-edit" className="flex flex-col h-full">
            <div className="h-16">
                <QuizDisplayMain_A_Modality questionData={questionData} />
            </div>
            <div className="h-full overflow-y-auto">
                <QuizDisplayMain_B_Header />
                {["BEST-ANSWER", "MULTIPLE-ANSWER"].includes(localQuizContextParams.currentQuestionModality) && <QuizDisplayMain_C_MCQ />}
                {"FLASHCARD" === (localQuizContextParams.currentQuestionModality) && <QuizDisplayMain_C_CARD />}
                {"SELECT" === (localQuizContextParams.currentQuestionModality) && <QuizDisplayMain_C_SELECT />}
            </div>
        </section>;
    }
    else elementsEditQuiz = <ChooseQuizToEdit />;

    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    return (
        <div className="flex flex-col -smooth-appear">
            <div id="display-two-cols-fixed" className="relative -border-t" key="interface">
                {localQuizContextParams.screenWidth > 1100
                    ? localQuizContextParams.asideHidden && <aside aria-label="aside-navigation" key="aside-navigation-large" id="quiz-col-scroll-aside" 
                        className={`relative w-[320px] flex flex-col -border-r -prevent-select"`}>
                        <QuizDisplayAside libraryData={libraryData} questionData={sortedFilteredQuestionData} buffetMode={buffetMode} />
                    </aside>

                    : !localQuizContextParams.asideHidden && <>
                        <aside aria-label="aside-navigation" key="aside-navigation-large" id="quiz-col-scroll-aside" 
                            className={`absolute w-[50dvw] flex flex-col z-100 -border-r -prevent-select -smooth-appear backdrop-blur-lg ${globalParams.theme ? "bg-white/90 dark:bg-black/50" : "bg-highlight/90 dark:bg-highlight-dark/80"}`}>
                            <QuizDisplayAside libraryData={libraryData} questionData={sortedFilteredQuestionData} buffetMode={buffetMode} />
                        </aside>
                        <div onClick={() => setLocalQuizContextParams("asideHidden", !localQuizContextParams.asideHidden)} className={`absolute h-full w-full z-[90] cursor-pointer ${globalParams.theme ? "bg-white/[0.95] dark:bg-black/[0.87]" : "bg-highlight/90 dark:bg-highlight-dark/90"}`}></div>
                    </>
                    
                }
                <main id="quiz-col-scroll-main" className="overflow-y-auto" key="interface-main">
                    {elementsEditQuiz}
                </main>
            </div>
            <ConsoleDisplay buffetMode={buffetMode} />
            <BackgroundImage libraryDataImage={libraryData.image} theme={localQuizContextParams.themeToggle} />
        </div>
    );
}


// =========================================================================
// 4. LOCAL COMPONENTS
// =========================================================================

const ChooseQuizToEdit = () => (
    <div className="my-auto text-textSlate dark:text-textSlate-dark flex flex-col justify-center items-center text-center" key="blank">
        <Icon icon="edit" size={48} />
        <h1>Choose quiz to start</h1>
    </div>
);

const BackgroundImage = ({
    libraryDataImage,
    theme
}: {
    libraryDataImage: string | undefined,
    theme: boolean
}) => (
    <div className="-smooth-appear fixed bottom-0 w-dvw h-dvh z-[-100]" key={theme ? "A" : "B"}>
        {libraryDataImage
            ? <img src={libraryDataImage} alt="" className="absolute h-full w-full z-[-100]" />
            : <Image src={BG} width={1000} height={1000} alt="" className="absolute h-full w-full z-[-100]" />
        }
        <div className={`absolute h-full w-full z-[-90] ${theme ? "bg-white/[0.95] dark:bg-black/[0.87]" : "bg-highlight/90 dark:bg-highlight-dark/90"}`}></div>
        <div className="glass-cover-spread z-[-80]"></div>
    </div>
);
