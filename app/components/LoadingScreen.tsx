// app/components/LoadingScreen.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: "radial-gradient(ellipse at center, #1a1812 0%, #0a0905 100%)",
          }}
        >
          {/*
            On large screens (lg+): full-bleed — fills 100vw × 100vh, no rounded corners
            On small screens       : card — max-w capped, rounded, centered with padding
          */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="
              relative overflow-hidden
              flex flex-col justify-between
              /* ── small: card ── */
              w-[min(720px,92vw)] rounded-2xl
              /* ── large: full bleed ── */
              lg:w-screen lg:h-screen lg:rounded-none lg:max-w-none
            "
            style={{
              background: "#e8e5c8",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Paper grain */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.15]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: "180px 180px",
              }}
            />

            {/*
              Content wrapper:
              - small: normal padding
              - large: full height, flex-col, centered vertically with generous padding
            */}
            <div className="
              relative
              px-8 py-8
              sm:px-12 sm:py-10
              lg:flex lg:flex-col lg:justify-center lg:h-full
              lg:px-[8vw] lg:py-[6vh]
            ">

              {/* ── Welcome words ── */}
              <div className="relative flex flex-col overflow-hidden
                gap-2 lg:gap-[1.5vh]
              ">

                {/* Row 1 — Hindi — slides from LEFT */}
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ x: "-110%", opacity: 0 }}
                    animate={{ x: "0%", opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-3 lg:gap-5"
                  >
                    <span
                      className="select-none leading-none text-[#8b1a1a]"
                      style={{
                        fontFamily: "'Noto Sans Devanagari', 'Mangal', serif",
                        fontWeight: 800,
                        /* small → large: scales from ~24px on mobile up to ~11rem on desktop */
                        fontSize: "clamp(1.8rem, 16vh, 15rem)",
                        fontStyle: "italic",
                        textShadow:
                          "2px 3px 0px rgba(139,26,26,0.15), -1px -1px 0px rgba(232,229,200,0.5)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      स्वागत
                    </span>
                    {/* Rule draws in after text lands */}
                    <motion.span
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
                      className="origin-left inline-block h-[2px] lg:h-[3px]"
                      style={{
                        background: "rgba(139,26,26,0.4)",
                        marginBottom: "0.35em",
                        width: "clamp(24px, 4vw, 64px)",
                      }}
                    />
                  </motion.div>
                </div>

                {/* Row 2 — English — letter-spacing stamp effect */}
                <div className="overflow-hidden flex justify-center">
                  <motion.span
                    initial={{ opacity: 0, letterSpacing: "0.65em", scale: 0.86 }}
                    animate={{ opacity: 1, letterSpacing: "0.2em", scale: 1 }}
                    transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="select-none uppercase text-[#1a1208] block text-center"
                    style={{
                      fontFamily: "'BankGothic Md BT', sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(1.4rem, 7vh, 10rem)",
                      textShadow:
                        "1px 1px 0 rgba(255,255,255,0.5), -1px -1px 0 rgba(0,0,0,0.1)",
                    }}
                  >
                    WELCOME
                  </motion.span>
                </div>

                {/* Row 3 — Japanese — slides from RIGHT, flush right */}
                <div className="overflow-hidden flex justify-end">
                  <motion.div
                    initial={{ x: "110%", opacity: 0 }}
                    animate={{ x: "0%", opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-3 lg:gap-5"
                  >
                    {/* Rule before Japanese */}
                    <motion.span
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
                      className="origin-right inline-block h-[2px] lg:h-[3px]"
                      style={{
                        background: "rgba(139,26,26,0.4)",
                        marginBottom: "0.3em",
                        width: "clamp(24px, 4vw, 64px)",
                      }}
                    />
                    <span
                      className="select-none leading-none text-[#8b1a1a]"
                      style={{
                        fontFamily: "'Noto Serif JP', 'Yu Mincho', 'MS Mincho', serif",
                        fontWeight: 900,
                        fontSize: "clamp(1.8rem, 16vh, 11rem)",
                        fontStyle: "italic",
                        textShadow:
                          "2px 3px 0px rgba(139,26,26,0.15), -1px -1px 0px rgba(232,229,200,0.5)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      歓迎
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="origin-left h-px mt-8 mb-8 lg:mt-[6vh] lg:mb-[5vh]"
                style={{ background: "rgba(139, 26, 26, 0.28)" }}
              />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-center tracking-[0.3em] uppercase select-none mb-12"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(0.65rem, 1.8vh, 1rem)",
                  color: "rgba(100, 70, 40, 0.7)",
                  letterSpacing: "0.3em",
                }}
              >
                A Wong Kar Wai Moment — For Every Visitor
              </motion.p>

            </div>

            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] lg:h-[3px]"
              style={{ background: "rgba(139,26,26,0.5)" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, delay: 0.2, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}