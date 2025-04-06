import objectKeyRetrieve from "./object-key-retrieve";
import objectKeyValueUpdate from "./object-dynamic-change";

export default function objectKeyDelete ({
    object, // Target object
    keysHierachy, // [key_1, key_2, key_3, ..., key_n], last key_n will be deleted
    keyToDelete
}: {
    object: {[key: string]: any},
    keysHierachy: string[],
    keyToDelete: string
}): {[key: string]: any} {
    try {
        // If there is no key hierachy, directly delete tarket key
        if (keysHierachy.length === 0) {
            const {[keyToDelete]: keyValue, ...rest} = object;
            return rest;
        }
        
        // Perform key delete
        const objectTarget = objectKeyRetrieve({
            object: object,
            keysHierachy: keysHierachy
        });
        const {[keyToDelete]: keyValue, ...rest } = objectTarget;
        
        return objectKeyValueUpdate({
            object: object,
            keysHierachy: keysHierachy,
            targetValue: rest
        });        
    } catch (error) {
        return object;
    }
}
