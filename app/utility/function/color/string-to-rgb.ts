import hexToRgb from "./hex-to-rgb";
import hslToHex from "./hsl-to-hex";

export default function stringToHex (text: string) {
    // turn string to ascii code -> sort both alphabet and number
    let ascii = 0;
    for (let index = 0; index < text.length; index++) {
        const char = text[index];
        ascii += char.charCodeAt(0) * (100 ** (text.length - index - 1));
    }

    // calculate representative color
    return hslToHex((ascii ** 1.8) % 360, 70, 70);
}

export function stringToRgb (text: string) {
    // turn string to ascii code -> sort both alphabet and number
    let ascii = 0;
    for (let index = 0; index < text.length; index++) {
        const char = text[index];
        ascii += char.charCodeAt(0) * (100 ** (text.length - index - 1));
    }

    // calculate representative color
    const color = hexToRgb(hslToHex((ascii ** 1.8) % 360, 70, 70))

    return color;
}
