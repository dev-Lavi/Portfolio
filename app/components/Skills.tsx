"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect, prefersReducedMotion } from "@/app/lib/gsap";
import { CoverflowCarousel, CoverflowSlide } from "@/app/components/ui/CoverflowCarousel";

export interface SkillItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  colorType?: "green" | "red";
}

export const SKILL_ITEMS: SkillItem[] = [
  {
    id: 1,
    title: "Next.js 15",
    category: "FRONTEND & FULL-STACK",
    description: "Server Components, App Router, Streaming SSR & Turbopack",
    image: "/skills/nextjs.svg",
    alt: "Next.js Logo",
    colorType: "green",
  },
  {
    id: 2,
    title: "React 19",
    category: "UI ARCHITECTURE",
    description: "Declarative Component Systems, Hooks & High Performance",
    image: "/skills/react.svg",
    alt: "React Logo",
    colorType: "green",
  },
  {
    id: 3,
    title: "TypeScript",
    category: "TYPE SAFETY",
    description: "Strict Type-Safe Schemas & Enterprise Codebase Scalability",
    image: "/skills/typescript.svg",
    alt: "TypeScript Logo",
    colorType: "red",
  },
  {
    id: 4,
    title: "Kotlin",
    category: "NATIVE MOBILE",
    description: "Modern Android Architecture, Coroutines, Flow & MVVM",
    image: "/skills/Kotlin.svg",
    alt: "Kotlin Logo",
    colorType: "green",
  },
  {
    id: 5,
    title: "Android Studio",
    category: "MOBILE TOOLCHAIN",
    description: "SDK Profiling, Jetpack Compose, Gradle & NDK Builds",
    image: "/skills/Android Studio.svg",
    alt: "Android Studio Logo",
    colorType: "green",
  },
  {
    id: 6,
    title: "Node.js",
    category: "BACKEND RUNTIME",
    description: "High-Throughput Asynchronous Microservices & Event Loop",
    image: "/skills/nodejs.svg",
    alt: "Node.js Logo",
    colorType: "green",
  },
  {
    id: 7,
    title: "Spring Boot",
    category: "ENTERPRISE BACKEND",
    description: "Resilient Java Microservices, REST APIs, Security & JPA",
    image: "/skills/Spring.svg",
    alt: "Spring Boot Logo",
    colorType: "green",
  },
  {
    id: 8,
    title: "Python",
    category: "AI & AUTOMATION",
    description: "Applied Machine Learning, PyTorch, FastAPI & Scripting",
    image: "/skills/python.svg",
    alt: "Python Logo",
    colorType: "red",
  },
  {
    id: 9,
    title: "Solidity",
    category: "SMART CONTRACTS",
    description: "EVM Smart Contract Engineering & Gas Optimization",
    image: "/skills/solidity.svg",
    alt: "Solidity Logo",
    colorType: "green",
  },
  {
    id: 10,
    title: "Ethereum",
    category: "WEB3 PROTOCOLS",
    description: "Decentralized Ledgers, Web3 Providers & Tokenomics",
    image: "/skills/ethereum.svg",
    alt: "Ethereum Logo",
    colorType: "red",
  },
  {
    id: 11,
    title: "PostgreSQL",
    category: "RELATIONAL DATABASE",
    description: "ACID Transactions, Complex SQL Indexing & Prisma",
    image: "/skills/PostgresSQL.svg",
    alt: "PostgreSQL Logo",
    colorType: "green",
  },
  {
    id: 12,
    title: "MongoDB",
    category: "NOSQL DATABASE",
    description: "Document Schemas, Fast Aggregations & Clustering",
    image: "/skills/MongoDB.svg",
    alt: "MongoDB Logo",
    colorType: "green",
  },
  {
    id: 13,
    title: "Redis",
    category: "IN-MEMORY CACHE",
    description: "Sub-Millisecond Low-Latency Caching & Pub/Sub",
    image: "/skills/Redis.svg",
    alt: "Redis Logo",
    colorType: "red",
  },
  {
    id: 14,
    title: "AWS Cloud",
    category: "CLOUD INFRASTRUCTURE",
    description: "S3, EC2, CloudFront CDN, Lambda Serverless & IAM",
    image: "/skills/AWS.svg",
    alt: "AWS Cloud Logo",
    colorType: "red",
  },
  {
    id: 15,
    title: "Vercel",
    category: "EDGE PLATFORM",
    description: "Edge Functions, Preview Branches & Global CDN Deploy",
    image: "/skills/vercel.svg",
    alt: "Vercel Logo",
    colorType: "green",
  },
  {
    id: 16,
    title: "Tailwind CSS",
    category: "DESIGN SYSTEMS",
    description: "Utility-First Responsive UI & Custom Design Tokens",
    image: "/skills/tailwind.svg",
    alt: "Tailwind CSS Logo",
    colorType: "green",
  },
  {
    id: 17,
    title: "JavaScript",
    category: "CORE WEB LANGUAGE",
    description: "Modern ESNext, Asynchronous DOM & V8 Execution",
    image: "/skills/js.svg",
    alt: "JavaScript Logo",
    colorType: "red",
  },
  {
    id: 18,
    title: "Express.js",
    category: "API FRAMEWORK",
    description: "RESTful Routing, Auth Pipelines & JSON Middleware",
    image: "/skills/express.svg",
    alt: "Express.js Logo",
    colorType: "green",
  },
  {
    id: 19,
    title: "Firebase",
    category: "SERVERLESS CLOUD",
    description: "Firestore, Cloud Functions, Remote Config & Auth",
    image: "/skills/Firebase.svg",
    alt: "Firebase Logo",
    colorType: "red",
  },
  {
    id: 20,
    title: "Git & GitHub",
    category: "VERSION CONTROL",
    description: "Git Flow, Automated Actions & Codebase Integrity",
    image: "/skills/git.svg",
    alt: "Git Logo",
    colorType: "green",
  },
  {
    id: 21,
    title: "Figma",
    category: "UI/UX DESIGN",
    description: "Interactive UI Prototyping & Design System Systems",
    image: "/skills/figma.svg",
    alt: "Figma Logo",
    colorType: "red",
  },
  {
    id: 22,
    title: "Postman",
    category: "API TESTING",
    description: "Automated Integration Testing & End-to-End Mocking",
    image: "/skills/Postman.svg",
    alt: "Postman Logo",
    colorType: "red",
  },
  {
    id: 23,
    title: "RevenueCat",
    category: "APP MONETIZATION",
    description: "In-App Purchases, Paywalls & Cross-Platform Billing",
    image: "/skills/revenuecat-logomark.svg",
    alt: "RevenueCat Logo",
    colorType: "red",
  },
  {
    id: 24,
    title: "Google Play",
    category: "APP PUBLISHING",
    description: "Production Release Tracks, ASO & Android Vitals",
    image: "/skills/google-play-console-icon.svg",
    alt: "Google Play Console Logo",
    colorType: "green",
  },
  {
    id: 25,
    title: "HTML5 Web",
    category: "SEMANTIC STANDARDS",
    description: "Accessible DOM Architecture & Modern Web Standards",
    image: "/skills/HTML5.svg",
    alt: "HTML5 Logo",
    colorType: "red",
  },
];

const DESKTOP_WIDTH = 1200;
const TABLET_MIN_WIDTH = 768;

const LEFT_DEPTH_MAX = 30;
const RIGHT_DEPTH_MAX = 40;
const DEPTH_MIN = -1;
const DEPTH_MAX = 1;
const Z_INDEX_MIN = 1;

function wrapProgress(value: number) {
  let wrappedValue = value % 1;
  if (wrappedValue < 0) {
    wrappedValue += 1;
  }
  return wrappedValue;
}

function getCircularPosition(
  progress: number,
  radiusX: number,
  radiusY: number,
  angleOffset = 0
) {
  const angle = progress * Math.PI * 2 + angleOffset;

  return {
    angle,
    x: Math.sin(angle) * radiusX,
    y: Math.cos(angle) * radiusY,
    verticalDepth: Math.cos(angle),
    horizontalDepth: Math.sin(angle),
  };
}

function getStrength(value: number) {
  return gsap.utils.clamp(
    0,
    1,
    gsap.utils.mapRange(DEPTH_MIN, DEPTH_MAX, 0, 1, value)
  );
}

function shapeFocus(strength: number, start = 0.65, power = 2.8) {
  const normalized = gsap.utils.clamp(0, 1, (strength - start) / (1 - start));
  return Math.pow(normalized, power);
}

export interface SkillsProps {
  items?: SkillItem[];
  className?: string;
  leftRadius?: number;
  rightRadius?: number;
  cardSize?: number;
  sectionHeight?: number;
  scrub?: number;
}

export default function Skills({
  items = SKILL_ITEMS,
  className = "",
  leftRadius = 220,
  rightRadius = 380,
  cardSize = 220,
  sectionHeight = 28,
  scrub = 1.2,
}: SkillsProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  const safeItems = useMemo(() => {
    return items.map((item, index) => ({
      ...item,
      id: item.id ?? index + 1,
      title: item.title ?? `Skill ${index + 1}`,
      category: item.category ?? "TECHNOLOGY",
      description: item.description ?? "Production-grade implementation & architecture.",
      image: item.image ?? "",
      alt: item.alt ?? item.title,
      colorType: item.colorType ?? (index % 2 === 0 ? "green" : "red"),
    }));
  }, [items]);

  const coverflowSlides = useMemo<CoverflowSlide[]>(() => {
    return safeItems.map((item) => ({
      id: item.id,
      src: item.image,
      alt: item.alt,
      title: item.title,
      category: item.category,
      description: item.description,
      colorType: item.colorType,
    }));
  }, [safeItems]);

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current || !stickyRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      const ctx = gsap.context(() => {
        const leftNodes = gsap.utils.toArray(
          ".circular-scroll-showcase__left-item"
        ) as HTMLElement[];
        const rightNodes = gsap.utils.toArray(
          ".circular-scroll-showcase__right-item"
        ) as HTMLElement[];

        const total = safeItems.length;
        if (!total) return;

        gsap.set([...leftNodes, ...rightNodes], { opacity: 1 });

        const leftRadiusX = leftRadius;
        const leftRadiusY = leftRadius;
        const rightRadiusX = rightRadius;
        const rightRadiusY = rightRadius;
        const leftAngleOffset = Math.PI / 2;
        const rightAngleOffset = -Math.PI / 2;
        const focusPhase = 0;

        // Sharp focus threshold so non-focused text completely fades out (zero overlapping)
        const textFocusStart = 0.82;
        const textFocusPower = 2.2;
        const imageFocusStart = 0.70;
        const imageFocusPower = 2.4;

        const textCenterScale = 1;
        const textSideScale = 0.75;
        const textCenterOpacity = 1;
        const textSideOpacity = 0; // Completely invisible outside focus zone!

        const imageCenterScale = 1;
        const imageSideScale = 0.55;
        const imageCenterOpacity = 1;
        const imageSideOpacity = 0; // Completely invisible outside active carousel arc!

        const render = (scrollProgress: number) => {
          progressRef.current = scrollProgress;

          const width = typeof window !== "undefined" ? window.innerWidth : DESKTOP_WIDTH;
          let factor = 1;

          if (width < DESKTOP_WIDTH && width >= TABLET_MIN_WIDTH) {
            factor = width / DESKTOP_WIDTH;
          }

          const leftRadiusScaledX = leftRadiusX * factor;
          const leftRadiusScaledY = leftRadiusY * factor;
          const rightRadiusScaledX = rightRadiusX * factor;
          const rightRadiusScaledY = rightRadiusY * factor;

          if (rootRef.current) {
            rootRef.current.style.setProperty("--css-card-width", `${cardSize * factor}px`);
            rootRef.current.style.setProperty("--css-card-height", `${cardSize * factor}px`);
          }

          leftNodes.forEach((node, index) => {
            // Distance in fraction of total items, wrapped in [-0.5, 0.5]
            let diff = (index / total - scrollProgress) % 1;
            if (diff > 0.5) diff -= 1;
            if (diff < -0.5) diff += 1;

            // Normalized distance where 1.0 = distance to adjacent item
            const itemDist = diff * total;
            const absItemDist = Math.abs(itemDist);

            // Strict visibility window: only visible within 0.65 item distance
            // When an item is near center, adjacent items are completely hidden (opacity = 0)
            const itemThreshold = 0.65;
            if (absItemDist >= itemThreshold) {
              gsap.set(node, {
                opacity: 0,
                visibility: "hidden",
                y: itemDist > 0 ? 250 : -250,
                scale: 0.85,
              });
              return;
            }

            // Smooth cubic ease for opacity: 1 at 0, drops to 0 at 0.65
            const normDist = absItemDist / itemThreshold;
            const opacity = Math.max(0, 1 - normDist * normDist);

            // Distinct vertical offset: active at 0, outgoing moves up, incoming moves from down
            const y = itemDist * 220;

            // Subtle scale transition
            const scale = gsap.utils.interpolate(0.88, 1, 1 - normDist);

            // Subtle horizontal shift for natural arc
            const x = (1 - Math.cos(normDist * Math.PI * 0.5)) * -20;

            const zIndex = Math.round(gsap.utils.interpolate(Z_INDEX_MIN, LEFT_DEPTH_MAX, 1 - normDist));

            gsap.set(node, {
              x,
              y,
              scale,
              opacity,
              zIndex,
              visibility: "visible",
              transformOrigin: "left center",
            });
          });

          rightNodes.forEach((node, index) => {
            const localProgress = wrapProgress(index / total - scrollProgress + focusPhase / total);

            const position = getCircularPosition(
              localProgress,
              rightRadiusScaledX,
              rightRadiusScaledY,
              rightAngleOffset
            );

            const rawStrength = getStrength(-position.horizontalDepth);
            const focusStrength = shapeFocus(rawStrength, imageFocusStart, imageFocusPower);

            const scale = gsap.utils.interpolate(imageSideScale, imageCenterScale, focusStrength);
            const opacity = gsap.utils.interpolate(imageSideOpacity, imageCenterOpacity, focusStrength);
            const zIndex = Math.round(gsap.utils.interpolate(Z_INDEX_MIN, RIGHT_DEPTH_MAX, focusStrength));

            gsap.set(node, {
              x: position.x,
              y: position.y,
              scale,
              opacity,
              zIndex,
              transformOrigin: "50% 50%",
            });
          });
        };

        render(0);

        const scrollTrigger = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: `+=${sectionHeight * safeItems.length}%`,
          pin: stickyRef.current,
          scrub,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            render(self.progress);
          },
        });

        const onResize = () => {
          render(progressRef.current);
          scrollTrigger.refresh();
        };

        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          scrollTrigger.kill();
        };
      }, rootRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [safeItems, scrub, sectionHeight, leftRadius, rightRadius, cardSize]);

  return (
    <section
      ref={rootRef}
      id="skills"
      className={`relative w-full min-h-screen bg-[#070b05] text-white overflow-clip ${className}`}
      style={{
        "--css-card-width": `${cardSize}px`,
        "--css-card-height": `${cardSize}px`,
      } as React.CSSProperties}
    >
      {/* Background Cybernetic Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(#202d18 1px, transparent 1px),
              linear-gradient(90deg, #202d18 1px, transparent 1px)
            `,
            backgroundSize: "75px 75px",
          }}
        />
        {/* Ambient Radial Glow Blobs */}
        <div
          className="absolute top-1/4 left-1/5 w-[550px] h-[550px] max-w-[90vw] rounded-full opacity-15 blur-[140px]"
          style={{ background: "radial-gradient(circle, #e3ff6b 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/5 w-[500px] h-[500px] max-w-[90vw] rounded-full opacity-10 blur-[130px]"
          style={{ background: "radial-gradient(circle, #FF0D4A 0%, transparent 70%)" }}
        />
      </div>

      {/* Pinned Desktop Circular Split Roll Carousel (>= 1025px) */}
      <div
        ref={stickyRef}
        aria-hidden="true"
        className={`relative h-screen w-full overflow-hidden ${reducedMotion ? "hidden" : "max-[1025px]:hidden"}`}
      >
        {/* Pinned HUD Header (clean top-left placement) */}
        <div className="absolute top-8 left-8 md:left-14 right-8 md:right-14 z-30 pointer-events-none flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#27341c] bg-[#0c1209]/90 backdrop-blur-md mb-2">
              <span className="h-2 w-2 rounded-full bg-[#e3ff6b] animate-pulse" />
              <span className="font-mono text-[9px] sm:text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#e3ff6b]">
                04 // CORE DISCIPLINES & TECH ARSENAL
              </span>
            </div>
            <h2 className="font-bank text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.1em] text-white">
              TECHNOLOGIES I <span className="text-[#e3ff6b] drop-shadow-[0_0_25px_rgba(227,255,107,0.4)]">WORK WITH.</span>
            </h2>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md font-mono text-xs text-[#e3ff6b]/80 uppercase tracking-widest">
            <span>Scroll Orbit</span>
            <span className="animate-bounce">↓</span>
          </div>
        </div>

        {/* Circular Orbit Presentation Stage */}
        <div className="relative mx-auto flex h-full w-full">
          {/* Left Column (Clean text presentation aligned with HUD header) */}
          <div className="relative flex h-full w-[48vw] lg:w-[46vw] items-center justify-start pl-8 sm:pl-12 md:pl-16 lg:pl-20 z-20">
            <div className="relative h-[65vh] w-full max-w-xl flex items-center">
              {safeItems.map((item) => (
                <div
                  key={item.id}
                  className="circular-scroll-showcase__left-item pointer-events-none absolute left-0 top-1/2 w-full origin-left text-left opacity-0 will-change-[transform,opacity] -translate-y-1/2"
                >
                  <div className="flex flex-col items-start gap-4 max-w-lg">
                    {/* Category Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.colorType === "red" ? "bg-[#FF0D4A]" : "bg-[#e3ff6b]"
                        } animate-pulse`}
                      />
                      <span
                        className={`font-mono text-[10.5px] sm:text-xs font-bold tracking-[0.16em] uppercase ${
                          item.colorType === "red" ? "text-[#FF0D4A]" : "text-[#e3ff6b]"
                        }`}
                      >
                        [ {item.category} ]
                      </span>
                    </div>

                    {/* Skill Title */}
                    <h3 className="font-bank text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-[0.05em] text-white leading-tight drop-shadow-[0_0_30px_rgba(227,255,107,0.35)]">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="font-mono text-xs sm:text-sm text-neutral-300 tracking-[0.06em] uppercase max-w-md leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Orbiting Glassmorphic Logo Badges, centered on right 50vw) */}
          <div
            className="relative flex h-full w-[50vw] items-center justify-center"
            style={{ transform: `translateX(${rightRadius}px)` }}
          >
            <div className="relative h-[78vh]">
              {safeItems.map((item) => (
                <div
                  key={item.id}
                  className="circular-scroll-showcase__right-item absolute left-1/2 top-1/2 ml-[calc(var(--css-card-width,220px)*-0.5)] mt-[calc(var(--css-card-height,220px)*-0.5)] h-[var(--css-card-height,220px)] w-[var(--css-card-width,220px)] origin-center opacity-0 will-change-[transform,opacity]"
                >
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-[26px] bg-gradient-to-b from-[#12190f]/95 to-[#060905]/95 backdrop-blur-xl border transition-all duration-300 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center p-6 ${
                      item.colorType === "red"
                        ? "border-[#4a0d1a] shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,13,74,0.25)]"
                        : "border-[#27341c] shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(227,255,107,0.25)]"
                    }`}
                  >
                    {/* Subtle Cybernetic Grid Inside Card */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-15"
                      style={{
                        backgroundImage:
                          item.colorType === "red"
                            ? "linear-gradient(#ff0d4a 1px, transparent 1px), linear-gradient(90deg, #ff0d4a 1px, transparent 1px)"
                            : "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />

                    {/* Ambient Downlight glow inside card */}
                    <div
                      className="pointer-events-none absolute -bottom-6 left-0 right-0 h-28"
                      style={{
                        background:
                          item.colorType === "red"
                            ? "radial-gradient(ellipse 90% 80% at 50% 100%, rgba(255, 13, 74, 0.45) 0%, transparent 75%)"
                            : "radial-gradient(ellipse 90% 80% at 50% 100%, rgba(227, 255, 107, 0.45) 0%, transparent 75%)",
                        filter: "blur(14px)",
                      }}
                    />

                    {/* Logo Image */}
                    <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        className="pointer-events-none object-contain p-2 select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
                        draggable={false}
                        unoptimized
                      />
                    </div>

                    {/* Title Pill under Logo */}
                    <div className="relative z-10 mt-3 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm">
                      <span
                        className={`font-bank text-xs font-bold uppercase tracking-[0.14em] ${
                          item.colorType === "red" ? "text-[#FF0D4A]" : "text-[#e3ff6b]"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Accessible Grid Fallback (<= 1024px or Reduced Motion) */}
      <div
        className={`w-full px-4 sm:px-6 md:px-10 py-16 ${
          reducedMotion ? "block" : "sr-only max-[1025px]:not-sr-only max-[1025px]:block"
        }`}
      >
        {/* Section Header for Mobile */}
        <div className="mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#27341c] bg-[#0c1209]/90 backdrop-blur-md mb-3">
            <span className="h-2 w-2 rounded-full bg-[#e3ff6b] animate-pulse" />
            <span className="font-mono text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e3ff6b]">
              04 // CORE DISCIPLINES & TECH ARSENAL
            </span>
          </div>

          <h2 className="font-bank text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.08em] text-white leading-tight">
            TECHNOLOGIES I <span className="text-[#e3ff6b]">WORK WITH.</span>
          </h2>
        </div>

        {/* 3D Coverflow Carousel for Small Width Devices */}
        <div className="w-full max-w-xl mx-auto">
          <CoverflowCarousel
            slides={coverflowSlides}
            rotate={42}
            depth={0.65}
            perspective={2.8}
            falloff={0.56}
            fade={0.12}
            cardWidth="clamp(175px, 50vw, 230px)"
            gap={0.06}
            loop={true}
            showCaption={true}
            showNavigation={false}
          />
        </div>
      </div>
    </section>
  );
}
