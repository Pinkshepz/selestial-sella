"use client";

import { useContentInterfaceContext } from "./content-provider";
import ConfirmPopUp from "@/app/component/confirm-popup";
import SettingInterface from './components/setting';
import QuizInterface from "./components/quiz";
import EditorInterface from "./components/quiz-edit";
import ContentController from "./components/controller";
import LogUpdate from "./components/log-update";
import uidObjectToArray from "@/app/libs/utils/uid-object-to-array";

const DEFAULT_BG = 'https://images.newscientist.com/wp-content/uploads/2022/08/08121245/SEI_117967799.jpg';

export default function Interface ({
    libraryData,
    questionData
}: {
    libraryData: {[key: string]: string}, // {uid: {library data}}
    questionData: {[key: string]: {[key: string]: any}} // {uid: {each question}}
}) {
    // Connect to contentInterfaceContext
    const {contentInterfaceParams, setContentInterfaceParams} = useContentInterfaceContext();

    if (Object.keys(contentInterfaceParams.logUpdate).length !== 0) {
        return (
            <>
                <ContentController />
                <ConfirmPopUp />
                <LogUpdate />
            </>
        );
    } else if (contentInterfaceParams.editMode) {
        return (
            <>
                <ContentController />
                <ConfirmPopUp />
                <EditorInterface
                libraryData={libraryData}
                questionData={questionData} />
            </>
        );
    } else {
        return (
            <>
                <ConfirmPopUp />
                <div className="relative flex flex-col">
                    {(contentInterfaceParams.pageSwitch == false) && 
                    <SettingInterface
                        libraryData={libraryData}
                        questionData={uidObjectToArray(questionData)} />}
        
                    {(contentInterfaceParams.pageSwitch == true) && 
                    <QuizInterface
                        libraryData={libraryData}
                        questionData={uidObjectToArray(questionData)} />}
        
                    <img className='fixed z-[-50] w-full h-full object-cover' src={(libraryData.image !== '') 
                        ? libraryData.image 
                        : DEFAULT_BG} alt=''></img>
                    <div className="glass-cover-spread"></div>
                </div>
            </>
        );
    }
}
