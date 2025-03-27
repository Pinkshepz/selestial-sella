import metadata from "@/metadata.json";

import { getFirestore, doc, deleteDoc } from "firebase/firestore";

import appClientAlpha from '../firebase/fireclient-alpha';
import appClientBeta from '../firebase/fireclient-beta';

export default async function firestoreDelete({
    firebaseBranch,
    collectionName,
    id
}: {
    firebaseBranch: typeof metadata.firebaseBranch[number],
    collectionName: string,
    id: string
}) {
    let [result, error]: any[] = [null, null]; // Variable to store server result logs

    // FIRESTORE ALPHA BRANCH
    if (firebaseBranch == "ALPHA") {
        const dbAlpha = getFirestore(appClientAlpha); // Connect to database

        try {
            result = await deleteDoc(doc(dbAlpha, collectionName, id));
        } catch (e) {
            error = e;
        }
    }

    // FIRESTORE BETA BRANCH
    else if (firebaseBranch == "BETA") {
        const dbBeta = getFirestore(appClientBeta); // Connect to database

        try {
            result = await deleteDoc(doc(dbBeta, collectionName, id));
        } catch (e) {
            error = e;
        }
    }

    return { result, error }
}
