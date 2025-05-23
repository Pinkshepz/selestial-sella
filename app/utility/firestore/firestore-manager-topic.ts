//// 1.1 Metadata & module & framework
import metadata from "@/metadata.json";

//// 1.2 Custom React hooks
////     N/A

//// 1.3 React components
////     N/A

//// 1.4 Utility functions
import firestoreWrite from "./firestore-write";
import firestoreDelete from "./firestore-delete";
import object_compare from "@/app/utility/function/object/object-compare";

//// 1.5 Public and others
////     N/A


export default async function firestoreUpdateTopic ({
    firebaseBranch,
    collectionName,
    originalData,
    editedData,
}: {
    firebaseBranch: typeof metadata.firebaseBranch[number],
    collectionName: string,
    originalData: {[key: string]: {[key: string]: any}},
    editedData: {[key: string]: {[key: string]: any}}
}) {
    console.log(`✏️ START UPDATE ${firebaseBranch}/COLLECTION/TOPIC DATA`);

    let resultLog: {[key: string]: {[key: string]: any}} = {}; // record each doc writing result
    const uidOriginal: string[] = Object.keys(originalData); // all uids of original data
    const uidEdited: string[] = Object.keys(editedData); // all uids of edited data
    
    if ((uidOriginal.length === 0) && (uidEdited.length === 0)){
        return {0: {
            action: "reject",
            type: "",
            topicUid: "", 
            result: "", 
            error: "both original and edited data have no value"
        }};
    }


    for (let index = 0; index < uidEdited.length; index++) {
        const euid = uidEdited[index];
        // DEFINE RULES
        // make sure data meet minimum requirement -> present id, topicUid
        if (collectionName === "course") {
            if (!editedData[euid].id || !editedData[euid].topicUid) {
                resultLog[euid] = {
                    action: "reject",
                    id: editedData[euid].id,
                    topicUid: editedData[euid].topicUid, 
                    result: "", 
                    error: `${!editedData[euid].id && "id is not specified"} \n ${!editedData[euid].topicUid && "topicUid is not specified"}`
                };
                continue;
            }
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
                type: editedData[euid].contentType,
                topicUid: editedData[euid].topicUid, 
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
                type: editedData[euid].contentType,
                topicUid: editedData[euid].topicUid, 
                result: "-",
                error: "-"
            };
        } else {
            const {result, error} = await firestoreWrite({
                firebaseBranch: firebaseBranch, collectionName: collectionName, id: euid, data: editedData[euid]
            });

            resultLog[euid] = {
                action: "edit",
                type: editedData[euid].contentType,
                topicUid: editedData[euid].topicUid, 
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
                type: originalData[ouid].contentType,
                topicUid: originalData[ouid].topicUid,
                result: result, 
                error: error
            };
        }
    }

    return resultLog;
}
