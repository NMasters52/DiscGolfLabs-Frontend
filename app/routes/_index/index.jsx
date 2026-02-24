import {
  Navbar,
  Hero,
  Features,
  Stats,
  SessionLogs,
  CtaSection,
  Footer,
} from "../../components/landing";

const HomePage = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <SessionLogs />
      <CtaSection />
      <Footer />
    </main>
  );
};

export default HomePage;
