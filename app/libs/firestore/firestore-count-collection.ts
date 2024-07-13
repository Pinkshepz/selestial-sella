import fireapp from '../firebase/fireclient';
import { getFirestore, collection, getCountFromServer } from "firebase/firestore";

// get database
export async function firestoreCountCollection(collectionName: string): Promise<number> {
    try {
        // get database and collection
        const db = getFirestore(fireapp);
        const coll = collection(db, collectionName);
        const snapshot = await getCountFromServer(coll);
        return snapshot.data().count;
    } catch (error) {
        return 0;
      }
}
