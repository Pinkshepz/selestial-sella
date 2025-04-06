"use client";

// app/library/[contents]/components/quiz-edit/quiz-edit-flashcard-function.ts

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import metadata from "@/metadata.json";

//// 1.2 Custom React hooks
////     N/A

//// 1.3 React components
import Question from "@/app/utility/interface/interface-quiz";

//// 1.4 Utility functions
import makeid from "@/app/utility/function/make-id";
import objectKeyValueUpdate from "@/app/utility/function/object/object-dynamic-change";
import objectKeyRetrieve from "@/app/utility/function/object/object-key-retrieve";

//// 1.5 Public and others
////     N/A


// =========================================================================
// 2. FUNCTION TO HANDLE MODALITY [BEST-ANSWER] [MULTIPLE-ANSWER]
// =========================================================================


//// 2.1 Function to duplicate choice
export const processAddQuestionCard = ({
    bufferQuestion,
    questionUid
}: {
    bufferQuestion: {[key: string]: Question},
    questionUid: string,
}): {newCardUid: string, newBufferQuestion: {[key: string]: Question}} => {
    const newCardUid = makeid(length=20);
    return {
        newCardUid: newCardUid,
        newBufferQuestion: objectKeyValueUpdate<typeof bufferQuestion>({
            object: bufferQuestion,
            keysHierachy: [questionUid, "questionData", "FLASHCARD", "questionCards", newCardUid],
            targetValue: metadata.questionModality["FLASHCARD"].questionDataFormat.questionCards["#UID-1"]
        })
    };
}

//// 2.2 Function to duplicate choice
export const processDuplicateQuestionCard = ({
    bufferQuestion,
    questionUid,
    cardUid
}: {
    bufferQuestion: {[key: string]: Question},
    questionUid: string,
    cardUid: string
}): {newCardUid: string, newBufferQuestion: {[key: string]: Question}} => {
    const newCardUid = makeid(length=20);
    return {
        newCardUid: newCardUid,
        newBufferQuestion: objectKeyValueUpdate<typeof bufferQuestion>({
            object: bufferQuestion,
            keysHierachy: [questionUid, "questionData", "FLASHCARD", "questionCards", newCardUid],
            targetValue: objectKeyRetrieve({
                object: bufferQuestion,
                keysHierachy: [questionUid, "questionData", "FLASHCARD", "questionCards", cardUid]
            })
        })
    };
}
