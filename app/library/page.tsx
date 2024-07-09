import { firestoreRead } from "../libs/firestore/firestore-read"

import { LibraryInterfaceProvider } from "./library-provider";

import Interface from "./interface";
import ErrorMessage from "../component/error";

export default async function HomePage() {
  const contentData = await firestoreRead("library");

  try {
    return (
      <LibraryInterfaceProvider>
        <Interface contentData={contentData} />
      </LibraryInterfaceProvider>
    );
  } catch (error) {
    return (
      <ErrorMessage 
        errorMessage={(error as Error).message}
        errorCode={"Access Denied"}
        previousRoute={"../library"} />
    )
  }

}
