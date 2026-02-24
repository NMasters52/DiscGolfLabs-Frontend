import {
  Navbar,
  Hero,
  Features,
  Stats,
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
      <CtaSection />
      <Footer />
    </main>
  );
};

export default HomePage;
