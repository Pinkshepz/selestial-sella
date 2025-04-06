import metadata from "@/metadata.json";

export default interface Library {
    uid: string,
    id: string, // library display & route id
    name: string,
    description: string,
    image: string,
    hidden: boolean,
    tag: string[],
    mode: {[key in keyof typeof metadata.questionModality]?: number},
    questionUidOrder: string[],
    allowShuffleQuestion: boolean,
    allowShuffleChoice: boolean
}

export const defaultLibrary = ({newUid}: {newUid: string}): Library => {
    return ({
        uid: newUid,
        id: "0",
        name: "New library",
        description: "",
        image: "",
        hidden: false,
        tag: [],
        mode: {},
        questionUidOrder: [],
        allowShuffleQuestion: false,
        allowShuffleChoice: false
    });
}
