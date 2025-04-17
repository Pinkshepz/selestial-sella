"use client";

// app/library/[contents]/components/quiz-edit/quiz-edit.tsx

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider"
import { useLocalQuizContext } from "@/app/library/[quiz]/local-quiz-provider";

//// 1.3 React components

//// 1.4 Utility functions
import firestoreRandomQuiz from "@/app/utility/firestore/firestore-query-random-quiz";

import objectKeyRetrieve from "@/app/utility/function/object/object-key-retrieve";
import objectKeyValueUpdate from "@/app/utility/function/object/object-dynamic-change";

import arrayIndexOf from "@/app/utility/function/array/array-index-of";
import makeid from "@/app/utility/function/make-id";

//// 1.5 Public and others


// =========================================================================
// 2. GLOBAL CONSTANT VARIABLES AND FUNCTIONS
// =========================================================================


// =========================================================================
// 3. EXPORT DEFAULT FUNCTION
// =========================================================================

export default function ConsoleDisplay ({
    buffetMode
}: {
    buffetMode: boolean
}): React.ReactNode {
    // I. Connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();
    
    // II. Connect to interface context
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();

    // III. Get current question data
    const currentQuestionData = objectKeyRetrieve({
        object: localQuizContextParams.bufferQuestion,
        keysHierachy: [localQuizContextParams.currentQuestionUid, "questionData", localQuizContextParams.currentQuestionModality]
    });

    // IV. Function to handle move question
    const handleQuestionChange = (direction: number) => {
        if (direction === 0) {return}

        const currentIndex: number = arrayIndexOf<string>({
            array: localQuizContextParams.bufferLibrary.questionUidOrder,
            targetValue: localQuizContextParams.currentQuestionUid
        });

        const l = localQuizContextParams.bufferLibrary.questionUidOrder.legth;
        const newQuestionUid = localQuizContextParams.bufferLibrary.questionUidOrder[(currentIndex + direction) % localQuizContextParams.bufferLibrary.questionUidOrder.length];
        
        // Lower limit
        if ((direction < 0) && (Math.abs(direction) > currentIndex)) {return}
        
        // Upper limit
        if ((direction > 0) && (direction > (l - 1 - currentIndex))) {return}

        // Change to new modality
        if (Object.keys(localQuizContextParams.bufferQuestion).includes(newQuestionUid)) {
            setLocalQuizContextParams("currentQuestionUid", newQuestionUid);
            setLocalQuizContextParams("currentQuestionModality", localQuizContextParams.bufferQuestion[newQuestionUid].modality);
        } else {handleQuestionChange(direction + direction)}

        // Fetch next question if buffetMode is activated
        if (buffetMode) {
            let fetchLimit = 50;
            let toggleGetNewQuestion = false;
            while (fetchLimit) {
                fetchLimit--
                firestoreRandomQuiz(localQuizContextParams.bufferLibrary.lastEdited).then(
                    (data) => {
                        const newQuestionUid = Object.keys(data)[0];
                        if (!localQuizContextParams.bufferLibrary.questionUidOrder.includes(newQuestionUid)) {
                            setLocalQuizContextParams("bufferQuestion", {
                                ...localQuizContextParams.bufferQuestion,
                                ...data
                            });
                            setLocalQuizContextParams("bufferLibrary", {
                                ...localQuizContextParams.bufferLibrary,
                                questionUidOrder: [
                                    ...localQuizContextParams.bufferLibrary.questionUidOrder,
                                    ...Object.keys(data)
                                ]
                            });
                            toggleGetNewQuestion = true;
                        }
                    }
                );
                if (toggleGetNewQuestion) break;
            }
        }
    }

    // V. Function to handle move question
    const handleQuestionGrade = () => {
        // Change to new modality
        setLocalQuizContextParams("bufferQuestion", objectKeyValueUpdate({
            object: localQuizContextParams.bufferQuestion,
            keysHierachy: [localQuizContextParams.currentQuestionUid, "questionData", localQuizContextParams.currentQuestionModality, "graded"],
            targetValue: true
        }));
    }

    try {
        return (
            <div key={1} className="flex flex-row items-center text-center h-16 font-black text-xl -border-y">
                {(arrayIndexOf<string>({
                    array: localQuizContextParams.bufferLibrary.questionUidOrder,
                    targetValue: localQuizContextParams.currentQuestionUid}) > 0) 
                    && <button key={makeid(20)} onClick={() => handleQuestionChange(-1)} className="h-full w-48 -hover-bg-half">PREVIOUS</button>}
                
                <button key={makeid(20)} onClick={() => handleQuestionGrade()} className={`h-full ${currentQuestionData.graded ? "w-0" : "w-full"} -border-l -hover-bg-half`}>{
                    ((!currentQuestionData.graded) && !(currentQuestionData.modality == "FLASHCARD") && !(currentQuestionData.modality == "WORD-CLOUD")) && "SUBMIT"
                }</button>
                
                {(arrayIndexOf<string>({
                    array: localQuizContextParams.bufferLibrary.questionUidOrder,
                    targetValue: localQuizContextParams.currentQuestionUid}) + 1 < localQuizContextParams.bufferLibrary.questionUidOrder.length) || buffetMode
                    ? <button key={makeid(20)} onClick={() => handleQuestionChange(1)} className={`h-full ${currentQuestionData.graded ? "w-full" : "w-48"} -border-l -hover-bg-half`}>NEXT</button>
                    : currentQuestionData.graded && <button key={makeid(20)} onClick={() => {
                            setGlobalParams("isLoading", true);
                            if (window !== undefined) window.location.reload();
                        }} className={`h-full w-full -border-l -hover-bg-half`}>FINISH</button>
                }
            </div>
        );
    } catch (error) {
        return (
            <div className="flex flex-row items-center text-center h-16 font-black text-xl -border-y"></div>
        );
    }
}
