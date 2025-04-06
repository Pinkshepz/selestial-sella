//// 1.1 Metadata & module & framework
////     N/A

//// 1.2 Custom React hooks
import { LocalQuizContextProvider } from "./local-quiz-provider";

//// 1.3 React components
import Interface from './interface';

//// 1.4 Utility functions
import firestoreReadQuery from "@/app/utility/firestore/firestore-read-query";
import uidObjectToArray from "@/app/utility/function/object/uid-object-to-array";
import Library from "@/app/utility/interface/interface-library";

//// 1.5 Public and others
////     N/A

// Dynamic routing <cardsets>
export default async function Quizset ({ params }: { params: {quiz: string} }) {
   
    // Fetch library data for this dynamic route
    const libraryData = await firestoreReadQuery({
        collectionName: "library",
        queryKey: "uid",
        queryComparator: "==",
        queryValue: params.quiz
    }).then((docs) => JSON.parse(docs));

    // Fetch content or question data for this dynamic route
    const libraryUid = Object.keys(libraryData)[0]; // uid of library
    const questionData = await firestoreReadQuery({
        collectionName: "quiz",
        queryKey: "libraryConnectionUid",
        queryComparator: "array-contains",
        queryValue: libraryUid
    }).then((docs) => JSON.parse(docs));

    return (
        <LocalQuizContextProvider>
            <Interface
                libraryData={uidObjectToArray<Library>(libraryData)[0]}
                questionData={questionData} />
        </LocalQuizContextProvider>
    );
}
