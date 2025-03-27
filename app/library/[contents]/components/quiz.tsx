"use client";

import React, { useEffect, useState } from 'react';
import useEventListener from "../../../libs/hooks/useEventListener";

import shuffle from '@/app/libs/function/shuffle';
import formatQuizText from '@/app/libs/function/paragraph';
import { useContentInterfaceContext } from '../content-provider';
import Icon from '@/public/icon';
import { ChipTextColor } from '@/app/libs/components/chip';

export default function QuizInterface ({
    libraryData,
    questionData
}: {
    libraryData: {[key: string]: string}, // {uid: {library data}}
    questionData: {[key: string]: any}[] // {question data}[]
}) {
    // supplement wallpaper
    const BG = "https://media.suara.com/pictures/653x366/2019/12/19/95933-aurora.jpg";

    // Connect to interfaceContext
    const {contentInterfaceParams, setContentInterfaceParams} = useContentInterfaceContext();

    // Create question pool
    const [questionArray, setQuestionArray] = useState(questionData);

    const ESCAPE_KEYS = ['Escape'];
    const ENTER_KEYS = ['Enter'];
    const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const ARROWUP_KEYS = ["ArrowUp"];
    const ARROWDOWN_KEYS = ["ArrowDown"];
    const ARROWLEFT_KEYS = ["ArrowLeft"];
    const ARROWRIGHT_KEYS = ["ArrowRight"];

    // Set keyboard interaction
    function handler({ key }: {key: string}): void {
        // escape key = quit
        if (ESCAPE_KEYS.includes(String(key))) {
            setContentInterfaceParams("pageSwitch", false);
            return;
        }
        // number keys for choice selection
        if (NUMBER_KEYS.includes(String(key))) {
            handleChoiceInteract(
                ((Number(key) - 1) % questionArray[contentInterfaceParams.currentQuestion].choices.length), 
                questionArray[contentInterfaceParams.currentQuestion].mode);
            return;
        }
        // enter for submit and move to next question
        if (ENTER_KEYS.includes(String(key))) {
            !((questionArray[contentInterfaceParams.currentQuestion].choices[0].graded) ||
            (questionArray[contentInterfaceParams.currentQuestion].mode == "flashcard")) 
            ? gradeAllChoices()
            : (contentInterfaceParams.currentQuestion < contentInterfaceParams.questionNumber - 1)
                ? changeQuestion(contentInterfaceParams.currentQuestion + 1)
                : setContentInterfaceParams("pageSwitch", false);
            return;
        }
        // arrow left to go to previous question
        if (ARROWLEFT_KEYS.includes(String(key))) {
            (contentInterfaceParams.currentQuestion > 0) && 
                changeQuestion(contentInterfaceParams.currentQuestion - 1);
            return;
        }
        // arrow right to go to previous question
        if (ARROWRIGHT_KEYS.includes(String(key))) {
            (contentInterfaceParams.currentQuestion < contentInterfaceParams.questionNumber - 1) && 
                changeQuestion(contentInterfaceParams.currentQuestion + 1);
            return;
        }
      }
    
    useEventListener('keydown', handler);

    // Random question on load
    useEffect(() => {
        if (contentInterfaceParams.shuffleQuestion === true) {
            setQuestionArray((prev) => shuffle(prev))}
    }, []);
    
    // Random choice on load
    useEffect(() => {
        if (contentInterfaceParams.shuffleChoice === true) {
            let newQuestionArray: {}[] = [];
            questionArray.map((_question) => {
                newQuestionArray.push(
                    {
                        ..._question,
                        choices: shuffle(_question.choices)
                    }
                );
            });
            setQuestionArray(newQuestionArray);
        }
    }, []);

    const handleChoiceInteract = (choiceIndex: number, mode: string) => {
        if (mode == "flashcard") {
            setQuestionArray((prev) => ([
                ...prev.slice(0, contentInterfaceParams.currentQuestion),
                {
                    ...prev[contentInterfaceParams.currentQuestion],
                    choices: [
                        ...prev[contentInterfaceParams.currentQuestion].choices.slice(0, choiceIndex),
                        {
                            ...prev[contentInterfaceParams.currentQuestion].choices[choiceIndex],
                            graded: !questionArray[contentInterfaceParams.currentQuestion].choices[choiceIndex].graded
                        },
                        ...prev[contentInterfaceParams.currentQuestion].choices.slice(choiceIndex + 1, prev[contentInterfaceParams.currentQuestion].choices.length)
                    ],
                    graded: !questionArray[contentInterfaceParams.currentQuestion].choices[choiceIndex].graded
                },
                ...prev.slice(contentInterfaceParams.currentQuestion + 1, contentInterfaceParams.questionNumber)
            ]));
        } else if (!questionArray[contentInterfaceParams.currentQuestion].graded) {
            switch (mode) {
                case "singleChoice":
                    for (let index = 0; index < Object.keys(questionArray[contentInterfaceParams.currentQuestion].choices).length; index++) {
                        // De-select all questions
                        setQuestionArray((prev) => ([
                            ...prev.slice(0, contentInterfaceParams.currentQuestion),
                            {
                                ...prev[contentInterfaceParams.currentQuestion],
                                choices: [
                                    ...prev[contentInterfaceParams.currentQuestion].choices.slice(0, index),
                                    {
                                        ...prev[contentInterfaceParams.currentQuestion].choices[index],
                                        selected: false
                                    },
                                    ...prev[contentInterfaceParams.currentQuestion].choices.slice(index + 1, prev[contentInterfaceParams.currentQuestion].choices.length)
                                ]
                            },
                            ...prev.slice(contentInterfaceParams.currentQuestion + 1, contentInterfaceParams.questionNumber)
                        ]));
                    }
    
                    // Select selected question
                    setQuestionArray((prev) => ([
                        ...prev.slice(0, contentInterfaceParams.currentQuestion),
                        {
                            ...prev[contentInterfaceParams.currentQuestion],
                            choices: [
                                ...prev[contentInterfaceParams.currentQuestion].choices.slice(0, choiceIndex),
                                {
                                    ...prev[contentInterfaceParams.currentQuestion].choices[choiceIndex],
                                    selected: !prev[contentInterfaceParams.currentQuestion].choices[choiceIndex].selected
                                },
                                ...prev[contentInterfaceParams.currentQuestion].choices.slice(choiceIndex + 1, prev[contentInterfaceParams.currentQuestion].choices.length)
                            ]
                        },
                        ...prev.slice(contentInterfaceParams.currentQuestion + 1, contentInterfaceParams.questionNumber)
                    ]));
    
                    break;
    
                case "multipleChoice":
    
                    setQuestionArray((prev) => ([
                        ...prev.slice(0, contentInterfaceParams.currentQuestion),
                        {
                            ...prev[contentInterfaceParams.currentQuestion],
                            choices: [
                                ...prev[contentInterfaceParams.currentQuestion].choices.slice(0, choiceIndex),
                                {
                                    ...prev[contentInterfaceParams.currentQuestion].choices[choiceIndex],
                                    selected: !prev[contentInterfaceParams.currentQuestion].choices[choiceIndex].selected
                                },
                                ...prev[contentInterfaceParams.currentQuestion].choices.slice(choiceIndex + 1, prev[contentInterfaceParams.currentQuestion].choices.length)
                            ]
                        },
                        ...prev.slice(contentInterfaceParams.currentQuestion + 1, contentInterfaceParams.questionNumber)
                    ]));
    
                    break;
            
                default:
                    break;
            }
        }
    }

    const gradeAllChoices = () => {
        let score_count = 0;
        for (let choiceIndex = 0; choiceIndex < Object.keys(questionArray[contentInterfaceParams.currentQuestion].choices).length; choiceIndex++) {
            
            setQuestionArray((prev) => ([
                ...prev.slice(0, contentInterfaceParams.currentQuestion),
                {
                    ...prev[contentInterfaceParams.currentQuestion],
                    choices: [
                        ...prev[contentInterfaceParams.currentQuestion].choices.slice(0, choiceIndex),
                        {
                            ...prev[contentInterfaceParams.currentQuestion].choices[choiceIndex],
                            graded: true
                        },
                        ...prev[contentInterfaceParams.currentQuestion].choices.slice(choiceIndex + 1, prev[contentInterfaceParams.currentQuestion].choices.length)
                    ],
                    graded: true
                },
                ...prev.slice(contentInterfaceParams.currentQuestion + 1, contentInterfaceParams.questionNumber)
            ]));

            // Record choice score
            if ((questionArray[contentInterfaceParams.currentQuestion].mode == "singleChoice") && questionArray[contentInterfaceParams.currentQuestion].choices[choiceIndex].choiceAnswer) {
                if (questionArray[contentInterfaceParams.currentQuestion].choices[choiceIndex].choiceAnswer == questionArray[contentInterfaceParams.currentQuestion].choices[choiceIndex].selected) {
                    questionArray[contentInterfaceParams.currentQuestion].maxScore = 1;
                    score_count += 1;
                }
            } else if (questionArray[contentInterfaceParams.currentQuestion].mode == "multipleChoice") {
                if (questionArray[contentInterfaceParams.currentQuestion].choices[choiceIndex].choiceAnswer == questionArray[contentInterfaceParams.currentQuestion].choices[choiceIndex].selected) {
                    questionArray[contentInterfaceParams.currentQuestion].maxScore = questionArray[contentInterfaceParams.currentQuestion].choices.length;
                    score_count += 1;
                }
            }
        }

        // Record question score
        questionArray[contentInterfaceParams.currentQuestion].score = score_count;
    }

    const changeQuestion = (value: number) => {
        setContentInterfaceParams("currentQuestion", value);
    }

    const handleReload = () => {
        setContentInterfaceParams("pageSwitch", false);
    }

    // Choice object rendering
    let ChoiceObject: Array<React.ReactNode> = [];

    // Render each choice into html object
    for (let index = 0; index < Object.keys(questionArray[contentInterfaceParams.currentQuestion].choices).length; index++) {
        const _choice = questionArray[contentInterfaceParams.currentQuestion].choices[index];
        if (!_choice.graded) {
            ChoiceObject.push(
                <div id='card-quiz-container' className={'h-full w-full rounded-xl'} key={contentInterfaceParams.currentQuestion + index}>
                    <button 
                        onClick={() => handleChoiceInteract(index, questionArray[contentInterfaceParams.currentQuestion].mode)}
                        id={(_choice["selected"] 
                            ? questionArray[contentInterfaceParams.currentQuestion].mode == 'flashcard'
                                ? 'card-quiz-ter'
                                : 'card-quiz-pri'
                            : 'card-quiz')}
                        className='relative p-1 w-full h-full font-bold text-lg sm:text-xl flex flex-col text-center items-center justify-center rounded-xl'>
                        
                        <div id='choice-front-text' className={"flex flex-wrap items-center justify-center px-2 gap-2 text-center " + (_choice["choiceText"] ? "py-1" : "")}>
                            {formatQuizText(_choice["choiceText"])}
                        </div>

                        {_choice["choiceImage"] ? 
                            <div className='flex h-full max-h-[35vh] p-1'>
                                <img src={_choice["choiceImage"]} alt=""
                                    className='h-full max-h-[40vh] xl:max-h-full w-full rounded-lg object-cover' />
                            </div> : null
                        }

                        {questionArray[contentInterfaceParams.currentQuestion].mode == 'flashcard'
                            ? <span id='answer-type'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                            </span>
                            : questionArray[contentInterfaceParams.currentQuestion].mode == 'singleChoice' 
                                ? <span id='answer-type'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
                                    </svg>
                                </span>
                                : <span id='answer-type'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
                                    </svg>
                                </span>
                            }
                    </button>
                </div>
            );
        } else {
            ChoiceObject.push(
                <div id='card-quiz-container' className='_graded h-full w-full rounded-xl' key={contentInterfaceParams.currentQuestion + index}>
                    <button id={(questionArray[contentInterfaceParams.currentQuestion].mode == "flashcard")
                        // In case of flashcard
                        ? 'card-quiz-ter'
                        // Incase of singleChoice
                        : _choice["choiceAnswer"]
                            // Answer is True
                            ? (_choice["selected"] 
                                ? 'card-quiz-green' // selected is True and choosed -> CORRECT
                                : 'card-quiz-amber') // Answer is True but unchoosed -> INCORRECT
                            // Answer is False
                            : (_choice["selected"] 
                                ? 'card-quiz-red' // Answer is False but choosed -> INCORRECT
                                : 'card-quiz') // Answer is False and unchoosed -> CORRECT
                        }
                        className={'w-full h-full text-lg sm:text-xl ' + ((questionArray[contentInterfaceParams.currentQuestion].mode != "flashcard") && 'cursor-default')}
                        onClick={() => handleChoiceInteract(index, questionArray[contentInterfaceParams.currentQuestion].mode)}>

                            {(questionArray[contentInterfaceParams.currentQuestion].mode != "flashcard")
                                && <div id='choice-front-text' className={(_choice["choiceText"] ? "py-1" : "")}>
                                {formatQuizText(_choice["choiceText"])}
                            </div>}

                            {_choice["choiceBackText"] 
                                && <div id='choice-back-text' className={"flex flex-col text-start " + (_choice["choiceText"] ? "py-1" : "")}>
                                    {formatQuizText(_choice["choiceBackText"])}
                                </div>
                            }

                            {_choice["choiceImage"] 
                                ? <div id='choice-image' className='flex h-full max-h-[35vh] p-1'>
                                    <img src={_choice["choiceImage"]} alt=""
                                        className='h-full max-h-[40vh] xl:max-h-full w-full rounded-lg object-cover' />
                                </div>
                                : null
                            }

                            {(questionArray[contentInterfaceParams.currentQuestion].mode == "flashcard")
                                // In case of flashcard
                                ? null
                                // Incase of singleChoice
                                : _choice["choiceAnswer"]
                                    // Answer is True
                                    ? (_choice["selected"] 
                                        ? <span id='answer-report'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                        </span> // selected is True and choosed -> CORRECT
                                        : <span id='answer-report'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </span>) // Answer is True but unchoosed -> MISSED ANSWER
                                    // Answer is False
                                    : (_choice["selected"] 
                                        ? <span id='answer-report'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </span> // Answer is False but choosed -> INCORRECT
                                        : null) // Answer is False and unchoosed -> OK
                            }
                    </button>
                </div>
            );
        }
    }

    let current_topic: string = questionArray[0].questionSection;
    let question_nav: React.ReactNode[] = [
        !contentInterfaceParams.shuffleQuestion && <h5 key={current_topic + "0"}>{current_topic}</h5>
    ];
    let same_topic_choice_nav: React.ReactNode[] = [];

    for (let i = 0; i < contentInterfaceParams.questionNumber; i++) {
        // Check topic
        if ((current_topic != questionArray[i].questionSection) && (!contentInterfaceParams.shuffleQuestion)) {
            // Push current topic questions
            question_nav.push(
                <div className='pb-4 grid grid-cols-5 gap-2' key={"nav group" + i}>
                    {same_topic_choice_nav}
                </div>
            );

            // Set new topic
            current_topic = questionArray[i].questionSection;
            question_nav.push(<h5 key={current_topic + i}>{current_topic}</h5>);
            
            // Reset
            same_topic_choice_nav = [];
        }

        same_topic_choice_nav.push(
            <button
                id={(contentInterfaceParams.currentQuestion == i)
                    ? 'card-nav-pri'
                    : (questionArray[i].graded)
                        ? (questionArray[i].mode == "flashcard")
                            ? 'card-nav-ter'
                            : (questionArray[i].score == questionArray[i].maxScore)
                                ? 'card-nav-green'
                                : (questionArray[i].score == 0)
                                    ? 'card-nav-red'
                                    : 'card-nav-amber'
                        : 'card-nav-neu'}
                key={i}
                onClick={() => changeQuestion(i)}>
                {i + 1}
            </button>
        );
    }

    // Push current topic questions, lastly
    question_nav.push(
        <div className='pb-4 grid grid-cols-5 gap-2' key={"nav group last"}>
            {same_topic_choice_nav}
        </div>
    );

    return(
        <div className='flex flex-col'>

            <div id='quiz-two-cols-fixed' className='-border-t' key='interface'>

                <aside id="quiz-col-scroll-aside" className='-scroll-none -border-r' key='interface-aside'>

                    <strong className="mx-4 mt-4">{`QUIZ ${libraryData.id}`}</strong>
                    <h1 className="mx-4">{libraryData.name.toLocaleUpperCase()}</h1>
                    <span className="mx-4 mb-8 color-slate">{libraryData.description}</span>
                    <div className="flex flex-row items-center px-4 mb-4">
                        <Icon icon="map" size={16} />
                        <h4 className="ml-2">QUESTIONS</h4>
                    </div>

                    <section className='mx-4 h-max overflow-y-scroll -scroll-none' key='interface-aside-section-2'>
                        <div className='flex flex-col gap-4'>
                            {question_nav}
                        </div>
                    </section>
                </aside>

                <main id="quiz-col-scroll-main" className='-scroll-none backdrop-blur-xl' key='interface-main'>
                    {/* 01 - Top stats bar */}
                    <div className='-border-b flex flex-row items-center relative h-12 w-ful px-4 py-8 flex items-center gap-2'>
                        {/* Question stats */}
                        <div className='flex items-center rounded-xl'>
                            <span className='font-bold hidden sm:inline'>
                                QUESTION</span>
                            <span className='font-bold inline sm:hidden'>
                                QUIZ</span>
                            <span className='px-2 font-bold'>
                                {contentInterfaceParams.currentQuestion + 1}</span>
                            <span className='font-bold'>|</span>
                            <span className='px-2 font-bold'>
                                {contentInterfaceParams.questionNumber}</span>
                            { contentInterfaceParams.shuffleQuestion && <Icon icon='shuffle' size={16} />}
                        </div>
                        <div className='flex items-center w-max px-1 py-1 ml-auto rounded-xl'>
                            <ChipTextColor chipText={questionArray[contentInterfaceParams.currentQuestion].mode} chipIcon={questionArray[contentInterfaceParams.currentQuestion].mode} paddingY={1} />
                        </div>
                    </div>

                    {/* 02 - Question */}
                    <div className='relative w-full p-4 flex flex-col md:flex-row'>
                        {/* Question Image */}
                        {questionArray[contentInterfaceParams.currentQuestion].questionImage ?
                            <img className='max-h-[45vh] md:max-w-[40dvw] lg:max-h-[30dvh] md:mr-4 mb-4 md:mb-0 rounded-2xl'
                                src={questionArray[contentInterfaceParams.currentQuestion].questionImage} alt={questionArray[contentInterfaceParams.currentQuestion].id} /> : null}

                        {/* Question Text */}
                        <div className='flex flex-col w-full lg:min-h-[10dvh] justify-between'>
                            <div className={`relative py-4 h-full flex flex-col ${questionArray[contentInterfaceParams.currentQuestion].questionText.includes("\n") ? "justify-start items-start" : "justify-center items-center"} rounded-xl`}>

                                <div className='font-semibold text-xl text-start'>
                                    {formatQuizText(questionArray[contentInterfaceParams.currentQuestion].questionText)}
                                </div>
                                
                                {questionArray[contentInterfaceParams.currentQuestion].graded 
                                    ? questionArray[contentInterfaceParams.currentQuestion].questionBackText && 
                                        <div className='mt-3 px-2 text-lg text-start'>
                                            {formatQuizText(questionArray[contentInterfaceParams.currentQuestion].questionBackText)}
                                        </div>
                                    : null
                                }
                            
                            </div>
                        </div>
                    </div>

                    {/* 03 - Choice */}
                    <div className={'-scroll-none px-4 pb-4 relative h-full lg:h-full w-full flex flex-col lg:grid gap-4 ' + (questionArray[contentInterfaceParams.currentQuestion].mode == 'flashcard'
                        ? 'lg:grid-cols-1'
                        : Object.keys(questionArray[contentInterfaceParams.currentQuestion].choices).length == 1
                            ? 'lg:grid-cols-1'
                            : 'lg:grid-cols-2')}>
                        {ChoiceObject}
                    </div>
                </main>
            </div>

            {/* 04 - Bottom action bar */}
            <footer className='-border-t w-full h-nav flex flex-row items-center justify-center'>

                <div className="-hover-bg-200 -border-r flex flex-col items-center content-center text-center">
                    <button onClick={() => handleReload()} 
                        className="h-nav px-4">
                        <div className='text-xl font-bold'>
                            <span>QUIT</span>
                        </div>
                    </button>
                </div>

                { !((questionArray[contentInterfaceParams.currentQuestion].choices[0].graded) ||
                    (questionArray[contentInterfaceParams.currentQuestion].mode == "flashcard")) 
                    
                    ? <button className="-hover-bg-200 text-xl h-nav w-full"
                        onClick={() => gradeAllChoices()}>
                        <div className='flex flex-row items-center justify-center gap-2 font-bold'>
                            <span>SUBMIT</span>
                            <Icon icon='right' size={16} />
                        </div>
                    </button>
                    
                    : (contentInterfaceParams.currentQuestion < contentInterfaceParams.questionNumber - 1)
                        ? <div className="flex flex-col w-full items-center content-center text-center">
                            <a className='w-full'>
                                <button className="-hover-bg-200 text-xl h-nav px-3 w-full"
                                    onClick={() => changeQuestion(contentInterfaceParams.currentQuestion + 1)}>
                                    <div className='hidden sm:flex flex-row items-center justify-center gap-2 font-bold'>
                                        <span>NEXT QUESTION</span>
                                        <Icon icon='right' size={16} />
                                    </div>
                                    <div className='flex sm:hidden flex flex-row items-center justify-center gap-2 font-bold'>
                                        <span>NEXT</span>
                                        <Icon icon='right' size={16} />
                                    </div>
                                </button>
                            </a>
                        </div>
                        : <button onClick={() => setContentInterfaceParams("pageSwitch", false)}
                            className="flex flex-col font-bold text-xl w-full h-nav px-4 items-center justify-center text-center">
                            Finish
                        </button>
                }

                { (contentInterfaceParams.currentQuestion > 0) ?
                    <div className="flex flex-col items-center content-center text-center">
                        <button className="-hover-bg-200 -border-l text-xl h-nav px-4"
                            onClick={() => changeQuestion(contentInterfaceParams.currentQuestion - 1)}>
                                <div className='font-bold'>
                                    <span>BACK</span>
                                </div>
                        </button>
                    </div> : null
                }

            </footer>
            <div className="fixed bottom-0 w-dvw h-dvh z-[-100]">
                <img src={libraryData.image ? libraryData.image : BG} alt="" className="absolute h-full w-full z-[-100]" />
                <div className="absolute h-full w-full z-[-90] bg-highlight/95 dark:bg-highlight-dark/90"></div>
                <div className="glass-cover-spread z-[-80]"></div>
            </div>
        </div>
    );
}
