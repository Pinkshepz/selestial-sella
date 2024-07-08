import fireapp from '../firebase/fireclient';
import { getFirestore, query, collection, getDocs } from "firebase/firestore";

// get database
export async function firestoreRead(collectionName: string): Promise<{[key: string]: {[key: string]: any}}> {
  try {
    // get database
    const db = getFirestore(fireapp);

    // query data
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);

    // extract data
    let docs: {[key: string]: {[key: string]: any}} = {}
    querySnapshot.forEach((doc) => {
      docs[doc.id] = doc.data();
    })

    return docs;
  } catch (error) {
    return {0:{"error": error}};
  }
}
