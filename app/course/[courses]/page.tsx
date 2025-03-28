//// 1.1 Metadata & module & framework
////     N/A

//// 1.2 Custom React hooks
import { TopicInterfaceProvider } from "./topic-provider";

//// 1.3 React components
import Interface from "./interface";

//// 1.4 Utility functions
import firestoreRead from "@/app/utility/firestore/firestore-read";
import firestoreReadQuery from "../../utility/firestore/firestore-read-query";
import uidObjectToArray from "@/app/utility/function/object/uid-object-to-array";

//// 1.5 Public and others
////     N/A


// Dynamic routing <cardsets>
export default async function Quizset ({ params }: { params: {courses: string} }) {
   
    // Fetch library data for this dynamic route
    const courseData = await firestoreReadQuery({
        firebaseBranch: "ALPHA",
        collectionName: "course",
        queryKey: "abbreviation",
        queryComparator: "==",
        queryValue: params.courses
    }).then((docs) => JSON.parse(docs));

    // Fetch content / question data for this dynamic route
    const courseUid = Object.keys(courseData)[0];
    const topicData = await firestoreReadQuery({
        firebaseBranch: "ALPHA",
        collectionName: "topic",
        queryKey: "courseUid",
        queryComparator: "==",
        queryValue: courseUid // uid of library
    }).then((docs) => JSON.parse(docs));

    // Fetch all libraries
    const library = await firestoreRead({
        firebaseBranch: "ALPHA",
        collectionName: "library"
    }).then((docs) => JSON.parse(docs));

    return (
        <TopicInterfaceProvider>
            <Interface
                courseData={uidObjectToArray(courseData)[0]}
                topicData={topicData}
                libraryData={library} />
        </TopicInterfaceProvider>
    );
}
