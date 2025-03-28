//// 1.1 Metadata & module & framework
////     N/A

//// 1.2 Custom React hooks
import { LibraryInterfaceProvider } from "./library-provider";

//// 1.3 React components
import Interface from "./interface";

import ErrorMessage from "@/app/utility/components/error";

//// 1.4 Utility functions
import firestoreRead from "@/app/utility/firestore/firestore-read"

//// 1.5 Public and others
////     N/A





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
