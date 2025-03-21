import { firestoreReadQuery } from "../../libs/firestore/firestore-read-query";
import { ContentInterfaceProvider } from "./content-provider";
import Interface from './interface';
import uidObjectToArray from "@/app/libs/utils/uid-object-to-array";
import { quizDataFetcher } from "@/app/libs/ggsheet/data-fetch";

// Dynamic routing <cardsets>
export default async function Quizset ({ params }: { params: {contents: string} }) {
   
    // Fetch library data for this dynamic route
    const libraryData = await firestoreReadQuery({
        collectionName: "library",
        queryKey: "id",
        queryComparator: "==",
        queryValue: params.contents
    });

    // Fetch content or question data for this dynamic route
    const libraryUid = Object.keys(libraryData)[0]; // uid of library
    const questionData = await firestoreReadQuery({
        collectionName: "content",
        queryKey: "library",
        queryComparator: "==",
        queryValue: libraryUid
    });

    // fetch ggsheet data if library data is blank
    const ggSheetImport = (Object.keys(libraryData).length == 0) ?
        await quizDataFetcher({content: params.contents}) :
        {}

    return (
        <ContentInterfaceProvider>
            <Interface
                libraryData={uidObjectToArray(libraryData)[0]}
                questionData={questionData}
                ggSheetImport={ggSheetImport} />
        </ContentInterfaceProvider>
    );
}
