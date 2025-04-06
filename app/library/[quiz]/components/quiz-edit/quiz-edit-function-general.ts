"use client";

// app/library/[contents]/components/quiz-edit/quiz-edit-general-function.ts

// =========================================================================
// 1. IMPORT
// =========================================================================

//// 1.1 Metadata & module & framework
import metadata from "@/metadata.json";

//// 1.2 Custom React hooks
////     N/A

//// 1.3 React components
import Question, {defaultQuestion} from "@/app/utility/interface/interface-quiz";

//// 1.4 Utility functions
import makeid from "@/app/utility/function/make-id";
import objectKeyValueUpdate from "@/app/utility/function/object/object-dynamic-change";
import objectKeyDelete from "@/app/utility/function/object/object-dynamic-delete";
import objectKeyRetrieve from "@/app/utility/function/object/object-key-retrieve";

//// 1.5 Public and others
////     N/A


// =========================================================================
// 2. FUNCTION TO PROCESS QUESTION CHANGE
// =========================================================================

//// 3.1 Function to add new question
export const processAddQuestion = ({
    bufferQuestion,
    questionModality,
    libraryUid
}: {
    bufferQuestion: {[key: string]: Question},
    questionModality: keyof typeof metadata.questionModality,
    libraryUid: string
}): {newQuestionUid: string, newBufferQuestion: {[key: string]: Question}} => {
    const newQuestionUid = makeid(length=20);
    return {
        newQuestionUid: newQuestionUid,
        newBufferQuestion: objectKeyValueUpdate<typeof bufferQuestion>({
            object: bufferQuestion,
            keysHierachy: [newQuestionUid],
            targetValue: defaultQuestion({questionModality: questionModality, libraryUid: libraryUid})
        })
    };
}

//// 3.2 Function to delete question
export const processDeleteQuestion = ({
    bufferQuestion,
    questionUid
}: {
    bufferQuestion: {[key: string]: Question},
    questionUid: string
}): {[key: string]: Question} => {
    return objectKeyDelete({
        object: bufferQuestion,
        keysHierachy: [],
        keyToDelete: questionUid
    }) as {[key: string]: Question};
}

//// 3.3 Function to duplicate question
export const processDuplicateQuestion = ({
    bufferQuestion,
    questionUid
}: {
    bufferQuestion: {[key: string]: Question},
    questionUid: string
}): {newQuestionUid: string, newBufferQuestion: {[key: string]: Question}} => {
    const newQuestionUid = makeid(length=20);
    return {
        newQuestionUid: newQuestionUid,
        newBufferQuestion: objectKeyValueUpdate<typeof bufferQuestion>({
            object: bufferQuestion,
            keysHierachy: [newQuestionUid],
            targetValue: objectKeyRetrieve({
                object: bufferQuestion,
                keysHierachy: [questionUid]
            })
        })
    };
}

//// 3.4 Function to change question modality
export const processChangeQuestionModality = ({
    bufferQuestion,
    questionUid,
    questionModality
}: {
    bufferQuestion: {[key: string]: Question},
    questionUid: string,
    questionModality: keyof typeof metadata.questionModality
}): {[key: string]: any} => {
    // Change modality property
    let updatedBufferQuestion = objectKeyValueUpdate<typeof bufferQuestion>({
        object: bufferQuestion,
        keysHierachy: [questionUid, "modality"],
        targetValue: questionModality
    });

    // Add default value of question modality if there is no data yet
    if (!Object.keys(
        objectKeyRetrieve({
            object: updatedBufferQuestion,
            keysHierachy: [questionUid, "questionData"]
        })
    ).includes(questionModality)) {
        updatedBufferQuestion = objectKeyValueUpdate({
            object: updatedBufferQuestion,
            keysHierachy: [questionUid, "questionData", questionModality],
            targetValue: metadata.questionModality[questionModality]
        });
    }

    return updatedBufferQuestion;
}

//// 3.4 Function to change rendering position of the array's item
export const processSwapArrayDataString = ({
    object,
    keysHierachyToTargetObjectUidSequenceArray,
    targetString,
    sequenceMoveUnit
}: {
    object: {[key: string]: any},
    keysHierachyToTargetObjectUidSequenceArray: string[],
    targetString: string,
    sequenceMoveUnit: number // -1 means shift to the left by 1 unit, and +1 means shift to the right by 1 unit
}): {[key: string]: any} => {
    // If sequenceMoveUnit is 0, no action
    if (sequenceMoveUnit === 0) {return object}

    // If sequenceMoveUnit is not an integer, no action
    if (sequenceMoveUnit % 1 !== 0) {return object}
    
    try {
        let cloneObject = object;

        // Get current index of target object
        const targetStringSequenceArray = objectKeyRetrieve({
            object: object,
            keysHierachy: keysHierachyToTargetObjectUidSequenceArray
        });

        const i = targetStringSequenceArray.indexOf(targetString); // CurrentTargetObjectIndex
        const l = targetStringSequenceArray.length; // Length of the array

        // If sequenceMoveUnit is negative, move object to the left
        if (sequenceMoveUnit < 0) {
            // Limit abs(sequenceMoveUnit) to less than or equal to i
            // If abs(sequenceMoveUnit) > i, change to i as maximum limit
            sequenceMoveUnit = (Math.abs(sequenceMoveUnit) <= i) ? sequenceMoveUnit : -i;
            // Perform values swap
            cloneObject = objectKeyValueUpdate({
                object: object,
                keysHierachy: keysHierachyToTargetObjectUidSequenceArray,
                targetValue: [
                    ...targetStringSequenceArray.slice(0, i + sequenceMoveUnit),
                    targetStringSequenceArray[i],
                    ...targetStringSequenceArray.slice(i + sequenceMoveUnit, i),
                    ...targetStringSequenceArray.slice(i + 1, l)
                ]
            });
            return cloneObject;
        }

        // Else if sequenceMoveUnit is positive, move object to the right
        if (sequenceMoveUnit > 0) {
            // Limit abs(sequenceMoveUnit) to less than or equal to i
            // If abs(sequenceMoveUnit) > i, change to i as maximum limit
            sequenceMoveUnit = (sequenceMoveUnit <= l - i) ? sequenceMoveUnit : l - i;
            // Perform values swap
            cloneObject = objectKeyValueUpdate({
                object: object,
                keysHierachy: keysHierachyToTargetObjectUidSequenceArray,
                targetValue: [
                    ...targetStringSequenceArray.slice(0, i),
                    ...targetStringSequenceArray.slice(i + 1, i + 1 + sequenceMoveUnit),
                    targetStringSequenceArray[i],
                    ...targetStringSequenceArray.slice(i + 1 + sequenceMoveUnit, l)
                ]
            });
            return cloneObject;
        }
        return object;
    } catch (error) {
        console.log(`QUIZ EDIT > fx.SWAP ERROR ${error}`)
        return object;
    }
}

//// 3.5 Function to insert new item into the array at the given position
export const processInsertArrayDataString = ({
    object,
    keysHierachyToTargetObjectUidSequenceArray,
    targetValueToInsert,
    insertPosition
}: {
    object: {[key: string]: any},
    keysHierachyToTargetObjectUidSequenceArray: string[],
    targetValueToInsert: string,
    insertPosition: number // 0 means first item, -1 means the last item, -2 means the 2nd last item of the area
}): {[key: string]: any} => {
    // If sequenceMoveUnit is not an integer, no action
    if (insertPosition % 1 !== 0) {return object}

    // [+0] A [+1] B [+2]
    // [-3] A [-2] B [-1]
    
    try {
        // Check if target array is an array
        const targetStringSequenceArray = objectKeyRetrieve({
            object: object,
            keysHierachy: keysHierachyToTargetObjectUidSequenceArray
        });
        const l = targetStringSequenceArray.length;
        
        // If sequenceMoveUnit is bigger than target array size (n), no action
        if (insertPosition > l + 1) {return object}
        
        // If sequenceMoveUnit is lesser than negative target array size (-n - 1), no action
        if (insertPosition < -l - 1) {return object}
        
        // Insert position (positive) = Insert position (negative) + len(array) + 1
        if (insertPosition < 0) {insertPosition = insertPosition + l + 1}

        // If sequenceMoveUnit is negative, move object to the left
        return objectKeyValueUpdate({
            object: object,
            keysHierachy: keysHierachyToTargetObjectUidSequenceArray,
            targetValue: [
                ...targetStringSequenceArray.slice(0, insertPosition),
                targetValueToInsert,
                ...targetStringSequenceArray.slice(insertPosition, l)
            ]
        });
    } catch (error) {
        console.log(`QUIZ EDIT > fx.INSERT ERROR ${error}`)
        return object;
    }
}

//// 3.6 Function to delete item of the array by its name
export const processDeleteArrayDataString = ({
    object,
    keysHierachyToTargetObjectUidSequenceArray,
    targetValueToDelete
}: {
    object: {[key: string]: any},
    keysHierachyToTargetObjectUidSequenceArray: string[],
    targetValueToDelete: string
}): {[key: string]: any} => {
    try {
        // Check if target array is an array
        const targetStringSequenceArray = objectKeyRetrieve({
            object: object,
            keysHierachy: keysHierachyToTargetObjectUidSequenceArray
        });
            
        // CurrentTargetObjectIndex
        // If targetValueToDelete is not an array member -> carch error and return default object
        const i = targetStringSequenceArray.indexOf(targetValueToDelete);
        const l = targetStringSequenceArray.length;
        
        // If sequenceMoveUnit is negative, move object to the left]
        return objectKeyValueUpdate({
            object: object,
            keysHierachy: keysHierachyToTargetObjectUidSequenceArray,
            targetValue: [
                ...targetStringSequenceArray.slice(0, i),
                ...targetStringSequenceArray.slice(i + 1, l)
            ]
        });
    } catch (error) {
        return object;
    }
}
