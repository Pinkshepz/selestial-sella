import makeid from "@/app/utility/function/make-id";

export default function objectUidFill <T>(object: T): T {
    // Replace uid placeholder in format "#UID-n" where n = 1, 2, 3, ... to 20-character (0-9, a-z, A-Z) uid
    console.log("A")
    let stringObject = JSON.stringify(object);

    for (let index = 1; index < 100; index++) {
        const uidPlaceholderString = "#UID-" + String(index); // Uid placeholder format
        
        // Check if stringObject has current uid placeholder, if contains: replace new uid recursively, else return object
        if (stringObject.includes(uidPlaceholderString)) {
            stringObject = stringObject.replaceAll(uidPlaceholderString, makeid(20));
            console.log(uidPlaceholderString)
        } else if (index > 10) break;
    }
    return JSON.parse(stringObject);
}
