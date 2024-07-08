import firestoreWrite from "./firestore-write";
import firestoreDelete from "./firestore-delete";

export default async function firestoreUpdate ({
    collectionName,
    originalData,
    editedData
}: {
    collectionName: string,
    originalData: {[key: string]: {[key: string]: any}},
    editedData: {[key: string]: {[key: string]: any}}
}) {
    let resultLog: {[key: string]: any[]} = {}; // record each doc writing result
    const uidOriginal: string[] = Object.keys(originalData); // all uids of original data
    const uidEdited: string[] = Object.keys(editedData); // all uids of edited data

    for (let index = 0; index < uidEdited.length; index++) {
        const euid = uidEdited[index];
        // compare to original data
        // if edited uid doesn't exist in original ones -> write new doc
        // else compare inner data
        if (!uidOriginal.includes(euid)) {
            const {result, error} = await firestoreWrite({collectionName: collectionName, id: euid, data: editedData[euid]});
            resultLog[euid] = ["write", editedData[euid].id, editedData[euid].name, result, error];
        } else {
            // if inner data is unchanged -> no action
            // else overwrite new data
            if (originalData[euid] === editedData[euid]) {
                resultLog[euid] = ["remain", editedData[euid].id, editedData[euid].name, "-", "-"];
            } else {
                const {result, error} = await firestoreWrite({collectionName: collectionName, id: euid, data: editedData[euid]});
                resultLog[euid] = ["write", editedData[euid].id, editedData[euid].name, result, error];
            }
        }
    }

    for (let index = 0; index < uidOriginal.length; index++) {
        const ouid = uidOriginal[index];
        // check if original uid doesn't exist in edited ones -> delete doc
        if (!uidEdited.includes(ouid)) {
            const {result, error} = await firestoreDelete({collectionName: collectionName, id: ouid});
            resultLog[ouid] = ["delete", originalData[ouid].id, originalData[ouid].name, result, error];
        }
    }

    return resultLog;
}
