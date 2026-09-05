"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect, prefersReducedMotion } from "@/app/lib/gsap";
import MagneticButton from "./motion/MagneticButton";

interface ProjectItem {
  id: number;
  num: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  preview: string;
  tech: string[];
  highlights: string[];
  github: string;
  demo: string;
  accent: string;
  gradient: string;
}

const projects: ProjectItem[] = [
  {
    id: 1,
    num: "01",
    title: "CarbonSetu",
    category: "SUSTAINABILITY // BLOCKCHAIN PLATFORM",
    subtitle: "Carbon Credit Management & Verification Protocol",
    description:
      "A decentralized carbon credit management and tokenization platform engineered for verified industrial emissions tracking, transparent smart contract settlements, and verifiable audit trails.",
    preview: "/projects/carbonsetu-preview.jpg",
    tech: ["MongoDB", "Python", "React", "AWS", "Web3"],
    highlights: ["SIH Finalist", "Smart Contract Ledger", "Real-Time Telemetry"],
    github: "https://github.com/dev-Lavi/Carbon-setu",
    demo: "https://sih-25-sage.vercel.app/",
    accent: "#e3ff6b",
    gradient: "linear-gradient(145deg, #111a0d 0%, #090e07 65%, #050804 100%)",
  },
  {
    id: 2,
    num: "02",
    title: "TVIC",
    category: "CREATIVE TECH // ENTERPRISE ARCHITECTURE",
    subtitle: "High-Performance Branding & Content Platform",
    description:
      "Enterprise digital experience and brand architecture featuring responsive micro-interactions, low-latency CDN image pipelines, and custom art direction tailored for high conversion.",
    preview: "/projects/tvic-preview.jpg",
    tech: ["Next.js", "Python", "AWS", "Cloudinary", "Tailwind"],
    highlights: ["Sub-second LCP", "Dynamic Cloudinary Media", "Custom Art Direction"],
    github: "https://github.com/dev-Lavi/TVIC",
    demo: "https://tvic.vercel.app/",
    accent: "#e3ff6b",
    gradient: "linear-gradient(145deg, #131b0f 0%, #0a1108 65%, #050804 100%)",
  },
  {
    id: 3,
    num: "03",
    title: "Laksh Closet",
    category: "E-COMMERCE // INSTANT SETTLEMENT",
    subtitle: "Modern Digital Fashion Storefront & Payment Engine",
    description:
      "A high-throughput e-commerce application equipped with seamless payment gateway integration, instant inventory sync, dynamic cart orchestration, and an ultra-minimalist UI.",
    preview: "/projects/lakshcloset-preview.jpg",
    tech: ["React", "Node.js", "Cashfree", "REST APIs", "Tailwind"],
    highlights: ["Payment Gateway API", "Dynamic Checkout", "Instant Inventory Sync"],
    github: "https://github.com/dev-Lavi/Laksh-closet",
    demo: "https://laksh-closet-lc.vercel.app/",
    accent: "#e3ff6b",
    gradient: "linear-gradient(145deg, #0e160c 0%, #080d06 65%, #040603 100%)",
  },
];

export default function Projects() {
  const deckRef = useRef<HTMLDivElement | null>(null);

  // GSAP ScrollTrigger Stacked Card Depth Effect (from reference Web3 landing)
  useIsomorphicLayoutEffect(() => {
    const el = deckRef.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Top card remains in focus

        // 1. Depth tween: scale down and lift upward as next card slides in
        gsap.to(card, {
          scale: 0.93,
          yPercent: -3.5,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top+=90",
            scrub: 0.5,
          },
        });

        // 2. Realistic Dimming tween: smoothly fades brightness once next card approaches
        gsap.fromTo(
          card,
          { filter: "brightness(1)" },
          {
            filter: "brightness(0.80)",
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top 58%",
              end: "top top+=90",
              scrub: 0.5,
            },
          }
        );
      });

      ScrollTrigger.refresh();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      className="relative z-10 w-full min-h-screen bg-[#070b05] py-16 sm:py-24 md:py-32 px-3 sm:px-6 md:px-10 lg:px-16"
    >
      {/* Background Cybernetic Grid & Glows - Encapsulated to prevent horizontal scroll */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(#202d18 1px, transparent 1px),
              linear-gradient(90deg, #202d18 1px, transparent 1px)
            `,
            backgroundSize: "75px 75px",
          }}
        />
        <div
          className="absolute -top-40 left-1/4 w-[500px] h-[500px] max-w-[90vw] rounded-full opacity-20 blur-[130px]"
          style={{ background: "radial-gradient(circle, #e3ff6b 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 right-1/4 w-[450px] h-[450px] max-w-[90vw] rounded-full opacity-15 blur-[110px]"
          style={{ background: "radial-gradient(circle, #6c8250 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 rounded-full border border-[#27341c] bg-[#0c1209]/80 backdrop-blur-md mb-4 sm:mb-6 max-w-full">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#e3ff6b] animate-pulse" />
            <span className="font-mono text-[9px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.25em] text-[#e3ff6b] truncate">
              02 // SELECTED WORK & ARCHITECTURE
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <h2 className="font-bank text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.18em] text-white leading-tight">
              ENGINEERED FOR <span className="text-[#e3ff6b] drop-shadow-[0_0_25px_rgba(227,255,107,0.4)]">SCALE.</span>
            </h2>
            <p className="max-w-md text-[11px] sm:text-xs md:text-sm text-[#e3ff6b]/70 font-mono uppercase tracking-[0.1em] sm:tracking-[0.18em] leading-relaxed">
              Production-grade applications, decentralized protocols, and reactive web interfaces engineered with zero compromise.
            </p>
          </div>
        </div>

        {/* Stacked Card Deck */}
        <div ref={deckRef} className="relative flex flex-col space-y-6 sm:space-y-8 md:space-y-12 w-full">
          {projects.map((project, index) => {
            const isLast = index === projects.length - 1;

            return (
              <div
                key={project.id}
                data-card
                style={{
                  background: project.gradient,
                  position: "sticky",
                  top: "76px",
                  marginBottom: isLast ? "0px" : "28px",
                  boxShadow:
                    "0 -10px 35px rgba(0,0,0,0.7), 0 20px 55px rgba(0,0,0,0.9), inset 0 1px 0 rgba(227,255,107,0.2)",
                  transformOrigin: "50% 0%",
                  willChange: "transform, filter",
                }}
                className="group relative rounded-2xl sm:rounded-3xl border border-[#27341c] hover:border-[#e3ff6b]/60 transition-colors duration-500 overflow-hidden w-full"
              >
                {/* Tactical Top Status Bar */}
                <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-2.5 sm:py-3.5 border-b border-[#27341c]/60 bg-black/40 backdrop-blur-md">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="font-bank text-xs sm:text-sm font-bold text-[#e3ff6b] tracking-[0.12em] sm:tracking-[0.25em] shrink-0 whitespace-nowrap">
                      [ {project.num} ]
                    </span>
                    <span className="h-1 w-2.5 sm:w-4 bg-[#e3ff6b]/40 rounded-full shrink-0" />
                    <span className="font-mono text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-[0.08em] sm:tracking-[0.2em] text-[#e3ff6b]/80 uppercase truncate">
                      {project.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#e3ff6b]" />
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.2em] text-[#e3ff6b]/70 uppercase whitespace-nowrap">
                      DEPLOYED
                    </span>
                  </div>
                </div>

                {/* Card Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] p-4 sm:p-6 md:p-8 lg:p-12 gap-5 sm:gap-8 lg:gap-12 items-center">
                  {/* Left Column: Text & Actions */}
                  <div className="flex flex-col justify-between h-full space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="font-bank text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.18em] lg:tracking-[0.25em] text-white leading-tight break-words">
                        {project.title}
                      </h3>

                      <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs md:text-sm font-semibold text-[#e3ff6b] tracking-[0.08em] sm:tracking-[0.2em] uppercase leading-snug">
                        {project.subtitle}
                      </p>

                      <p className="mt-2.5 sm:mt-5 text-xs sm:text-sm md:text-base text-gray-300 font-sans leading-relaxed tracking-normal">
                        {project.description}
                      </p>
                    </div>

                    {/* Highlights / Specs */}
                    <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {project.highlights.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-[#e3ff6b]/10 border border-[#e3ff6b]/30 font-mono text-[9px] sm:text-[10px] md:text-xs tracking-[0.08em] sm:tracking-[0.15em] text-[#e3ff6b] uppercase whitespace-nowrap"
                          >
                            <span className="text-[#e3ff6b]/60">✦</span>
                            {item}
                          </span>
                        ))}
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {project.tech.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full bg-black/60 border border-[#27341c] font-mono text-[9px] sm:text-[10px] md:text-[11px] text-gray-400 tracking-[0.08em] sm:tracking-[0.15em] uppercase whitespace-nowrap"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons (Magnetic) */}
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2 sm:pt-4">
                      <MagneticButton
                        as="a"
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        strength={0.25}
                        className="inline-flex items-center justify-center rounded-full bg-[#e3ff6b] px-4 py-2 sm:px-6 sm:py-3 font-bank text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.12em] sm:tracking-[0.25em] text-black shadow-[0_0_20px_rgba(227,255,107,0.5)] hover:bg-[#f3ff9c] hover:shadow-[0_0_35px_rgba(227,255,107,0.85)] transition-all duration-300 cursor-pointer whitespace-nowrap"
                      >
                        Launch Demo <span className="ml-1.5 font-sans">↗</span>
                      </MagneticButton>

                      <MagneticButton
                        as="a"
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        strength={0.25}
                        className="inline-flex items-center justify-center rounded-full border border-[#e3ff6b]/70 bg-black/40 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 font-bank text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.12em] sm:tracking-[0.25em] text-[#e3ff6b] hover:bg-[#e3ff6b]/15 hover:border-[#e3ff6b] hover:shadow-[0_0_20px_rgba(227,255,107,0.3)] transition-all duration-300 cursor-pointer whitespace-nowrap"
                      >
                        Source Code
                      </MagneticButton>
                    </div>
                  </div>

                  {/* Right Column: Visual Showcase Frame */}
                  <div className="relative w-full mt-2 lg:mt-0">
                    {/* Ambient Glow Spotlight */}
                    <div
                      className="pointer-events-none absolute inset-0 -m-4 sm:-m-6 rounded-3xl opacity-30 blur-2xl transition-opacity duration-700 group-hover:opacity-50"
                      style={{
                        background: "radial-gradient(circle, #e3ff6b 0%, transparent 70%)",
                      }}
                    />

                    {/* Frame Container */}
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block rounded-xl sm:rounded-2xl overflow-hidden border border-[#27341c] group-hover:border-[#e3ff6b]/80 shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all duration-500 aspect-[16/10] w-full"
                    >
                      {/* Tactical Crosshairs */}
                      <div className="absolute top-2 left-2 z-20 font-mono text-[9px] sm:text-[10px] text-[#e3ff6b]/50 select-none">
                        +
                      </div>
                      <div className="absolute top-2 right-2 z-20 font-mono text-[9px] sm:text-[10px] text-[#e3ff6b]/50 select-none">
                        +
                      </div>
                      <div className="absolute bottom-2 left-2 z-20 font-mono text-[9px] sm:text-[10px] text-[#e3ff6b]/50 select-none">
                        +
                      </div>
                      <div className="absolute bottom-2 right-2 z-20 font-mono text-[9px] sm:text-[10px] text-[#e3ff6b]/50 select-none">
                        +
                      </div>

                      {/* Project Image with Subtle Parallax/Zoom */}
                      <Image
                        src={project.preview}
                        alt={`${project.title} interface preview`}
                        fill
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                        priority={index === 0}
                      />

                      {/* Scanline Gradient Overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      {/* View Indicator Overlay on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#e3ff6b] font-bank text-[10px] sm:text-xs font-bold text-black uppercase tracking-[0.18em] sm:tracking-[0.25em] shadow-[0_0_25px_rgba(227,255,107,0.8)] whitespace-nowrap">
                          Explore Architecture <span>↗</span>
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
