"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const skills = [
  // Frontend
  { name: "React", logo: "/skills/react.svg", category: "frontend", level: 95 },
  { name: "Next.js", logo: "/skills/nextjs.svg", category: "frontend", level: 90 },
  { name: "TypeScript", logo: "/skills/typescript.svg", category: "frontend", level: 85 },
  { name: "Tailwind", logo: "/skills/tailwind.svg", category: "frontend", level: 92 },
  { name: "JavaScript", logo: "/skills/js.svg", category: "frontend", level: 88 },
  
  // Backend
  { name: "Node.js", logo: "/skills/nodejs.svg", category: "backend", level: 85 },
  { name: "Python", logo: "/skills/python.svg", category: "backend", level: 82 },
  { name: "Express", logo: "/skills/express.svg", category: "backend", level: 80 },
  
  // Blockchain
  { name: "Solidity", logo: "/skills/solidity.svg", category: "blockchain", level: 78 },
  { name: "Ethereum", logo: "/skills/ethereum.svg", category: "blockchain", level: 72 },
  
  // Tools/Design
  { name: "Figma", logo: "/skills/figma.svg", category: "design", level: 85 },
  { name: "Git", logo: "/skills/git.svg", category: "tools", level: 90 },
  { name: "Vercel", logo: "/skills/vercel.svg", category: "tools", level: 88 },
];

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen py-32 px-4 sm:px-8 md:px-12 lg:px-24 bg-[#1f2b17]/90 overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#6c8250 1px, transparent 1px),
            linear-gradient(90deg, #6c8250 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header - Matches Hero style */}
        <div className="text-center mb-24">
          <div className="inline-block w-full max-w-md mx-auto rounded-xl bg-[#e3ff6b] px-8 py-4 mb-12 text-[12px] sm:text-xs md:text-sm font-bank uppercase tracking-[0.3em] text-black shadow-2xl">
            Skills & Technologies
          </div>
          <h2 className="text-[48px] md:text-[72px] lg:text-[96px] xl:text-[120px] font-semibold tracking-[0.2em] bg-gradient-to-r from-red-600/90 via-red-500/80 to-orange-500/70 bg-clip-text text-transparent opacity-90">
            TECH STACK
          </h2>
        </div>

        {/* Modern Floating Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8 h-32 lg:h-40 flex flex-col items-center justify-center hover:bg-white/20 hover:border-[#e3ff6b]/50 transition-all duration-500 hover:scale-110 hover:-translate-y-4 hover:shadow-2xl hover:shadow-[#6c8250]/30 overflow-hidden cursor-pointer"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: "fadeInUp 0.8s ease forwards",
              }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              {/* Logo */}
              <div className="relative z-20 w-12 h-12 lg:w-16 lg:h-16 mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={skill.logo}
                  alt={skill.name}
                  fill
                  className="object-contain filter group-hover:brightness-0 group-hover:invert grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>

              {/* Name */}
              <span className="text-xs lg:text-sm font-semibold text-white/90 tracking-wide uppercase group-hover:text-[#e3ff6b] transition-colors duration-300">
                {skill.name}
              </span>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#e3ff6b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -m-1" />

              {/* Progress Bar - Shows on hover */}
              <div className={`absolute bottom-2 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                hoveredSkill === skill.name ? 'scale-x-100' : 'scale-x-0'
              } origin-left`}>
                <div className="h-full bg-gradient-to-r from-[#e3ff6b] to-green-400 rounded-full transition-all duration-700" 
                     style={{ transform: `scaleX(${skill.level / 100})` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Category Labels - Floating */}
        <div className="flex flex-wrap gap-4 justify-center mt-20 lg:mt-32">
          {["frontend", "backend", "blockchain", "design", "tools"].map((cat) => (
            <span key={cat} className="px-4 py-2 text-xs uppercase font-bank tracking-[0.2em] text-white/70 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-[#e3ff6b]/20 hover:text-[#e3ff6b] transition-all duration-300 cursor-default">
              {cat.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
