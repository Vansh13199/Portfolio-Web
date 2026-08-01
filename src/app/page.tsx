import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FeaturedProjects from "@/components/FeaturedProjects";
import About from "@/components/CloudExpertise";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <FeaturedProjects />
        <About />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}

