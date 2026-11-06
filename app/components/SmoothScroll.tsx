"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/app/lib/gsap";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Custom physics specification for Projects and Experience sections
    const CUSTOM_PHYSICS = {
      lerp: 0.095,
      syncTouch: true,
      touchMultiplier: 0.88,
      touchInertiaExponent: 1.3,
      syncTouchLerp: 0.075,
    };

    // Default native phone touch physics for all other sections
    const NATIVE_TOUCH_PHYSICS = {
      lerp: 0.1,
      syncTouch: false,
      touchMultiplier: 1,
      touchInertiaExponent: 1.7,
      syncTouchLerp: 0.075,
    };

    // Initial state: default native touch physics for general sections
    const lenis = new Lenis({
      lerp: NATIVE_TOUCH_PHYSICS.lerp,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: NATIVE_TOUCH_PHYSICS.syncTouch,
      touchMultiplier: NATIVE_TOUCH_PHYSICS.touchMultiplier,
      touchInertiaExponent: NATIVE_TOUCH_PHYSICS.touchInertiaExponent,
      syncTouchLerp: NATIVE_TOUCH_PHYSICS.syncTouchLerp,
      autoRaf: false, // Driven directly by GSAP ticker for synchronized 60/120fps frames
    });

    (window as unknown as { lenis: Lenis }).lenis = lenis;

    // Helper: Determine if a touch target or current viewport is within Projects or Experience
    const checkIsCustomSection = (target?: EventTarget | null): boolean => {
      if (typeof window === "undefined" || typeof document === "undefined") return false;

      // 1. Direct Touch Target Check:
      // If the touch event occurred directly on or inside #projects or #experience
      if (target && target instanceof Element) {
        if (target.closest("#projects, #experience, [data-section='projects'], [data-section='experience']")) {
          return true;
        }
      }

      // 2. Viewport Scroll Position Check:
      // Determine if either section currently occupies the active interactive viewport region
      const vh = window.innerHeight;
      const isTargetInViewport = (selector: string): boolean => {
        const elements = document.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
          const rect = elements[i].getBoundingClientRect();
          if (rect.top <= vh * 0.7 && rect.bottom >= vh * 0.25) {
            return true;
          }
        }
        return false;
      };

      return isTargetInViewport("#projects") || isTargetInViewport("#experience");
    };

    let isCustomActive = false;
    const applyPhysics = (isCustom: boolean) => {
      if (isCustom === isCustomActive) return;
      isCustomActive = isCustom;

      const config = isCustom ? CUSTOM_PHYSICS : NATIVE_TOUCH_PHYSICS;

      lenis.options.syncTouch = config.syncTouch;
      lenis.options.touchMultiplier = config.touchMultiplier;
      lenis.options.touchInertiaExponent = config.touchInertiaExponent;
      lenis.options.syncTouchLerp = config.syncTouchLerp;
      lenis.options.lerp = config.lerp;

      // Synchronize Lenis's internal VirtualScroll instance options
      const virtualScroll = (lenis as unknown as { virtualScroll?: { options?: { touchMultiplier?: number } } }).virtualScroll;
      if (virtualScroll?.options) {
        virtualScroll.options.touchMultiplier = config.touchMultiplier;
      }
    };

    // Capture phase touchstart listener guarantees physics is configured BEFORE Lenis or browser handles touch
    const onTouchStartCapture = (e: TouchEvent) => {
      const isCustom = checkIsCustomSection(e.target);
      applyPhysics(isCustom);
    };

    window.addEventListener("touchstart", onTouchStartCapture, { capture: true, passive: true });

    const onScroll = (e: { velocity: number; direction: number }) => {
      ScrollTrigger.update();
      document.documentElement.style.setProperty(
        "--scroll-velocity",
        String(e.velocity.toFixed(3))
      );
      document.documentElement.style.setProperty(
        "--scroll-direction",
        String(e.direction)
      );

      // Pre-arm the physics based on viewport position during scroll
      applyPhysics(checkIsCustomSection(null));
    };

    lenis.on("scroll", onScroll);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const handleRefresh = () => {
      ScrollTrigger.refresh();
      applyPhysics(checkIsCustomSection(null));
    };

    window.addEventListener("load", handleRefresh);
    if (document.fonts) {
      document.fonts.ready.then(handleRefresh);
    }

    const syncLenis = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", syncLenis);

    return () => {
      window.removeEventListener("touchstart", onTouchStartCapture, { capture: true });
      lenis.off("scroll", onScroll);
      window.removeEventListener("load", handleRefresh);
      ScrollTrigger.removeEventListener("refresh", syncLenis);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return <>{children}</>;
}
