import metadata from "@/metadata.json";

import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

import appClientAlpha from '../firebase/fireclient-alpha';
import appClientBeta from '../firebase/fireclient-beta';

export default async function firestoreWrite({
    firebaseBranch,
    collectionName,
    id,
    data
}: {
    firebaseBranch: typeof metadata.firebaseBranch[number],
    collectionName: string,
    id: string,
    data: {[key: string]: any}
}) {
    let [result, error]: any[] = [null, null]; // Variable to store server result logs

    // FIRESTORE ALPHA BRANCH
    if (firebaseBranch == "ALPHA") {
        const dbAlpha = getFirestore(appClientAlpha); // Connect to database

        try {
            result = await setDoc(doc(dbAlpha, collectionName, id), {
                ...data,
                lastEdited: Timestamp.now().toMillis()
            }, {
                merge: true
            });
        } catch (e) {
            error = e;
        }
    }

    // FIRESTORE BETA BRANCH
    else if (firebaseBranch == "BETA") {
        const dbBeta = getFirestore(appClientBeta); // Connect to database

        try {
            result = await setDoc(doc(dbBeta, collectionName, id), {
                ...data,
                lastEdited: Timestamp.now().toMillis()
            }, {
                merge: true
            });
        } catch (e) {
            error = e;
        }
    }

    return { result, error }
}
