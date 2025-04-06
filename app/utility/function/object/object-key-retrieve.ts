export default function objectKeyRetrieve ({
    object, // Target object
    keysHierachy
}: {
    object: {[key: string]: any},
    keysHierachy: string[]
}) {
    try {
        // Instantly return object if no keys are passed
        if (keysHierachy.length < 1) {return object}
    
        // Handle in case of one-layered key-value assignment
        if (keysHierachy.length === 1) {return object[keysHierachy[0]]}
    
        // Handle in case of multiple-layered keys => recursive key-value assignment
        return objectKeyRetrieve({
            object: object[keysHierachy[0]],
            keysHierachy: keysHierachy.slice(1, keysHierachy.length)
        });
    } catch (error) {
        return object;
    }
}
