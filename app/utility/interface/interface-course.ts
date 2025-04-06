export default interface Course {
    uid?: string
    id: string,
    abbreviation: string,
    name: string,
    description: string,
    image: string,
    tag: string[],
    hidden: boolean,
    section: {
        [key: string]: {
            sectionId: string,
            sectionName: string,
            sectionTopics: {
                [key: string]: {
                    topicId: string,
                    topicName: string
                }
            }
        }
    }
}

export const defaultCoruse = (): Course => {
    return {
        id: "0",
        abbreviation: "N",
        name: "New course",
        description: "",
        image: "https://st.depositphotos.com/1411161/2534/i/450/depositphotos_25345533-stock-photo-technical-blueprint.jpg",
        tag: [],
        hidden: false,
        section: {
            "#UID-1": {
                sectionId: "A",
                sectionName: "Section A",
                sectionTopics: {
                    "#UID-2": {
                        topicId: "A1",
                        topicName: "Topic A1"
                    }
                }
            }
        }
    }
}
