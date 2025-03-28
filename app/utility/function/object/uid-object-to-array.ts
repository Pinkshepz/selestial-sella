export default function uidObjectToArray (
    object: {[key: string]: {[key: string]: any}} // {uid: {data map}}
): {[key: string]: any}[] { // turn to {{...data map, uid: uid}}[]
    // array of objects
    let arrayOfObjects: {[key: string]: any}[] = [];
    // array of all uid
    const uid: string[] = Object.keys(object);

    for (let index = 0; index < uid.length; index++) {
        const euid = uid[index];
        arrayOfObjects.push({
            uid: euid,
            ...object[euid]
        });
    }
    return arrayOfObjects;
}
