// app/components/Welcome.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function Welcome() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Trigger animation when section enters viewport
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // run only once
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex w-full items-center justify-center bg-[#10120f]"
    >
      {/* vignette + grain (optional) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.35),transparent_50%),radial-gradient(circle_at_bottom,_rgba(0,0,0,0.6),transparent_55%)] opacity-80 mix-blend-multiply" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/grain.png')] opacity-[0.22]" />

      {/* Full-width card */}
      <div
        className="
          relative z-10
          w-full
          rounded-t-[1.8rem] rounded-b-[1.8rem]
          border border-[#d2c9a0]/60
          bg-[#e2dcb2]
          px-4 py-10 sm:px-10 sm:py-12 md:px-16 md:py-16
          shadow-[0_30px_80px_rgba(0,0,0,0.65)]
        "
      >
        {/* Top line */}
        <div className="mb-6 h-px w-full bg-[#b6ac80]" />

{/* 3‑column welcome text */}
<div
  className={`
    grid w-full gap-4
    sm:gap-6
    md:grid-cols-3
    items-center
    transition-all duration-[1400ms] ease-out
    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
  `}
>
  {/* Hindi */}
  <p
    className={`
      text-center md:text-left
      text-[32px] sm:text-[44px] md:text-[58px] lg:text-[72px]
      text-[#9b2420]
      tracking-[0.05em]
      drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)]
      transition-transform duration-[1600ms] ease-[cubic-bezier(0.19,1,0.22,1)]
      ${visible ? "translate-x-0" : "-translate-x-6"}
    `}
  >
    स्वागत
  </p>

  {/* English */}
  <p
    className={`
      text-center
      text-[27px] sm:text-[39px] md:text-[36px] lg:text-[45px]
      uppercase tracking-[0.18em]
      text-[#9b2420]
      drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)]
      transition-transform duration-[1600ms] delay-150 ease-[cubic-bezier(0.19,1,0.22,1)]
      ${visible ? "translate-y-0" : "translate-y-4"}
    `}
  >
    Welcome
  </p>

  {/* Japanese */}
  <p
    className={`
      text-center md:text-right
      text-[32px] sm:text-[44px] md:text-[58px] lg:text-[72px]
      text-[#9b2420]
      tracking-[0.04em]
      drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)]
      transition-transform duration-[1600ms] delay-300 ease-[cubic-bezier(0.19,1,0.22,1)]
      ${visible ? "translate-x-0" : "translate-x-6"}
    `}
  >
    歓迎
  </p>
</div>


        {/* Bottom line */}
        <div className="mt-6 h-px w-full bg-[#b6ac80]" />

        {/* Wong Kar‑Wai style subtitle */}
        <p
          className={`
            mt-4 text-center text-[9px] sm:text-[10px] md:text-[11px]
            tracking-[0.32em] uppercase
            text-[#7b7251]
            transition-opacity duration-[1800ms] delay-450
            ${visible ? "opacity-100" : "opacity-0"}
          `}
        >
          A WONG KAR WAI MOMENT — FOR EVERY VISITOR
        </p>
      </div>
    </section>
  );
}
