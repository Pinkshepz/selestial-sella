import fireapp from '../firebase/fireclient';
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

// get database
const db = getFirestore(fireapp);

export default async function firestoreDelete({
    collectionName,
    id
}: {
    collectionName: string,
    id: string
}) {
    let result = null;
    let error = null;
    
    try {
        result = await deleteDoc(doc(db, collectionName, id));
    } catch (e) {
        error = e;  
    }
    
    return { result, error };
}
