import fireapp from "../firebase/fireclient";
import { getFirestore, query, where, collection, getDocs, WhereFilterOp } from "firebase/firestore";

// get database
export async function firestoreReadQuery ({
  collectionName,
  queryKey,
  queryComparator,
  queryValue
} : {
  collectionName: string,
  queryKey: string,
  queryComparator: WhereFilterOp,
  queryValue: string
}): Promise<{[key: string]: {[key: string]: any}}> {
  try {
    // get database
    const db = getFirestore(fireapp);

    // query data
    const q = query(collection(db, collectionName), where(queryKey, queryComparator, queryValue));
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
