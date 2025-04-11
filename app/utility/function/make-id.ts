// generate combination of string and number
export default function makeid(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let index = 0; index < length; index++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));      
    }
    
    return result;
}

export function makeNid(length: number) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;

  for (let index = 0; index < length; index++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));      
  }
  
  return Number(result);
}
