"use client";

// app/library/[contents]/components/quiz-edit/quiz-edit-mcq-function.ts

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
export const processAddQuestionChoice = ({
    bufferQuestion,
    questionUid,
    questionModality
}: {
    bufferQuestion: {[key: string]: Question},
    questionUid: string,
    questionModality: "BEST-ANSWER" | "MULTIPLE-ANSWER"
}): {newChoiceUid: string, newBufferQuestion: {[key: string]: Question}} => {
    const newChoiceUid = makeid(length=20);
    return {
        newChoiceUid: newChoiceUid,
        newBufferQuestion: objectKeyValueUpdate<typeof bufferQuestion>({
            object: bufferQuestion,
            keysHierachy: [questionUid, "questionData", questionModality, "questionChoices", newChoiceUid],
            targetValue: metadata.questionModality[questionModality].questionDataFormat.questionChoices["#UID-1"]
        })
    };
}

//// 2.2 Function to duplicate choice
export const processDuplicateQuestionChoice = ({
    bufferQuestion,
    questionUid,
    questionModality,
    choiceUid
}: {
    bufferQuestion: {[key: string]: Question},
    questionUid: string,
    questionModality: "BEST-ANSWER" | "MULTIPLE-ANSWER",
    choiceUid: string
}): {newChoiceUid: string, newBufferQuestion: {[key: string]: Question}} => {
    const newChoiceUid = makeid(length=20);
    return {
        newChoiceUid: newChoiceUid,
        newBufferQuestion: objectKeyValueUpdate<typeof bufferQuestion>({
            object: bufferQuestion,
            keysHierachy: [questionUid, "questionData", questionModality, "questionChoices", newChoiceUid],
            targetValue: objectKeyRetrieve({
                object: bufferQuestion,
                keysHierachy: [questionUid, "questionData", questionModality, "questionChoices", choiceUid]
            })
        })
    };
}

//// 2.3 Function to toggle choice answer
export const processToggleChoiceAnswer = ({
    bufferQuestion,
    questionModality,
    questionUid,
    choiceUid
}: {
    bufferQuestion: {[key: string]: Question},
    questionModality: "BEST-ANSWER" | "MULTIPLE-ANSWER",
    questionUid: string,
    choiceUid: string
}): typeof bufferQuestion => {
    if (questionModality === "MULTIPLE-ANSWER") {
        return objectKeyValueUpdate({
            object: bufferQuestion,
            keysHierachy: [questionUid, "questionData", questionModality, "questionChoices", choiceUid, "choiceAnswer"],
            targetValue: !objectKeyRetrieve({
                object: bufferQuestion,
                keysHierachy: [questionUid, "questionData", questionModality, "questionChoices", choiceUid, "choiceAnswer"]
            })
        });
    } else if (questionModality === "BEST-ANSWER") {
        let processedBufferQuestion = bufferQuestion;

        // Firstly, turn all choices answer false
        objectKeyRetrieve({
            object: bufferQuestion,
            keysHierachy: [questionUid, "questionData", questionModality, "questionChoicesUidSequence"]
        }).map((eachChoiceUid: string) => {
            processedBufferQuestion = objectKeyValueUpdate({
                object: processedBufferQuestion,
                keysHierachy: [questionUid, "questionData", questionModality, "questionChoices", eachChoiceUid, "choiceAnswer"],
                targetValue: false
            });
        });

        return objectKeyValueUpdate({
            object: processedBufferQuestion,
            keysHierachy: [questionUid, "questionData", questionModality, "questionChoices", choiceUid, "choiceAnswer"],
            targetValue: true
        });
    } else return bufferQuestion
}
