"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";

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
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const [loaded, setLoaded] = useState(false);
  const currentFrameRef = useRef(1);
  const rafIdRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll physics to remove micro-stuttering during frame scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  const drawToCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
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
    ctx.drawImage(img, 0, 0, img.width, img.height,
                  centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    ctx.restore();
  };

  const drawFrame = (index: number) => {
    if (!canvasRef.current || !imagesRef.current[index]) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
       if (rafIdRef.current !== null) {
         cancelAnimationFrame(rafIdRef.current);
       }
       rafIdRef.current = requestAnimationFrame(() => {
          if (canvasRef.current && imagesRef.current[index]) {
             drawToCanvas(ctx, canvasRef.current, imagesRef.current[index]!);
          }
       });
    }
  };

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const frame = Math.min(TOTAL_FRAMES, Math.max(1, Math.floor(latest * TOTAL_FRAMES)));
    if (frame !== currentFrameRef.current) {
      currentFrameRef.current = frame;
      drawFrame(frame);
    }
  });

  useEffect(() => {
    let isMounted = true;
    
    const loadImages = async () => {
      // Eagerly load and decode the first 30 frames for fast initial paint
      for (let i = 1; i <= 30; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        try {
          await img.decode();
        } catch {
          // Fallback if decoding promise fails in browser
        }
        imagesRef.current[i] = img;
      }
      
      if (isMounted) {
        setLoaded(true);
        // Canvas sizing with Device Pixel Ratio (Retina/High-DPI support)
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
        
        // Lazy load and decode remaining WebP frames asynchronously
        for (let i = 31; i <= TOTAL_FRAMES; i++) {
          const img = new Image();
          img.src = getFramePath(i);
          img.onload = async () => {
            try {
              await img.decode();
            } catch {}
            if (isMounted) {
              imagesRef.current[i] = img;
            }
          };
        }

        return () => window.removeEventListener("resize", handleResize);
      }
    };
    
    const cleanup = loadImages();
    return () => { 
      isMounted = false; 
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, []);

  // Story beats fade opacities
  const beat1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.2], [0, 1, 1, 0]);
  const beat2Opacity = useTransform(scrollYProgress, [0.25, 0.3, 0.5, 0.55], [0, 1, 1, 0]);
  const beat3Opacity = useTransform(scrollYProgress, [0.6, 0.65, 0.8, 0.85], [0, 1, 1, 0]);
  const beat4Opacity = useTransform(scrollYProgress, [0.85, 0.9, 1, 1], [0, 1, 1, 1]); 
  
  // Underline glows
  const beat1Line = useTransform(scrollYProgress, [0.05, 0.15], ["0%", "100%"]);
  const beat2Line = useTransform(scrollYProgress, [0.3, 0.5], ["0%", "100%"]);
  const beat3Line = useTransform(scrollYProgress, [0.65, 0.8], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-[#0A0C0A]">
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Grain overlay */}
        <div 
           className="pointer-events-none absolute inset-0 z-10 opacity-15 mix-blend-overlay"
           style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"}}
        ></div>

        {/* Cinematic Vignette & Lighting Gradient Overlays */}
        <div className="pointer-events-none absolute inset-0 z-10" style={{
            background: "radial-gradient(circle, transparent 35%, #000000 120%)"
        }}></div>
        <div className="pointer-events-none absolute inset-0 z-10" style={{
            background: "linear-gradient(to bottom, #0A0C0A 0%, transparent 18%, transparent 82%, #0A0C0A 100%)"
        }}></div>
        
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

        {/* Scroll Progress Indicator */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-[2px] h-32 bg-white/10 z-30 rounded-full overflow-hidden hidden md:block">
           <motion.div 
             className="w-full bg-gradient-to-b from-[#FFB020] to-white origin-top"
             style={{ 
                height: "100%",
                scaleY: scrollYProgress 
             }}
           />
        </div>

        {/* Text Layer */}
        <div className="absolute inset-0 z-30 font-sans pointer-events-none p-6 md:p-16 lg:p-24 flex flex-col justify-center">
            
            {/* Beat 1: Top Left */}
            <motion.div style={{ opacity: beat1Opacity }} className="absolute top-32 left-8 md:left-24 max-w-xl">
                <span className="text-[#E8FFE0] text-xs font-mono tracking-[0.2em] uppercase mb-4 block">WEB3TASK — SOFTWARE ENGINEER INTERN</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white/90 tracking-tight mb-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  Traverse VPN & Voice to Notes
                </h2>
                <div className="h-[1px] bg-white/20 w-full mb-4 relative overflow-hidden">
                    <motion.div style={{ width: beat1Line }} className="h-full bg-gradient-to-r from-[#FF3B1F] to-[#FFB020] absolute left-0 top-0" />
                </div>
                <p className="text-white/60 text-lg">
                  Optimized landing pages to 99% Lighthouse performance and increased AI app premium users by 36%.
                </p>
            </motion.div>

            {/* Beat 2: Bottom Left */}
            <motion.div style={{ opacity: beat2Opacity }} className="absolute bottom-32 left-8 md:left-24 max-w-xl">
                <span className="text-[#E8FFE0] text-xs font-mono tracking-[0.2em] uppercase mb-4 block">WEB3TASK — SOFTWARE ENGINEER INTERN</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white/90 tracking-tight mb-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  DeepURLs Infrastructure
                </h2>
                <div className="h-[1px] bg-white/20 w-full mb-4 relative overflow-hidden">
                    <motion.div style={{ width: beat2Line }} className="h-full bg-gradient-to-r from-[#FF3B1F] to-[#FFB020] absolute left-0 top-0" />
                </div>
                <p className="text-white/60 text-lg">
                  Scaled backend for 29K+ daily users with custom domain routing and precise deep linking SDK.
                </p>
            </motion.div>

            {/* Beat 3: Center Right */}
            <motion.div style={{ opacity: beat3Opacity }} className="absolute top-1/2 -translate-y-1/2 right-8 md:right-32 max-w-xl text-right">
                <span className="text-[#E8FFE0] text-xs font-mono tracking-[0.2em] uppercase mb-4 block">ORIGINHASH — FULL STACK DEVELOPER</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white/90 tracking-tight mb-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  Scalable Backends
                </h2>
                <div className="h-[1px] bg-white/20 w-full mb-4 relative overflow-hidden flex justify-end">
                    <motion.div style={{ width: beat3Line }} className="h-full bg-gradient-to-l from-[#FF3B1F] to-[#FFB020] absolute right-0 top-0" />
                </div>
                <p className="text-white/60 text-lg">
                  Built Node.js APIs and React applications, improving UX by 30% and query performance by 15%.
                </p>
            </motion.div>

            {/* Beat 4: Center Resolve */}
            <motion.div style={{ opacity: beat4Opacity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto max-w-2xl">
                <span className="text-[#E8FFE0] text-xs font-mono tracking-[0.2em] uppercase mb-4 block">ORIGINHASH — FULL STACK DEVELOPER</span>
                <h2 className="text-4xl md:text-6xl font-bold text-white/90 tracking-tight mb-6 uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] whitespace-nowrap">
                  Blockchain Integration
                </h2>
                <p className="text-white/60 text-lg mb-8">
                  Enhanced product traceability by 60% through Ethereum smart contracts, IPFS, and MetaMask.
                </p>
            </motion.div>

        </div>
      </div>
    </div>
  );
}

