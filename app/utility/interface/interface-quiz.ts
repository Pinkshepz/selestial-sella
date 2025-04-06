import metadata from "@/metadata.json";
import objectUidFill from "@/app/utility/function/object/object-uid-fill";

export type UniversalQuestionModality = QuestionModalityMCQ | QuestionModalityFlashcard | QuestionModalitySelect
export type UniversalQuestionModality_Action = QuestionModalityMCQ_Action | QuestionModalityFlashcard_Action | QuestionModalitySelect_Action

type QuestionData = {
    "BEST-ANSWER"?: QuestionModalityMCQ,
    "MULTIPLE-ANSWER"?: QuestionModalityMCQ,
    "FLASHCARD"?: QuestionModalityFlashcard,
    "SELECT"?: QuestionModalitySelect,
    "WORD-CLOUD"?: QuestionModalityCloud
  };

type QuestionDataAction = {
    "BEST-ANSWER"?: QuestionModalityMCQ_Action,
    "MULTIPLE-ANSWER"?: QuestionModalityMCQ_Action,
    "FLASHCARD"?: QuestionModalityFlashcard_Action,
    "SELECT"?: QuestionModalitySelect_Action
    "WORD-CLOUD"?: QuestionModalityCloud_Action};

export default interface Question {
    libraryConnectionUidFootprint: string[], // libraryUid
    libraryConnectionUid: string[], // libraryUid
    modality: keyof typeof metadata.questionModality,
    questionData: QuestionData
}

export interface QuestionAction {
    libraryConnectionUidFootprint: string[], // libraryUid
    libraryConnectionUid: string[], // libraryUid
    modality: keyof typeof metadata.questionModality,
    questionData: QuestionDataAction
}

export const defaultQuestion = ({
    questionModality,
    libraryUid
}: {
    questionModality: keyof typeof metadata.questionModality,
    libraryUid: string
}): Question => {
    return ({
        "libraryConnectionUidFootprint": [libraryUid],
        "libraryConnectionUid": [libraryUid],
        "modality": questionModality,
        "questionData": {
            [questionModality]: objectUidFill(metadata.questionModality[questionModality].questionDataFormat)
        }
    });
}

export interface QuestionModalityMCQ {
    questionComment: string,
    questionChoicesUidSequence: string[],
    questionChoices: {
        [key: string]: {
            choiceAnswer: boolean,
            choiceComment: string,
            choiceText: string
        }
    },
    questionImageUrl: string,
    questionText: string,
    questionResourceUrl: string
}

export interface QuestionModalityMCQ_Action {
    questionComment: string,
    questionChoicesUidSequence: string[],
    questionChoices: {
        [key: string]: {
            choiceAnswer: boolean,
            choiceComment: string,
            choiceText: string,
            selected: boolean
        }
    },
    questionImageUrl: string,
    questionText: string,
    questionResourceUrl: string,
    graded: boolean
}

export interface QuestionModalityFlashcard {
    questionCardsUidSequence: string[],
    questionCards: {
        [key: string]: {
            cardAllowlipped: boolean,
            cardBackText: string,
            cardFrontText: string,
        }
    },
    questionImageUrl: string,
    questionResourceUrl: string,
    questionText: string
}

export interface QuestionModalityFlashcard_Action {
    questionCardsUidSequence: string[],
    questionCards: {
        [key: string]: {
            cardAllowlipped: boolean,
            cardBackText: string,
            cardFrontText: string,
            flipped: boolean
        }
    },
    questionImageUrl: string,
    questionResourceUrl: string,
    questionText: string,
    graded: boolean
}

export interface QuestionModalitySelect {
    questionColumns: {
        columnsDataUidSequence: string[],
        columnsData: {
            [key: string]: {
                columnText: string,
                columnSelect: {
                    [key: string]: string
                }
            }
        }
    },
    questionRows: {
        rowsDataUidSequence: string[],
        rowsData: {
            [key: string]: {
                rowText: string,
                rowAnswer: {
                    [key: string]: string
                },
            }
        }
    },
    questionText: string,
    questionResourceUrl: string
}
export interface QuestionModalitySelect_Action {
    questionColumns: {
        columnsDataUidSequence: string[],
        columnsData: {
            [key: string]: {
                columnText: string,
                columnSelect: {
                    [key: string]: string
                }
            }
        }
    },
    questionRows: {
        rowsDataUidSequence: string[],
        rowsData: {
            [key: string]: {
                rowText: string,
                rowAnswer: {
                    [key: string]: string
                },
                rowSelect: {
                    [key: string]: string
                }
            }
        }
    },
    questionText: string,
    questionResourceUrl: string,
    graded: boolean
}

export interface QuestionModalityCloud {
    questionImageUrl: string,
    questionText: string,
    questionResourceUrl: string
}

export interface QuestionModalityCloud_Action {
    questionImageUrl: string,
    questionText: string,
    questionResourceUrl: string,
    graded: boolean
}
