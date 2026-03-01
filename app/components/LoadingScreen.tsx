// app/components/LoadingScreen.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Show for 2.4s then fade out
    const timer = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          // Fullscreen overlay, sits above everything
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0e0d0b]"
          style={{
            background: "radial-gradient(ellipse at center, #1a1812 0%, #0a0905 100%)",
          }}
        >
          {/* The card — matches the screenshot aesthetic */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative w-[min(780px,88vw)] rounded-2xl overflow-hidden"
            style={{
              background: "#e8e5c8",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Subtle paper grain overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.18]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: "180px 180px",
              }}
            />

            <div className="relative px-10 py-10 sm:px-14 sm:py-12">

              {/* Top row: three-column — Hindi | WELCOME | Chinese */}
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                {/* Hindi — स्वागत */}
                <motion.span
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[#8b1a1a] font-bold leading-none select-none"
                  style={{
                    fontFamily: "'Noto Sans Devanagari', 'Mangal', serif",
                    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                  }}
                >
                  स्वागत
                </motion.span>

                {/* Center — WELCOME */}
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="tracking-[0.22em] text-[#8b1a1a] uppercase select-none"
                  style={{
                    fontFamily: "'Courier New', 'Courier', monospace",
                    fontWeight: 700,
                    fontSize: "clamp(1.2rem, 3vw, 1.9rem)",
                    letterSpacing: "0.22em",
                  }}
                >
                  Welcome
                </motion.span>

                {/* Chinese — 歡迎 */}
                <motion.span
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[#8b1a1a] font-bold leading-none select-none"
                  style={{
                    fontFamily: "'Noto Serif SC', 'STSong', 'SimSun', serif",
                    fontSize: "clamp(1.6rem, 4.5vw, 2.8rem)",
                  }}
                >
                  歡迎
                </motion.span>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="my-6 h-px origin-left"
                style={{ background: "rgba(139, 26, 26, 0.3)" }}
              />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-center tracking-[0.3em] uppercase select-none"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(0.55rem, 1.2vw, 0.78rem)",
                  color: "rgba(100, 70, 40, 0.75)",
                  letterSpacing: "0.3em",
                }}
              >
                A Wong Kar Wai Moment — For Every Visitor
              </motion.p>

            </div>

            {/* Thin progress bar at bottom — drains over the 2.4s duration */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px]"
              style={{ background: "rgba(139,26,26,0.5)" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, delay: 0.2, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}