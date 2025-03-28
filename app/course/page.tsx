//// 1.1 Metadata & module & framework
////     N/A

//// 1.2 Custom React hooks
import { CourseInterfaceProvider } from "./course-provider";

//// 1.3 React components
import Interface from "./interface";

//// 1.4 Utility functions
import firestoreRead from "@/app/utility/firestore/firestore-read";
import ErrorMessage from "@/app/utility/components/error";

//// 1.5 Public and others
////     N/A


export default async function Course() {
  const contentData = await firestoreRead({collectionName: "course"}).then((docs) => JSON.parse(docs));

  try {
    return (
      <CourseInterfaceProvider>
        <Interface contentData={contentData} />
      </CourseInterfaceProvider>
    );
  } catch (error) {
    return (
      <ErrorMessage 
        errorMessage={(error as Error).message}
        errorCode={"Access Denied"}
        previousRoute={"../course"} />
    );
  }
}
