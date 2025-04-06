export default function objectKeyValueUpdate<T>({
    object, // Target object
    keysHierachy, // [key_1, key_2, key_3, ..., key_n]
    targetValue // Newly assigned value of key_n
}: {
    object: {[key: string]: any},
    keysHierachy: string[],
    targetValue: any
}): T {
    try {
        // Instantly return object if no keys are passed
        if (keysHierachy.length < 1) {return object as T}
    
        // Handle in case of one-layered key-value assignment
        if (keysHierachy.length === 1) {return {...object, [keysHierachy[0]]: targetValue} as T}
    
        // Handle in case of multiple-layered keys => recursive key-value assignment
        return {
            ...object,
            [keysHierachy[0]]: objectKeyValueUpdate({
                object: object[keysHierachy[0]],
                keysHierachy: keysHierachy.slice(1, keysHierachy.length),
                targetValue: targetValue
            })
        } as T
    } catch (error) {
        return object as T;
    }
}
