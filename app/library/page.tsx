import firestoreRead from "../libs/firestore/firestore-read"

import { LibraryInterfaceProvider } from "./library-provider";

import Interface from "./interface";
import ErrorMessage from "../libs/components/error";

export default async function Library() {
  const contentData = await firestoreRead({collectionName: "library"}).then((docs) => JSON.parse(docs));

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
    );
  }
}
