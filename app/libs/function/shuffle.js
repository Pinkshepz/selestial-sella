// Shuffle items in array
export default function shuffle(array) {
    // Copy new array
    let c_array = [...array];

    let currentIndex = c_array.length, randomIndex;
  
    // While there remain elements to shuffle
    while (currentIndex > 0) {
  
      // Pick a remaining element
      randomIndex = Math.floor(((1000 * Math.random()) * (1000 * Math.random())) % c_array.length);
      currentIndex--;
  
      // And swap it with the current element
      [c_array[currentIndex], c_array[randomIndex]] = [
        c_array[randomIndex], c_array[currentIndex]];
    };
  
    return c_array;
}
