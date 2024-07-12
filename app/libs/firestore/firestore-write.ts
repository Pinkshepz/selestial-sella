import fireapp from '../firebase/fireclient';
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

// get database
const db = getFirestore(fireapp);

export default async function firestoreWrite({
    collectionName,
    id,
    data
}: {
    collectionName: string,
    id: string,
    data: {[key: string]: any}
}) {
    let result = null;
    let error = null;

    console.log("writing", data);
    
    try {
        result = await setDoc(doc(db, collectionName, id), {
            ...data,
            latestUpdated: Timestamp.now()
        }, {
            merge: true
        }
    );
    } catch (e) {
        error = e;  
    }
    
    return { result, error };
}
