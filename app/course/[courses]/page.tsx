import { firestoreRead } from "@/app/libs/firestore/firestore-read";
import { firestoreReadQuery } from "../../libs/firestore/firestore-read-query";
import { TopicInterfaceProvider } from "./topic-provider";
import Interface from "./interface";
import uidObjectToArray from "@/app/libs/utils/uid-object-to-array";

// Dynamic routing <cardsets>
export default async function Quizset ({ params }: { params: {courses: string} }) {
   
    // Fetch library data for this dynamic route
    const courseData = await firestoreReadQuery({
      collectionName: "course",
      queryKey: "abbreviation",
      queryComparator: "==",
      queryValue: params.courses
    }).then((docs) => JSON.parse(docs));

    // Fetch content / question data for this dynamic route
    const courseUid = Object.keys(courseData)[0];
    const topicData = await firestoreReadQuery({
        collectionName: "topic",
        queryKey: "courseUid",
        queryComparator: "==",
        queryValue: courseUid // uid of library
    }).then((docs) => JSON.parse(docs));

    // Fetch all libraries
    const library = await firestoreRead({
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
