"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import app from "../libs/firebase/fireclient";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useGlobalContext } from "../provider"
import Icon from "../../public/icon"
import Loading from "../component/loading";
const GOOGLE_LOGO = "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png"

// render login page
const Login = (): React.ReactNode => {
    // access web router
    const router = useRouter();

    const auth = getAuth(app);
    console.log((auth.currentUser))

    // access global data
    const {globalParams, setGlobalParams} = useGlobalContext();

    useEffect(() => {
        setGlobalParams("isLoading", false);
    }, []);

    // render pop-up window for sign in Google account
    const signInWithGoogle = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            console.error("Error signing in with Google: ", error.message)
        }
    }

    const handleLogOut = async () => {
        try {
            const auth = getAuth();
            await signOut(auth);
            router.push("/") // redirect to home page
        } catch (error: any) {
            console.error("Error signing out with Google:", error.message)
        }
    }

    if (globalParams.authChecked) {
        return (
            <main className="flex h-[95dvh] px-8 justify-center items-center">
                {(globalParams.user != null) ? (
                    // user is already logged in, render profie with options
                    <section className="flex flex-col justify-center items-center text-center">
                        <h4>Guten ! Your current account is</h4>
    
                        <div id="frame" className="overflow-hidden bg-cover h-32 w-32 mt-12 mb-4 rounded-full border border-base">
                            <img className="h-full w-full" src={globalParams.user.photoURL} alt="" />
                        </div>
                        <h1>{globalParams.user.displayName}</h1>
                        
                        <div className="flex flex-row justify-center items-center gap-2 mb-12">
                            <Icon icon={"mail"} size={20}></Icon>
                            <p>{globalParams.user.email}</p>
                        </div>
    
                        <div className="flex flex-col sm:flex-row gap-6">
                            <button 
                                onClick={handleLogOut}
                                id="theme-button">
                                <Icon icon={"out"} size={28}></Icon>
                                <h4>Log out</h4>
                            </button>
                            <Link 
                                href={"./"}
                                id="theme-button">
                                <Icon icon={"home"} size={28}></Icon>
                                <h4>Home page</h4>
                            </Link>
                        </div>
                    </section>
                ) : (
                    // for new users, render login button
                    <section className="flex flex-col justify-center items-center text-center">
                        <div className="flex flex-row justify-center items-center gap-4 mb-8">
                            <Icon icon="beaker" size={72}></Icon>
                            <Icon icon="tool" size={72}></Icon>
                            <Icon icon="rocket" size={72}></Icon>
                        </div>
                        <h1>Join our brand new content manager system :D</h1>
                        <p className="mt-4">Contribute Selestial content by gaining read and write access to the database</p>
                        <div className="flex flex-col justify-center items-center gap-4 mt-16">
                            <img src={GOOGLE_LOGO} alt="" className="h-6" />
                            <button
                                onClick={signInWithGoogle}
                                id="theme-button">
                                    <h4>Sign in with Google account</h4>
                            </button>
                        </div>
                    </section>
                )}
            </main>
        );
    } else {
        return (
            <main className="flex h-[95dvh] px-8 justify-center items-center">
                <Loading />
            </main>
        );
    }
};

export default Login;
