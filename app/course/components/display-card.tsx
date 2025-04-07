"use client";

//// 1.1 Metadata & module & framework
import Link from "next/link";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";

//// 1.3 React components
import Course from "@/app/utility/interface/interface-course";

//// 1.4 Utility functions
import { ChipTextColor } from "@/app/utility/components/chip";

//// 1.5 Public and others
////     N/A


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
    cardDescription: string,
    cardTag?: string[]
}) => {
    // prepare tag chips
    let tagsElements: React.ReactNode[] = [];

    if (cardTag) {cardTag.map((tag) => tagsElements.push(<span key={tag}><ChipTextColor chipText={tag} chipBackgroundOpacity={0.5} colorTheme="dark"/></span>));}

    return (
        // card template
        <article className="card-main -card-hover" key={cardUid}>
            <div className="overflow-hidden">
                {cardImageLink && <img src={cardImageLink} alt="" className="w-full duration-200" height={1000} width={1000} />}
                <div aria-label="effect-filter" className="absolute w-full h-full z-[-10] bg-gradient-to-t from-black/30 to-black/10"></div>
            </div>
            <div className="flex flex-col h-full p-4">
                <p className="w-fit mb-2 px-2 py-1 text-md font-bold -hover-bg-active rounded-lg">{`${cardId} ￨ ${cardAbb}`}</p>
                <h4 className="max-h-[50px] text-md font-black overflow-hidden">{cardName.toLocaleUpperCase()}</h4>
                <p className="max-h-[51px] h-24 mt-6 text-md text-white/80 overflow-hidden">{cardDescription}</p>
                <div className="flex flex-wrap items-center gap-2 mt-auto">
                    {cardTag && tagsElements}
                </div>
            </div>
        </article>
    );
}

export default function CardView ({
    courseData
}: {
    courseData: {[key: string]: Course}
}): React.ReactNode {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // Store all elements
    let elements: Array<React.ReactNode> = [];

    // Map courseData into each card
    Object.values(courseData).map((content, index) => {
        const uid = Object.keys(courseData)[index]
        if (!content.hidden) {
            elements.push(
                <Link 
                    href={{ pathname: "./course/[courses]" }}
                    onClick={() => setGlobalParams("isLoading", true)}
                    as={`course/${content.abbreviation}`}
                    key={"Card " + uid}>
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
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-1">
            {elements}
        </section>
    );
}
