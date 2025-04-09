"use client";

//// 1.1 Metadata & module & framework

//// 1.2 Custom React hooks
import { useGlobalContext } from "@/app/global-provider"
import { useLocalQuizContext } from "@/app/library/[quiz]/local-quiz-provider";
import makeid from "@/app/utility/function/make-id";

//// 1.3 React components

//// 1.4 Utility functions

//// 1.5 Public and others
import Icon from "@/public/icon";


export default function ControllerDisplay () {
    // Connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();

    // Connect to interface context
    const {localQuizContextParams, setLocalQuizContextParams} = useLocalQuizContext();


    const handleSearchKeyChange = (searchKey: string) => {
        setLocalQuizContextParams("searchKey", searchKey);
    }

    return (
        <section className="controller-area">
            <div className="controller-island text-nowrap">

                <button onClick={() => {
                        setGlobalParams("isLoading", true);
                        if (window !== undefined) {
                            window.location.reload();
                        }
                    }}
                    className="controller-menu -smooth-appear">
                    <Icon icon="left" size={16} />
                    <p>BACK TO QUIZ PAGE</p>
                </button>

                <button onClick={() => {
                    setLocalQuizContextParams("discardChangesToggle", !localQuizContextParams.discardChangesToggle);
                    setGlobalParams("popUp", true);
                    setGlobalParams("popUpAction", "discardChangesToggle");
                    setGlobalParams("popUpText", "Discard all changes, all question answer will be resetted");
                }}
                    className="controller-menu -smooth-appear">
                    <Icon icon="false" size={16} />
                    <p>RESET ALL ANSWER</p>
                </button>

                <div className="controller-menu -smooth-appear">
                    <Icon icon="search" size={16} />
                    <span className="input-field" id="quizSearch"
                        contentEditable={true} suppressContentEditableWarning={true}
                        onInput={e => handleSearchKeyChange(e.currentTarget.textContent!)}>
                    </span>
                    {!localQuizContextParams.searchKey && <span className="absolute left-[34px] z-[-10] text-sm">SEARCH QUIZ</span>}
                </div>

                <button className="controller-menu -smooth-appear" 
                    onClick={() => setLocalQuizContextParams("themeToggle", !localQuizContextParams.themeToggle)}>
                    <Icon icon={localQuizContextParams.themeToggle ? "wind" : "sparkles"} size={16} />
                   <p>{localQuizContextParams.themeToggle ? "JET BLACK THEME" : "MIDNIGHT BLUE THEME"}</p>
                </button>

            </div>
        </section>
    );
}
