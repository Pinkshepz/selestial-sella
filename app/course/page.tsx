import { firestoreRead } from "../libs/firestore/firestore-read"

import { InterfaceProvider } from "./provider";

import Interface from "./interface";
import ErrorMessage from "../component/error";

import "./styles.css"

export default async function HomePage() {
  const contentData = await firestoreRead("course");

  try {
    return (
      <InterfaceProvider>
        <Interface contentData={contentData} />
      </InterfaceProvider>
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
