"use client";

//// 1.1 Metadata & module & framework
import React, { useEffect } from 'react';
import Link from 'next/link';

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider"
import { useLocalQuizContext } from "@/app/library/[quiz]/local-quiz-provider";

//// 1.3 React components
import Library from '@/app/utility/interface/interface-library';
import Question from '@/app/utility/interface/interface-quiz';

import { ChipTextColor } from '@/app/utility/components/chip';

//// 1.4 Utility functions
////     N/A

//// 1.5 Public and others
import Icon from "@/public/icon";


export default function SettingInterface ({
    libraryData,
    questionData
}: {
    libraryData: Library, // {uid: {library data}}
    questionData: Question[] // {uid: {each question}}
}) {
    // supplement wallpaper
    const BG = "https://media.suara.com/pictures/653x366/2019/12/19/95933-aurora.jpg";
    
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // Connect to interfaceContext
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();

    // manage editing mode on and off
    useEffect(() => {
        if (globalParams.popUpConfirm &&
            (globalParams.popUpAction.toString().includes("turnEditMode"))) {
            setLocalQuizContextParams("editMode", !localQuizContextParams.editMode)
            setGlobalParams("popUpConfirm", false);
            setGlobalParams("popUpAction", "");
        }
    }, [globalParams]);
    
    // Set initial interface parameters
    useEffect(() => setLocalQuizContextParams("shuffleQuestion", libraryData.allowShuffleQuestion), []);
    useEffect(() => setLocalQuizContextParams("shuffleChoice", libraryData.allowShuffleChoice), []);
    useEffect(() => setLocalQuizContextParams("questionNumber", questionData.length), []);
    useEffect(() => setLocalQuizContextParams("currentQuestion", 0), []);

    // Handle toogle shuffle question option
    const handleShuffleQuestionToggle = () => {
        setLocalQuizContextParams("shuffleQuestion", !localQuizContextParams.shuffleQuestion);
    }

    // Handle toogle shuffle choice option
    const handleShuffleChoiceToggle = () => {
        setLocalQuizContextParams("shuffleChoice", !localQuizContextParams.shuffleChoice);
    }
    
    // Handle slidebar quiz number option
    const handleNumSlider = (value: number) => {
        setLocalQuizContextParams("questionNumber", value);
    }

    return (
        <div className='w-dvw h-dvh-nav mt-8 flex flex-col items-center justify-center'>
            <section className='relative w-dvw sm:w-[70dvw] sm:h-[full] mx-auto mt-14 sm:m-auto'>
                {/* Start page static information */}
                <article className="panel relative w-full sm:w-[70dvw] h-[100dvh] sm:h-full p-6">

                    {/* Title */}
                    <h2 className='mt-8 sm:mt-2'>{libraryData.name}</h2>

                    {/* Description */}
                    {libraryData.description && <p className='mt-6'>{libraryData.description}</p>}

                    {/* Content data */}
                    <div className='flex flex-wrap gap-4 items-center mt-4'>
                        <span id='pri-chip' className='text-sm font-semibold'>{libraryData.id}</span>
                        <span id='pri-chip' className='text-sm font-semibold'>Total {questionData.length} Questions</span>
                    </div>

                    {/* Settings */}
                    {(localQuizContextParams.questionNumber > 0) && 
                        <div className="flex flex-col mt-8"> 
                            {/* Shuffle */}
                            <div className="flex flex-wrap gap-4">
                                {/* Shuffle Quiz */}
                                <button 
                                    onClick={() => handleShuffleQuestionToggle()} id='theme-button'
                                    className={(localQuizContextParams?.shuffleQuestion ? "true" : "") + " flex flex-row w-max justify-center items-center"}>
                                    <div className="flex flex-row items-center w-fit py-1">
                                    <Icon icon='shuffle' size={16}/>
                                        <h5 className="font-bold ml-2 mr-4 after:bg-slate-700 dark:after:bg-slate-200">Shuffle Questions</h5>
                                    </div>
                                    {/* ENABLED OR DISABLED */}
                                    {localQuizContextParams?.shuffleQuestion ? 
                                        <h5 className="mr-1 mt-0 font-bold text-pri after:bg-pri">ENABLED</h5> : 
                                        <h5 className="mr-1 mt-0 font-bold">DISABLED</h5>}
                                </button>
                                {/* Shuffle Choice */}
                                <button 
                                    onClick={() => handleShuffleChoiceToggle()} id='theme-button'
                                    className={(localQuizContextParams?.shuffleChoice ? "true" : "") + " flex flex-row w-max justify-center items-center"}>
                                    <div className="flex flex-row items-center w-fit py-1">
                                        <Icon icon='shuffle' size={16}/>
                                        <h5 className="font-bold ml-2 mr-4 after:bg-slate-700 dark:after:bg-slate-200">Shuffle Choice</h5>
                                    </div>
                                    {/* ENABLED OR DISABLED */}
                                    {localQuizContextParams?.shuffleChoice ? 
                                        <h5 className="mr-1 mt-0 font-bold text-pri after:bg-pri">ENABLED</h5> : 
                                        <h5 className="mr-1 mt-0 font-bold">DISABLED</h5>}
                                </button>
                            </div>

                            {/* Question Number */}
                            <div id='theme-button' className="px-2 mr-2 mt-4 inline max-w-[500px]">
                                <div className="flex flex-row items-center">
                                <div>
                                    <Icon icon='tag' size={16}/>
                                </div>
                                    <h5 className="font-bold ml-2 mr-4 whitespace-nowrap">
                                        Total Questions</h5>
                                    {/* Slider number */}
                                    <h5 className="font-bold text-pri dark:text-pri-dark">{localQuizContextParams.questionNumber}</h5>
                                </div>
                                <div className="flex flex-row items-center w-full">
                                    {/* INPUT - slider */}
                                    <input type="range" min={1} max={questionData.length} name='QuizNumRange' 
                                        value={localQuizContextParams.questionNumber} onChange={e => handleNumSlider(Number(e.target.value))}/>
                                </div>
                            </div>
                        </div>
                    }
                    
                    {(localQuizContextParams.questionNumber < 1) && 
                        <div className='mt-8 p-4 rounded-xl border border-sec dark:border-sec-dark font-bold text-sec dark:text-sec-dark bg-red/20 dark:bg-red-dark/20'>
                            It seems that there is no question avaliable in this library. Go to editor mode to add new questions
                        </div>
                    }

                    {/* Action */}
                    <div className="flex flex-wrap lg:flex-row mt-8 gap-8">
                        <Link href={"./"} className="text-md">
                            <button
                                onClick={() => setGlobalParams("isLoading", true)}
                                id="theme-button">
                                GO BACK
                            </button>
                        </Link>
                        {!(localQuizContextParams.questionNumber < 1) && 
                            <a href="#top" className="text-md">
                                <button id="theme-button"
                                    onClick={() => setLocalQuizContextParams("pageSwitch", true)}>
                                    START QUIZ
                                </button>
                            </a>
                        }
                        <div className='hidden lg:inline'>
                            <button
                                onClick={() => {
                                    setGlobalParams("popUp", true);
                                    setGlobalParams("popUpAction", localQuizContextParams.editMode ? "turnEditModeOff" : "turnEditModeOn");
                                    setGlobalParams("popUpText", localQuizContextParams.editMode ? 
                                        "Turn editing mode off. All unsaved changes will be ignored" : 
                                        `Turn editing mode on`);
                                }}
                                id="theme-button"
                                className="lg:ml-auto text-md">
                                <Icon icon={localQuizContextParams.editMode ? "edit" : "map"} size={16} />
                                {localQuizContextParams.editMode ? "EXIT EDIT MODE" : "ENTER EDIT MODE"}
                            </button>
                        </div>
                    </div>
                </article>
                <div className="card-2-glow-image">
                    <img src={libraryData.image ? libraryData.image : BG } alt="" height={1000} width={1000} className='h-full'/>
                </div>
            </section>
        </div>
    );
}
