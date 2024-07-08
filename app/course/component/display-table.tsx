import Link from "next/link";

import hexToRgb from "../../libs/utils/hex-to-rgb";
import hslToHex from "../../libs/utils/hsl-to-hex";

const DisplayRow = ({
    cardUid,
    cardId,
    cardImageLink,
    cardTitle,
    cardDescription,
    cardTag
}: {
    cardUid: string,
    cardId: string,
    cardImageLink: string,
    cardTitle: string,
    cardDescription?: string,
    cardTag?: string[]
}) => {
    // prepare tag chips
    let tagsElements: React.ReactNode[] = [];

    if (cardTag) {
        cardTag.map((tag) => {
            // calculate representative color
            const color = hexToRgb(hslToHex(((tag.charCodeAt(0) * 333) ** 3) % 360, 80, 70))
            tagsElements.push(
                <span
                    className="flex justify-center items-center h-min px-2 text-sm font-semibold rounded-full max-w-max"
                    style={{
                        backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`,
                        border: `solid 1px rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`
                        }}
                    key={tag}>
                    {tag}
                </span>
                );
            }
        );
    }

    return (
        <div className="flex flex-row justify-start items-start gap-8 w-full px-2 py-6 hover:bg-ter/20 dark:hover:bg-card-dark/30 border-b border-slate-400/10 dark:border-slate-400/10" key={cardUid}>
            <span className="w-8 font-bold" key={cardUid + "1"}>{cardId}</span>
            <span className="w-[70dvw] md:w-80 xl:w-96 font-bold" key={cardUid + "2"}>{cardTitle}</span>
            <span className="hidden w-full md:flex md:w-[30dvw] md:flex-wrap md:gap-4 lg:w-[20dvw]" key={cardUid + "3"}>{tagsElements}</span>
            <span className="hidden lg:inline lg:w-[30dvw]" key={cardUid + "4"}>{cardDescription ? cardDescription : "-"}</span>
        </div>
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
        <Link 
            href={{ pathname: "./course/[courses]" }}
            as={`course/${content.id}`}
            key={"Link " + uid}>
            <DisplayRow 
                cardUid={uid}
                cardId={content.id}
                cardImageLink={content.image}
                cardTitle={content.name}
                cardDescription={content.description}
                cardTag={content.tag}
                key={content.id}/>
        </Link>
      );
  });

    return (
        <section className="artificial-table flex flex-col justify-start items-center h-full mx-4 text-sm">
            <div className="flex flex-row justify-center items-start gap-8 px-2 py-2 my-1 font-bold border-b border-slate-300/50 dark:border-slate-400/50">
                <span className="w-8 font-bold">ID</span>
                <span className="w-[70dvw] md:w-80 xl:w-96 font-bold">Course name</span>
                <span className="hidden w-full md:flex md:w-[30dvw] md:flex-wrap md:gap-4 lg:w-[20dvw]">Tags</span>
                <span className="hidden lg:inline lg:w-[30dvw]">Description</span>
            </div>
            <div className="flex flex-col h-full overflow-y-scroll">
                {rows}
            </div>
        </section>
    )
}
