"use client";
import Image from "next/image";
import HeroRevealBackground from "./HeroRevealBackground";

export default function Hero() {
  return (
    <section className="relative flex w-full overflow-hidden bg-[#060906] h-[90vh] md:h-screen">
      {/* Background: ASCII Art Glitch Video with Liquid Cursor Reveal for mountain photo */}
      <HeroRevealBackground qualityMode="lo-fi" />

      {/* Scrolling name - positioned vertically in the middle of hero, hidden on small devices (< md) */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 max-w-[100%] overflow-hidden hidden md:block">
        <div className="flex whitespace-nowrap animate-[scroll_20s_linear_infinite]">
          <span className="text-[60px] sm:text-[72px] md:text-[72px] lg:text-[104px] xl:text-[128px] font-semibold tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] text-red-600 opacity-90">
            LAVI &nbsp; SHARMA &nbsp; LAVI &nbsp; SHARMA &nbsp;
          </span>
        </div>
      </div>

      {/* Hero Avatar - pinned directly to center-bottom with 0 gap */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 z-20 flex justify-center items-end">
        <div className="
          relative
          aspect-[1424/1286]
          w-[76vw] max-w-[360px] max-h-[62vh]
          sm:w-[58vw] sm:max-w-[440px] sm:max-h-[66vh]
          md:w-[48vw] md:max-w-[500px] md:max-h-[70vh]
          lg:w-[780px] lg:max-w-[820px] lg:max-h-[82vh]
          xl:w-[920px] xl:max-w-[960px] xl:max-h-[85vh]
          2xl:w-[1100px] 2xl:max-w-[1150px] 2xl:max-h-[88vh]
          [@media(min-width:1900px)]:w-[1250px] [@media(min-width:1900px)]:max-w-[1300px] [@media(min-width:1900px)]:max-h-[90vh]
        ">
          <Image
            src="/images/avatar.webp"
            alt="Portrait of Lavi with katana - desktop"
            fill
            priority
            unoptimized
            fetchPriority="high"
            className="w-full h-full object-contain object-bottom"
          />
        </div>
      </div>

      {/* Bottom labels — direct child of section so absolute works correctly */}
      <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between sm:bottom-6 sm:left-6 sm:right-6">
        {/* On desktop (md+): Scroll down is on the left */}
        <button
          className="hidden md:flex items-center gap-2 rounded-lg bg-[#e3ff6b] px-3 py-2 sm:px-4 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.18em] sm:tracking-[0.2em] text-black hover:bg-[#d4f055] transition-colors cursor-pointer"
          onClick={() => {
            const el = document.getElementById("about");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-black">↓</span>
          Scroll down
        </button>

        {/* On desktop (md+): ©2025 on the right */}
        <div className="hidden md:block ml-auto rounded-lg bg-[#e3ff6b] px-3 py-2 text-[10px] sm:text-xs font-semibold tracking-[0.15em] text-black">
          ©2025
        </div>

        {/* On small devices (< md): Scroll down box in the right bottom corner instead of ©2025 */}
        <button
          className="md:hidden ml-auto flex items-center gap-2 rounded-lg bg-[#e3ff6b] px-3 py-2 text-[9px] font-medium uppercase tracking-[0.18em] text-black hover:bg-[#d4f055] transition-colors cursor-pointer"
          onClick={() => {
            const el = document.getElementById("about");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-black text-[9px]">↓</span>
          Scroll down
        </button>
      </div>

      {/* Remove the height controller div - no longer needed */}
    </section>

  );
}
