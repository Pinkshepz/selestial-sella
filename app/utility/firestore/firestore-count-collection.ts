import { getFirestore, collection, getCountFromServer } from "firebase/firestore";
import appClientAlpha from '../firebase/fireclient-alpha';

// get database
export async function firestoreCountCollection(collectionName: string): Promise<number> {
    try {
        // get database and collection
        const db = getFirestore(appClientAlpha);
        const coll = collection(db, collectionName);
        const snapshot = await getCountFromServer(coll);
        return snapshot.data().count;
    } catch (error) {
        return 0;
      }
}
