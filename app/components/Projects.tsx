"use client";
import Image from "next/image";
import { useState } from "react";

const projects = [
  {
    id: 1,
    title: "CarbonSetu",
    subtitle: "Carbon Credit Management Platform",
    preview: "/projects/carbonsetu-preview.jpg",
    image: "/projects/carbonsetu-thumb.jpg",
    tech: ["MongoDB", "Python", "React", "AWS"],
    github: "https://github.com/yourusername/carbonsetu",
    demo: "https://carbonsetu.com",
  },
  {
    id: 2,
    title: "TVIC",
    subtitle: "Branding, Website, Art Direction",
    preview: "/projects/tvic-preview.jpg",
    image: "/projects/tvic-thumb.jpg",
    tech: ["Next.js", "Python", "AWS", "Cloudinary"],
    github: "https://github.com/yourusername/tvic",
    demo: "https://tvic.com",
  },
  {
    id: 3,
    title: "Laksh Closet",
    subtitle: "E-commerce Store",
    preview: "/projects/lakshcloset-preview.jpg",
    image: "/projects/lakshcloset-thumb.jpg",
    tech: ["React", "Node.js", "Cashfree"],
    github: "https://github.com/yourusername/lakshcloset",
    demo: "https://lakshcloset.com",
  },
];

export default function Work() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen bg-[#1f2b17] py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-20 overflow-hidden">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundColor: "#1f2b17",
          backgroundImage: `
            linear-gradient(#2b3b1f 1px, transparent 1px),
            linear-gradient(90deg, #2b3b1f 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ✅ FIXED: Previews relative to section */}
      <div className="relative z-30 h-0 pointer-events-none">
        {projects.map((project) =>
          hoveredProject === project.id ? (
            <div
              key={`preview-${project.id}`}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ zIndex: 9999 }}
            >
              <div className="w-[400px] h-[250px] mx-4 rounded-3xl border border-[#e3ff6b]/70 bg-gradient-to-br from-[#6c8250] via-[#1f2b17] to-black shadow-[0_0_35px_rgba(108,130,80,0.75)]">
                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                  <Image
                    src={project.preview}
                    alt={`${project.title} preview`}
                    fill
                    className="object-cover opacity-90 mix-blend-lighten"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white drop-shadow-lg">
                      {project.title}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e3ff6b]">
                      View case
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* PROJECTS header */}
        <div className="mb-8 text-left">
          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-semibold uppercase tracking-[0.28em] text-[#e3ff6b]">
            PROJECTS
          </h2>
        </div>

        {/* Project rows */}
        <div className="space-y-6 md:space-y-7 lg:space-y-8 lg:max-w-5xl lg:mx-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-xl border border-[#27341c] bg-[#0f140c]/90 backdrop-blur-xl px-5 py-5 sm:px-7 sm:py-6 md:px-9 md:py-7 shadow-[0_0_0_1px_rgba(0,0,0,0.9),0_18px_45px_rgba(0,0,0,0.95)] hover:border-[#e3ff6b]/70 hover:shadow-[0_0_40px_rgba(227,255,107,0.35)] transition-all duration-500 hover:scale-[1.02] lg:hover:scale-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 w-full lg:max-w-5xl mx-auto"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Tech + Title + Subtitle */}
              <div className="flex-1 min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-[9px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.3em] text-[#e3ff6b]/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e3ff6b] flex-shrink-0" />
                  {project.tech.map((tech, i) => (
                    <span key={i}>{tech}{i < project.tech.length - 1 && " • "}</span>
                  ))}
                </div>
                <h3 className="text-xl sm:text-2xl md:text-[24px] lg:text-[26px] font-bold tracking-[0.35em] text-white uppercase leading-tight truncate">
                  {project.title}
                </h3>
                <p className="mt-1 text-[10px] sm:text-xs md:text-sm text-[#e3ff6b]/80 font-semibold tracking-[0.25em] uppercase leading-relaxed">
                  {project.subtitle}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 mt-4 lg:mt-0">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-[96px] items-center justify-center rounded-full border border-[#e3ff6b] bg-black/40 px-4 py-2 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e3ff6b] hover:bg-[#e3ff6b]/10 hover:shadow-[0_0_24px_rgba(227,255,107,0.45)] transition-all duration-300 whitespace-nowrap"
                >
                  GitHub
                </a>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-[112px] items-center justify-center rounded-full bg-[#e3ff6b] px-4 py-2 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] text-black shadow-[0_0_32px_rgba(227,255,107,0.75)] hover:bg-[#f3ff9c] hover:shadow-[0_0_40px_rgba(227,255,107,0.95)] transition-all duration-300 whitespace-nowrap"
                >
                  Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-12px, -18px, 0);
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          [class*="animate-"] {
            animation-play-state: running;
          }
        }
      `}</style>
    </section>
  );
}
