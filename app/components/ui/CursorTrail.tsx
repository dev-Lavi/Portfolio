"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorTrail() {
  const [isVisible, setIsVisible] = useState(false);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Fast, low-mass spring for the glowing aura so it smoothly tracks the cursor without lag
  const glowSpringConfig = { damping: 32, stiffness: 1400, mass: 0.06 };
  const glowX = useSpring(dotX, glowSpringConfig);
  const glowY = useSpring(dotY, glowSpringConfig);

  useEffect(() => {
    // Only activate on desktop devices with fine pointer
    const checkDevice = () => {
      if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    const moveCursor = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("resize", checkDevice);
    };
  }, [dotX, dotY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Ambient glowing aura that fluidly follows the cursor */}
      <motion.div
        data-cursor-glow
        aria-hidden="true"
        className="hidden md:block fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[99999] mix-blend-screen -translate-x-1/2 -translate-y-1/2"
        style={{
          x: glowX,
          y: glowY,
          backgroundColor: "#e3ff6b",
          filter: "blur(12px)",
          opacity: 0.65,
        }}
      />
      {/* Precision center dot - exactly matches the speed of the cursor (zero latency) */}
      <motion.div
        data-cursor-dot
        aria-hidden="true"
        className="hidden md:block fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[99999] shadow-[0_0_8px_rgba(255,255,255,1)] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: dotX,
          y: dotY,
        }}
      />
    </>
  );
}
