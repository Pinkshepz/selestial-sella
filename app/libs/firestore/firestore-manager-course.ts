import metadata from "@/metadata.json";

import firestoreWrite from "./firestore-write";
import firestoreDelete from "./firestore-delete";
import object_compare from "../function/object-compare";

export default async function firestoreCourseUpdate ({
    firebaseBranch,
    collectionName,
    originalData,
    editedData,
    forceUpdate
}: {
    firebaseBranch: typeof metadata.firebaseBranch[number],
    collectionName: string,
    originalData: {[key: string]: {[key: string]: any}},
    editedData: {[key: string]: {[key: string]: any}},
    forceUpdate?: boolean
}) {
    console.log(`✏️ START UPDATING ${firebaseBranch}/COLLECTION/COURSE DATA`);

    let resultLog: {[key: string]: {[key: string]: any}} = {}; // record each doc writing result
    const uidOriginal: string[] = Object.keys(originalData); // all uids of original data
    const uidEdited: string[] = Object.keys(editedData); // all uids of edited data
    
    if ((uidOriginal.length === 0) && (uidEdited.length === 0)){
        return {0: {
            action: "reject",
            id: -1,
            name: "", 
            result: "", 
            error: "both original and edited data have no value"
        }};
    }

    // CASE: forece update is true => overwrite all data
    if (forceUpdate) {
        for (let index = 0; index < uidEdited.length; index++) {
            const euid = uidEdited[index];
            const {result, error} = await firestoreWrite({
                firebaseBranch: firebaseBranch, collectionName: collectionName, id: euid, data: editedData[euid]
            });

            resultLog[euid] = {
                action: "write",
                id: editedData[euid].id,
                name: editedData[euid].name, 
                result: result, 
                error: error
            };
            continue;
        }
        return resultLog;
    }


    for (let index = 0; index < uidEdited.length; index++) {
        const euid = uidEdited[index];
        // DEFINE RULES
        // make sure data meet minimum requirement -> present id, name
        if (!editedData[euid].id || !editedData[euid].name) {
            resultLog[euid] = {
                action: "reject",
                id: editedData[euid].id,
                name: editedData[euid].name, 
                result: "", 
                error: `${!editedData[euid].id && "id is not specified"} \n ${!editedData[euid].name && "name is not specified"}`
            };
            continue;
        }

        // compare to original data
        // if edited uid doesn't exist in original ones -> write new doc
        // else compare inner data
        if (!uidOriginal.includes(euid)) {
            const {result, error} = await firestoreWrite({
                firebaseBranch: firebaseBranch, collectionName: collectionName, id: euid, data: editedData[euid]
            });

            resultLog[euid] = {
                action: "write",
                id: editedData[euid].id,
                name: editedData[euid].name, 
                result: result, 
                error: error
            };
            continue;
        }

        // if inner data is unchanged -> no action
        // else overwrite new data
        if (object_compare(originalData[euid], editedData[euid])) {
            resultLog[euid] = {
                action: "remain",
                id: editedData[euid].id,
                name: editedData[euid].name, 
                result: "-",
                error: "-"
            };
        } else {
            const {result, error} = await firestoreWrite({
                firebaseBranch: firebaseBranch, collectionName: collectionName, id: euid, data: editedData[euid]
            });

            resultLog[euid] = {
                action: "edit",
                id: editedData[euid].id,
                name: editedData[euid].name, 
                result: result, 
                error: error
            };
        }
    }

    for (let index = 0; index < uidOriginal.length; index++) {
        const ouid = uidOriginal[index];
        // check if original uid doesn't exist in edited ones -> delete doc
        if (!uidEdited.includes(ouid)) {
            const {result, error} = await firestoreDelete({
                firebaseBranch: firebaseBranch, collectionName: collectionName, id: ouid
            });

            resultLog[ouid] = {
                action: "delete",
                id: originalData[ouid].id,
                name: originalData[ouid].name,
                result: result, 
                error: error
            };
        }
    }
    return resultLog;
}
