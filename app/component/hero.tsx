import Particles from "./particles";

const Hero = (): React.ReactNode => {
    return (
        // render hero banner
        <>
            <section className="relative h-[100dvh]">
                <article className="flex flex-col h-full w-full justify-center items-center">
                    <div className="pixellet text-[16vw] text-[16vw] sm:text-[12vw] cursor-default">Selestial</div>
                    <strong className=" text-[7vw] sm:text-[3vw] cursor-default">Second Generation: Sella</strong>
                    <strong className="mt-24 sm:mt-16 cursor-default">Discover the journey of Selec series</strong>
                    <div className="flex flex-wrap justify-center gap-4 mt-8 text-md font-bold">
                        <a href="" id="pri-chip">SelecGame</a>
                        <a href="https://selestial-selecard.vercel.app" id="pri-chip">Selestial Selecard 1.3.6</a>
                        <span id="pri-chip">Selestial Sella 2.0.0</span>
                    </div>
                </article>
                <article className="absolute top-0 left-0 right-0 h-full w-full z-[-10]">
                    <Particles />
                </article>
            </section>
            <section className="relative h-[100dvh]">

            </section>
        </>
    )
}

export default Hero
