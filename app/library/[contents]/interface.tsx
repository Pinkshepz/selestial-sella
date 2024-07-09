"use client";

import { useInterfaceContext } from "./provider-interface";
import SettingInterface from './components/setting';
import QuizInterface from "./components/quiz";

const DEFAULT_BG = 'https://images.newscientist.com/wp-content/uploads/2022/08/08121245/SEI_117967799.jpg';

export default function Interface ({
    libraryData,
    questionData
}: {
    libraryData: {[key: string]: string}, // {uid: {library data}}
    questionData: {[key: string]: any}[] // {uid: {each question}}
}) {
    // Connect to interfaceContext
    const {interfaceParams, setInterfaceParams} = useInterfaceContext();

    return (
        <div className="relative flex flex-col">
            {(interfaceParams.pageSwitch == false) && 
            <SettingInterface
                libraryData={libraryData}
                questionData={questionData} />}

            {(interfaceParams.pageSwitch == true) && 
            <QuizInterface
                libraryData={libraryData}
                questionData={questionData} />}

            <img className='fixed z-[-50] w-full h-full object-cover' src={(libraryData.image !== '') 
                ? libraryData.image 
                : DEFAULT_BG} alt=''></img>
            <div className="glass-cover-spread"></div>
        </div>
    );
}
