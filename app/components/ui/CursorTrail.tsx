"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorTrail() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 650, mass: 0.4 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only activate on desktop pointer devices
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
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("resize", checkDevice);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Ambient glowing cursor aura */}
      <motion.div
        data-cursor-glow
        aria-hidden="true"
        className="hidden md:block fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[99999] mix-blend-screen"
        style={{
          x: springX,
          y: springY,
          backgroundColor: "#e3ff6b",
          filter: "blur(14px)",
          opacity: 0.7,
        }}
      />
      {/* Precision center dot */}
      <motion.div
        data-cursor-dot
        aria-hidden="true"
        className="hidden md:block fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[99999] shadow-[0_0_10px_rgba(255,255,255,1)]"
        style={{
          x: springX,
          y: springY,
          translateX: 11,
          translateY: 11,
        }}
      />
    </>
  );
}
