export default function sortUidObjectByValue<T>(
    // {uid: [key to target value: value]}
    object: {[key: string]: {[key: string]: any}}, 
    sortValue: string,
    isAscending: boolean = true
): {[key: string]: T} {
    // handle blank object
    if (Object.keys(object).length == 0) {
        return {};
    }

    // sort by target value
    let sortable = [];

    for (let uid in object) {
        if (typeof object[uid][sortValue] == "string") {
            // turn string to ascii code -> sort both alphabet and number
            // SIID999-A1 > SIID999-AAA
            const asciiStandardLength = 12
            let ascii: number = 0;
            for (let index = 0; index < object[uid][sortValue].length; index++) {
                const char = object[uid][sortValue][index];
                ascii += char.charCodeAt(0) * (100 ** (asciiStandardLength - index - 1));
            }
            sortable.push([ascii, uid]);
        } else {
            sortable.push([object[uid][sortValue], uid])
        }
    }

    sortable.sort(function(a, b) {
        if (isAscending) {
        return (a[0] as number) - (b[0] as number);
        } else {
        return (b[0] as number) - (a[0] as number);
        }
    });

    // reassemble into object format
    let reassembledObject: {[key: string]: T} = {}

    for (let index = 0; index < sortable.length; index++) {
        const eachObject = sortable[index];
        reassembledObject[eachObject[1]] = object[eachObject[1]] as T;
    }

    return reassembledObject;
}
  