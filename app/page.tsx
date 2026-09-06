import Hero from "./components/Hero";
import About from "./components/About";
import Footer from "./components/Footer";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import WhatIDo from "./components/WhatIDo";
import MotorcycleShowcase from "./components/MotorcycleShowcase";
import ThemeMorph from "./components/motion/ThemeMorph";

export default function Home() {
  return (
    <ThemeMorph
      initialBg="#070b05"
      initialFg="#ffffff"
      className="relative min-h-screen transition-colors duration-700"
    >
      <main className="min-h-screen">
        {/* Hero stays sticky — About slides up over it */}
        <section
          data-theme-bg="#070b05"
          data-theme-fg="#ffffff"
          className="sticky top-0 z-0"
        >
          <Hero />
        </section>

        {/* About slides up over the sticky Hero */}
        <section
          id="about"
          data-theme-bg="#050806"
          data-theme-fg="#ffffff"
          className="relative z-20"
        >
          <About />
        </section>

        {/* Selected Work & Projects (Stacked Deck Animation) */}
        <section
          id="projects-wrapper"
          data-theme-bg="#070b05"
          data-theme-fg="#ffffff"
          className="relative z-10"
        >
          <Projects />
        </section>

        {/* What I Do (Kinetic Services Grid with Light Theme Transition) */}
        <section
          id="what-i-do-wrapper"
          data-theme-bg="#F7F7F5"
          data-theme-fg="#111111"
          className="relative z-30 bg-[#F7F7F5]"
        >
          <WhatIDo />
        </section>

        {/* Motorcycle Experience (Smooth Canvas Scrubbing with Dark Theme Return) */}
        <section
          id="showcase-wrapper"
          data-theme-bg="#0A0C0A"
          data-theme-fg="#ffffff"
          className="relative z-20"
        >
          <MotorcycleShowcase />
        </section>

        {/* Skills & Tech Stack */}
        <section
          id="skills-wrapper"
          data-theme-bg="#070b05"
          data-theme-fg="#ffffff"
          className="relative z-20"
        >
          <Skills />
        </section>

        {/* Footer */}
        <section
          data-theme-bg="#0A0C0A"
          data-theme-fg="#ffffff"
          className="relative z-20"
        >
          <Footer />
        </section>
      </main>
    </ThemeMorph>
  );
}