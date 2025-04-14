//// 1.1 Metadata & module & framework
////     N/A

//// 1.2 Custom React hooks
import { LocalQuizContextProvider } from "./local-quiz-provider";

//// 1.3 React components
import Library from "@/app/utility/interface/interface-library";

import Interface from './interface';

//// 1.4 Utility functions
import firestoreReadQuery from "@/app/utility/firestore/firestore-read-query";
import firestoreRandomQuiz from "@/app/utility/firestore/firestore-query-random-quiz";
import uidObjectToArray from "@/app/utility/function/object/uid-object-to-array";

//// 1.5 Public and others
////     N/A

// Dynamic routing <cardsets>
export default async function Quizset ({ params }: { params: {quiz: string} }) {

    if (params.quiz === "buffet") {
        const lastEditedMaximum = await firestoreReadQuery({
            firebaseBranch: "ALPHA", collectionName: "quiz",
            queryKey: "metadata", queryComparator: "==", queryValue: "metadata"
        }).then((doc) => JSON.parse(doc).lastEdited);

        const questionData = await firestoreRandomQuiz(2);

        let libraryData = {
            uid: "99-BUFFET",
            id: "99-BUFFET",
            tag: ["99-BUFFET"],
            name: "AURICLE BUFFET",
            description: "Randomly recall questions from every corner of the Auricle",
            image: "https://cdn.shopify.com/s/files/1/0657/3100/2634/files/papier-peint-bulles-eclat-lumineux-et-couleurs-vives_c97c03dd-94c4-4e8d-8a9c-f973e9176e9c.png?v=1730291372",
            questionUidOrder: Object.keys(questionData),
            hidden: false,
            allowShuffleQuestion: false,
            allowShuffleChoice: false,
            bookmark: {},
            mode: {},
            lastEdited: lastEditedMaximum
        }

        return (
            <LocalQuizContextProvider>
                <Interface
                    libraryData={libraryData}
                    questionData={{...questionData}}
                    buffetMode={true} />
            </LocalQuizContextProvider>
        );

    } else {
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
                    questionData={questionData}
                    buffetMode={false} />
            </LocalQuizContextProvider>
        );
    }

}
