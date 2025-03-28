import Icon from "@/public/icon";

export default function LastEdited () {
    return <span className="flex flex-row items-center gap-2 px-2 py-1 text-md text-nowrap font-black bg-amber/50 dark:bg-amber-dark/50 rounded-lg border border-amber dark:border-amber-dark">
        <Icon icon={"true"} size={16}/>
        LAST EDITED
    </span>;
}
