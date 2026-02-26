// app/components/About.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

          <motion.h2
            style={{ y: headingY, opacity: headingOpacity }}
            className="font-bank uppercase tracking-[0.06em] text-[#f5f5f0] leading-none text-[56px] sm:text-[72px]"
          >
            About
          </motion.h2>

          <motion.p
            style={{ y: paraY, opacity: paraOpacity }}
            className="font-bank tracking-[0.06em] text-[#f5f5f0] leading-snug text-[15px] sm:text-[18px]"
          >
            LAVI{" "}
            <span className="text-[0.65em] tracking-[0.12em] align-middle text-[#a7b693]">
              (HE/HIM)
            </span>{" "}
            IS A FULL-STACK DEVELOPER AND CREATIVE TECHNOLOGIST WITH EXPERTISE IN
            FRONTEND, BACKEND, AI, AND BLOCKCHAIN. HE ORCHESTRATES DESIGN, CODE,
            AND AI TO ENGINEER SCALABLE, INTELLIGENT DIGITAL PRODUCTS THAT ELEVATE
            USER EXPERIENCE AND DRIVE REAL-WORLD IMPACT.
          </motion.p>

          <motion.div
            style={{ y: roleY, opacity: roleOpacity }}
            className="flex flex-col gap-3 mt-2"
          >
            <p className="font-bank tracking-[0.26em] uppercase text-[#a7b693] text-[11px] sm:text-[12px]">
              BUILDING PRODUCTS AT THE CROSSPATHS OF AI — SAAS — WEB3.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#e3ff6b]">
                <Image src="/images/globe.svg" alt="OriginHash" width={24} height={24} className="object-contain" />
              </div>
              <div className="flex flex-col font-bank tracking-[0.18em] text-[#f5f5f0] text-[11px] sm:text-[12px]">
                <span className="uppercase">Senior Product Designer</span>
                <span className="uppercase text-[#a7b693]">OriginHash</span>
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
              <h2
                className="font-bank uppercase text-[#f5f5f0] leading-[0.9] tracking-[0.03em]"
                /*
                  5.5vw at 1024px ≈ 56px  (lg breakpoint, "About" ≈ 220px wide → fits in 26% of 1024 = 266px ✓)
                  5.5vw at 1440px ≈ 79px  (fits in 26% of 1440 = 374px ✓)
                  5.5vw at 1920px ≈ 105px (fits in 26% of 1920 = 499px ✓)
                */
                style={{ fontSize: "clamp(2.8rem, 5.5vw, 6.5rem)" }}
              >
                About
              </h2>
            </motion.div>

            {/* RIGHT — paragraph fills the rest, min-w-0 prevents flex blowout */}
            <motion.p
              style={{ y: paraY, opacity: paraOpacity, fontSize: "clamp(1.1rem, 1.65vw, 1.75rem)" }}
              className="flex-1 min-w-0 font-bank tracking-[0.05em] text-[#f5f5f0] leading-snug"
            >
              LAVI{" "}
              <span className="text-[0.6em] tracking-[0.12em] align-middle text-[#a7b693]">
                (HE/HIM)
              </span>{" "}
              IS A FULL-STACK DEVELOPER AND CREATIVE TECHNOLOGIST WITH EXPERTISE IN
              FRONTEND, BACKEND, AI, AND BLOCKCHAIN. HE ORCHESTRATES DESIGN, CODE,
              AND AI TO ENGINEER SCALABLE, INTELLIGENT DIGITAL PRODUCTS THAT ELEVATE
              USER EXPERIENCE AND DRIVE REAL-WORLD IMPACT.
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#e3ff6b]">
                  <Image src="/images/globe.svg" alt="OriginHash" width={28} height={28} className="object-contain" />
                </div>
                <div className="flex flex-col font-bank tracking-[0.18em] text-[#f5f5f0] text-[12px] lg:text-[13px] xl:text-[14px]">
                  <span className="uppercase">Senior Product Designer</span>
                  <span className="uppercase text-[#a7b693]">OriginHash</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}