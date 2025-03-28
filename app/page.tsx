import { firestoreCountCollection } from "./utility/firestore/firestore-count-collection";
import Hero from "./components/hero";
import HomeStats from "./components/home-stats";

export default async function Home () {
  const courseCount = await firestoreCountCollection("course");
  const libraryCount = await firestoreCountCollection("library");
  const contentCount = await firestoreCountCollection("content");
  
  return (
    <main>
      <Hero/>
      <HomeStats
        courseCount={courseCount} 
        libraryCount={libraryCount} 
        contentCount={contentCount} />
    </main>
  );
}
