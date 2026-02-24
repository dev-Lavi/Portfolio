"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex w-full overflow-hidden bg-[#6c8250] h-[90vh] md:h-screen sticky top-0">
      {/* Grid background - matches section height */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundColor: "#6c8250",
          backgroundImage: `
            linear-gradient(#1f2b17 2px, transparent 1px),
            linear-gradient(90deg, #1f2b17 2px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content wrapper - flex column for perfect bottom alignment */}
      <div className="z-22 relative flex w-full h-full flex-col">
        {/* Top tagline */}
        <div className="absolute left-1/2 top-6 -translate-x-1/2 w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[95%] rounded-xl bg-[#e3ff6b] px-4 py-3 sm:px-6 sm:py-5 text-[10px] sm:text-xs md:text-sm font-bank uppercase tracking-[0.25em] sm:tracking-[0.32em] lg:tracking-[0.39em] text-black z-20">
          Designer, Full stack developer and blockchain developer
        </div>

{/* Main content spacer */}
<div className="flex-1 flex items-center justify-end relative z-5 pb-32 lg:pb-48 xl:pb-64">
  {/* Scrolling name - moved down, behind avatar */}
  <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-[100%]">
    <div className="flex whitespace-nowrap animate-[scroll_20s_linear_infinite] -mb-20 lg:-mb-28 xl:-mb-36">
      <span className="text-[60px] sm:text-[72px] md:text-[72px] lg:text-[104px] xl:text-[128px] font-semibold tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] text-red-600 opacity-90">
        LAVI &nbsp; SHARMA &nbsp; LAVI &nbsp; SHARMA &nbsp;
      </span>
    </div>
  </div>
</div>

{/* Bottom area - TWO avatars for perfect design match */}
<div className="flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
  
  {/* 🎯 SMALL AVATAR (Mobile/Tablet) - HIDE on lg+ */}
  <div className="lg:hidden w-[70vw] h-[70vw] sm:w-[55vw] sm:h-[55vw] md:w-[45vw] md:h-[45vw] max-w-[600px] max-h-[600px] mx-auto mb-1 sm:mb-2">
    <Image
      src="/images/Avator.svg"
      alt="Portrait of Lavi with katana"
      fill
      className="w-full h-full object-contain"
      priority
    />
  </div>

{/* 🎯 HUGE AVATAR (Desktop) - Responsive scaling */}
{/* 🎯 HUGE AVATAR (Desktop) - 1990px+ special case */}
<div className="hidden lg:block 
  lg:w-[65vw] lg:h-[90vw] 
  xl:w-[55vw] xl:h-[51vw] 
  2xl:w-[54vw] 2xl:h-[48vw]
  lg:max-w-[750px] lg:max-h-[650px] 
  xl:max-w-[850px] xl:max-h-[650px] 
  2xl:max-w-[1200px] 2xl:max-h-[1200px] 
  mx-auto mb-1 sm:mb-2 relative 
  lg:-top-0 xl:-top-20 2xl:-top-45
  [@media(min-width:1900px)]:-top-[270px]">
  <Image
    src="/images/Avator.svg"
    alt="Portrait of Lavi with katana - desktop"
    fill
    className="w-full h-full object-contain"
    priority
  />
</div>




        </div>
      </div>
      {/* Bottom labels — direct child of section so absolute works correctly */}
      <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between sm:bottom-6 sm:left-6 sm:right-6">
        <button
          className="hidden md:flex items-center gap-2 rounded-lg bg-[#e3ff6b] px-3 py-2 sm:px-4 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.18em] sm:tracking-[0.2em] text-black hover:bg-[#d4f055] transition-colors"
          onClick={() => {
            const el = document.getElementById("about");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-black">↓</span>
          Scroll down
        </button>
        <div className="ml-auto rounded-lg bg-[#e3ff6b] px-3 py-2 text-[10px] sm:text-xs font-semibold tracking-[0.15em] text-black">
          ©2025
        </div>
      </div>

      {/* Remove the height controller div - no longer needed */}
    </section>

  );
}
