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
    tech: ["MongoDB", "JavaScript", "Python", "React.js", "AWS"],
    github: "https://github.com/yourusername/carbonsetu",
    demo: "https://carbonsetu.com",
    description: "Developed a full-stack MERN platform to manage and visualize carbon credit data. Designed responsive UI components (UX +30%). Ethereum smart contracts with Ethers.js & MetaMask (scalability +40%).",
  },
  {
    id: 2,
    title: "TVIC", 
    subtitle: "IC Verification Tool",
    preview: "/projects/tvic-preview.jpg",
    image: "/projects/tvic-thumb.jpg",
    tech: ["Python", "JavaScript", "AWS", "Next.js", "Cloudinary"],
    github: "https://github.com/yourusername/tvic",
    demo: "https://tvic.com",
    description: "Built verification tool for IC authenticity. Admin dashboard with ML model (verification speed +60%). Processed 300+ datasets. PDF parser + secure backend (accuracy +30%).",
  },
  {
    id: 3,
    title: "Laksh Closet",
    subtitle: "E-commerce Store",
    preview: "/projects/lakshcloset-preview.jpg",
    image: "/projects/lakshcloset-thumb.jpg",
    tech: ["React.js", "Cloudinary", "Node.js", "Cashfree"],
    github: "https://github.com/yourusername/lakshcloset",
    demo: "https://lakshcloset.com",
    description: "Created brand assets (Illustrator/Figma) + responsive React store (satisfaction +90%). Node.js APIs, Cloudinary (100+ products), payment gateway (sales +40%).",
  },
];

export default function Work() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen py-32 px-4 sm:px-8 md:px-12 lg:px-24 bg-[#1f2b17]">
      {/* Fallen Angel cinematic grid */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(227,255,107,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(227,255,107,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
        }}
      />

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-28 lg:mb-36">
          <div className="inline-block w-full max-w-lg mx-auto rounded-2xl bg-[#e3ff6b] px-8 py-5 mb-16 text-[12px] sm:text-sm md:text-base font-bank uppercase tracking-[0.35em] text-black shadow-2xl border-4 border-white/30">
            Selected Works
          </div>
          <h2 className="text-[52px] md:text-[80px] lg:text-[110px] xl:text-[140px] font-semibold tracking-[0.25em] bg-gradient-to-r from-red-600 via-red-400 to-[#e3ff6b] bg-clip-text text-transparent drop-shadow-2xl">
            PROJECTS
          </h2>
        </div>

        {/* Cinematic Cards - Your real projects */}
        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-8 pb-12 lg:pb-20 -ml-4 lg:-ml-8 pl-4 lg:pl-8 pr-8 lg:pr-12 snap-x">
          {projects.map((project) => {
            const proj = projects.find(p => p.id === project.id);
            
            return (
              <div
                key={project.id}
                className="flex-none w-80 lg:w-96 h-96 lg:h-[500px] relative group cursor-grab active:cursor-grabbing snap-center hover:w-[90vw] lg:hover:w-[450px] transition-all duration-700 ease-out hover:z-50"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* SOLID Dark Cinematic Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1f2b17] via-black/80 to-[#6c8250]/50 rounded-3xl border-4 border-[#e3ff6b]/30 shadow-2xl group-hover:border-red-500/80 group-hover:shadow-[0_0_60px_rgba(227,255,107,0.4)] group-hover:shadow-red-500/20 transition-all duration-700 overflow-hidden relative">
                  
                  {/* Thumbnail */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover brightness-50 group-hover:brightness-75 saturate-150 transition-all duration-1000 scale-105 group-hover:scale-110"
                    />
                  </div>

                  {/* Neon overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-700" />

                  {/* Content */}
                  <div className="absolute bottom-8 left-8 right-8 z-20 translate-y-8 group-hover:translate-y-0 transition-all duration-700">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white/95 drop-shadow-lg mb-2 tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-[#e3ff6b] text-lg font-semibold font-bank uppercase tracking-[0.25em] mb-6 opacity-90">
                      {project.subtitle}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {project.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-[#e3ff6b]/20 border-2 border-[#e3ff6b]/40 backdrop-blur-sm rounded-xl text-sm font-bold tracking-wide text-[#e3ff6b] hover:bg-[#e3ff6b]/40 transition-all duration-300 shadow-lg hover:shadow-[#e3ff6b]/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* GitHub + Demo Buttons */}
                    <div className="flex gap-3">
                      <a
                        href={project.github}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-2 bg-black/50 border-2 border-white/30 text-white px-5 py-3 rounded-xl font-bold uppercase tracking-[0.15em] text-sm hover:border-[#e3ff6b]/70 hover:text-[#e3ff6b] hover:bg-black/70 transition-all duration-300 shadow-lg hover:shadow-[#e3ff6b]/30"
                      >
                        GitHub
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        className="flex items-center gap-2 bg-gradient-to-r from-[#e3ff6b] to-green-400 text-black px-5 py-3 rounded-xl font-bold uppercase tracking-[0.2em] text-sm hover:from-red-400 hover:to-red-500 hover:shadow-[0_0_25px_rgba(227,255,107,0.6)] transition-all duration-400 shadow-2xl hover:scale-105"
                      >
                        Live Demo →
                      </a>
                    </div>
                  </div>

                  {/* Hover Preview */}
                  {hoveredProject === project.id && (
                    <div className="absolute -top-16 -right-16 w-80 h-64 lg:w-96 lg:h-72 bg-gradient-to-br from-[#1f2b17] to-black/90 border-4 border-red-500/70 shadow-2xl shadow-red-500/40 rounded-2xl overflow-hidden z-50 scale-95 group-hover:scale-100 transition-all duration-500">
                      <Image
                        src={project.preview}
                        alt={`${project.title} preview`}
                        fill
                        className="object-cover brightness-75 saturate-150"
                      />
                      <div className="absolute bottom-3 left-4 right-4 bg-gradient-to-t from-black/90 p-3 rounded-xl">
                        <h4 className="text-white font-bold text-lg drop-shadow-lg">{project.title}</h4>
                      </div>
                    </div>
                  )}

                  {/* Direction Arrows */}
                  <div className="absolute -left-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-10 h-10 bg-[#e3ff6b]/80 rounded-full flex items-center justify-center shadow-xl group-hover:shadow-[#e3ff6b]/60 hover:scale-110 transition-all duration-300">
                      <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
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
      `}</style>
    </section>
  );
}
