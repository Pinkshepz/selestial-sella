import firestoreRead from "./firestore-read";
import firestoreWrite from "./firestore-write";

// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// DANGEROUS FUNCTION, AFFECTING ENTIRE COLLECTION DATA
// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

export default async function firestoreCollectionTransferAlphaToBeta({
    collectionName
}: {
    collectionName: string
}): Promise<string[]> {
    console.log("⚠️ START TRANSFERING ALPHA TO BETA ⚠️");
    try {
        let log: string[] = [];
        const collectionSourceData = await firestoreRead(
            {firebaseBranch: "ALPHA", collectionName: collectionName}).then((docs) => JSON.parse(docs));

        const collectionDestinationData = await firestoreRead(
            {firebaseBranch: "BETA", collectionName: collectionName}).then((docs) => JSON.parse(docs));
    
        // TRANSFER ALPHA TO BETA IN CASE OF NEW DATA
        Object.keys(collectionSourceData).map((dataUid) => {
            if (Object.keys(collectionDestinationData).includes(dataUid)) {
                firestoreWrite({
                    firebaseBranch: "BETA", collectionName: collectionName, id: dataUid, data: collectionSourceData[dataUid]
                });
                log.push(dataUid)
            }
        });

        console.log(log);
        return log;
    } catch (error) {
        return ["0"];
    }
}
