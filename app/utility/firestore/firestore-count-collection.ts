//// 1.1 Metadata & module & framework
import metadata from "@/metadata.json";
import { getFirestore, collection, getCountFromServer } from "firebase/firestore";

//// 1.2 Custom React hooks
////     N/A

//// 1.3 React components
////     N/A

//// 1.4 Utility functions
import appClientAlpha from '../firebase/fireclient-alpha';

//// 1.5 Public and others
////     N/A


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
