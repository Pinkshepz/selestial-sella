import { firestoreRead } from "../libs/firestore/firestore-read"

import { CourseInterfaceProvider } from "./course-provider";

import Interface from "./interface";
import ErrorMessage from "../component/error";

export default async function Course() {
  const contentData = await firestoreRead("course");

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
    )
  }

}
