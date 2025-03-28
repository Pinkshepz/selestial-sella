"use client";

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


const DisplayCard = ({
    cardUid,
    cardId,
    cardImageLink,
    cardName,
    cardDescription,
    cardMode,
    cardTotalQuestion,
}: {
    cardUid: string,
    cardId: string,
    cardImageLink: string,
    cardName: string,
    cardDescription: string,
    cardMode?: string,
    cardTotalQuestion?: number
}) => {
    // default background image if image link is not provided
    const BG = "https://media.suara.com/pictures/653x366/2019/12/19/95933-aurora.jpg";

    return (
        // card template
        <article className="relative">
            <div className="card-2-main" key={cardUid}>
                <div className="card-2-image">
                    {cardImageLink && <img src={cardImageLink} alt="" className='h-full' height={1000} width={1000} />}
                </div>
                <div className="card-2-content bg-black/40 dark:bg-black/60 text-white">
                    <h4 className="text-md font-bold">{cardName}</h4>
                    <p className="mt-6">{cardDescription}</p>
                    <div className="flex flex-wrap justify-start items-center gap-2 mt-4">
                        {cardMode && <ChipTextColor chipText={cardMode} chipIcon={cardMode ? cardMode.toString().toLocaleLowerCase() : "mcq"}/>}
                        <p className="text-md font-bold">{cardId}</p>
                        {(cardTotalQuestion !== undefined) && <p className="ml-auto text-md font-bold">{cardTotalQuestion} Q</p>}
                    </div>
                </div>
            </div>
            <div className="card-2-glow-image">
                <img src={cardImageLink ? cardImageLink : BG} alt="" className='h-full' height={1000} width={1000} />
            </div>
        </article>
    );
}

export default function CardView ({
    contentData
}: {
    contentData: {[key: string]: {[key: string]: any}}
}): React.ReactNode {
    
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // Store all elements
    let elements: Array<React.ReactNode> = [];

    // Map contentData into each card
    Object.values(contentData).map((content, index) => {
    const uid = Object.keys(contentData)[index]
    elements.push(
        <Link 
            onClick={() => setGlobalParams("isLoading", true)}
            href={{ pathname: "./library/[courses]" }}
            as={`library/${content.id}`}
            key={"Link " + uid}>
            <DisplayCard 
                cardUid={uid}
                cardId={content.id}
                cardImageLink={content.image}
                cardName={content.name}
                cardDescription={content.description}
                cardMode={content.mode}
                cardTotalQuestion={content.totalQuestion}
                key={content.id}/>
        </Link>
        );
    });

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 px-6">
            {elements}
            <div className="glass-cover-spread"></div>
        </section>
    );
}
