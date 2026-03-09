import {
  Hero,
  Features,
  Stats,
  SessionLogs,
  CtaSection,
} from "../../components/landing";
import useCourses from "../../queries/useCourses";

const HomePage = () => {
  const { data: courses, isLoading } = useCourses();

  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <SessionLogs />
      <CtaSection />
    </>
  );
};

export default HomePage;
