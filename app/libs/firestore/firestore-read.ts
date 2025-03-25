import fireapp from '../firebase/fireclient';
import { getFirestore, query, collection, getDocs } from "firebase/firestore";

// get database
export async function firestoreRead({
  collectionName
}: {
  collectionName: string
}): Promise<string> {
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

    return JSON.stringify(docs);
  } catch (error) {
    return "{}";
  }
}
