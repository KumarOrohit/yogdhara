import Hero from "../../components/home/Hero";
import { useEffect, useState } from "react";
import HomeApiService from "./homeService";
import Banner from "../../components/home/Banner";
// import Blog from "../../components/home/Blog";
import BatchCarousel from "../../components/home/BatchCarousel";
import InstructorsCarousel from "../../components/home/InstructorsCarousel";



const Home = () => {
  const [levels, setLevels] = useState([]);
  const [learnings, setLearnings] = useState([]);
  const [batches, setBatches] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const getHomeDeatils = async () => {
    const levelData = await HomeApiService.getLevelList();
    setLevels(levelData.levels);

    const learningData = await HomeApiService.getLearningList();
    setLearnings(learningData.learnings);

    const batchesData = await HomeApiService.getBatchList();
    setBatches(batchesData.batches);

    const instructorData = await HomeApiService.getInstructorList();
    setInstructors(instructorData.instructors)
  }

  useEffect(() => {
    getHomeDeatils();
  }, [])

  return (
    <>
      <Hero learnings={learnings} levels={levels}/>
      {batches && <BatchCarousel dataSet={{
        heading: "Popular Yoga Classes",
        description: "Discover our most loved classes taught by expert instructors. Find the perfect practice for your journey.",
        list: batches
      }} />}


      <Banner />

      {instructors && <InstructorsCarousel instructors={instructors} // Pass your instructor data here, or use the sample data
        title="Our Certified Yoga Instructors"
        description="Each of our teachers brings unique expertise and passion to help you on your yoga journey." />}

      {/* <Blog /> */}

    </>
  );
};

export default Home;