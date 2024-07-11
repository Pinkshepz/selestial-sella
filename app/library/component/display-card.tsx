"use client";

import Link from "next/link";

import { useGlobalContext } from "@/app/provider";

import stringToHex from "../../libs/utils/string-to-rgb";
import Icon from "@/public/icon";

const DisplayCard = ({
    cardUid,
    cardId,
    cardImageLink,
    cardName,
    cardDescription,
    cardMode
}: {
    cardUid: string,
    cardId: string,
    cardImageLink: string,
    cardName: string,
    cardDescription: string,
    cardMode?: string[]
}) => {

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
                        <span
                            className="flex justify-center items-center gap-1 h-min px-1 text-sm font-semibold rounded-full"
                            style={{
                                backgroundColor: `rgba(${stringToHex(cardMode).r}, ${stringToHex(cardMode).g}, ${stringToHex(cardMode).b}, 0.4)`,
                                border: `solid 1px rgba(${stringToHex(cardMode).r}, ${stringToHex(cardMode).g}, ${stringToHex(cardMode).b}, 0.7)`
                                }}>
                            <Icon icon={cardMode ? cardMode.toString().toLocaleLowerCase() : "mcq"} size={12} />
                            {cardMode}
                        </span>
                        <p className="text-md font-bold">{cardId}</p>
                    </div>
                </div>
            </div>
            <div className="card-2-glow-image">
                {cardImageLink && <img src={cardImageLink} alt="" className='h-full' height={1000} width={1000} />}
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
                key={content.id}/>
        </Link>
        );
    });

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-6">
            {elements}
            <div className="glass-cover-spread"></div>
        </section>
    );
}
