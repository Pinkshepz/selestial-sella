import hexToRgb from "./hex-to-rgb";
import hslToHex from "./hsl-to-hex";

export default function stringToHex (text: string, colorTheme: string = "dark") {
    const saturation: number = (colorTheme == "dark") ? 70 : 60
    const lightness: number = (colorTheme == "dark") ? 70 : 40

    if (typeof text !== "string") {return hslToHex(0, saturation, lightness)}

    // Turn string to ascii code -> sort both alphabet and number
    let ascii = 0;
    for (let index = 0; index < text.length; index++) {
        const char = text[index];
        ascii += char.charCodeAt(0) * (100 ** (text.length - index - 1));
    }

    // Calculate representative color
    return hslToHex((ascii ** 1.8) % 360, saturation, lightness);
}

export function stringToRgb (text: string, colorTheme: string = "dark") {
    const saturation: number = (colorTheme == "dark") ? 70 : 60
    const lightness: number = (colorTheme == "dark") ? 70 : 40

    if (typeof text !== "string") {return hexToRgb(hslToHex(0, saturation, lightness))}

    // Turn string to ascii code -> sort both alphabet and number
    let ascii = 0;
    for (let index = 0; index < text.length; index++) {
        const char = text[index];
        ascii += char.charCodeAt(0) * (100 ** (text.length - index - 1));
    }

    // Calculate representative color
    const color = hexToRgb(hslToHex((ascii ** 1.8) % 360, saturation, lightness))

    return color;
}
