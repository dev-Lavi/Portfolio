"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect, prefersReducedMotion } from "@/app/lib/gsap";

interface ProjectItem {
  id: number;
  num: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  logo: string;
  tech: string[];
  highlights: string[];
  demo: string;
}

const projects: ProjectItem[] = [
  {
    id: 7,
    num: "07",
    title: "VoiceToNotes",
    category: "AI // REAL-TIME TRANSCRIPTION & NOTES",
    subtitle: "Voice-to-Text, Real-Time Transcripts & AI Summaries",
    description:
      "Convert voice into accurate notes, transcripts, AI summaries, meeting notes, study notes, and action items in real time. Skip the keyboard and speak naturally while AI captures every word with accurate punctuation and speaker-aware formatting.",
    logo: "/projects/vtn.png",
    tech: ["Next.js", "AI Speech Models", "WebSockets", "Cloud Functions"],
    highlights: ["Real-Time Transcription", "AI Summaries & Actions", "Speaker-Aware Formatting"],
    demo: "https://voicetonotes.ai/",
  },
  {
    id: 6,
    num: "06",
    title: "MacaoAi",
    category: "AI // SITUATIONAL LANGUAGE LEARNING",
    subtitle: "Conversational AI Language Learning with Owl AI",
    description:
      "An interactive language learning mobile app built with native Kotlin. Users converse with our AI model Owl across real-life simulated scenarios—like ordering food in a dream destination or navigating travel abroad—building genuine conversational fluency.",
    logo: "/projects/MacaoAI.png",
    tech: ["Kotlin", "Android", "Jetpack Compose", "AI Language Models"],
    highlights: ["Owl AI Conversation", "Situational Simulations", "Native Android App"],
    demo: "https://drive.google.com/file/d/1QALOw6agjMrFJJdEh5pK8kTKKNCy2GAo/view?usp=sharing",
  },
  {
    id: 5,
    num: "05",
    title: "DeepURLs",
    category: "INFRASTRUCTURE // ATTRIBUTION & DEEP LINKING",
    subtitle: "Flawless Linking & Full-Funnel Attribution Engine",
    description:
      "Reliable deep linking with accurate attribution across the entire user journey. Bridges web-to-app conversions with intelligent Deferred Deep Linking—routing users seamlessly through the App Store and automatically opening the exact destination immediately upon install.",
    logo: "/projects/deepurls.png",
    tech: ["Node.js", "Firebase", "Caddy", "React", "Mobile SDKs"],
    highlights: ["Deferred Deep Linking", "Full-Funnel Attribution", "Cross-Platform SDKs"],
    demo: "https://deepurls.com/",
  },
  {
    id: 4,
    num: "04",
    title: "Web3Task",
    category: "PRODUCT STUDIO // VENTURE SCALING",
    subtitle: "High-Performance Studio & Digital Product Platform",
    description:
      "We build, ship, and scale software for ambitious startups. Engineering conversion-ready SaaS dashboards, AI automations, and integrated digital tools that solve real problems, scale reliably, and move ideas forward.",
    logo: "/projects/web3task_logo.png",
    tech: ["Next.js", "React", "Tina CMS", "Tolgee", "Tailwind CSS"],
    highlights: ["SaaS & Dashboards", "AI Automations", "Sub-Second LCP"],
    demo: "https://web3task.com/",
  },
  {
    id: 3,
    num: "03",
    title: "TVIC",
    category: "CREATIVE TECH // ENTERPRISE ARCHITECTURE",
    subtitle: "High-Performance Branding & Content Platform",
    description:
      "Enterprise digital experience and brand architecture featuring responsive micro-interactions, low-latency Cloudinary CDN image pipelines, and custom art direction tailored for high conversion.",
    logo: "/projects/tvic.png",
    tech: ["Next.js", "Python", "AWS", "Cloudinary", "Tailwind"],
    highlights: ["Sub-second LCP", "Dynamic Cloudinary Media", "Custom Art Direction"],
    demo: "https://tvic.vercel.app/",
  },
  {
    id: 2,
    num: "02",
    title: "CarbonSetu",
    category: "SUSTAINABILITY // BLOCKCHAIN PLATFORM",
    subtitle: "Carbon Credit Management & Verification Protocol",
    description:
      "A decentralized carbon credit management and tokenization platform engineered for verified industrial emissions tracking, transparent smart contract settlements, and verifiable audit trails.",
    logo: "/projects/carbonsetu.png",
    tech: ["MongoDB", "Python", "React", "AWS", "Web3"],
    highlights: ["SIH Finalist", "Smart Contract Ledger", "Real-Time Telemetry"],
    demo: "https://sih-25-sage.vercel.app/",
  },
  {
    id: 1,
    num: "01",
    title: "Traverse VPN",
    category: "PRIVACY & SECURITY // WIREGUARD PROTOCOL",
    subtitle: "Next-Generation High-Speed Encrypted VPN",
    description:
      "Wraps your connection in military-grade AES-256 encryption, hides your IP address, and gives you safe, unrestricted internet access from anywhere, on any device, with zero compromises to speed or privacy.",
    logo: "/projects/vpnlogo.png",
    tech: ["Next.js", "Tolgee", "Tina CMS", "Localization", "WireGuard"],
    highlights: ["AES-256 Encryption", "WireGuard Protocol", "Zero-Log Privacy"],
    demo: "https://traversevpn.com/",
  },
];

export default function Projects() {
  const deckRef = useRef<HTMLDivElement | null>(null);

  // GSAP ScrollTrigger Stacked Card Depth Effect (replicates reference Web3 landing)
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
            filter: "brightness(0.82)",
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
      {/* Background Cybernetic Grid & Glows - Encapsulated */}
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
                  position: "sticky",
                  top: "76px",
                  marginBottom: isLast ? "0px" : "28px",
                  boxShadow:
                    "0 -10px 35px rgba(0,0,0,0.7), 0 20px 55px rgba(0,0,0,0.9), inset 0 1px 0 rgba(227,255,107,0.2)",
                  transformOrigin: "50% 0%",
                  willChange: "transform, filter",
                }}
                className="group relative rounded-[28px] sm:rounded-[32px] border border-[#2b3a23] overflow-hidden w-full grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] min-h-[500px]"
              >
                {/* Left Column: Light Panel (matching reference SelectedWork light card) */}
                <div className="relative z-10 flex flex-col justify-between p-6 sm:p-9 lg:p-12 bg-[#ecece7] text-[#111111] border-b lg:border-b-0 lg:border-r border-black/10">
                  <div>
                    {/* Status badge */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <span className="font-bank text-xs sm:text-sm font-bold text-[#354921] tracking-[0.14em] shrink-0 whitespace-nowrap">
                        [ {project.num} ]
                      </span>
                      <span className="h-1 w-3 bg-[#354921]/30 rounded-full shrink-0" />
                      <span className="font-mono text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-[0.15em] text-[#556349] uppercase">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="font-bank text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-[0.05em] text-[#111111] leading-tight break-words">
                      {project.title}
                    </h3>

                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-bold text-[#3d5228] tracking-[0.12em] uppercase leading-snug">
                      {project.subtitle}
                    </p>

                    <p className="mt-3.5 sm:mt-5 text-xs sm:text-sm md:text-[15px] text-[#485240] font-sans leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
                      {project.highlights.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/5 border border-black/10 font-mono text-[9px] sm:text-[10px] tracking-[0.1em] text-[#2d3a20] uppercase whitespace-nowrap"
                        >
                          <span className="text-[#354921]">✦</span>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Underlined Explore Link matching reference screenshot */}
                  <div className="pt-6 sm:pt-8">
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-bank font-bold uppercase tracking-[0.16em] text-[#111111] hover:text-[#354921] transition-colors group/link w-fit"
                    >
                      <span className="border-b-2 border-[#111111] group-hover/link:border-[#354921] pb-1 transition-colors">
                        Explore {project.title}
                      </span>
                      <span className="font-sans text-sm sm:text-base font-bold group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5 transition-transform">
                        ↗
                      </span>
                    </a>
                  </div>
                </div>

                {/* Right Column: Dark Green Canvas with Single Logo Badge (no double box) */}
                <div className="relative overflow-hidden flex items-center justify-center p-8 sm:p-12 lg:p-16 min-h-[300px] lg:min-h-0 bg-gradient-to-br from-[#121c0e] via-[#0b1208] to-[#050804]">
                  {/* Subtle Grid Backdrop */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: `
                        linear-gradient(#202d18 1px, transparent 1px),
                        linear-gradient(90deg, #202d18 1px, transparent 1px)
                      `,
                      backgroundSize: "32px 32px",
                    }}
                  />

                  {/* Ambient Radial Glowing Aura */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700"
                    style={{
                      background: "radial-gradient(circle at 50% 50%, rgba(227, 255, 107, 0.24) 0%, transparent 65%)",
                    }}
                  />

                  {/* Single Floating Glassmorphic Logo Badge (clean reference aesthetic) */}
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 flex flex-col items-center justify-center gap-4 rounded-[24px] sm:rounded-[28px] p-8 sm:p-10 md:p-12 bg-black/60 backdrop-blur-md border border-white/10 hover:border-[#e3ff6b]/70 hover:bg-black/75 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group/logo max-w-[340px] w-full"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center">
                      <Image
                        src={project.logo}
                        alt={`${project.title} logo`}
                        fill
                        className="object-contain p-2 transition-transform duration-500 group-hover/logo:scale-110 drop-shadow-[0_6px_25px_rgba(0,0,0,0.9)]"
                        sizes="(max-width: 768px) 112px, 140px"
                        priority={index === 0}
                      />
                    </div>
                    <span className="font-bank text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.14em] text-white group-hover/logo:text-[#e3ff6b] transition-colors duration-300 flex items-center gap-2 text-center leading-tight">
                      {project.title} <span className="text-sm font-sans text-[#e3ff6b]">↗</span>
                    </span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
