"use client";

import React from "react";

export interface StackingImageItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
  tag?: string;
}

interface CssImageStackingProps {
  images: readonly StackingImageItem[];
  className?: string;
}

export default function CssImageStacking({
  images,
  className = "",
}: CssImageStackingProps) {
  // Progressive width scale for deck stacking effect
  const widthClasses = [
    "w-[92%] sm:w-[76%] md:w-[68%] lg:w-[60%]",
    "w-[94%] sm:w-[79%] md:w-[72%] lg:w-[64%]",
    "w-[96%] sm:w-[82%] md:w-[76%] lg:w-[68%]",
    "w-[98%] sm:w-[85%] md:w-[80%] lg:w-[72%]",
    "w-full sm:w-[88%] md:w-[84%] lg:w-[76%]",
  ];

  // Progressive sticky top offsets considering the fixed navbar
  const stickyTopClasses = [
    "sm:sticky sm:top-20",
    "sm:sticky sm:top-24",
    "sm:sticky sm:top-28",
    "sm:sticky sm:top-32",
    "sm:sticky sm:top-36",
  ];

  return (
    <div className={`w-full ${className}`}>
      {images.map((item, index) => {
        const widthClass = widthClasses[index % widthClasses.length];
        const stickyClass = stickyTopClasses[index % stickyTopClasses.length];

        return (
          <div key={item.id} className={`${stickyClass} w-full py-4`}>
            <figure className="w-full min-h-[82vh] sm:min-h-[88vh] flex items-center justify-center px-4">
              <div
                className={`group relative transition-all duration-300 ${widthClass} overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0c110d] [box-shadow:0_-14px_36px_rgba(0,0,0,0.92),0_10px_25px_rgba(0,0,0,0.8)] hover:border-[#e3ff6b]/40`}
              >
                {/* Sleek Mac-Style Console Top Bar */}
                <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#121813] px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>

                  {item.tag && (
                    <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider text-white/50 uppercase">
                      {item.tag}
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e3ff6b] shadow-[0_0_6px_#e3ff6b]" />
                    <span className="font-mono text-[10px] text-[#e3ff6b] font-medium">
                      0{index + 1}
                    </span>
                  </div>
                </div>

                {/* Dashboard Image */}
                <div className="relative aspect-[16/9] sm:aspect-[16/10] w-full bg-[#070b05] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.01]"
                  />

                  {/* Subtle edge vignette */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </div>
            </figure>
          </div>
        );
      })}
    </div>
  );
}
