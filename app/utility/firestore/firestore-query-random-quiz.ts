import metadata from "@/metadata.json";
import { getFirestore, query, where, collection, getDocs, limit } from "firebase/firestore";

import appClientAlpha from "@/app/utility/firebase/fireclient-alpha";
import sortUidObjectByValue from "../function/object/sort-uid-object-by-value";

export default async function firestoreRandomQuiz(fetchLimit: number = 1): Promise<{}> {
    try {
        let docs: {[key: string]: {[key: string]: any}} = {}
        const randNid = Math.round(Math.random() * metadata.nidScale);

        // Query data
        let maxFetch = 10;
        while (maxFetch) {
            // Regulate fetch maximum
            if (maxFetch == 0) break;
            maxFetch--;

            // Try query document ">='"
            const q1 = query(collection(getFirestore(appClientAlpha), "quiz"), where("nid", ">=", randNid), limit(1));
            const querySnapshot1 = await getDocs(q1);
        
            // Extract data
            querySnapshot1.forEach((doc) => docs[doc.id] = doc.data());
            
            // Break when successful
            if (Object.keys(docs).length > 0) break;

            // Then, try query document "<'"
            const q2 = query(collection(getFirestore(appClientAlpha), "quiz"), where("nid", "<", randNid), limit(1));
            const querySnapshot2 = await getDocs(q2);
        
            // Extract data
            querySnapshot2.forEach((doc) => docs[doc.id] = doc.data());
            
            // Break when successful
            if (Object.keys(docs).length > 0) break;
        }

        return sortUidObjectByValue(docs, "lastEdited");
    } catch (error) {
        return {};
    }
}
