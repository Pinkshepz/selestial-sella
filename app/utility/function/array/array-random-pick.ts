export function getRandomArrayItem(arr: any[]): any {
    // Handle empty array
    if (!Array.isArray(arr) || arr.length === 0) return null;

    // Pick random array item
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

export function getMultipleRandomArrayItems(arr: any[], count: number) {
    // Handle empty array
    if (!Array.isArray(arr) || arr.length === 0) return [];
    // Handle if count is greater than array length
    if (count >= arr.length) return [...arr];
  
    const result = [];
    const usedIndices = new Set();
  
    // Pick multiple random array items
    while (result.length < count) {
      let index = Math.floor(Math.random() * arr.length);
      if (!usedIndices.has(index)) {
        result.push(arr[index]);
        usedIndices.add(index);
      }
    }
  
    return result;
}