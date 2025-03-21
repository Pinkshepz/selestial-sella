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
    });

    // Fetch content / question data for this dynamic route
    const courseUid = Object.keys(courseData)[0];
    const courseTopicData = await firestoreReadQuery({
        collectionName: "topic",
        queryKey: "courseUid",
        queryComparator: "==",
        queryValue: courseUid // uid of library
    });

    console.log(courseData)

    return (
        <TopicInterfaceProvider>
            <Interface
                courseData={uidObjectToArray(courseData)[0]}
                courseTopicData={courseTopicData} />
        </TopicInterfaceProvider>
    );
}
