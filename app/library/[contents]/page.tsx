import firestoreReadQuery from "../../libs/firestore/firestore-read-query";

import { ContentInterfaceProvider } from "./content-provider";

import Interface from './interface';

import uidObjectToArray from "@/app/libs/function/uid-object-to-array";

// Dynamic routing <cardsets>
export default async function Quizset ({ params }: { params: {contents: string} }) {
   
    // Fetch library data for this dynamic route
    const libraryData = await firestoreReadQuery({
        collectionName: "library",
        queryKey: "id",
        queryComparator: "==",
        queryValue: params.contents
    }).then((docs) => JSON.parse(docs));

    // Fetch content or question data for this dynamic route
    const libraryUid = Object.keys(libraryData)[0]; // uid of library
    const questionData = await firestoreReadQuery({
        collectionName: "content",
        queryKey: "library",
        queryComparator: "==",
        queryValue: libraryUid
    }).then((docs) => JSON.parse(docs));

    return (
        <ContentInterfaceProvider>
            <Interface
                libraryData={uidObjectToArray(libraryData)[0]}
                questionData={questionData} />
        </ContentInterfaceProvider>
    );
}
