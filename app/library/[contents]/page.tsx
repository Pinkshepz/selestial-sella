//// 1.1 Metadata & module & framework
////     N/A

//// 1.2 Custom React hooks
import { ContentInterfaceProvider } from "./content-provider";

//// 1.3 React components
import Interface from './interface';

//// 1.4 Utility functions
import firestoreReadQuery from "@/app/utility/firestore/firestore-read-query";
import uidObjectToArray from "@/app/utility/function/object/uid-object-to-array";

//// 1.5 Public and others
////     N/A

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
