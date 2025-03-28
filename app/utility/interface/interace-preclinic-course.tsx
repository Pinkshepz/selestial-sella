export default interface PreclinicCourse {
    id: string,
    name: string,
    description: string,
    image: string,
    tag: string[],
    hidden: boolean
}

export const defaultPreclinicCoruse: PreclinicCourse = {
    id: "",
    name: "",
    description: "",
    image: "",
    tag: [],
    hidden: false
}
