"use client";

// app/library/[contents]/components/quiz-edit/quiz-edit.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import { useEffect } from "react";
import Image from "next/image";
import firestoreUpdate from "@/app/utility/firestore/firestore-manager-library";
import firestoreUpdateQuiz from "@/app/utility/firestore/firestore-manager-quiz";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";
import { useLocalQuizContext } from "@/app/library/[quiz]/local-quiz-provider";

//// 1.3 React components
import Library from "@/app/utility/interface/interface-library";
import Question from "@/app/utility/interface/interface-quiz";

import QuizEditAside from "./quiz-edit-component-aside";
import QuizEditMain_A_Modality from "./quiz-edit-component-main-A-modality";
import QuizEditMain_B_Header from "./quiz-edit-component-main-B-header";
import QuizEditMain_B_Bookmark from "./quiz-edit-component-main-B-bookmark";
import QuizEditMain_C_MCQ from "./quiz-edit-component-main-C-mcq";
import QuizEditMain_C_FLASHCARD from "./quiz-edit-component-main-C-flashcard";
import QuizEditMain_C_SELECT from "./quiz-edit-component-main-C-select";

//// 1.4 Utility functions
//// N/A

import sortUidObjectByValue from "@/app/utility/function/object/sort-uid-object-by-value";

//// 1.5 Public and others
import Icon from "@/public/icon";
import BG from "@/public/images/aurora.png"; // Default background image
import QuizEditMain_A_Bookmark from "./quiz-edit-component-main-A-bookmark";


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

// <MAIN> QUIZ-EDIT
// -> <ASIDE> QUIZ-EDIT-ASIDE
// -> <SECTION> QUIZ-EDIT-MAIN
// -> -> <ARTICLE> QUESTION MODALITY SELECT
// -> -> <ARTICLE> QUESTION INTERFACE
// -> -> <ARTICLE> CHOICE / COMPONENT INTERFACE

export default function QuizEditorInterface ({
    libraryData,
    questionData
}: {
    libraryData: Library, // {uid: {library data}}
    questionData: {[key: string]: Question}, // {uid: {each question}}
}): React.ReactNode {

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
    

    ////// -------------------------------------------------------------------------
    ////// QUESTION FX.

    ////// B.VI useEffect to discard changes
    useEffect(() => {
    if (localQuizContextParams.discardChangesToggle && 
        globalParams.popUpConfirm &&
        (globalParams.popUpAction === "discardChangesToggle")) {
            setLocalQuizContextParams("bufferQuestion", questionData);
            setLocalQuizContextParams("bufferLibrary", libraryData);
            setLocalQuizContextParams("currentQuestionUid", "");
            setLocalQuizContextParams("currentQuestionModality", "");
            setLocalQuizContextParams("discardChangesToggle", false);
            setGlobalParams("popUpConfirm", false);
            setGlobalParams("popUpAction", "");
        }
    }, [globalParams.popUpConfirm]);
    
    ////// B.VII useEffect to save changed and move to server log page
    useEffect(() => {
        if (localQuizContextParams.saveChangesToggle &&
            globalParams.popUpConfirm &&
            (globalParams.popUpAction == "saveChangesToggle")) {
            setGlobalParams("isLoading", true);
            const libraryUid = libraryData.uid
            
            // Update library data
            firestoreUpdate({
                firebaseBranch: "ALPHA",
                collectionName: "library",
                originalData: {[libraryUid!]: libraryData}, 
                editedData: {[libraryUid!]: localQuizContextParams.bufferLibrary}
            });
            firestoreUpdate({
                firebaseBranch: "BETA",
                collectionName: "library",
                originalData: {[libraryUid!]: libraryData}, 
                editedData: {[libraryUid!]: localQuizContextParams.bufferLibrary}
            });
            
            // Update all question data
            firestoreUpdateQuiz({
                firebaseBranch: "ALPHA",
                originalData: questionData, 
                editedData: localQuizContextParams.bufferQuestion
            })
            firestoreUpdateQuiz({
                firebaseBranch: "BETA",
                originalData: questionData, 
                editedData: localQuizContextParams.bufferQuestion
            }).then(
                (data) => {
                    setGlobalParams("popUpConfirm", false);
                    setGlobalParams("popUpAction", "");
                    setLocalQuizContextParams("saveChangesToggle", false);
                    setLocalQuizContextParams("logUpdate", data);
                    setLocalQuizContextParams("editMode", false);
                }
            );
        };
    }, [globalParams.popUpConfirm]);


    //// -------------------------------------------------------------------------
    //// C. COMPONENT ASSEMBLY
    //// -------------------------------------------------------------------------

    ////// C.I Filter by search key
    let filteredQuestion: {[key: string]: Question} = {};
    for (let index = 0; index < Object.values(localQuizContextParams.bufferQuestion).length; index++) {
        // Each content data
        const question: Question = Object.values<Question>(localQuizContextParams.bufferQuestion)[index];
        // Create combination of all content information for search target
        const search_target = JSON.stringify(question);

        // Check if data matches to searchkey
        if (search_target.toLowerCase().includes(localQuizContextParams.searchKey.toLowerCase())) {
            filteredQuestion[Object.keys(localQuizContextParams.bufferQuestion)[index]] = question;
        }
    }

    ////// C.II Then, sort filtered content
    const sortedFilteredQuestionData: {[key: string]: Question} = sortUidObjectByValue(
        filteredQuestion, "id", localQuizContextParams.sortAscending
    );

    ////// C.III Render main editing interface
    let elementsEditQuiz: React.ReactNode = <></>;
    if (localQuizContextParams.currentQuestionUid.startsWith("《")) {
        // Assemble each sub-components
        elementsEditQuiz = <section aria-label="main-quiz-edit" className="flex flex-col h-full">
            <div className="h-16">
                <QuizEditMain_A_Bookmark />
            </div>
            <div className="h-full overflow-y-auto">
                <QuizEditMain_B_Bookmark />
            </div>
        </section>;
    } else if (Object.keys(sortedFilteredQuestionData).includes(localQuizContextParams.currentQuestionUid)) {
        try {
            // Get current question data
            const currentQuestion = sortedFilteredQuestionData[localQuizContextParams.currentQuestionUid];
            
            // Assemble each sub-components
            elementsEditQuiz = <section aria-label="main-quiz-edit" className="flex flex-col h-full">
                <div className="h-16">
                    <QuizEditMain_A_Modality questionDatum={currentQuestion}/>
                </div>
                <div className="h-full overflow-y-auto">
                    <QuizEditMain_B_Header />
                    {["BEST-ANSWER", "MULTIPLE-ANSWER"].includes(localQuizContextParams.currentQuestionModality) && <QuizEditMain_C_MCQ />}
                    {"FLASHCARD" === (localQuizContextParams.currentQuestionModality) && <QuizEditMain_C_FLASHCARD />}
                    {"SELECT" === (localQuizContextParams.currentQuestionModality) && <QuizEditMain_C_SELECT />}
                </div>
            </section>;
        } catch (error) {
            elementsEditQuiz = <ChooseQuizToEdit />;
        }
    } else elementsEditQuiz = <ChooseQuizToEdit />;

    //// -------------------------------------------------------------------------
    //// D. RETURN FINAL COMPONENT
    //// -------------------------------------------------------------------------

    return (
        <div className='flex flex-col'>
            <div id='editor-two-cols-fixed' className='-border-t' key='interface'>
                <QuizEditAside libraryData={libraryData} questionData={sortedFilteredQuestionData} />
                <main id="quiz-col-scroll-main" className='overflow-y-auto' key='interface-main'>
                    {elementsEditQuiz}
                </main>
            </div>
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
        <h1>Choose quiz to edit</h1>
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
