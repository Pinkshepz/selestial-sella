"use client";

import { useGlobalContext } from "@/app/global-provider";
import Icon from "@/public/icon";

export default function ConfirmPopUp (): React.ReactNode {
    // connect to global context
    const {globalParams, setGlobalParams} = useGlobalContext();
    if (globalParams.popUp) {
        return (
            <>
                <div className="glass-cover-screen"></div>
                <section className="main-popup">
                    {!globalParams.popUpAction.startsWith("⟨")
                        ? <h1>CONFIRMATION</h1>
                        : <h1>SERVER EXCEPTION</h1>}
                    <span id="pri-chip">
                        <Icon icon="code" size={16} />
                        {globalParams.popUpAction.split("Toggle")[0]}
                    </span>
                    <h4>{globalParams.popUpText}</h4>
                    <div className="flex flex-row justify-center items-center gap-8 font-bold">
                        <button 
                            onClick={() => {
                                setGlobalParams("popUp", false);
                                setGlobalParams("popUpConfirm", false);
                                setGlobalParams("popUpAction", "");
                                setGlobalParams("popUpText", "");
                            }}
                            id="theme-button">GO BACK</button>
                        {!globalParams.popUpAction.startsWith("⟨") 
                            && <button
                                onClick={() => {
                                    setGlobalParams("popUp", false);
                                    setGlobalParams("popUpConfirm", true);
                                    setGlobalParams("popUpText", "");
                                }}
                                className="text-pri dark:text-pri"
                                id="theme-button">CONFIRM</button>
                        }
                    </div>
                </section>
            </>
        );
    } else {
        return <></>;
    }
}
