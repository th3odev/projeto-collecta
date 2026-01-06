import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import HowItWorks from "../components/home/HowItWorks";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/layout/Footer";
import PointSystem from "../components/home/PointSystem";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-black">
        <Hero />
        <Stats />
        <HowItWorks />
        <PointSystem />
        <CallToAction />
        <Footer />
      </main>
    </>
  );
}
