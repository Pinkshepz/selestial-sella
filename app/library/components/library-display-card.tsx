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
import sortUidObjectByValue from "@/app/utility/function/object/sort-uid-object-by-value";


const DisplayCard = ({
    cardUid,
    cardId,
    cardImageLink,
    cardName,
    cardDescription,
    cardQuestionNumber,
    cardTag
}: {
    cardUid: string,
    cardId: string,
    cardImageLink: string,
    cardName: string,
    cardDescription: string,
    cardQuestionNumber: number,
    cardTag?: string[]
}) => {
    // prepare tag chips
    let tagsElements: React.ReactNode[] = [];

    if (cardTag) {cardTag.map((tag) => tagsElements.push(<span key={tag}><ChipTextColor chipText={tag} chipBackgroundOpacity={0.5} colorTheme="dark" /></span>));}

    return (
        // card template
        <article className="card-main -card-hover duration-200 -smooth-appear" key={cardUid}>
            <div className="overflow-hidden">
                {cardImageLink 
                    ? <img src={cardImageLink} alt="" className="w-full" height={1000} width={1000} />
                    : <Image src={aurora} alt="" width={1000} height={1000} />
                }
                <div className="absolute w-full h-full z-[-10] bg-gradient-to-t from-black/90 to-black/40 overflow-hidden"></div>
            </div>
            <div className="flex flex-col h-full p-4">
                <p className="mb-2 text-md font-bold">{`${cardId}`}</p>
                <h4 className="max-h-[48px] mt-1 text-md font-black overflow-hidden">{cardName.toLocaleUpperCase()}</h4>
                <p className="max-h-[36px] mt-6 text-md color-slate overflow-hidden">{cardDescription}</p>
                <div className="flex flex-wrap items-center gap-2 mt-auto">
                    {cardTag && tagsElements}
                    <h5 className='ml-auto px-2 py-1 -hover-bg-active rounded-xl'>{`${cardQuestionNumber} QUESTION${(cardQuestionNumber > 1) ? "S" : ""}`}</h5>
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
    Object.keys(sortUidObjectByValue(libraryData, "id")).map((libraryUid) => {
        const library = libraryData[libraryUid];
        if (!library.hidden) {
            elements.push(
                <Link 
                    href={{ pathname: "./library/[quiz]" }}
                    onClick={() => {
                        setGlobalParams("isLoading", true);
                    }}
                    as={`library/${libraryUid}`}
                    key={"Card " + libraryUid}>
                    <DisplayCard 
                        cardUid={libraryUid}
                        cardId={library.id}
                        cardImageLink={library.image}
                        cardName={library.name}
                        cardDescription={library.description}
                        cardQuestionNumber={library.questionUidOrder.length}
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
