import { firestoreReadQuery } from "../../libs/firestore/firestore-read-query";
import { InterfaceProvider } from "./provider-interface";
import Interface from './interface';
import ErrorMessage from '@/app/component/error';
import uidObjectToArray from "@/app/libs/utils/uid-object-to-array";

// Dynamic routing <cardsets>
export default async function Quizset ({ params }: { params: {contents: string} }) {
   
    // Fetch content / question data for this dynamic route
    const questionData = await firestoreReadQuery({
        collectionName: "content",
        queryKey: "library",
        queryComparator: "array-contains",
        queryValue: params.contents
    });

    // Fetch library data for this dynamic route
    const libraryData = await firestoreReadQuery({
        collectionName: "library",
        queryKey: "id",
        queryComparator: "==",
        queryValue: params.contents
    });

    if (Object.keys(questionData).length < 1) {return (
        <ErrorMessage
            errorMessage={`Library ${params.contents} does not exist`}
            errorCode="404-notFound"
            previousRoute="/library" />
        );
    };
    return (
        <InterfaceProvider>
            <Interface
                libraryData={uidObjectToArray(libraryData)[0]}
                questionData={uidObjectToArray(questionData)} />
        </InterfaceProvider>
    );
}
