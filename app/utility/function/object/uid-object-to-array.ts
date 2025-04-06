export default function uidObjectToArray<T>(
    object: {[key: string]: T} // {uid: {data map}}
): T[] { // turn to {{...data map, uid: uid}}[]
    // array of objects
    let arrayOfObjects: T[] = [];
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
