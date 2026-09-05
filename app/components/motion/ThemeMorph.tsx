"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect, prefersReducedMotion } from "@/app/lib/gsap";

interface ThemeMorphProps {
  initialBg?: string;
  initialFg?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Scroll-driven theme morph provider.
 * Sections declare desired background and foreground with `data-theme-bg` and `data-theme-fg`.
 * Crossing a section's midpoint smoothly interpolates the wrapper background and foreground colors.
 */
export default function ThemeMorph({
  initialBg = "#070b05",
  initialFg = "#ffffff",
  className = "",
  style,
  children,
}: ThemeMorphProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const bands = gsap.utils.toArray<HTMLElement>("[data-theme-bg]", el);

      bands.forEach((band) => {
        const bg = band.dataset.themeBg || initialBg;
        const fg = band.dataset.themeFg || initialFg;
        const apply = () => {
          gsap.to(el, {
            backgroundColor: bg,
            color: fg,
            duration: 0.7,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        ScrollTrigger.create({
          trigger: band,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: apply,
          onEnterBack: apply,
        });
      });
    }, el);

    return () => ctx.revert();
  }, [initialFg, initialBg]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        backgroundColor: initialBg,
        color: initialFg,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
