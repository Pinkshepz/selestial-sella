import { useGlobalContext } from "@/app/global-provider";
import { stringToRgb } from "@/app/utility/function/color/string-to-rgb";
import Icon from "@/public/icon";

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
    chipText = "",
    chipIcon,
    fontWeight = 700,
    fontSize = "1rem",
    chipBackgroundOpacity = 0.7,
    chipBorderOpacity = 0.7,
    textColor = null,
    textStringForColor = "",
    paddingY = 0,
    colorTheme = ""
}: {
    chipText?: string,
    chipIcon?: string,
    fontWeight?: number,
    fontSize?: string,
    chipBackgroundOpacity?: number,
    chipBorderOpacity?: number,
    textColor?: ReturnType<typeof stringToRgb> | null,
    textStringForColor?: string,
    paddingY?: number,
    colorTheme?: string
}) {
    const {globalParams, setGlobalParams} = useGlobalContext();
    colorTheme = colorTheme ? colorTheme : globalParams.theme;
    const color = textColor 
        ? textColor 
        : textStringForColor
            ? stringToRgb(textStringForColor, colorTheme)
            : stringToRgb(chipText, colorTheme);

    return (
        <div
            className={`flex flex-row gap-2 items-center w-fit px-2 rounded-lg text-nowrap ${(chipBackgroundOpacity <= 0.3) ? "text-black dark:text-white" : "text-white"}`}
            style={{
                backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.abs((chipBackgroundOpacity - 0.001) % 1)})`,
                border: `solid 1px rgba(${color.r}, ${color.g}, ${color.b}, ${Math.abs((chipBorderOpacity - 0.001) % 1)})`,
                fontWeight: fontWeight,
                fontSize: fontSize,
                paddingTop: paddingY,
                paddingBottom: paddingY
            }}
            key={chipText}>
            {chipIcon && <Icon icon={chipIcon} size={16}/>}
            {chipText}
        </div>
    );
}

export function TextColor ({
    chipText = "",
    chipIcon,
    fontWeight = 700,
    fontSize = "1rem",
    textColor = null,
    textStringForColor = "",
    colorTheme = "",
    opacity = 1
}: {
    chipText?: string,
    chipIcon?: string,
    fontWeight?: number,
    fontSize?: string,
    textColor?: ReturnType<typeof stringToRgb> | null,
    textStringForColor?: string,
    colorTheme?: string,
    opacity?: number
}) {
    const {globalParams, setGlobalParams} = useGlobalContext();
    colorTheme = colorTheme ? colorTheme : globalParams.theme;
    const color = textColor 
        ? textColor 
        : textStringForColor
            ? stringToRgb(textStringForColor, colorTheme)
            : stringToRgb(chipText, colorTheme);

    return (
        <span
            className="flex flex-row gap-2 items-center w-fit px-2 rounded-lg text-nowrap"
            style={{
                color: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
                fontWeight: fontWeight,
                fontSize: fontSize,
                opacity: opacity
            }}
            key={chipText}>
            {chipIcon && <Icon icon={chipIcon} size={16}/>}
            {chipText}
        </span>
    );
}
