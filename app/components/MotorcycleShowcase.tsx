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

  // Stage 1 (Team Conatus): Frame 1 to 57 -> RIGHT SIDE (Green Box)
  const stage1Opacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.19, 0.2435],
    [0, 1, 1, 0]
  );
  const stage1Line = useTransform(scrollYProgress, [0.03, 0.14], ["0%", "100%"]);

  // Stage 2 (Sharnex): Frame 58 to 115 -> LEFT SIDE (Red Box)
  const stage2Opacity = useTransform(
    scrollYProgress,
    [0.2435, 0.28, 0.44, 0.4915],
    [0, 1, 1, 0]
  );
  const stage2Line = useTransform(scrollYProgress, [0.28, 0.38], ["0%", "100%"]);

  // Stage 3 (OriginHash): Frame 116 to 174 -> LEFT SIDE (Green Box)
  const stage3Opacity = useTransform(
    scrollYProgress,
    [0.4915, 0.53, 0.69, 0.7435],
    [0, 1, 1, 0]
  );
  const stage3Line = useTransform(scrollYProgress, [0.53, 0.63], ["0%", "100%"]);

  // Stage 4 (Web3Task): Frame 175 to 234 -> RIGHT SIDE (Red Box)
  const stage4Opacity = useTransform(
    scrollYProgress,
    [0.7435, 0.78, 0.98, 1],
    [0, 1, 1, 1]
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
          <h2 className="font-bank text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-[0.08em] text-white/90 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] hidden sm:block">
            FROM FOUNDATION <span className="text-[#e3ff6b]">TO SCALE.</span>
          </h2>
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
        {/* STAGE 1: TEAM CONATUS (Frames 1 - 57) -> RIGHT SIDE (GREEN GRADIENT BOX)  */}
        {/* ========================================================================= */}
        <motion.div
          style={{ opacity: stage1Opacity }}
          className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 md:right-12 lg:right-20 left-3 sm:left-auto w-[94vw] sm:w-auto sm:max-w-lg md:max-w-xl z-30 pointer-events-none text-left"
        >
          <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 lg:p-8 bg-[#060c06]/85 backdrop-blur-xl border border-[#4ade80]/25 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(74,222,128,0.12)] overflow-hidden">
            {/* Green Radiant Downlight Effect */}
            <div
              className="pointer-events-none absolute -bottom-10 inset-x-0 h-3/4 blur-xl opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse 95% 75% at 50% 100%, rgba(74, 222, 128, 0.35) 0%, rgba(34, 197, 94, 0.12) 45%, transparent 75%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "linear-gradient(to top, rgba(74, 222, 128, 0.12) 0%, transparent 65%)",
              }}
            />

            <div className="relative z-10">
              {/* Logo & Category */}
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl overflow-hidden bg-black/70 border border-[#4ade80]/30 flex items-center justify-center p-1 shadow-[0_4px_20px_rgba(0,0,0,0.8)] shrink-0">
                  <Image
                    src="/projects/Team%20conatus.jpg"
                    alt="Team Conatus"
                    fill
                    className="object-contain p-0.5 rounded-lg"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[#e3ff6b] text-[9.5px] sm:text-xs font-mono tracking-wider sm:tracking-[0.2em] uppercase block truncate">
                    TEAM CONATUS — TECHNICAL SOCIETY
                  </span>
                  <span className="text-gray-400 text-[9px] sm:text-xs font-mono tracking-widest uppercase block truncate">
                    SEP 2024 – PRESENT · 2 YRS 1 MO · AKGEC
                  </span>
                </div>
              </div>

              {/* Main Title / Role with Responsive TextLoop */}
              <div className="mb-2 sm:mb-3 w-full overflow-hidden">
                <TextLoop
                  interval={2.4}
                  className="font-bank text-lg sm:text-2xl md:text-3xl lg:text-[32px] xl:text-[36px] font-bold text-white uppercase tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] leading-[1.15] break-words"
                >
                  <span>TEAM CONATUS</span>
                  <span className="text-[#e3ff6b]">BACK END DEVELOPER</span>
                  <span>TECHNICAL SOCIETY</span>
                </TextLoop>
              </div>

              {/* Glowing Underline Bar */}
              <div className="h-[1px] bg-white/15 w-full mb-2.5 sm:mb-3.5 relative overflow-hidden">
                <motion.div
                  style={{ width: stage1Line }}
                  className="h-full bg-gradient-to-r from-[#e3ff6b] to-[#4ade80] absolute left-0 top-0"
                />
              </div>

              {/* Sub-Roles */}
              <div className="mb-2.5 sm:mb-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-mono font-semibold text-[#e3ff6b] uppercase tracking-wider">
                  BACK END DEVELOPER (DEC 2024 – PRESENT)
                </span>
                <span className="text-gray-500 text-xs">•</span>
                <span className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase tracking-wider">
                  TRAINEE (SEP 2024 – DEC 2024)
                </span>
              </div>

              {/* Bullet Points */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-[#e3ff6b] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans">
                    Engineered resilient server-side architectures, RESTful APIs, and database models powering university-wide technical platforms.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#e3ff6b] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans">
                    Promoted from Trainee to Back End Developer; led backend API development, authentication pipelines, and query optimizations.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#e3ff6b] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans">
                    Collaborated across design and mobile teams to build robust microservices with high reliability and low-latency endpoints.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* STAGE 2: SHARNEX (Frames 58 - 115) -> LEFT SIDE (RED GRADIENT BOX)        */}
        {/* ========================================================================= */}
        <motion.div
          style={{ opacity: stage2Opacity }}
          className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 md:left-12 lg:left-20 right-3 sm:right-auto w-[94vw] sm:w-auto sm:max-w-lg md:max-w-xl z-30 pointer-events-none text-left"
        >
          <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 lg:p-8 bg-[#0d0406]/85 backdrop-blur-xl border border-[#ff0d4a]/25 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(255,13,74,0.12)] overflow-hidden">
            {/* Red Radiant Downlight Effect */}
            <div
              className="pointer-events-none absolute -bottom-10 inset-x-0 h-3/4 blur-xl opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse 95% 75% at 50% 100%, rgba(255, 13, 74, 0.35) 0%, rgba(220, 15, 60, 0.12) 45%, transparent 75%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "linear-gradient(to top, rgba(255, 13, 74, 0.12) 0%, transparent 65%)",
              }}
            />

            <div className="relative z-10">
              {/* Logo & Category */}
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl overflow-hidden bg-black/70 border border-[#ff0d4a]/30 flex items-center justify-center p-1 shadow-[0_4px_20px_rgba(0,0,0,0.8)] shrink-0">
                  <Image
                    src="/projects/sharnex.jpg"
                    alt="Sharnex"
                    fill
                    className="object-contain p-0.5 rounded-lg"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[#ff4d6d] text-[9.5px] sm:text-xs font-mono tracking-wider sm:tracking-[0.2em] uppercase block truncate">
                    SHARNEX — INTERNSHIP
                  </span>
                  <span className="text-gray-400 text-[9px] sm:text-xs font-mono tracking-widest uppercase block truncate">
                    MAR 2026 · NOIDA, UP (REMOTE)
                  </span>
                </div>
              </div>

              {/* Main Title / Role with Responsive TextLoop */}
              <div className="mb-2 sm:mb-3 w-full overflow-hidden">
                <TextLoop
                  interval={2.4}
                  className="font-bank text-lg sm:text-2xl md:text-3xl lg:text-[32px] xl:text-[36px] font-bold text-white uppercase tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] leading-[1.15] break-words"
                >
                  <span>SHARNEX</span>
                  <span className="text-[#ff4d6d]">FULL STACK ENGINEER</span>
                  <span>PRODUCT ENGINEERING</span>
                </TextLoop>
              </div>

              {/* Glowing Underline Bar */}
              <div className="h-[1px] bg-white/15 w-full mb-2.5 sm:mb-3.5 relative overflow-hidden">
                <motion.div
                  style={{ width: stage2Line }}
                  className="h-full bg-gradient-to-r from-[#ff0d4a] to-[#f87171] absolute left-0 top-0"
                />
              </div>

              {/* Sub-Roles / Domain */}
              <div className="mb-2.5 sm:mb-3 text-[10px] sm:text-xs font-mono font-semibold text-[#ff4d6d] uppercase tracking-wider">
                PRODUCT ENGINEERING // NOIDA, UP
              </div>

              {/* Bullet Points */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-[#ff4d6d] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans">
                    Engineered responsive full-stack features and high-conversion web application interfaces utilizing MERN Stack and Next.js.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#ff4d6d] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans">
                    Developed modular UI component libraries, optimized client-side state handling, and integrated robust REST APIs.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#ff4d6d] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans">
                    Collaborated with product teams to ship performant, accessible digital interfaces tailored for rapid business scaling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* STAGE 3: ORIGINHASH (Frames 116 - 174) -> LEFT SIDE (GREEN GRADIENT BOX)  */}
        {/* ========================================================================= */}
        <motion.div
          style={{ opacity: stage3Opacity }}
          className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 md:left-12 lg:left-20 right-3 sm:right-auto w-[94vw] sm:w-auto sm:max-w-lg md:max-w-xl z-30 pointer-events-none text-left"
        >
          <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 lg:p-8 bg-[#060c06]/85 backdrop-blur-xl border border-[#4ade80]/25 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(74,222,128,0.12)] overflow-hidden">
            {/* Green Radiant Downlight Effect */}
            <div
              className="pointer-events-none absolute -bottom-10 inset-x-0 h-3/4 blur-xl opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse 95% 75% at 50% 100%, rgba(74, 222, 128, 0.35) 0%, rgba(34, 197, 94, 0.12) 45%, transparent 75%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "linear-gradient(to top, rgba(74, 222, 128, 0.12) 0%, transparent 65%)",
              }}
            />

            <div className="relative z-10">
              {/* Logo & Category */}
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl overflow-hidden bg-black/70 border border-[#4ade80]/30 flex items-center justify-center p-1 shadow-[0_4px_20px_rgba(0,0,0,0.8)] shrink-0">
                  <Image
                    src="/projects/originhash.png"
                    alt="OriginHash"
                    fill
                    className="object-contain p-0.5 rounded-lg"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[#4ade80] text-[9.5px] sm:text-xs font-mono tracking-wider sm:tracking-[0.2em] uppercase block truncate">
                    ORIGINHASH — FULL STACK DEVELOPER
                  </span>
                  <span className="text-gray-400 text-[9px] sm:text-xs font-mono tracking-widest uppercase block truncate">
                    AUG 2025 – NOV 2025 · HYDERABAD (REMOTE)
                  </span>
                </div>
              </div>

              {/* Main Title / Role with Responsive TextLoop */}
              <div className="mb-2 sm:mb-3 w-full overflow-hidden">
                <TextLoop
                  interval={2.4}
                  className="font-bank text-lg sm:text-2xl md:text-3xl lg:text-[32px] xl:text-[36px] font-bold text-white uppercase tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] leading-[1.15] break-words"
                >
                  <span>ORIGINHASH</span>
                  <span className="text-[#4ade80]">FULL STACK DEVELOPER</span>
                  <span>BLOCKCHAIN PLATFORM</span>
                </TextLoop>
              </div>

              {/* Glowing Underline Bar */}
              <div className="h-[1px] bg-white/15 w-full mb-2.5 sm:mb-3.5 relative overflow-hidden">
                <motion.div
                  style={{ width: stage3Line }}
                  className="h-full bg-gradient-to-r from-[#4ade80] to-[#e3ff6b] absolute left-0 top-0"
                />
              </div>

              {/* Subtitle */}
              <div className="mb-2.5 sm:mb-3 text-[10px] sm:text-xs font-mono text-[#4ade80] font-semibold uppercase tracking-wider">
                FULL STACK & BLOCKCHAIN PLATFORM
              </div>

              {/* Bullet Points */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-[#4ade80] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans">
                    Built Node.js backends with scalable, secure APIs and React applications improving UX by 30% and query performance by 15%, while designing UI/branding using Figma and Adobe Illustrator.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#4ade80] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[14px] leading-relaxed font-sans">
                    Enhanced product traceability by 60% through blockchain-based smart contracts, MetaMask wallet integration, IPFS, and Ethers.js.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* STAGE 4: WEB3TASK (Frames 175 - 234) -> RIGHT SIDE (RED/AMBER BOX)        */}
        {/* ========================================================================= */}
        <motion.div
          style={{ opacity: stage4Opacity }}
          className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 md:right-12 lg:right-20 left-3 sm:left-auto w-[94vw] sm:w-auto sm:max-w-lg md:max-w-xl z-30 pointer-events-none text-left"
        >
          <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 lg:p-8 bg-[#0d0406]/85 backdrop-blur-xl border border-[#ff0d4a]/25 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(255,13,74,0.12)] overflow-hidden">
            {/* Red & Amber Radiant Downlight Effect */}
            <div
              className="pointer-events-none absolute -bottom-10 inset-x-0 h-3/4 blur-xl opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse 95% 75% at 50% 100%, rgba(255, 13, 74, 0.35) 0%, rgba(255, 176, 32, 0.15) 45%, transparent 75%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "linear-gradient(to top, rgba(255, 13, 74, 0.12) 0%, transparent 65%)",
              }}
            />

            <div className="relative z-10">
              {/* Logo & Category */}
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl overflow-hidden bg-black/70 border border-[#ff0d4a]/30 flex items-center justify-center p-1 shadow-[0_4px_20px_rgba(0,0,0,0.8)] shrink-0">
                  <Image
                    src="/projects/web3task_logo.png"
                    alt="Web3Task"
                    fill
                    className="object-contain p-0.5 rounded-lg"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[#FFB020] text-[9.5px] sm:text-xs font-mono tracking-wider sm:tracking-[0.2em] uppercase block truncate">
                    WEB3TASK — SOFTWARE ENGINEER
                  </span>
                  <span className="text-gray-400 text-[9px] sm:text-xs font-mono tracking-widest uppercase block truncate">
                    MAR 2026 – PRESENT · GLOBAL REMOTE
                  </span>
                </div>
              </div>

              {/* Main Title / Role with Responsive TextLoop */}
              <div className="mb-2 sm:mb-3 w-full overflow-hidden">
                <TextLoop
                  interval={2.4}
                  className="font-bank text-lg sm:text-2xl md:text-3xl lg:text-[32px] xl:text-[36px] font-bold text-white uppercase tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] leading-[1.15] break-words"
                >
                  <span>WEB3TASK</span>
                  <span className="text-[#FFB020]">SOFTWARE ENGINEER</span>
                  <span>DEEPURLS & MOBILE</span>
                </TextLoop>
              </div>

              {/* Glowing Underline Bar */}
              <div className="h-[1px] bg-white/15 w-full mb-2.5 sm:mb-3.5 relative overflow-hidden">
                <motion.div
                  style={{ width: stage4Line }}
                  className="h-full bg-gradient-to-r from-[#ff0d4a] to-[#FFB020] absolute left-0 top-0"
                />
              </div>

              {/* Subtitle / Projects */}
              <div className="mb-2.5 sm:mb-3 text-[10px] sm:text-xs font-mono text-[#FFB020] font-semibold uppercase tracking-wider">
                TRAVERSE VPN · DEEPURLS · VOICE TO NOTES
              </div>

              {/* Bullet Points */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-[#FFB020] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed font-sans">
                    Optimized Traverse VPN landing pages to achieve 99% Lighthouse performance and improved load speed.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#FFB020] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed font-sans">
                    Implemented i18n localization using Tolgee, enabling multi-language support and improving user reach.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#FFB020] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed font-sans">
                    Developed and scaled DeepURLs using dashboard & Firebase Functions supporting 29K+ daily users with Caddy-based custom domain routing.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#FFB020] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed font-sans">
                    Enhanced Voice to Notes AI Android app using Kotlin, optimizing voice-to-text workflows and increasing premium users by 36%.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#FFB020] text-xs sm:text-sm shrink-0 mt-0.5">✦</span>
                  <p className="text-gray-200 text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed font-sans">
                    Integrated DeepURLs SDK to enable precise deep linking for in-app navigation and notification-based redirection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

