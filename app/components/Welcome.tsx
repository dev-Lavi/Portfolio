// app/components/Welcome.tsx
"use client";

export default function Welcome() {
  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 bg-[#10120f]">
      {/* Full-width card - NO animations, NO transforms */}
      <div className="w-full">
        <div className="
          relative z-10 w-full max-w-5xl mx-auto
          rounded-[1.8rem]
          border border-[#d2c9a0]/70
          bg-[#e2dcb2]
          px-6 py-8 sm:px-10 sm:py-12 md:px-16 md:py-16
          shadow-[0_20px_60px_rgba(0,0,0,0.5)]
        ">
          {/* Top line */}
          <div className="mb-6 h-px w-full bg-gradient-to-r from-[#b6ac80] to-[#d2c9a0]" />

          {/* 3-column responsive grid - NO transitions */}
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 items-center justify-items-center md:justify-items-stretch">
            {/* Hindi - Left on desktop */}
            <p className="
              text-center md:text-left
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl
              text-[#9b2420] tracking-[0.06em] drop-shadow-lg font-bold
            ">
              स्वागत
            </p>

            {/* English - Always center */}
            <p className="
              text-center mx-auto
              text-2xl sm:text-3xl md:text-3xl lg:text-4xl
              uppercase tracking-[0.2em] text-[#9b2420] 
              drop-shadow-lg font-black
            ">
              Welcome
            </p>

            {/* Japanese - Right on desktop */}
            <p className="
              text-center md:text-right
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl
              text-[#9b2420] tracking-[0.05em] drop-shadow-lg font-bold
            ">
              歓迎
            </p>
          </div>

          {/* Bottom line */}
          <div className="mt-8 h-px w-full bg-gradient-to-r from-[#b6ac80] to-[#d2c9a0]" />

          {/* Wong Kar-wai subtitle */}
          <p className="
            mt-6 text-center 
            text-xs sm:text-sm md:text-base
            tracking-[0.3em] uppercase font-mono
            text-[#7b7251]
          ">
            A WONG KAR WAI MOMENT — FOR EVERY VISITOR
          </p>
        </div>
      </div>
    </section>
  );
}
