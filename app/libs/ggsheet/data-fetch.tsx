import { getGoogleSheetProps } from './ggsheet';
import makeid from '../utils/make-id';

// CONSTANT VARIABLE
const CARDSET_RANGE = "B1:Z";
const QUIZSET_RANGE = "A1:CZ";

// Dynamic routing <cardsets>
export async function quizDataFetcher({ content }: { content: string }) {
   
    // Fetch cardset data for this dynamic route
    const courseDataRaw: any = await getGoogleSheetProps({
        id: null,
        ref: '[courses]',
        sheetName: "COURSE",
        rangeName: "A1:Z"
      });

      const courseData = courseDataRaw[content.split('-')[0]];
      
      // Verify avaliability of this quizset's course
      if (courseData === undefined) {
          console.log('Library is not avaliable')
          return undefined}
      
    const cardsetDataRaw: {[key: string]: {[key: string]: any}} | undefined = await getGoogleSheetProps({
        id: courseData.SheetID,
        ref: '[content]',
        sheetName: content.split('-')[0] + "-CONTENT",
        rangeName: CARDSET_RANGE
      });
    
    // Verify avaliability of this quizset's course
    if (cardsetDataRaw === undefined) {
        console.log('Quiz set is not avaliable')
        return undefined}

    // Fetch quizset data for this dynamic route
    const questionData: {[key: string]: {[key: string]: any}} | undefined = await getGoogleSheetProps({ 
        id: courseData.SheetID,
        ref: "cardsets",
        sheetName: content,
        rangeName: QUIZSET_RANGE
    }!)

    // If no data, return not found
    if ((questionData === undefined) || (Object.keys(questionData)).length == 0) {
        console.log('There is no question data in the provided quizset code')
        return undefined}

    // Get Id of every questions for indexing and modify data
    const questionDataId = Object.keys(questionData)

    for (let i = 0; i < questionDataId.length; i++) {
        let _choice_structure = [];
        let _count_answer_true = 0;
        const questionRow = questionData[questionDataId[i]];

        try {
            let _choice_num = 1;
            while (_choice_num > 0) {
                if (questionRow["Choice" + (_choice_num)] || (questionRow["ChoiceImageUrl" + (_choice_num)])) {
                    _choice_structure.push({
                        choiceText: questionRow["Choice" + (_choice_num)],
                        choiceimage: questionRow["ChoiceImageUrl" + (_choice_num)],
                        choiceAnswer: questionRow["Answer" + (_choice_num)] === "TRUE",
                        choiceBackText: questionRow["BackText" + (_choice_num)]})
                    if (questionRow["Answer" + (_choice_num)] === "TRUE") {
                        _count_answer_true += 1;
                    }
                } else _choice_num = -1

                // Delete old choice data
                delete questionData[questionDataId[i]]["Choice" + (_choice_num)];
                delete questionData[questionDataId[i]]["ChoiceImageUrl" + (_choice_num)];
                delete questionData[questionDataId[i]]["Answer" + (_choice_num)];
                delete questionData[questionDataId[i]]["BackText" + (_choice_num)];
                delete questionData[questionDataId[i]]["Description" + (_choice_num)];

                _choice_num += 1;
            }

        } catch (error) {
            console.log("MINOR ERROR: Question data entry error at" + questionDataId[i]);
        }

        questionData[questionDataId[i]] = {
            ...questionRow,
            choices: _choice_structure
        }
    }

    let connector: {[key: string]: {[key: string]: any}} = {}

    const modeMap = {
        "Flashcard": "flashcard",
        "One Answer": "singleChoice",
        "Multiple Answer": "multipleChoice",
    }

    Object.values(questionData).map((question) => {
        connector[makeid(20)] = {
            mode: modeMap[question.Mode as keyof typeof modeMap],
            libraryFootprint: [content],
            questionSection: question.Topic,
            questionImage: question.QuestionImageUrl,
            questionText: question.Question,
            questionBackText: question.QuestionBackText,
            library: [content],
            tag: [""],
            choices: question.choices
        }
    })
    
    return (connector);
}
