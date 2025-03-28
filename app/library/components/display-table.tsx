//// 1.1 Metadata & module & framework
import Link from "next/link";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";

//// 1.3 React components
////     N/A

//// 1.4 Utility functions
import { ChipTextColor } from "@/app/utility/components/chip";

//// 1.5 Public and others
////     N/A


const DisplayRow = ({
    cardUid,
    cardId,
    cardImageLink,
    cardName,
    cardDescription,
    cardMode,
    cardTotalQuestion
}: {
    cardUid: string,
    cardId: string,
    cardImageLink: string,
    cardName: string,
    cardDescription: string,
    cardMode: string,
    cardTotalQuestion?: number
}) => {

    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    return (
        <tr key={cardUid}>
            <td className="font-bold" key={cardUid + "1"}>
                <div className="flex flex-row items-center gap-2 whitespace-nowrap">
                    <div id="frame" className="flex justify-center items-center overflow-hidden bg-cover h-6 w-6 rounded-full border-pri">
                        <img className="h-full" src={cardImageLink} alt="" />
                    </div>
                    {cardId}
                </div>
            </td>
            <td className="font-bold" key={cardUid + "2"}>
                <Link 
                    href={{ pathname: "./library/[courses]" }}
                    onClick={() => setGlobalParams("isLoading", true)}
                    as={`library/${cardId}`}
                    className="underline hover:text-pri dark:hover:text-pri-dark ease-in-out duration-300"
                    key={"Link " + cardUid}>
                        {cardName}
                </Link>
            </td>
            <td className="hidden md:table-cell" key={cardUid + "3"}>
                <ChipTextColor chipText={cardMode} chipIcon={cardMode ? cardMode.toString().toLocaleLowerCase() : "mcq"} chipBackgroungOpacity={0.4} />
            </td>
            <td className="hidden md:table-cell text-center" key={cardUid + "4"}>
                {cardTotalQuestion}
            </td>
            <td className="hidden lg:table-cell" key={cardUid + "5"}>
                {cardDescription}
            </td>
        </tr>
    );
}

export default function TableView ({
    contentData
}: {
    contentData: {[key: string]: {[key: string]: any}}
}): React.ReactNode {
    // Store all rows
    let rows: Array<React.ReactNode> = [];

    // Map contentData into each row
    Object.values(contentData).map((content, index) => {
    const uid = Object.keys(contentData)[index]
    rows.push(
        <DisplayRow 
            cardUid={uid}
            cardId={content.id}
            cardImageLink={content.image}
            cardName={content.name}
            cardDescription={content.description}
            cardMode={content.mode}
            cardTotalQuestion={content.totalQuestion}
            key={content.id}/>
      );
  });

    return (
        <section className="flex flex-col justify-start items-center h-full mx-4 text-sm">
            <table className="theme-table">
                <thead>
                    <tr>
                        <th>Library ID</th>
                        <th>Library name</th>
                        <th className="hidden md:table-cell">Mode</th>
                        <th className="hidden md:table-cell">Questions</th>
                        <th className="hidden lg:table-cell">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </section>
    )
}
