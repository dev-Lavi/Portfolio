"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  category?: string;
  description?: string;
  colorType?: "green" | "red";
  id?: number;
  meta?: { label: string; value: string }[];
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(170px, 46vw, 230px)",
  gap = 0.05,
  loop = true,
  showCaption = true,
  showPagination = false,
  showNavigation = true,
  label = "Cover carousel",
  className,
  cardClassName,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    let width = widthRef.current;
    if (!width && cardRefs.current[0]) {
      width = cardRefs.current[0].offsetWidth;
      widthRef.current = width;
    }
    if (!width) return;

    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring. This is the
      // whole looping mechanism — no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // Both the tilt and the recession ease off as cards travel out —
      // doubling the distance adds only about half again as much of each.
      // A linear ramp folds the second card shut; this keeps it readable.
      const ramp = Math.pow(distance, falloff);
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      // A card is teleported across the ring at exactly half a turn out, so it
      // has to be gone by then or the jump is visible.
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // ponytail: exponential ease-out, not a spring. Swap in a spring only
        // if the settle needs overshoot.
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      // Take the shorter way round rather than unwinding the whole ring.
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    let width = widthRef.current;
    if (!width && cardRefs.current[0]) {
      width = cardRefs.current[0].offsetWidth;
      widthRef.current = width;
    }
    const pitch = width * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    // Cards per second, for the throw.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    // Let a flick carry, but never more than two cards.
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  // Card width drives pitch, depth and perspective, so it is the only thing
  // worth measuring — and only when the box actually changes.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      const w = card.offsetWidth;
      if (w > 0) {
        widthRef.current = w;
        paint();
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const active = slides[selected];

  return (
    <div
      className={cn("w-full select-none", className)}
      style={{ ["--cf-card" as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          // Vertical padding keeps the drop shadows clear of the overflow clip.
          className="cursor-grab overflow-hidden py-8 outline-none ring-ring focus-visible:ring-2 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            // Horizontal drag is ours; the page keeps vertical scrolling.
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "var(--cf-card)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              const isSelected = index === selected;
              const isRed = slide.colorType === "red";

              return (
                <div
                  key={index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  onClick={() => {
                    if (index !== selected) {
                      goTo(index);
                    }
                  }}
                  className={cn(
                    "absolute left-1/2 top-0 aspect-square overflow-hidden rounded-[22px] will-change-transform cursor-pointer transition-colors duration-300",
                    isRed
                      ? "border border-[#4a0d1a] bg-gradient-to-b from-[#180e12]/95 to-[#090506]/95"
                      : "border border-[#27341c] bg-gradient-to-b from-[#12190f]/95 to-[#060905]/95",
                    isSelected
                      ? isRed
                        ? "shadow-[0_22px_50px_rgba(255,13,74,0.35),inset_0_1px_0_rgba(255,13,74,0.3)] border-[#ff0d4a]/70 ring-1 ring-[#ff0d4a]/40"
                        : "shadow-[0_22px_50px_rgba(227,255,107,0.35),inset_0_1px_0_rgba(227,255,107,0.3)] border-[#e3ff6b]/70 ring-1 ring-[#e3ff6b]/40"
                      : "shadow-[0_15px_35px_rgba(0,0,0,0.85)]",
                    cardClassName,
                  )}
                  style={{ width: "var(--cf-card)" }}
                >
                  {/* Subtle cybernetic grid texture inside card */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: isRed
                        ? "linear-gradient(#ff0d4a 1px, transparent 1px), linear-gradient(90deg, #ff0d4a 1px, transparent 1px)"
                        : "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Ambient downlight glow */}
                  <div
                    className="pointer-events-none absolute -bottom-4 left-0 right-0 h-24"
                    style={{
                      background: isRed
                        ? "radial-gradient(ellipse 90% 80% at 50% 100%, rgba(255, 13, 74, 0.45) 0%, transparent 75%)"
                        : "radial-gradient(ellipse 90% 80% at 50% 100%, rgba(227, 255, 107, 0.45) 0%, transparent 75%)",
                      filter: "blur(12px)",
                    }}
                  />

                  {/* Logo content */}
                  <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-4">
                    <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        draggable={false}
                        className="h-full w-full select-none object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)]"
                      />
                    </div>

                    {slide.title && (
                      <div className="relative z-10 mt-2.5 rounded-full bg-black/70 px-3 py-0.5 border border-white/10 backdrop-blur-sm">
                        <span
                          className={cn(
                            "font-bank text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.14em]",
                            isRed ? "text-[#FF0D4A]" : "text-[#e3ff6b]",
                          )}
                        >
                          {slide.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-1 sm:left-3 top-1/2 z-[200] -translate-y-1/2 rounded-full border border-white/10 bg-black/70 p-2.5 text-white/90 backdrop-blur-md transition hover:border-[#e3ff6b] hover:text-[#e3ff6b] active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-1 sm:right-3 top-1/2 z-[200] -translate-y-1/2 rounded-full border border-white/10 bg-black/70 p-2.5 text-white/90 backdrop-blur-md transition hover:border-[#e3ff6b] hover:text-[#e3ff6b] active:scale-95"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </>
        )}
      </div>

      {showCaption && active && (
        <div
          key={selected}
          className="mt-4 flex flex-col items-center px-4 text-center duration-300 animate-in fade-in"
        >
          {/* Category Pill with pulsing status dot */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3.5 py-1 backdrop-blur-md mb-2">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full animate-pulse",
                active.colorType === "red" ? "bg-[#FF0D4A]" : "bg-[#e3ff6b]",
              )}
            />
            <span
              className={cn(
                "font-mono text-[10px] sm:text-xs font-bold tracking-[0.16em] uppercase",
                active.colorType === "red" ? "text-[#FF0D4A]" : "text-[#e3ff6b]",
              )}
            >
              [ {active.category || active.subtitle || "TECHNOLOGY"} ]
            </span>
          </div>

          {/* Large Bank Gothic Title with glow */}
          <h3 className="font-bank text-2xl sm:text-3xl font-bold uppercase tracking-[0.06em] text-white leading-tight drop-shadow-[0_0_20px_rgba(227,255,107,0.35)]">
            {active.title}
          </h3>

          {/* Description / Subtitle */}
          {(active.description || active.subtitle) && (
            <p className="mt-1.5 max-w-sm font-mono text-xs sm:text-sm text-neutral-300 tracking-[0.06em] uppercase leading-relaxed">
              {active.description || active.subtitle}
            </p>
          )}
        </div>
      )}

      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-1.5 flex-wrap px-4">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === selected
                  ? "w-6 bg-[#e3ff6b]"
                  : "w-1.5 bg-white/20 hover:bg-white/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CoverflowCarousel;
