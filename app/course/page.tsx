import { firestoreRead } from "../libs/firestore/firestore-read";

import { CourseInterfaceProvider } from "./course-provider";

import Interface from "./interface";
import ErrorMessage from "../libs/material/error";

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
