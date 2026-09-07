// app/components/About.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HyperText } from "./ui/HyperText";

export default function About() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  const headingY = useTransform(scrollYProgress, [0.3, 0.9], ["40px", "0px"]);
  const headingOpacity = useTransform(scrollYProgress, [0.3, 0.85], [0, 1]);

  const paraY = useTransform(scrollYProgress, [0.45, 0.8], ["40px", "0px"]);
  const paraOpacity = useTransform(scrollYProgress, [0.4, 0.95], [0, 1]);

  const roleY = useTransform(scrollYProgress, [0.55, 0.85], ["30px", "0px"]);
  const roleOpacity = useTransform(scrollYProgress, [0.5, 1.0], [0, 1]);

  return (
    <motion.section
      ref={ref}
      id="about"
      style={{ y, scale }}
      className="relative z-10 w-full bg-[#050806] px-0 py-0 md:rounded-t-[32px] overflow-hidden min-h-[87vh]"
    >
      <div className="mx-auto w-full border border-[#2c3621] bg-[#050806] px-4 py-10 sm:px-8 sm:py-12 md:px-10 md:py-16 min-h-[87vh] flex flex-col justify-between">

        {/* ═══════════════════════════════════════════
            MOBILE / TABLET  (< lg) — stacked layout
        ════════════════════════════════════════════ */}
        <div className="flex flex-col gap-6 lg:hidden">

          <motion.div
            style={{ y: headingY, opacity: headingOpacity }}
          >
            <HyperText
              text="About"
              className="font-bank uppercase tracking-[0.06em] text-[#f5f5f0] leading-none text-[48px] sm:text-[64px]"
            />
          </motion.div>

          <motion.p
            style={{ y: paraY, opacity: paraOpacity }}
            className="font-bank tracking-[0.05em] text-[#f5f5f0] leading-relaxed text-[14.5px] sm:text-[17px]"
          >
            LAVI{" "}
            <span className="text-[0.65em] tracking-[0.12em] align-middle text-[#a7b693]">
              (HE/HIM)
            </span>{" "}
            IS A FULL-STACK DEVELOPER & SOFTWARE ENGINEER SPECIALIZING IN HIGH-PERFORMANCE
            WEB ARCHITECTURES, NATIVE MOBILE APPS, AND SCALABLE DISTRIBUTED SYSTEMS.
            CURRENTLY ENGINEERING AT WEB3TASK — SCALING INFRASTRUCTURE FOR 29K+ DAILY USERS
            ACROSS DEEPURLS, OPTIMIZING TRAVERSE VPN TO 99% LIGHTHOUSE PERFORMANCE, AND
            ADVANCING AI-POWERED ANDROID PLATFORMS. BACKED BY STRONG FOUNDATIONS IN NODE.JS,
            NEXT.JS, AND BLOCKCHAIN PROTOCOLS, HE BRIDGES CODE, SYSTEM DESIGN, AND
            INTELLIGENT WORKFLOWS TO BUILD IMPACTFUL PRODUCTS AT PRODUCTION SCALE.
          </motion.p>

          <motion.div
            style={{ y: roleY, opacity: roleOpacity }}
            className="flex flex-col gap-3 mt-2"
          >
            <p className="font-bank tracking-[0.24em] uppercase text-[#a7b693] text-[10.5px] sm:text-[12px]">
              BUILDING PRODUCTS AT THE CROSSPATHS OF AI — SAAS — WEB3.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/80 border border-[#27341c] p-2 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                <Image
                  src="/projects/web3task_logo.png"
                  alt="Web3Task Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col font-bank tracking-[0.16em] text-[#f5f5f0] text-[11.5px] sm:text-[12.5px]">
                <span className="uppercase font-bold text-white">Software Engineer</span>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e3ff6b] animate-pulse" />
                  <span className="uppercase text-[#e3ff6b] font-semibold">Web3Task</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════
            DESKTOP  (≥ lg) — side-by-side layout
            
            Strategy: percentage-based flex columns.
            - Heading column: 26% of container width
            - font-size uses vw units so "About" always
              fits within its column regardless of viewport
        ════════════════════════════════════════════ */}
        <div className="hidden lg:flex flex-col gap-14">

          {/* ── Row 1: Heading (left) + Paragraph (right) ── */}
          <div className="flex items-start">

            {/* LEFT — heading column, strictly 26% wide */}
            <motion.div
              style={{ y: headingY, opacity: headingOpacity }}
              className="w-[26%] shrink-0"
            >
              <HyperText
                text="About"
                className="font-bank uppercase text-[#f5f5f0] leading-[0.9] tracking-[0.03em] text-[54px] xl:text-[76px] 2xl:text-[88px]"
              />
            </motion.div>

            {/* RIGHT — paragraph fills the rest, min-w-0 prevents flex blowout */}
            <motion.p
              style={{ y: paraY, opacity: paraOpacity, fontSize: "clamp(1.05rem, 1.55vw, 1.65rem)" }}
              className="flex-1 min-w-0 font-bank tracking-[0.05em] text-[#f5f5f0] leading-relaxed"
            >
              LAVI{" "}
              <span className="text-[0.6em] tracking-[0.12em] align-middle text-[#a7b693]">
                (HE/HIM)
              </span>{" "}
              IS A FULL-STACK DEVELOPER & SOFTWARE ENGINEER SPECIALIZING IN HIGH-PERFORMANCE
              WEB ARCHITECTURES, NATIVE MOBILE APPS, AND SCALABLE DISTRIBUTED SYSTEMS.
              CURRENTLY ENGINEERING AT WEB3TASK — SCALING INFRASTRUCTURE FOR 29K+ DAILY USERS
              ACROSS DEEPURLS, OPTIMIZING TRAVERSE VPN TO 99% LIGHTHOUSE PERFORMANCE, AND
              ADVANCING AI-POWERED ANDROID PLATFORMS. BACKED BY STRONG FOUNDATIONS IN NODE.JS,
              NEXT.JS, AND BLOCKCHAIN PROTOCOLS, HE BRIDGES CODE, SYSTEM DESIGN, AND
              INTELLIGENT WORKFLOWS TO BUILD IMPACTFUL PRODUCTS AT PRODUCTION SCALE.
            </motion.p>
          </div>

          {/* ── Row 2: Spacer (left) + Role info (right) ── */}
          <div className="flex">

            {/* Spacer — same width as heading column above */}
            <div className="w-[26%] shrink-0" />

            {/* Role info sits directly under the paragraph */}
            <motion.div
              style={{ y: roleY, opacity: roleOpacity }}
              className="flex-1 flex flex-col gap-4"
            >
              <p className="font-bank tracking-[0.28em] uppercase text-[#a7b693] text-[11px] lg:text-[12px] xl:text-[13px]">
                BUILDING PRODUCTS AT THE CROSSPATHS OF AI — SAAS — WEB3.
              </p>
              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-xl bg-black/80 border border-[#27341c] p-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                  <Image
                    src="/projects/web3task_logo.png"
                    alt="Web3Task Logo"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col font-bank tracking-[0.18em] text-[#f5f5f0] text-[12px] lg:text-[13px] xl:text-[14px]">
                  <span className="uppercase font-bold text-white">Software Engineer</span>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e3ff6b] animate-pulse" />
                    <span className="uppercase text-[#e3ff6b] font-semibold">Web3Task</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}