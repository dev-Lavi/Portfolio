"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 192;
const FRAME_PREFIX = "/frames_bike/ezgif-frame-";
const FRAME_SUFFIX = ".jpg";

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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const drawToCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
                  centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  };

  const drawFrame = (index: number) => {
    if (!canvasRef.current || !imagesRef.current[index]) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
       requestAnimationFrame(() => {
          if (canvasRef.current && imagesRef.current[index]) {
             drawToCanvas(ctx, canvasRef.current, imagesRef.current[index]!);
          }
       });
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const frame = Math.min(TOTAL_FRAMES, Math.max(1, Math.floor(latest * TOTAL_FRAMES)));
    if (frame !== currentFrameRef.current) {
      currentFrameRef.current = frame;
      drawFrame(frame);
    }
  });

  useEffect(() => {
    let isMounted = true;
    
    const loadImages = async () => {
      // Load first 20 eagerly
      for (let i = 1; i <= 20; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; 
        });
        imagesRef.current[i] = img;
      }
      
      if (isMounted) {
        setLoaded(true);
        // Initial setup on canvas
        const handleResize = () => {
          if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            drawFrame(currentFrameRef.current);
          }
        };
        handleResize(); // Size properly
        window.addEventListener("resize", handleResize);
        
        // Lazy load the rest
        for (let i = 21; i <= TOTAL_FRAMES; i++) {
          const img = new Image();
          img.src = getFramePath(i);
          img.onload = () => {
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
           className="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay"
           style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"}}
        ></div>

        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 z-10" style={{
            background: "radial-gradient(circle, transparent 40%, #000000 130%)"
        }}></div>
        <div className="pointer-events-none absolute inset-0 z-10" style={{
            background: "linear-gradient(to bottom, #000000 0%, transparent 15%, transparent 85%, #000000 100%)"
        }}></div>
        
        {/* Loading State */}
        {!loaded && (
           <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0A0C0A]">
              <div className="text-[#FFB020] text-sm uppercase tracking-widest font-mono animate-pulse">
                Loading Sequence...
              </div>
           </div>
        )}

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" />

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
            <motion.div style={{ opacity: beat1Opacity }} className="absolute top-32 left-8 md:left-24 max-w-md">
                <span className="text-[#E8FFE0] text-xs font-mono tracking-[0.2em] uppercase mb-4 block">SCENE 01</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white/90 tracking-tight mb-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  Motion, generated.
                </h2>
                <div className="h-[1px] bg-white/20 w-full mb-4 relative overflow-hidden">
                    <motion.div style={{ width: beat1Line }} className="h-full bg-gradient-to-r from-[#FF3B1F] to-[#FFB020] absolute left-0 top-0" />
                </div>
                <p className="text-white/60 text-lg">
                  An AI-directed chase sequence, frame by frame.
                </p>
            </motion.div>

            {/* Beat 2: Bottom Left */}
            <motion.div style={{ opacity: beat2Opacity }} className="absolute bottom-32 left-8 md:left-24 max-w-md">
                <h2 className="text-3xl md:text-5xl font-bold text-white/90 tracking-tight mb-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  Every frame, directed.
                </h2>
                <div className="h-[1px] bg-white/20 w-full mb-4 relative overflow-hidden">
                    <motion.div style={{ width: beat2Line }} className="h-full bg-gradient-to-r from-[#FF3B1F] to-[#FFB020] absolute left-0 top-0" />
                </div>
                <p className="text-white/60 text-lg">
                  Camera path, lean angle, light streaks — all specified, none left to chance.
                </p>
            </motion.div>

            {/* Beat 3: Center Right */}
            <motion.div style={{ opacity: beat3Opacity }} className="absolute top-1/2 -translate-y-1/2 right-8 md:right-32 max-w-md text-right">
                <h2 className="text-3xl md:text-5xl font-bold text-white/90 tracking-tight mb-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  Cinematic control, without a camera.
                </h2>
                <div className="h-[1px] bg-white/20 w-full mb-4 relative overflow-hidden flex justify-end">
                    <motion.div style={{ width: beat3Line }} className="h-full bg-gradient-to-l from-[#FF3B1F] to-[#FFB020] absolute right-0 top-0" />
                </div>
                <p className="text-white/60 text-lg">
                  Prompted like a shot list. Rendered like a car commercial.
                </p>
            </motion.div>

            {/* Beat 4: Center Resolve */}
            <motion.div style={{ opacity: beat4Opacity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto">
                <h2 className="text-4xl md:text-6xl font-bold text-white/90 tracking-tight mb-6 uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] whitespace-nowrap">
                  Full case study &rarr;
                </h2>
                <button className="text-[#E8FFE0] hover:text-white transition-colors duration-300 text-sm font-mono tracking-widest uppercase border border-white/20 hover:border-white/50 px-6 py-3 rounded-full bg-black/50 backdrop-blur-sm cursor-pointer">
                  See the prompt breakdown
                </button>
            </motion.div>

        </div>
      </div>
    </div>
  );
}
