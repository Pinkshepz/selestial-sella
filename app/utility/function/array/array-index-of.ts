export default function arrayIndexOf<T>({
    array,
    targetValue,
    indexIfError = 0
}: {
    array: Array<T>,
    targetValue: T,
    indexIfError?: number
}): number {
    try {
        // Casually get array index of target value
        return array.indexOf(targetValue);
    } catch (error) {
        return indexIfError;
    }
};
