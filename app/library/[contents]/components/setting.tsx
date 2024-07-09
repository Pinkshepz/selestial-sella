"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';

import { useInterfaceContext } from '../provider-interface';
import stringToHex from "../../../libs/utils/string-to-rgb";
import Icon from "@/public/icon";
import './slider.css'

export default function SettingInterface ({
    libraryData,
    questionData
}: {
    libraryData: {[key: string]: string}, // {uid: {library data}}
    questionData: {[key: string]: any}[] // {uid: {each question}}
}) {
    // Connect to interfaceContext
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();
    
    // Set initial interface parameters
    useEffect(() => setInterfaceParams("shuffleQuestion", (libraryData.shuffleQuestion === "FALSE") ? false : true), []);
    useEffect(() => setInterfaceParams("shuffleChoice", (libraryData.questionShuffle === "FALSE") ? false : true), []);
    useEffect(() => setInterfaceParams("questionNumber", questionData.length), []);
    useEffect(() => setInterfaceParams("currentQuestion", 0), []);

    // Handle toogle shuffle question option
    const handleShuffleQuestionToggle = () => {
        setInterfaceParams("shuffleQuestion", !interfaceParams.shuffleQuestion);
    }

    // Handle toogle shuffle choice option
    const handleShuffleChoiceToggle = () => {
        setInterfaceParams("shuffleChoice", !interfaceParams.shuffleChoice);
    }
    
    // Handle slidebar quiz number option
    const handleNumSlider = (value: number) => {
        setInterfaceParams("questionNumber", value);
    }

    return (
        <div className='min-h-[100lvh] relative pt-16 flex items-center justify-center'>
        
            {/* Start page static information */}
            <div className="panel relative w-full md:w-[70dvw] h-full p-6 m-6">

                {/* Course data */}
                <p>{libraryData.id}</p>

                {/* Title */}
                <h2 className='mt-2'>{libraryData.name}</h2>

                {/* Description */}
                {libraryData.description && <p className='mt-6'>{libraryData.description}</p>}

                {/* Content data */}
                <div className='flex flex-wrap gap-4 items-center mt-4'>
                    <span
                        id='clear-chip'
                        className='text-sm font-semibold'
                        style={{
                            backgroundColor: `rgba(${stringToHex(libraryData.mode).r}, ${stringToHex(libraryData.mode).g}, ${stringToHex(libraryData.mode).b}, 0.4)`,
                            border: `solid 1px rgba(${stringToHex(libraryData.mode).r}, ${stringToHex(libraryData.mode).g}, ${stringToHex(libraryData.mode).b}, 0.7)`
                            }}>
                        <Icon icon={libraryData.mode ? libraryData.mode.toString().toLocaleLowerCase() : "mcq"} size={12} />
                        {libraryData.mode}
                    </span>
                    <span id='pri-chip' className='text-sm font-semibold'>{libraryData.id}</span>
                    <span id='pri-chip' className='text-sm font-semibold'>Total {questionData.length} Questions</span>
                </div>

                {/* Settings */}
                <div className="flex flex-col mt-8"> 
                    {/* Shuffle */}
                    <div className="flex flex-wrap gap-4">
                        {/* Shuffle Quiz */}
                        <button 
                            onClick={() => handleShuffleQuestionToggle()} id='theme-button'
                            className={(interfaceParams?.shuffleQuestion ? "true" : "") + " flex flex-row w-max justify-center items-center"}>
                            <div className="flex flex-row items-center w-fit py-1">
                            <Icon icon='shuffle' size={16}/>
                                <h5 className="font-bold ml-2 mr-4 after:bg-slate-700 dark:after:bg-slate-200">Shuffle Questions</h5>
                            </div>
                            {/* ENABLED OR DISABLED */}
                            {interfaceParams?.shuffleQuestion ? 
                                <h5 className="mr-1 mt-0 font-bold text-pri after:bg-pri">ENABLED</h5> : 
                                <h5 className="mr-1 mt-0 font-bold">DISABLED</h5>}
                        </button>
                        {/* Shuffle Choice */}
                        <button 
                            onClick={() => handleShuffleChoiceToggle()} id='theme-button'
                            className={(interfaceParams?.shuffleChoice ? "true" : "") + " flex flex-row w-max justify-center items-center"}>
                            <div className="flex flex-row items-center w-fit py-1">
                                <Icon icon='shuffle' size={16}/>
                                <h5 className="font-bold ml-2 mr-4 after:bg-slate-700 dark:after:bg-slate-200">Shuffle Choice</h5>
                            </div>
                            {/* ENABLED OR DISABLED */}
                            {interfaceParams?.shuffleChoice ? 
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
                            <h5 className="font-bold text-pri dark:text-pri-dark">{interfaceParams.questionNumber}</h5>
                        </div>
                        <div className="flex flex-row items-center w-full">
                            {/* INPUT - slider */}
                            <input type="range" min={1} max={questionData.length} name='QuizNumRange' 
                                value={interfaceParams.questionNumber} onChange={e => handleNumSlider(Number(e.target.value))}/>
                        </div>
                    </div>
                </div>

                {/* Action */}
                <div className="flex flex-row mt-8 gap-8">
                    <Link href={"./"} className="text-xl">
                        <button id="theme-button">
                            Go back
                        </button>
                    </Link>
                    <a href="#top" className="text-xl">
                        <button id="theme-button"
                            onClick={() => setInterfaceParams("pageSwitch", true)}>
                            Start Quiz
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}
