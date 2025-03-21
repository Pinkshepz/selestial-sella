import Link from "next/link";
import { ChipTextColor } from "@/app/libs/material/chip";

const DisplayCard = ({
    cardUid,
    cardId,
    cardAbb,
    cardImageLink,
    cardName,
    cardDescription,
    cardTag
}: {
    cardUid: string,
    cardId: string,
    cardAbb: string,
    cardImageLink: string,
    cardName: string,
    cardDescription?: string,
    cardTag?: string[]
}) => {
    // prepare tag chips
    let tagsElements: React.ReactNode[] = [];

    if (cardTag) {
        cardTag.map((tag) => tagsElements.push(<ChipTextColor chipText={tag} chipBackgroungOpacity={0.5}/>)
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
                <p className="mt-12 text-md font-bold">{`${cardId} ￨ ${cardAbb}`}</p>
                <h4 className="mt-1 text-md font-bold">{cardName}</h4>
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
    if (!content.hidden) {
        elements.push(
            <Link 
                href={{ pathname: "./course/[courses]" }}
                as={`course/${content.abbreviation}`}
                key={"Link " + uid}>
                <DisplayCard 
                    cardUid={uid}
                    cardId={content.id}
                    cardAbb={content.abbreviation}
                    cardImageLink={content.image}
                    cardName={content.name}
                    cardDescription={content.description}
                    cardTag={content.tag}
                    key={content.id}/>
            </Link>
        );
    }
  });

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {elements}
    </section>
  );
}
