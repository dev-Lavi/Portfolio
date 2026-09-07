"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { TextLoop } from "./ui/TextLoop";

const TOTAL_FRAMES = 234;
const FRAME_PREFIX = "/frames_bike/webp/frame-";
const FRAME_SUFFIX = ".webp";

const getFramePath = (index: number) => {
  const paddedIndex = index.toString().padStart(3, "0");
  return `${FRAME_PREFIX}${paddedIndex}${FRAME_SUFFIX}`;
};

export default function MotorcycleShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES + 1).fill(null)
  );
  const [loaded, setLoaded] = useState(false);
  const [activeStage, setActiveStage] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);
  const currentFrameRef = useRef(1);
  const rafIdRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Clamp scroll progress strictly to [0, 1] so boundaries never fluctuate
  const clampedProgress = useTransform(scrollYProgress, [0, 1], [0, 1], {
    clamp: true,
  });

  // Smooth, overdamped physics (zeta > 1.6) guarantees ZERO overshoot and ZERO rebound/reversal
  const smoothProgress = useSpring(clampedProgress, {
    stiffness: 160,
    damping: 38,
    mass: 0.8,
    restDelta: 0.0001,
  });

  const drawToCanvas = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement
  ) => {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.width / dpr;
    const displayHeight = canvas.height / dpr;

    const ratio = Math.max(displayWidth / img.width, displayHeight / img.height);
    const centerShift_x = (displayWidth - img.width * ratio) / 2;
    const centerShift_y = (displayHeight - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
    ctx.restore();
  };

  const drawFrame = (index: number) => {
    if (!canvasRef.current) return;
    let imgToDraw = imagesRef.current[index];
    if (!imgToDraw || !imgToDraw.complete) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = imagesRef.current[index - offset];
        if (prev && prev.complete) {
          imgToDraw = prev;
          break;
        }
        const next = imagesRef.current[index + offset];
        if (next && next.complete) {
          imgToDraw = next;
          break;
        }
      }
    }
    if (!imgToDraw) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        if (canvasRef.current && imgToDraw) {
          drawToCanvas(ctx, canvasRef.current, imgToDraw);
        }
      });
    }
  };

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const progress = Math.min(1, Math.max(0, latest));
    const frame = Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.round(progress * (TOTAL_FRAMES - 1)) + 1)
    );
    if (frame !== currentFrameRef.current) {
      currentFrameRef.current = frame;
      drawFrame(frame);
    }

    // Cutoffs:
    // Frame 1 to 57: Stage 1 (Right Side)
    // Frame 58 to 115: Stage 2 (Left Side)
    // Frame 116 to 174: Stage 3 (Left Side)
    // Frame 175 to 234: Stage 4 (Right Side)
    let stage = 1;
    if (frame <= 57) stage = 1;
    else if (frame <= 115) stage = 2;
    else if (frame <= 174) stage = 3;
    else stage = 4;

    setActiveStage(stage);
  });

  useEffect(() => {
    let isMounted = true;

    // Immediately load Frame 1 so the sequence renders instantly
    const firstImg = new window.Image();
    firstImg.src = getFramePath(1);
    firstImg.onload = () => {
      if (!isMounted) return;
      imagesRef.current[1] = firstImg;
      setLoaded(true);
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        drawFrame(1);
      }
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        drawFrame(currentFrameRef.current);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Load remaining frames in background
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (isMounted) {
          imagesRef.current[i] = img;
        }
      };
    }

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Frame mapping to scroll progress:
  // Frame 57 / 234 = 0.2435
  // Frame 115 / 234 = 0.4915
  // Frame 174 / 234 = 0.7435
  // Frame 234 / 234 = 1.0000

  // Stage 1 (Team Conatus): Frame 1 to 57 -> RIGHT SIDE (Desktop), BOTTOM CENTER (Mobile)
  const stage1Opacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.19, 0.2435],
    [0, 1, 1, 0]
  );
  const stage1X = useTransform(
    scrollYProgress,
    [0, 0.04, 0.19, 0.2435],
    [36, 0, 0, 36]
  );
  const stage1Y = useTransform(
    scrollYProgress,
    [0, 0.04, 0.19, 0.2435],
    [16, 0, 0, 16]
  );
  const stage1Line = useTransform(scrollYProgress, [0.03, 0.14], ["0%", "100%"]);

  // Stage 2 (Sharnex): Frame 58 to 115 -> LEFT SIDE (Desktop), BOTTOM CENTER (Mobile)
  const stage2Opacity = useTransform(
    scrollYProgress,
    [0.2435, 0.28, 0.44, 0.4915],
    [0, 1, 1, 0]
  );
  const stage2X = useTransform(
    scrollYProgress,
    [0.2435, 0.28, 0.44, 0.4915],
    [-36, 0, 0, -36]
  );
  const stage2Y = useTransform(
    scrollYProgress,
    [0.2435, 0.28, 0.44, 0.4915],
    [16, 0, 0, 16]
  );
  const stage2Line = useTransform(scrollYProgress, [0.28, 0.38], ["0%", "100%"]);

  // Stage 3 (OriginHash): Frame 116 to 174 -> LEFT SIDE (Desktop), BOTTOM CENTER (Mobile)
  const stage3Opacity = useTransform(
    scrollYProgress,
    [0.4915, 0.53, 0.69, 0.7435],
    [0, 1, 1, 0]
  );
  const stage3X = useTransform(
    scrollYProgress,
    [0.4915, 0.53, 0.69, 0.7435],
    [-36, 0, 0, -36]
  );
  const stage3Y = useTransform(
    scrollYProgress,
    [0.4915, 0.53, 0.69, 0.7435],
    [16, 0, 0, 16]
  );
  const stage3Line = useTransform(scrollYProgress, [0.53, 0.63], ["0%", "100%"]);

  // Stage 4 (Web3Task): Frame 175 to 234 -> RIGHT SIDE (Desktop), BOTTOM CENTER (Mobile)
  const stage4Opacity = useTransform(
    scrollYProgress,
    [0.7435, 0.78, 0.98, 1],
    [0, 1, 1, 1]
  );
  const stage4X = useTransform(
    scrollYProgress,
    [0.7435, 0.78, 0.98, 1],
    [36, 0, 0, 0]
  );
  const stage4Y = useTransform(
    scrollYProgress,
    [0.7435, 0.78, 0.98, 1],
    [16, 0, 0, 0]
  );
  const stage4Line = useTransform(scrollYProgress, [0.78, 0.88], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-[#0A0C0A]">
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-15 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
          }}
        />

        {/* Cinematic Vignette & Lighting Gradient Overlays */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: "radial-gradient(circle, transparent 35%, #000000 120%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, #0A0C0A 0%, transparent 18%, transparent 82%, #0A0C0A 100%)",
          }}
        />

        {/* Loading State */}
        {!loaded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0A0C0A]">
            <div className="text-[#FFB020] text-sm uppercase tracking-widest font-mono animate-pulse">
              Loading Sequence...
            </div>
          </div>
        )}

        {/* Enhanced Canvas with CSS Color Grading Filter */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 filter contrast-[1.08] saturate-[1.15] brightness-[1.02]"
        />

        {/* Top Left Section Header */}
        <div className="absolute top-6 sm:top-10 left-4 sm:left-8 md:left-12 lg:left-16 z-30 pointer-events-none">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 rounded-full border border-[#27341c] bg-[#0c1209]/85 backdrop-blur-md mb-2">
            <span className="h-2 w-2 rounded-full bg-[#e3ff6b] animate-pulse" />
            <span className="font-mono text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e3ff6b]">
              04 // CAREER TRAJECTORY & EXPERIENCE
            </span>
          </div>
        </div>

        {/* Scroll Progress Indicator Bar on extreme right */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-[2px] h-40 bg-white/10 z-30 rounded-full overflow-hidden hidden xl:block pointer-events-none">
          <motion.div
            className="w-full bg-gradient-to-b from-[#e3ff6b] via-[#FFB020] to-white origin-top"
            style={{
              height: "100%",
              scaleY: scrollYProgress,
            }}
          />
        </div>

        {/* ========================================================================= */}
        {/* STAGE 1: TEAM CONATUS (Frames 1 - 57) -> RIGHT SIDE ON DESKTOP            */}
        {/* ========================================================================= */}
        <div className="absolute bottom-6 xs:bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-auto md:right-8 lg:right-14 xl:right-20 w-[calc(100%-28px)] max-w-[350px] xs:max-w-[390px] sm:max-w-[440px] md:max-w-md lg:max-w-lg xl:max-w-xl z-30 pointer-events-none text-left">
          <motion.div
            style={{
              opacity: stage1Opacity,
              x: isDesktop ? stage1X : 0,
              y: !isDesktop ? stage1Y : 0,
            }}
            className="relative"
          >
            {/* Company Logo, Company Name & Duration */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2 md:mb-2.5">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg overflow-hidden bg-black/85 border border-[#e3ff6b]/40 shadow-[0_0_12px_rgba(227,255,107,0.15)] flex items-center justify-center p-1 shrink-0">
                <Image
                  src="/projects/Team%20conatus.jpg"
                  alt="Team Conatus"
                  fill
                  className="object-contain p-0.5 rounded-md"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <span className="font-bank text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-[#e3ff6b] block truncate drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  TEAM CONATUS
                </span>
                <span className="text-white/70 text-[9.5px] sm:text-[11px] font-mono tracking-wider uppercase block truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  SEP 2024 – PRESENT
                </span>
              </div>
            </div>

            {/* Position / Role with Responsive TextLoop in font-bank White and Yellow */}
            <div className="w-full overflow-hidden min-h-[28px] sm:min-h-[34px] md:min-h-[44px] flex items-center my-0.5 sm:my-1">
              <TextLoop
                interval={2.4}
                className="font-bank text-base sm:text-xl md:text-2xl lg:text-[28px] xl:text-[32px] font-bold uppercase tracking-[0.06em] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] leading-tight break-words"
              >
                <span>BACK END DEVELOPER</span>
                <span className="text-[#e3ff6b]">API & SYSTEM ARCHITECTURE</span>
                <span>TRAINEE DEVELOPER</span>
              </TextLoop>
            </div>

            {/* Glowing Yellow/White Divider Line (Desktop) */}
            <div className="hidden md:block h-[1.5px] bg-white/15 w-full my-3 relative overflow-hidden rounded-full">
              <motion.div
                style={{ width: stage1Line }}
                className="h-full bg-gradient-to-r from-[#e3ff6b] via-white to-transparent absolute left-0 top-0"
              />
            </div>

            {/* Sub-Roles (Desktop) */}
            <div className="hidden md:flex mb-2 flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-semibold text-[#e3ff6b] uppercase tracking-wider drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                BACK END DEVELOPER (DEC 2024 – PRESENT)
              </span>
              <span className="text-white/40 text-xs">•</span>
              <span className="text-[11px] font-mono text-white/75 uppercase tracking-wider drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                TRAINEE (SEP 2024 – DEC 2024)
              </span>
            </div>

            {/* Detailed Bullet Points (Desktop) */}
            <div className="hidden md:block space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Engineered resilient server-side architectures, RESTful APIs, and database models powering university-wide technical platforms.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Promoted from Trainee to Back End Developer; led backend API development, authentication pipelines, and query optimizations.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Collaborated across design and mobile teams to build robust microservices with high reliability and low-latency endpoints.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 2: SHARNEX (Frames 58 - 115) -> LEFT SIDE ON DESKTOP                */}
        {/* ========================================================================= */}
        <div className="absolute bottom-6 xs:bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-auto md:left-8 lg:left-14 xl:left-20 w-[calc(100%-28px)] max-w-[350px] xs:max-w-[390px] sm:max-w-[440px] md:max-w-md lg:max-w-lg xl:max-w-xl z-30 pointer-events-none text-left">
          <motion.div
            style={{
              opacity: stage2Opacity,
              x: isDesktop ? stage2X : 0,
              y: !isDesktop ? stage2Y : 0,
            }}
            className="relative"
          >
            {/* Company Logo, Company Name & Duration */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2 md:mb-2.5">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg overflow-hidden bg-black/85 border border-[#e3ff6b]/40 shadow-[0_0_12px_rgba(227,255,107,0.15)] flex items-center justify-center p-1 shrink-0">
                <Image
                  src="/projects/sharnex.jpg"
                  alt="Sharnex"
                  fill
                  className="object-contain p-0.5 rounded-md"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <span className="font-bank text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-[#e3ff6b] block truncate drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  SHARNEX
                </span>
                <span className="text-white/70 text-[9.5px] sm:text-[11px] font-mono tracking-wider uppercase block truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  MAR 2026
                </span>
              </div>
            </div>

            {/* Position / Role with Responsive TextLoop in font-bank White and Yellow */}
            <div className="w-full overflow-hidden min-h-[28px] sm:min-h-[34px] md:min-h-[44px] flex items-center my-0.5 sm:my-1">
              <TextLoop
                interval={2.4}
                className="font-bank text-base sm:text-xl md:text-2xl lg:text-[28px] xl:text-[32px] font-bold uppercase tracking-[0.06em] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] leading-tight break-words"
              >
                <span>FULL STACK ENGINEER</span>
                <span className="text-[#e3ff6b]">PRODUCT ENGINEERING</span>
                <span>MERN & NEXT.JS</span>
              </TextLoop>
            </div>

            {/* Glowing Yellow/White Divider Line (Desktop) */}
            <div className="hidden md:block h-[1.5px] bg-white/15 w-full my-3 relative overflow-hidden rounded-full">
              <motion.div
                style={{ width: stage2Line }}
                className="h-full bg-gradient-to-r from-[#e3ff6b] via-white to-transparent absolute left-0 top-0"
              />
            </div>

            {/* Sub-Roles / Domain (Desktop) */}
            <div className="hidden md:block mb-2 text-[11px] font-mono font-semibold text-[#e3ff6b] uppercase tracking-wider drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              PRODUCT ENGINEERING // NOIDA, UP
            </div>

            {/* Detailed Bullet Points (Desktop) */}
            <div className="hidden md:block space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Engineered responsive full-stack features and high-conversion web application interfaces utilizing MERN Stack and Next.js.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Developed modular UI component libraries, optimized client-side state handling, and integrated robust REST APIs.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Collaborated with product teams to ship performant, accessible digital interfaces tailored for rapid business scaling.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 3: ORIGINHASH (Frames 116 - 174) -> LEFT SIDE ON DESKTOP            */}
        {/* ========================================================================= */}
        <div className="absolute bottom-6 xs:bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-auto md:left-8 lg:left-14 xl:left-20 w-[calc(100%-28px)] max-w-[350px] xs:max-w-[390px] sm:max-w-[440px] md:max-w-md lg:max-w-lg xl:max-w-xl z-30 pointer-events-none text-left">
          <motion.div
            style={{
              opacity: stage3Opacity,
              x: isDesktop ? stage3X : 0,
              y: !isDesktop ? stage3Y : 0,
            }}
            className="relative"
          >
            {/* Company Logo, Company Name & Duration */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2 md:mb-2.5">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg overflow-hidden bg-black/85 border border-[#e3ff6b]/40 shadow-[0_0_12px_rgba(227,255,107,0.15)] flex items-center justify-center p-1 shrink-0">
                <Image
                  src="/projects/originhash.png"
                  alt="OriginHash"
                  fill
                  className="object-contain p-0.5 rounded-md"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <span className="font-bank text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-[#e3ff6b] block truncate drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  ORIGINHASH
                </span>
                <span className="text-white/70 text-[9.5px] sm:text-[11px] font-mono tracking-wider uppercase block truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  AUG 2025 – NOV 2025
                </span>
              </div>
            </div>

            {/* Position / Role with Responsive TextLoop in font-bank White and Yellow */}
            <div className="w-full overflow-hidden min-h-[28px] sm:min-h-[34px] md:min-h-[44px] flex items-center my-0.5 sm:my-1">
              <TextLoop
                interval={2.4}
                className="font-bank text-base sm:text-xl md:text-2xl lg:text-[28px] xl:text-[32px] font-bold uppercase tracking-[0.06em] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] leading-tight break-words"
              >
                <span>FULL STACK DEVELOPER</span>
                <span className="text-[#e3ff6b]">BLOCKCHAIN PLATFORM</span>
                <span>WEB3 & SMART CONTRACTS</span>
              </TextLoop>
            </div>

            {/* Glowing Yellow/White Divider Line (Desktop) */}
            <div className="hidden md:block h-[1.5px] bg-white/15 w-full my-3 relative overflow-hidden rounded-full">
              <motion.div
                style={{ width: stage3Line }}
                className="h-full bg-gradient-to-r from-[#e3ff6b] via-white to-transparent absolute left-0 top-0"
              />
            </div>

            {/* Subtitle (Desktop) */}
            <div className="hidden md:block mb-2 text-[11px] font-mono text-[#e3ff6b] font-semibold uppercase tracking-wider drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              HYDERABAD // FULL STACK & BLOCKCHAIN PLATFORM
            </div>

            {/* Detailed Bullet Points (Desktop) */}
            <div className="hidden md:block space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Built Node.js backends with scalable, secure APIs and React applications improving UX by 30% and query performance by 15%, while designing UI/branding using Figma and Adobe Illustrator.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Enhanced product traceability by 60% through blockchain-based smart contracts, MetaMask wallet integration, IPFS, and Ethers.js.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 4: WEB3TASK (Frames 175 - 234) -> RIGHT SIDE ON DESKTOP             */}
        {/* ========================================================================= */}
        <div className="absolute bottom-6 xs:bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-auto md:right-8 lg:right-14 xl:right-20 w-[calc(100%-28px)] max-w-[350px] xs:max-w-[390px] sm:max-w-[440px] md:max-w-md lg:max-w-lg xl:max-w-xl z-30 pointer-events-none text-left">
          <motion.div
            style={{
              opacity: stage4Opacity,
              x: isDesktop ? stage4X : 0,
              y: !isDesktop ? stage4Y : 0,
            }}
            className="relative"
          >
            {/* Company Logo, Company Name & Duration */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2 md:mb-2.5">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg overflow-hidden bg-black/85 border border-[#e3ff6b]/40 shadow-[0_0_12px_rgba(227,255,107,0.15)] flex items-center justify-center p-1 shrink-0">
                <Image
                  src="/projects/web3task_logo.png"
                  alt="Web3Task"
                  fill
                  className="object-contain p-0.5 rounded-md"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <span className="font-bank text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-[#e3ff6b] block truncate drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  WEB3TASK
                </span>
                <span className="text-white/70 text-[9.5px] sm:text-[11px] font-mono tracking-wider uppercase block truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  MAR 2026 – PRESENT
                </span>
              </div>
            </div>

            {/* Position / Role with Responsive TextLoop in font-bank White and Yellow */}
            <div className="w-full overflow-hidden min-h-[28px] sm:min-h-[34px] md:min-h-[44px] flex items-center my-0.5 sm:my-1">
              <TextLoop
                interval={2.4}
                className="font-bank text-base sm:text-xl md:text-2xl lg:text-[28px] xl:text-[32px] font-bold uppercase tracking-[0.06em] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] leading-tight break-words"
              >
                <span>SOFTWARE ENGINEER</span>
                <span className="text-[#e3ff6b]">VOICETONOTES</span>
                <span>TRAVERSE VPN</span>
              </TextLoop>
            </div>

            {/* Glowing Yellow/White Divider Line (Desktop) */}
            <div className="hidden md:block h-[1.5px] bg-white/15 w-full my-3 relative overflow-hidden rounded-full">
              <motion.div
                style={{ width: stage4Line }}
                className="h-full bg-gradient-to-r from-[#e3ff6b] via-white to-transparent absolute left-0 top-0"
              />
            </div>

            {/* Subtitle / Projects (Desktop) */}
            <div className="hidden md:block mb-2 text-[11px] font-mono text-[#e3ff6b] font-semibold uppercase tracking-wider drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              TRAVERSE VPN · VOICETONOTES · DEEPURLS
            </div>

            {/* Detailed Bullet Points (Desktop) */}
            <div className="hidden md:block space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Optimized Traverse VPN landing pages to achieve 99% Lighthouse performance and improved load speed.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Implemented i18n localization using Tolgee, enabling multi-language support and improving user reach.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Developed and scaled DeepURLs using dashboard & Firebase Functions supporting 29K+ daily users with Caddy-based custom domain routing.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Enhanced Voice to Notes AI Android app using Kotlin, optimizing voice-to-text workflows and increasing premium users by 36%.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#e3ff6b] text-sm shrink-0 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">✦</span>
                <p className="text-white/90 text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Integrated DeepURLs SDK to enable precise deep linking for in-app navigation and notification-based redirection.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

