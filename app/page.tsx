import Hero from "./components/Hero";
import About from "./components/About";
import Welcome from "./components/Welcome"; 
import Footer from "./components/Footer";
import Skills from "./components/Skills";
import Projects from "./components/Projects"; 

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      {/* Hero stays sticky — About will slide up over it */}
      <section className="sticky top-0 z-0">
        <Hero />
      </section>

      {/* About slides up over the sticky Hero */}
      <section id="about" className="relative z-10">
        <About />
      </section>

      <section className="relative z-10">
        <Projects />
      </section>


      <section className="relative z-10">
        <Skills />
      </section >

           <section className="relative z-10">
       <Footer />
      </section >
    </main>
  );
}