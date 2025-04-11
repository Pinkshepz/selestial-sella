import { getFirestore, query, where, collection, getDocs, limit } from "firebase/firestore";
import appClientAlpha from "@/app/utility/firebase/fireclient-alpha";

import sortUidObjectByValue from "../function/object/sort-uid-object-by-value";

export default async function firestoreRandomQuiz(lastEditedMaximum?: number, fetchLimit: number = 1): Promise<{}> {
    try {
        let docs: {[key: string]: {[key: string]: any}} = {}
        let currentNid

        if (lastEditedMaximum === undefined) {
            currentNid = Date.now()
        } else {
            currentNid = lastEditedMaximum
        }

        const firstNid = 1743954263879;
        const randNid = firstNid + (Math.random() * (currentNid - firstNid));

        // Query data
        let maxFetch = 50;
        while (maxFetch) {
            // Regulate fetch maximum
            if (maxFetch == 0) break;
            maxFetch--;

            // Try query document ">='"
            const q1 = query(collection(getFirestore(appClientAlpha), "quiz"), where("lastEdited", ">=", randNid), limit(fetchLimit));
            const querySnapshot1 = await getDocs(q1);
        
            // Extract data
            querySnapshot1.forEach((doc) => docs[doc.id] = doc.data());
            
            // Break when successful
            if (Object.keys(docs).length > 0) break;

            // Then, try query document "<'"
            const q2 = query(collection(getFirestore(appClientAlpha), "quiz"), where("lastEdited", "<", randNid), limit(fetchLimit));
            const querySnapshot3 = await getDocs(q2);
        
            // Extract data
            querySnapshot3.forEach((doc) => docs[doc.id] = doc.data());
            
            // Break when successful
            if (Object.keys(docs).length > 0) break;
        }

        return sortUidObjectByValue(docs, "lastEdited");
    } catch (error) {
        return {};
    }
}
