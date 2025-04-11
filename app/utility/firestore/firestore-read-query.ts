//// 1.1 Metadata & module & framework
import metadata from "@/metadata.json";
import { getFirestore, query, where, collection, getDocs, WhereFilterOp } from "firebase/firestore";

//// 1.2 Custom React hooks
////     N/A

//// 1.3 React components
////     N/A

//// 1.4 Utility functions
import appClientAlpha from "@/app/utility/firebase/fireclient-alpha";
import appClientBeta from "@/app/utility/firebase/fireclient-beta";

import { getRandomArrayItem } from "../function/array/array-random-pick";

//// 1.5 Public and others
////     N/A


// get database
export default async function firestoreReadQuery({
  firebaseBranch = getRandomArrayItem(metadata.firebaseBranch),
  collectionName,
  queryKey,
  queryComparator,
  queryValue
}: {
  firebaseBranch?: typeof metadata.firebaseBranch[number],
  collectionName: string,
  queryKey: string,
  queryComparator: WhereFilterOp,
  queryValue: string | number
}): Promise<string> {

  // Prepare docs varaible storing fetch data
  let docs: {[key: string]: {[key: string]: any}} = {}
  // Get database
  const getDatabase = () => {
    switch (firebaseBranch) {
      case "ALPHA":
        return getFirestore(appClientAlpha);

      case "BETA":
        return getFirestore(appClientBeta);
        
      default:
        return getFirestore(appClientAlpha);
    }
  }
  
  try {
    // Query data
    const q = query(collection(getDatabase(), collectionName), where(queryKey, queryComparator, queryValue));
    const querySnapshot = await getDocs(q);

    // Extract data
    querySnapshot.forEach((doc) => docs[doc.id] = doc.data());
  } catch (error) {null}
  
  console.log(`✏️ START QUERY READING ${firebaseBranch}/COLLECTION/${collectionName} [${Object.keys(docs).length}]`);
  return JSON.stringify(docs);
}
