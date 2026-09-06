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
  colorType: "green" | "red";
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
    colorType: "green",
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
    colorType: "red",
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
    colorType: "green",
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
    colorType: "red",
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
    colorType: "green",
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
    colorType: "red",
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
    colorType: "green",
  },
];

export default function Projects() {
  const deckRef = useRef<HTMLDivElement | null>(null);

  // GSAP ScrollTrigger Stacked Card Depth Effect (replicates reference Web3 landing)
  useIsomorphicLayoutEffect(() => {
    const el = deckRef.current;
    if (!el || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    // DESKTOP (>= 769px): Full 3D scale & lift depth stacking
    mm.add("(min-width: 769px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Top card remains in focus

        // 1. Depth tween: scale down and lift upward as next card slides in
        gsap.to(card, {
          scale: 0.94,
          yPercent: -3,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top+=90",
            scrub: 0.5,
          },
        });

        // 2. Realistic Dimming overlay
        const dimOverlay = card.querySelector<HTMLElement>("[data-card-dim]");
        if (dimOverlay) {
          gsap.fromTo(
            dimOverlay,
            { opacity: 0 },
            {
              opacity: 0.35,
              ease: "none",
              scrollTrigger: {
                trigger: cards[i + 1],
                start: "top 60%",
                end: "top top+=90",
                scrub: 0.5,
              },
            }
          );
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="projects"
      className="relative z-10 w-full min-h-screen bg-[#070b05] py-16 sm:py-24 md:py-32 px-3 sm:px-6 md:px-10 lg:px-16"
    >
      {/* Background Cybernetic Grid & Glows */}
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
        <div
          ref={deckRef}
          className="relative flex flex-col space-y-6 sm:space-y-8 md:space-y-12 w-full pb-36 sm:pb-44 lg:pb-0"
        >
          {projects.map((project, index) => {
            const isLast = index === projects.length - 1;
            const isRed = project.colorType === "red";

            return (
              <div
                key={project.id}
                data-card
                style={{
                  position: "sticky",
                  top: "76px",
                  zIndex: index + 1,
                  marginBottom: isLast ? "0px" : "28px",
                  boxShadow: isRed
                    ? "0 -10px 35px rgba(0,0,0,0.7), 0 20px 55px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,13,74,0.2)"
                    : "0 -10px 35px rgba(0,0,0,0.7), 0 20px 55px rgba(0,0,0,0.9), inset 0 1px 0 rgba(74,222,128,0.25)",
                  transformOrigin: "50% 0%",
                }}
                className={`group relative rounded-[22px] sm:rounded-[32px] overflow-hidden w-full grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] min-h-0 lg:min-h-[500px] border transition-colors duration-500 lg:will-change-transform ${
                  isRed
                    ? "border-[#4a0d1a] hover:border-[#FF0D4A]/60"
                    : "border-[#2b3a23] hover:border-[#4ade80]/60"
                }`}
              >
                {/* Dimming overlay when subsequent cards stack on top (desktop depth cue) */}
                <div
                  data-card-dim
                  className="pointer-events-none absolute inset-0 bg-black/45 z-30 opacity-0 hidden lg:block"
                  style={{ willChange: "opacity" }}
                />

                {/* Left Column on Desktop / Bottom on Mobile: Light Panel (alternating green & red accents) */}
                <div className="relative z-10 flex flex-col justify-between p-6 sm:p-9 lg:p-12 bg-[#ecece7] text-[#111111] order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-black/10 w-full">
                  <div>
                    {/* Status badge */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <span
                        className={`font-bank text-xs sm:text-sm font-bold tracking-[0.14em] shrink-0 whitespace-nowrap ${
                          isRed ? "text-[#D6003C]" : "text-[#354921]"
                        }`}
                      >
                        [ {project.num} ]
                      </span>
                      <span
                        className={`h-1 w-3 rounded-full shrink-0 ${
                          isRed ? "bg-[#D6003C]/30" : "bg-[#354921]/30"
                        }`}
                      />
                      <span
                        className={`font-mono text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-[0.14em] sm:tracking-[0.15em] uppercase ${
                          isRed ? "text-[#8a253b]" : "text-[#556349]"
                        }`}
                      >
                        {project.category}
                      </span>
                    </div>

                    <h3 className="font-bank text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-[0.05em] text-[#111111] leading-tight break-words">
                      {project.title}
                    </h3>

                    <p
                      className={`mt-1.5 sm:mt-2 text-xs sm:text-sm font-bold tracking-[0.12em] uppercase leading-snug ${
                        isRed ? "text-[#a11335]" : "text-[#3d5228]"
                      }`}
                    >
                      {project.subtitle}
                    </p>

                    <p
                      className={`mt-3.5 sm:mt-5 text-xs sm:text-sm md:text-[15px] font-sans leading-relaxed ${
                        isRed ? "text-[#4a383c]" : "text-[#485240]"
                      }`}
                    >
                      {project.description}
                    </p>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
                      {project.highlights.map((item, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/5 border border-black/10 font-mono text-[9px] sm:text-[10px] tracking-[0.1em] uppercase whitespace-nowrap ${
                            isRed ? "text-[#3a1d23]" : "text-[#2d3a20]"
                          }`}
                        >
                          <span className={isRed ? "text-[#D6003C]" : "text-[#354921]"}>✦</span>
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
                      className={`inline-flex items-center gap-2.5 text-xs sm:text-sm font-bank font-bold uppercase tracking-[0.16em] text-[#111111] transition-colors group/link w-fit ${
                        isRed ? "hover:text-[#D6003C]" : "hover:text-[#354921]"
                      }`}
                    >
                      <span
                        className={`border-b-2 border-[#111111] pb-1 transition-colors ${
                          isRed ? "group-hover/link:border-[#D6003C]" : "group-hover/link:border-[#354921]"
                        }`}
                      >
                        Explore {project.title}
                      </span>
                      <span
                        className={`font-sans text-sm sm:text-base font-bold group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5 transition-transform ${
                          isRed ? "text-[#D6003C]" : "text-[#354921]"
                        }`}
                      >
                        ↗
                      </span>
                    </a>
                  </div>
                </div>

                {/* Right Column on Desktop / Top on Mobile: Dark Canvas with Downlight Effect & Logo */}
                <div
                  className={`relative overflow-hidden flex items-center justify-center p-6 sm:p-10 lg:p-16 min-h-[220px] sm:min-h-[280px] lg:min-h-0 order-1 lg:order-2 w-full ${
                    isRed ? "bg-[#0a0406]" : "bg-[#060a05]"
                  }`}
                >
                  {/* Subtle Grid Backdrop */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: isRed
                        ? `
                          linear-gradient(#ff0d4a 1px, transparent 1px),
                          linear-gradient(90deg, #ff0d4a 1px, transparent 1px)
                        `
                        : `
                          linear-gradient(#4ade80 1px, transparent 1px),
                          linear-gradient(90deg, #4ade80 1px, transparent 1px)
                        `,
                      backgroundSize: "32px 32px",
                    }}
                  />

                  {/* 1. Base upward light gradient */}
                  <div
                    className="pointer-events-none absolute inset-0 transition-opacity duration-700"
                    style={{
                      background: isRed
                        ? "linear-gradient(to top, rgba(220, 15, 60, 0.45) 0%, rgba(130, 8, 35, 0.18) 32%, transparent 70%)"
                        : "linear-gradient(to top, rgba(34, 197, 94, 0.45) 0%, rgba(20, 105, 45, 0.18) 32%, transparent 70%)",
                    }}
                  />

                  {/* 2. Primary Radiant Downlight (hardware-accelerated radial bloom) */}
                  <div
                    className="pointer-events-none absolute -bottom-10 inset-x-0 h-[85%] blur-xl opacity-90"
                    style={{
                      background: isRed
                        ? "radial-gradient(ellipse 95% 75% at 50% 100%, rgba(255, 25, 75, 0.85) 0%, rgba(220, 15, 60, 0.5) 28%, rgba(120, 10, 35, 0.2) 58%, transparent 78%)"
                        : "radial-gradient(ellipse 95% 75% at 50% 100%, rgba(74, 222, 128, 0.85) 0%, rgba(34, 197, 94, 0.5) 28%, rgba(20, 83, 45, 0.2) 58%, transparent 78%)",
                    }}
                  />

                  {/* 3. Secondary ambient glow layer */}
                  <div
                    className="pointer-events-none absolute bottom-0 left-[10%] w-[80%] h-[75%] blur-2xl opacity-60"
                    style={{
                      background: isRed
                        ? "radial-gradient(circle at 50% 100%, rgba(255, 80, 120, 0.5) 0%, rgba(220, 20, 60, 0.2) 45%, transparent 75%)"
                        : "radial-gradient(circle at 50% 100%, rgba(163, 230, 53, 0.5) 0%, rgba(34, 197, 94, 0.2) 45%, transparent 75%)",
                    }}
                  />

                  {/* Single Floating Glassmorphic Logo Badge */}
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative z-10 flex flex-col items-center justify-center gap-3 sm:gap-4 rounded-[20px] sm:rounded-[28px] p-5 sm:p-8 md:p-12 bg-black/85 md:bg-black/65 md:backdrop-blur-md border border-white/10 hover:bg-black/80 transition-all duration-300 shadow-[0_18px_45px_rgba(0,0,0,0.85)] group/logo max-w-[260px] sm:max-w-[320px] md:max-w-[340px] w-full ${
                      isRed ? "hover:border-[#FF0D4A]/70" : "hover:border-[#4ade80]/70"
                    }`}
                  >
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 flex items-center justify-center">
                      <Image
                        src={project.logo}
                        alt={`${project.title} logo`}
                        fill
                        className="object-contain p-1.5 sm:p-2 transition-transform duration-500 group-hover/logo:scale-110 drop-shadow-[0_6px_25px_rgba(0,0,0,0.9)]"
                        sizes="(max-width: 640px) 72px, (max-width: 768px) 96px, 140px"
                        priority={index === 0}
                      />
                    </div>
                    <span
                      className={`font-bank text-sm sm:text-lg md:text-xl font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 flex items-center gap-2 text-center leading-tight ${
                        isRed ? "group-hover/logo:text-[#FF0D4A]" : "group-hover/logo:text-[#4ade80]"
                      }`}
                    >
                      {project.title}{" "}
                      <span className={`text-xs sm:text-sm font-sans ${isRed ? "text-[#FF0D4A]" : "text-[#4ade80]"}`}>
                        ↗
                      </span>
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
