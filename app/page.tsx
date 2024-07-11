"use client";

import { useEffect } from "react";

import { useGlobalContext } from "./provider";

import Hero from "./component/hero";

const Home = () => {

  // connect to global context
  const {globalParams, setGlobalParams} = useGlobalContext();

  useEffect(() => {
    setGlobalParams("isLoading", false);
  }, []);

  return (
    <main>
      <Hero/>
    </main>
  );
}

export default Home
