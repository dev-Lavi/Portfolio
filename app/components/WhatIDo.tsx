"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap, useIsomorphicLayoutEffect, prefersReducedMotion } from "@/app/lib/gsap";

interface ServiceSubItem {
  title: string;
  description: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  blurb: string;
  accent: string;
  colorType: "green" | "red";
  pillColor: string;
  items: ServiceSubItem[];
}

const disciplines: ServiceCategory[] = [
  {
    id: "android",
    name: "Android Development",
    blurb: "High-performance native mobile apps engineered with modern Kotlin.",
    accent: "linear-gradient(135deg, #131d0e 0%, #0b1207 100%)",
    colorType: "green",
    pillColor: "#e3ff6b",
    items: [
      {
        title: "Native Kotlin Architecture",
        description:
          "Production Android apps built with Kotlin, Coroutines, Flow, and clean MVVM architecture designed for long-term scalability.",
      },
      {
        title: "Jetpack Compose & UI",
        description:
          "Declarative UI engineering with 60/120fps fluid animations, responsive layouts across phone and tablet form factors, and custom themes.",
      },
      {
        title: "System APIs & Store Release",
        description:
          "Deep integration with Bluetooth, background workers, Room database caching, and automated Google Play Console CI/CD pipelines.",
      },
    ],
  },
  {
    id: "frontend",
    name: "Frontend Development",
    blurb: "Modern, reactive, and cinematic web interfaces with Next.js and React.",
    accent: "linear-gradient(135deg, #D6003C 0%, #7a0420 100%)",
    colorType: "red",
    pillColor: "#ffffff",
    items: [
      {
        title: "Next.js App Router",
        description:
          "React Server Components, streaming SSR, edge middleware, and aggressive performance optimization for sub-second page loads.",
      },
      {
        title: "React 19 & Architecture",
        description:
          "Component-driven engineering, custom hooks, Server Actions, and reliable data synchronization across complex client workflows.",
      },
      {
        title: "Studio Animations & CSS",
        description:
          "GSAP ScrollTrigger scrubbing, Lenis momentum scrolling, interactive micro-interactions, and mobile-first responsive design systems.",
      },
    ],
  },
  {
    id: "backend",
    name: "Backend Development",
    blurb: "Scalable cloud microservices built with Node.js and Java Spring Boot.",
    accent: "linear-gradient(135deg, #172210 0%, #0d1408 100%)",
    colorType: "green",
    pillColor: "#e3ff6b",
    items: [
      {
        title: "Node.js & Express APIs",
        description:
          "Event-driven REST and WebSocket real-time architectures engineered for high concurrency and sub-millisecond query execution.",
      },
      {
        title: "Java Spring Boot",
        description:
          "Enterprise services using Spring Boot, Spring Security, JPA/Hibernate persistence, and rock-solid relational database integrity.",
      },
      {
        title: "Databases & Cloud Infra",
        description:
          "PostgreSQL, MongoDB, and Redis caching layers deployed with Docker containers on scalable AWS cloud infrastructure.",
      },
    ],
  },
  {
    id: "blockchain",
    name: "Blockchain Development",
    blurb: "Decentralized protocols, smart contracts, and Web3 infrastructure.",
    accent: "linear-gradient(135deg, #D6003C 0%, #7a0420 100%)",
    colorType: "red",
    pillColor: "#ffffff",
    items: [
      {
        title: "Ethereum & Smart Contracts",
        description:
          "Gas-optimized Solidity smart contracts implementing ERC-20, ERC-721, and ERC-1155 token standards verified with Hardhat and Foundry.",
      },
      {
        title: "IPFS & Pinata Storage",
        description:
          "Decentralized content addressing, immutable media hosting, and automated off-chain asset pinning via Pinata gateway APIs.",
      },
      {
        title: "MetaMask & Web3 SDKs",
        description:
          "Seamless Web3 wallet authentication using MetaMask, Wagmi, viem, and ethers.js with secure client-side cryptographic signing.",
      },
    ],
  },
  {
    id: "ai",
    name: "AI Development",
    blurb: "Practical intelligence, machine learning models, and LLM integrations.",
    accent: "linear-gradient(135deg, #1e2a14 0%, #10170a 100%)",
    colorType: "green",
    pillColor: "#e3ff6b",
    items: [
      {
        title: "AI Development & Agents",
        description:
          "Custom autonomous agents, LLM tool execution, Retrieval-Augmented Generation (RAG), and deterministic reasoning pipelines.",
      },
      {
        title: "Machine Learning Models",
        description:
          "Data preprocessing, model evaluation, fine-tuning open-source models, and deploying low-latency Python inference servers.",
      },
      {
        title: "AI Integration",
        description:
          "Embedding vector databases (Pinecone, Chroma) and production LLM APIs into user-facing web, mobile, and automation products.",
      },
    ],
  },
];

const PANEL_EASE = "cubic-bezier(.22,.8,.2,1)";

export default function WhatIDo() {
  const [active, setActive] = useState<number>(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef<boolean>(false);
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-cycle through categories until the user hovers or interacts
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHoveredRef.current) {
        setActive((prev) => (prev + 1) % disciplines.length);
      }
    }, 4800);
    return () => clearInterval(interval);
  }, []);

  // Stagger sub-items entrance whenever active index changes
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const bodyEl = bodyRefs.current[active];
    if (bodyEl) {
      const items = bodyEl.querySelectorAll("[data-item]");
      gsap.fromTo(
        items,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.04,
        }
      );
    }
  }, [active]);

  return (
    <section
      id="what-i-do"
      data-theme-bg="#F7F7F5"
      data-theme-fg="#111111"
      className="relative z-30 w-full bg-[#F7F7F5] text-[#111111] py-20 sm:py-28 lg:py-36 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden transition-colors duration-700"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Pill Label */}
        <div className="inline-flex items-center gap-3 mb-6 sm:mb-8">
          <span className="font-bank text-sm sm:text-base md:text-[17px] font-bold text-[#354921]">03</span>
          <span className="w-7 h-[1.5px] bg-black/20" />
          <span className="font-mono text-xs sm:text-sm md:text-[14px] font-bold tracking-[0.18em] text-neutral-500 uppercase">
            WHAT I DO // CORE DISCIPLINES
          </span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 sm:gap-8 mb-12 sm:mb-16">
          <h2 className="font-bank text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] text-[#111111] leading-tight m-0">
            What I <span className="text-[#354921] underline decoration-[#9ab73d] decoration-4 underline-offset-8">do.</span>
          </h2>
          <p className="font-sans text-base sm:text-lg md:text-[19px] lg:text-[20px] text-neutral-600 max-w-2xl m-0 leading-[1.65]">
            Five disciplines, one developer. From native mobile apps and modern web architectures to distributed smart contracts and applied artificial intelligence.
          </p>
        </div>

        {/* Kinetic Accordion Board */}
        <div
          ref={rootRef}
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          className="border-t border-black/15 w-full"
        >
          {disciplines.map((item, i) => {
            const on = i === active;

            return (
              <div
                key={item.id}
                data-row
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                tabIndex={0}
                role="button"
                aria-expanded={on}
                aria-label={`${item.name} — ${item.blurb}`}
                className="relative overflow-hidden cursor-pointer outline-none border-b border-black/15 select-none hover:bg-black/[0.02]"
              >
                {/* Accent Background Wipe */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left block w-full h-full pointer-events-none"
                  style={{
                    background: item.accent,
                    transform: on ? "scaleX(1)" : "scaleX(0)",
                    transition: `transform .55s ${PANEL_EASE}`,
                  }}
                />

                {/* Row Header Bar */}
                <div
                  className="relative z-10 flex items-center gap-3 sm:gap-6 md:gap-8 py-5 sm:py-6 md:py-8"
                  style={{
                    paddingLeft: on ? 24 : 0,
                    paddingRight: on ? 24 : 0,
                    color: on ? "#ffffff" : "#111111",
                    transition: `padding .5s ${PANEL_EASE}, color .3s ease`,
                  }}
                >
                  {/* Number Badge */}
                  <span
                    className="font-mono text-sm sm:text-base md:text-[17px] font-bold tracking-[0.16em] tabular-nums shrink-0"
                    style={{
                      color: on ? item.pillColor : "rgba(17,17,17,0.38)",
                      transition: "color .3s ease",
                    }}
                  >
                    0{i + 1}
                  </span>

                  {/* Discipline Title - Reference grey rgba(17,17,17,0.24) when inactive */}
                  <span
                    className="flex-1 min-w-0 font-bank text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-[0.05em] sm:tracking-[0.1em] leading-snug"
                    style={{
                      color: on ? "#ffffff" : "rgba(17,17,17,0.24)",
                      transition: "color .3s ease",
                    }}
                  >
                    {item.name}
                  </span>

                  {/* Desktop Right Blurb */}
                  <span
                    className="hidden md:block w-[320px] lg:w-[420px] text-right font-sans text-base sm:text-[16px] md:text-[17px] lg:text-[18px] leading-relaxed shrink-0"
                    style={{
                      color: on ? "rgba(255,255,255,0.88)" : "rgba(17,17,17,0.48)",
                      transition: "color .3s ease",
                    }}
                  >
                    {item.blurb}
                  </span>

                  {/* Arrow Indicator */}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-lg sm:text-2xl font-bold font-sans"
                    style={{
                      color: on ? item.pillColor : "rgba(17,17,17,0.24)",
                      transform: on ? "translateX(0)" : "translateX(-6px)",
                      opacity: on ? 1 : 0.35,
                      transition: `all .3s ${PANEL_EASE}`,
                    }}
                  >
                    ↗
                  </span>
                </div>

                {/* Animated Drawer */}
                <div
                  className="relative z-10 grid"
                  style={{
                    gridTemplateRows: on ? "1fr" : "0fr",
                    transition: `grid-template-rows .5s ${PANEL_EASE}`,
                  }}
                >
                  <div className="overflow-hidden min-h-0">
                    <div
                      ref={(el) => {
                        bodyRefs.current[i] = el;
                      }}
                      className="pb-7 sm:pb-9 pt-2"
                      style={{
                        paddingLeft: on ? 24 : 0,
                        paddingRight: on ? 24 : 0,
                      }}
                    >
                      {/* Mobile Blurb (visible < md) */}
                      <p
                        className="md:hidden font-sans text-base sm:text-[17px] leading-relaxed mb-6 text-white/90"
                      >
                        {item.blurb}
                      </p>

                      {/* 3-Column Sub-Services Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 lg:gap-9 max-w-[1150px]">
                        {item.items.map((sub, n) => (
                          <div
                            key={sub.title}
                            data-item
                            className="pt-4 border-t border-white/20"
                          >
                            <div
                              className="font-bank text-base sm:text-[17px] font-bold mb-2"
                              style={{ color: item.pillColor }}
                            >
                              0{n + 1}
                            </div>
                            <h4 className="font-bank text-lg sm:text-xl md:text-[21px] font-bold mb-2.5 uppercase tracking-[0.06em] leading-snug text-white">
                              {sub.title}
                            </h4>
                            <p className="font-sans text-sm sm:text-[16px] md:text-[17px] leading-relaxed text-white/85">
                              {sub.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
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
