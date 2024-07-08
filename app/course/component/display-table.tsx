import Link from "next/link";

import stringToHex from "../../libs/utils/string-to-rgb";

const DisplayRow = ({
    cardUid,
    cardId,
    cardImageLink,
    cardName,
    cardTag
}: {
    cardUid: string,
    cardId: string,
    cardImageLink: string,
    cardName: string,
    cardTag?: string[]
}) => {
    // prepare tag chips
    let tagsElements: React.ReactNode[] = [];

    if (cardTag) {
        cardTag.map((tag) => {
            const color = stringToHex(tag);
            tagsElements.push(
                <div
                    className="flex justify-center items-center h-min px-2 text-sm font-semibold rounded-full max-w-max h-full"
                    style={{
                        backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`,
                        border: `solid 1px rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`
                        }}
                    key={tag}>
                    {tag}
                </div>
                );
            }
        );
    }

    return (
        <tr key={cardUid}>
            <td className="font-bold" key={cardUid + "1"}>
                <div className="flex flex-row items-center gap-2">
                    <div id="frame" className="flex justify-center items-center overflow-hidden bg-cover h-6 w-6 rounded-full border-pri">
                        <img className="h-full" src={cardImageLink} alt="" />
                    </div>
                    {cardId}
                </div>
            </td>
            <td className="font-bold" key={cardUid + "2"}>
                <Link 
                    href={{ pathname: "./course/[courses]" }}
                    as={`course/${cardId}`}
                    className="underline hover:text-pri dark:hover:text-pri-dark ease-in-out duration-300"
                    key={"Link " + cardUid}>
                        {cardName}
                </Link>
            </td>
            <td className="hidden md:table-cell" key={cardUid + "3"}>
                <div className="flex flex-wrap gap-4">
                    {tagsElements}
                </div>
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
            cardTag={content.tag}
            key={content.id}/>
      );
  });

    return (
        <section className="artificial-table flex flex-col justify-start items-center h-full mx-4 text-sm">
            <table className="theme-table">
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Course name</th>
                        <th className="hidden md:flex">Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </section>
    )
}
