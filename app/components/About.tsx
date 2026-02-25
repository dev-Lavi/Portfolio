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

  // Section slides up from 100% → 0%
  const y = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

  // Subtle scale lift
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  // Heading
  const headingY = useTransform(scrollYProgress, [0.3, 0.9], ["40px", "0px"]);
  const headingOpacity = useTransform(scrollYProgress, [0.3, 0.85], [0, 1]);

  // Paragraph
  const paraY = useTransform(scrollYProgress, [0.45, 0.8], ["40px", "0px"]);
  const paraOpacity = useTransform(scrollYProgress, [0.4, 0.95], [0, 1]);

  // Role line + logo
  const roleY = useTransform(scrollYProgress, [0.55, 0.85], ["30px", "0px"]);
  const roleOpacity = useTransform(scrollYProgress, [0.5, 1.0], [0, 1]);

  // Buttons
  const btnY = useTransform(scrollYProgress, [0.65, 0.9], ["20px", "0px"]);
  const btnOpacity = useTransform(scrollYProgress, [0.6, 1.0], [0, 1]);

  return (
    <motion.section
      ref={ref}
      id="about"
      style={{ y, scale }}
      className="relative z-10 w-full bg-[#050806] px-0 py-0 md:rounded-t-[32px] overflow-hidden min-h-[87vh]"
    >
      <div
        className="
          mx-auto w-full
          border border-[#2c3621]
          bg-[#050806]
          px-4 py-10 sm:px-8 sm:py-12 md:px-10 md:py-16
          min-h-[87vh] flex flex-col justify-between
        "
      >
        <div>
          {/* Heading — large like inspiration */}
          <motion.h2
            style={{ y: headingY, opacity: headingOpacity }}
            className="
              mb-8 text-left
              text-[52px] sm:text-[72px] md:text-[96px] lg:text-[120px]
              font-bank uppercase tracking-[0.2em]
              text-[#e3ff6b]
              leading-none
            "
          >
            About
          </motion.h2>

          {/* Main paragraph — much larger, fills width like inspiration */}
          <motion.p
            style={{ y: paraY, opacity: paraOpacity }}
            className="
              mb-10 text-left
              text-[18px] sm:text-[22px] md:text-[28px] lg:text-[32px]
              leading-snug
              font-bank tracking-[0.08em]
              text-[#f5f5f0]
              max-w-6xl
            "
          >
            LAVI (HE/HIM) IS A NOMAD PRODUCT AND BRAND DESIGNER WITH A PASSION
            FOR ART, TECHNOLOGY, AND THE FUTURE OF THE WEB. HE BLENDS DESIGN
            SYSTEMS, MOTION, AND CODE TO CRAFT EXPRESSIVE, HIGH-IMPACT DIGITAL
            EXPERIENCES FOR BRANDS AND PRODUCTS ACROSS THE GLOBE.
          </motion.p>

          {/* Current role line */}
          <motion.p
            style={{ y: roleY, opacity: roleOpacity }}
            className="
              mb-5 text-[11px] sm:text-[13px] md:text-[14px]
              font-bank tracking-[0.28em]
              uppercase text-[#a7b693]
            "
          >
            BUILDING PRODUCTS AT THE CROSSPATHS OF AI — SAAS — WEB3.
          </motion.p>

          {/* Logo + role */}
          <motion.div
            style={{ y: roleY, opacity: roleOpacity }}
            className="mb-10 flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#e3ff6b]">
              <Image
                src="/images/globe.svg"
                alt="Company logo"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col text-[12px] sm:text-[13px] md:text-[14px] font-bank tracking-[0.18em] text-[#f5f5f0]">
              <span className="uppercase">Senior Product Designer</span>
              <span className="uppercase text-[#a7b693]">OriginHash</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom buttons */}
        <motion.div
          style={{ y: btnY, opacity: btnOpacity }}
          className="flex flex-wrap items-center justify-center gap-3 pb-4"
        >
          <button className="rounded-full bg-[#12361f] px-8 py-3 text-[10px] sm:text-[11px] font-bank uppercase tracking-[0.22em] text-[#e3ff6b]">
            Home
          </button>
          <button className="rounded-full bg-[#12361f] px-8 py-3 text-[10px] sm:text-[11px] font-bank uppercase tracking-[0.22em] text-[#e3ff6b]">
            Work
          </button>
          <button className="rounded-full bg-[#12361f] px-8 py-3 text-[10px] sm:text-[11px] font-bank uppercase tracking-[0.22em] text-[#e3ff6b]">
            Honors
          </button>
          <button className="rounded-full bg-[#12361f] px-8 py-3 text-[10px] sm:text-[11px] font-bank uppercase tracking-[0.22em] text-[#e3ff6b]">
            Contact
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}