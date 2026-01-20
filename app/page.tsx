import Hero from "./components/Hero";
import About from "./components/About";
import Welcome from "./components/Welcome";
import Projects from "./components/Projects";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
  <section className="relative z-0">
    <Hero />
  </section>
      <section id="about" className="relative z-10 -mt-4">
        <About />
      </section>
      <section className="relative z-10">
        <Welcome />
      </section>
      <section className="relative z-0">
        <Projects />
      </section>
      <Footer />
    </main>
  );
}
