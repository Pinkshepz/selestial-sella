"use client";

//// 1.1 Metadata & module & framework
import Image from "next/image";
import Link from "next/link";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";

//// 1.3 React components
import Library from "@/app/utility/interface/interface-library";

//// 1.4 Utility functions
import { ChipTextColor } from "@/app/utility/components/chip";

//// 1.5 Public and others
import aurora from "@/public/images/aurora.png";


const DisplayCard = ({
    cardUid,
    cardId,
    cardImageLink,
    cardName,
    cardDescription,
    // cardMode,
    cardTag
}: {
    cardUid: string,
    cardId: string,
    cardImageLink: string,
    cardName: string,
    cardDescription: string,
    // cardMode: {},
    cardTag?: string[]
}) => {
    // prepare tag chips
    let tagsElements: React.ReactNode[] = [];

    if (cardTag) {cardTag.map((tag) => tagsElements.push(<span key={tag}><ChipTextColor chipText={tag} chipBackgroundOpacity={0.5}/></span>));}

    return (
        // card template
        <article className="card-main -card-hover" key={cardUid}>
            <div className="overflow-hidden">
                {cardImageLink 
                    ? <img src={cardImageLink} alt="" className="w-full" height={1000} width={1000} />
                    : <Image src={aurora} alt="" width={1000} height={1000} />
                }
                <div className="absolute w-full h-full z-[-10] bg-gradient-to-t from-black/60 to-black/60 backdrop-blur-3xl overflow-hidden"></div>
            </div>
            <div className="flex flex-col h-full p-4">
                <h4 className="mt-1 text-md font-bold">{cardName.toLocaleUpperCase()}</h4>
                <p className="mt-auto text-md font-medium">{cardDescription}</p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                    <p className="text-md font-bold">{`${cardId}`}</p>
                    {cardTag && tagsElements}
                </div>
            </div>
        </article>
    );
}

export default function CardView ({
    libraryData
}: {
    libraryData: {[key: string]: Library}
}): React.ReactNode {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // Store all elements
    let elements: Array<React.ReactNode> = [];

    // Map libraryData into each card
    Object.values(libraryData).map((library, index) => {
        const uid = Object.keys(libraryData)[index]
        if (!library.hidden) {
            elements.push(
                <Link 
                    href={{ pathname: "./library/[quiz]" }}
                    onClick={() => setGlobalParams("isLoading", true)}
                    as={`library/${uid}`}
                    key={"Card " + uid}>
                    <DisplayCard 
                        cardUid={uid}
                        cardId={library.id}
                        cardImageLink={library.image}
                        cardName={library.name}
                        cardDescription={library.description}
                        // cardMode={library.mode}
                        cardTag={library.tag}
                        key={library.id}/>
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
