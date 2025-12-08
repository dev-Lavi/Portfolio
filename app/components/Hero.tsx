"use client";
// app/components/Hero.tsx
import Image from "next/image";

export default function Hero() {
  return (
   <section className="relative flex h-screen w-full overflow-hidden bg-[#6c8250]">
  {/* Grid background */}
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



{/* Content wrapper */}
<div className="relative flex h-full w-full items-center justify-center">
  {/* Top tagline bar */}
  <div
    className="
      fixed left-1/2 top-6 -translate-x-1/2
      w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[1480px]
      rounded-xl bg-[#e3ff6b]
      px-4 py-3 sm:px-6 sm:py-5
      text-[10px] sm:text-xs md:text-sm
      font-bank uppercase tracking-[0.25em] sm:tracking-[0.32em] lg:tracking-[0.39em]
      text-black
      z-20
    "
  >
    Designer, Full stack developer and blockchain developer
  </div>  {/* end of Top tagline bar */}


   {/* Center area: name + avatar */}
<div
  className="
    relative flex w-full flex-1
    flex-col items-center justify-center
    pt-20 sm:pt-24 lg:pt-6
  "
>
  {/* Avatar */}
  <div
    className="
      relative
      -mt-9
      w-[70vw] h-[70vw]
      sm:w-[80vw] sm:h-[80vw]
      md:w-[70vw] md:h-[70vw]
      lg:w-[51vw] lg:h-[51vw]
      max-w-[1050px] max-h-[1050px]
      z-12
    "
  >
    <Image
      src="/images/Avator.svg"
      alt="Portrait of Lavi with katana"
      fill
      className="w-full h-full object-contain"
      priority
    />
  </div>

</div>

{/* Name in background */}
<div
  className="
    pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2
    mx-auto max-w-[95%]
    overflow-hidden
    z-10
  "
>
  <div className="flex whitespace-nowrap animate-[scroll_20s_linear_infinite]">
    <span
      className="
        text-[40px] sm:text-[56px] md:text-[72px] lg:text-[104px] xl:text-[128px]
        font-semibold tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em]
        text-red-600 opacity-70
      "
    >
      L A V I &nbsp; S H A R M A &nbsp; L A V I &nbsp; S H A R M A &nbsp;
    </span>
  </div>
</div>



    {/* Bottom labels */}
    <div
      className="
        -mt-24 fixed bottom-7 left-0 right-0 flex w-full items-end justify-between
        px-4 sm:px-6 md`:px-8 lg:px-12

      "
    >
      {/* Scroll down */}
      <button
        className="
          hidden md:flex                          /* hide on small/mobile, show from md (tablet+) */
          items-center gap-2 rounded-lg bg-[#e3ff6b]
          px-3 py-2 sm:px-4
          text-[9px] sm:text-[10px]
          font-medium uppercase tracking-[0.18em] sm:tracking-[0.2em]
          text-black
          hover:bg-[#d4f055] transition-colors
        "
        onClick={() => {
          const el = document.getElementById("about");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-black">
          ↓
        </span>
        Scroll down
      </button>

      {/* Year box */}
      <div
        className="
          rounded-lg bg-[#e3ff6b]
          px-3 py-2
          text-[10px] sm:text-xs
          font-semibold tracking-[0.15em]
          text-black
        "
      >
        ©2025
      </div>
    </div>
  </div>
</section>
  );
}
