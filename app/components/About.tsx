// app/components/About.tsx
"use client";

import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      className="w-full bg-[#181c13] px-0 py-0 
       sm:px-0 sm:py-0
        md:px-0 md:py-0 
       lg:px-0 lg:py-0"
    >
      <div
        className="
          mx-auto w-full max-w-xl
          sm:max-w-3xl md:max-w-5xl lg:max-w-none
          border border-[#2c3621]
          bg-[#050806]
          px-4 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12
        "
      >
        {/* Heading */}
        <h2
          className="
            mb-6 text-left
            text-[32px] sm:text-[40px] md:text-[48px]
            font-bank uppercase tracking-[0.25em]
            text-[#e3ff6b]
          "
        >
          About
        </h2>

        {/* Main paragraph */}
        <p
          className="
            mb-8 text-left
            text-[16px] sm:text-[13px] md:text-[15px]
            leading-relaxed
            font-bank tracking-[0.16em]
            text-[#f5f5f0]
          "
        >
          LAVI (he/him) is a nomad product and brand designer with a passion for
          art, technology, and the future of the web. He blends design systems,
          motion, and code to craft expressive, high-impact digital experiences
          for brands and products across the globe.
        </p>

        {/* Current role line */}
        <p
          className="
            mb-4 text-[10px] sm:text-[11px] md:text-[12px]
            font-bank tracking-[0.22em]
            uppercase text-[#a7b693]
          "
        >
          BUILDING PRODUCTS AT THE CROSSPATHS OF AI — SAAS — WEB3.
        </p>

        {/* Logo + role */}
        <div className="mb-10 flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Company logo */}
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-md bg-[#e3ff6b]
            "
          >
            <Image
              src="/images/globe.svg" // put your logo svg in /public/images/
              alt="Company logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>

          {/* Title + company */}
          <div className="flex flex-col text-[10px] sm:text-[11px] md:text-[12px] font-bank tracking-[0.18em] text-[#f5f5f0]">
            <span className="uppercase">Senior Product Designer</span>
            <span className="uppercase text-[#a7b693]">OriginHash</span>
          </div>
        </div>

        {/* Bottom buttons row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            className="
              rounded-full bg-[#12361f]
              px-8 py-3
              text-[10px] sm:text-[11px]
              font-bank uppercase tracking-[0.22em]
              text-[#e3ff6b]
            "
          >
            Home
          </button>
          <button
            className="
              rounded-full bg-[#12361f]
              px-8 py-3
              text-[10px] sm:text-[11px]
              font-bank uppercase tracking-[0.22em]
              text-[#e3ff6b]
            "
          >
            Work
          </button>
          <button
            className="
              rounded-full bg-[#12361f]
              px-8 py-3
              text-[10px] sm:text-[11px]
              font-bank uppercase tracking-[0.22em]
              text-[#e3ff6b]
            "
          >
            Honors
          </button>
          <button
            className="
              rounded-full bg-[#12361f]
              px-8 py-3
              text-[10px] sm:text-[11px]
              font-bank uppercase tracking-[0.22em]
              text-[#e3ff6b]
            "
          >
            Contact
          </button>
        </div>
      </div>
    </section>
  );
}
