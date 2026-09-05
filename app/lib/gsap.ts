"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useEffect } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Expose to window in development for trigger debugging
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as { __gsap: typeof gsap; __ScrollTrigger: typeof ScrollTrigger }).__gsap = gsap;
    (window as unknown as { __gsap: typeof gsap; __ScrollTrigger: typeof ScrollTrigger }).__ScrollTrigger = ScrollTrigger;
  }
}

/** useLayoutEffect on client, useEffect on server to suppress SSR hydration warnings */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Respect OS reduced motion preference */
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };
