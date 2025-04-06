//// 1.1 Metadata & module & framework
import metadata from "@/metadata.json";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

//// 1.2 Custom React hooks
////     N/A

//// 1.3 React components
////     N/A

//// 1.4 Utility functions
import appClientAlpha from '../firebase/fireclient-alpha';
import appClientBeta from '../firebase/fireclient-beta';

//// 1.5 Public and others
////     N/A


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
