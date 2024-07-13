import { firestoreCountCollection } from "./libs/firestore/firestore-count-collection";
import Hero from "./component/hero";
import HomeStats from "./component/home-stats";

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
