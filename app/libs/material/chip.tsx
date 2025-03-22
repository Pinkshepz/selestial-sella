import Icon from "@/public/icon";
import { stringToRgb } from "@/app/libs/utils/string-to-rgb";

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
    fontWeight = 400,
    fontSize = "1rem",
    chipBackgroungOpacity = 0.4,
    textColor = null
}: {
    chipText: string,
    chipIcon?: string,
    fontWeight?: number,
    fontSize?: string,
    chipBackgroungOpacity?: number,
    textColor?: ReturnType<typeof stringToRgb> | null
}) {
    const color = textColor ? textColor : stringToRgb(chipText);
    return (
        <span
            className="px-2 rounded-full"
            style={{
                backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.abs((chipBackgroungOpacity - 0.001) % 1)})`,
                border: `solid 1px rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`,
                fontWeight: fontWeight,
                fontSize: fontSize
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
    fontWeight = 400,
    fontSize = "1rem",
    textColor = null
}: {
    chipText: string,
    chipIcon?: string,
    fontWeight?: number,
    fontSize?: string,
    textColor?: ReturnType<typeof stringToRgb> | null
}) {
    const color = textColor ? textColor : stringToRgb(chipText);
    return (
        <span
            className="px-2 rounded-full"
            style={{
                color: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
                fontWeight: fontWeight,
                fontSize: fontSize
                }}
            key={chipText}>
            {chipIcon && <Icon icon="icon" size={16}/>}
            {chipText}
        </span>
    );
}
