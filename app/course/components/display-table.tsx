//// 1.1 Metadata & module & framework
import Link from "next/link";

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider";

//// 1.3 React components
import Course from "@/app/utility/interface/interface-course";

//// 1.4 Utility functions
import {stringToRgb} from "@/app/utility/function/color/string-to-rgb";

//// 1.5 Public and others
////     N/A


const DisplayRow = ({
    cardUid,
    cardId,
    cardAbb,
    cardImageLink,
    cardName,
    cardTag
}: {
    cardUid: string,
    cardId: string,
    cardAbb: string,
    cardImageLink: string,
    cardName: string,
    cardTag?: string[]
}) => {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();
    
    // prepare tag chips
    let tagsElements: React.ReactNode[] = [];

    if (cardTag) {
        cardTag.map((tag) => {
            const color = stringToRgb(tag);
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
        <tr key={cardUid} className="-smooth-appear">
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
                    onClick={() => setGlobalParams("isLoading", true)}
                    as={`course/${cardAbb}`}
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
    courseData
}: {
    courseData: {[key: string]: Course}
}): React.ReactNode {
    // Store all rows
    let rows: Array<React.ReactNode> = [];

    // Map courseData into each row
    Object.values(courseData).map((content, index) => {
    const uid = Object.keys(courseData)[index]
    if (!content.hidden) {
        rows.push(
            <DisplayRow 
                cardUid={uid}
                cardId={content.id}
                cardAbb={content.abbreviation}
                cardImageLink={content.image}
                cardName={content.name}
                cardTag={content.tag}
                key={content.id}/>
        );
    }
  });

    return (
        <section className="flex flex-col justify-start items-center h-full mx-4 text-sm">
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
    );
}
