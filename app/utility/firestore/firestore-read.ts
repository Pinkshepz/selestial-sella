import metadata from "@/metadata.json";

import { getFirestore, query, collection, getDocs } from "firebase/firestore";

import appClientAlpha from '../firebase/fireclient-alpha';
import appClientBeta from '../firebase/fireclient-beta';

// get database
export default async function firestoreRead({
  firebaseBranch = metadata.firebaseBranch[Math.round((Math.random() * 100) % (metadata.firebaseBranch.length - 1))],
  collectionName
}: {
  firebaseBranch?: typeof metadata.firebaseBranch[number],
  collectionName: string
}): Promise<string> {
  console.log(`✏️ START READING ${firebaseBranch}/COLLECTION/${collectionName}`);

  if (firebaseBranch == "ALPHA") {
    try {
      // get database
      const dbAlpha = getFirestore(appClientAlpha);
  
      // query data
      const q = query(collection(dbAlpha, collectionName));
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
  
  else if (firebaseBranch == "BETA") {
    try {
      // get database
      const dbBeta = getFirestore(appClientBeta);
  
      // query data
      const q = query(collection(dbBeta, collectionName));
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
  
  else {return "{}";}
}
