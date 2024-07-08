import Link from "next/link";

import hexToRgb from "../../libs/utils/hex-to-rgb";
import hslToHex from "../../libs/utils/hsl-to-hex";

const DisplayCard = ({
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
                    className="flex justify-center items-center h-min px-2 text-sm font-semibold rounded-full"
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
        // card template
        <article className="card-main" key={cardUid}>
            <div className="overflow-hidden">
                {cardImageLink && <img src={cardImageLink} alt="" className="w-full" height={1000} width={1000} />}
                <div className="absolute w-full h-full z-[-10] bg-gradient-to-t from-black/90 to-transparent"></div>
            </div>
            <div className="p-4 mt-auto">
                <p className="mt-12 text-md font-bold">{cardId}</p>
                <h4 className="mt-1 text-md font-bold">{cardTitle}</h4>
                <div className="flex flex-wrap gap-2 mt-4">
                    {cardTag && tagsElements}
                </div>
            </div>
        </article>
    );
}

export default function CardView ({
    contentData
}: {
    contentData: {[key: string]: {[key: string]: any}}
}): React.ReactNode {
  // Store all elements
  let elements: Array<React.ReactNode> = [];

  // Map contentData into each card
  Object.values(contentData).map((content, index) => {
    const uid = Object.keys(contentData)[index]
    elements.push(
        <Link 
            href={{ pathname: "./course/[courses]" }}
            as={`course/${content.id}`}
            key={"Link " + uid}>
            <DisplayCard 
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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {elements}
    </section>
  );
}
