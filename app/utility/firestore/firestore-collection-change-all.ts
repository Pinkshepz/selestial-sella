// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// DANGEROUS FUNCTION, AFFECTING ENTIRE COLLECTION DATA
// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

import firestoreRead from "./firestore-read";
import firestoreWrite from "./firestore-write";

export default async function firestoreCollectionChangeAll({
    collectionName
}: {
    collectionName: string
}): Promise<string[]> {
    console.log("⚠️ START TRANSFERING ALPHA TO BETA ⚠️");
    try {
        let log: string[] = [];
        const collectionSourceData = await firestoreRead(
            {firebaseBranch: "ALPHA", collectionName: collectionName}).then((docs) => JSON.parse(docs));

        // TRANSFER ALPHA TO BETA IN CASE OF NEW DATA
        Object.keys(collectionSourceData).map((dataUid) => {
            const data = collectionSourceData[dataUid];
            const editedData = {
                ...data,
                nid: Math.round(Math.random() * 10000)
            }

            firestoreWrite({
                firebaseBranch: "ALPHA", collectionName: collectionName, id: dataUid, data: editedData
            });
        });

        console.log(log);
        return log;
    } catch (error) {
        return ["0"];
    }
}
