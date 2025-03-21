import Icon from "@/app/libs/material/icon";
import { stringToRgb } from "../utils/string-to-rgb";

export function Chip ({
    chipText,
    chipIcon
}: {
    chipText: string,
    chipIcon?: string
}) {
    return (
        <div className="p-2 text-sm text-white font-bold bg-pri dark:bg-pri-dark">
            {chipIcon && <Icon icon="icon" size={16}/>}
            {chipText}
        </div>
    );
}

export function ChipTextColor ({
    chipText,
    chipIcon,
    chipBackgroungOpacity = 0.4
}: {
    chipText: string,
    chipIcon?: string,
    chipBackgroungOpacity?: number
}) {
    const color = stringToRgb(chipText);
    return (
        <span
            className="px-2 pb-0.5 text-sm font-semibold rounded-full"
            style={{
                backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.abs((chipBackgroungOpacity - 0.001) % 1)})`,
                border: `solid 1px rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`
            }}
            key={chipText}>
            {chipIcon && <Icon icon="icon" size={16}/>}
            {chipText}
        </span>
    );
}

export function TextColor ({
    chipText,
    chipIcon,
    fontWeight = 400
}: {
    chipText: string,
    chipIcon?: string,
    fontWeight?: number
}) {
    const color = stringToRgb(chipText);
    return (
        <span
            className="px-2 pb-0.5 text-sm font-semibold rounded-full"
            style={{
                color: `rgba(${color.r}, ${color.g}, ${color.b})`,
                fontWeight: fontWeight
                }}
            key={chipText}>
            {chipIcon && <Icon icon="icon" size={16}/>}
            {chipText}
        </span>
    );
}
