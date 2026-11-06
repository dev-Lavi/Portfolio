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

    // Slowed-down scroll physics specifically for Projects and Experience sections
    const SLOW_PHYSICS = {
      lerp: 0.065,              // Higher fluid damping for a heavy, deliberate, smooth feel
      syncTouch: true,
      touchMultiplier: 0.72,    // Slows down touch swipe distance by ~28%
      wheelMultiplier: 0.60,    // Slows down mouse wheel / trackpad scroll by 40%
      touchInertiaExponent: 1.2,// Softens fling momentum so sections don't whip past
      syncTouchLerp: 0.065,
    };

    // Smooth physics for About section
    const ABOUT_PHYSICS = {
      lerp: 0.095,
      syncTouch: true,
      touchMultiplier: 1.0,
      wheelMultiplier: 1.0,
      touchInertiaExponent: 1.5,
      syncTouchLerp: 0.075,
    };

    // Default native phone touch physics for all other sections
    const NATIVE_TOUCH_PHYSICS = {
      lerp: 0.1,
      syncTouch: false,
      touchMultiplier: 1.0,
      wheelMultiplier: 1.0,
      touchInertiaExponent: 1.7,
      syncTouchLerp: 0.075,
    };

    // Initial state: default native touch physics for general sections
    const lenis = new Lenis({
      lerp: NATIVE_TOUCH_PHYSICS.lerp,
      wheelMultiplier: NATIVE_TOUCH_PHYSICS.wheelMultiplier,
      smoothWheel: true,
      syncTouch: NATIVE_TOUCH_PHYSICS.syncTouch,
      touchMultiplier: NATIVE_TOUCH_PHYSICS.touchMultiplier,
      touchInertiaExponent: NATIVE_TOUCH_PHYSICS.touchInertiaExponent,
      syncTouchLerp: NATIVE_TOUCH_PHYSICS.syncTouchLerp,
      autoRaf: false, // Driven directly by GSAP ticker for synchronized 60/120fps frames
    });

    (window as unknown as { lenis: Lenis }).lenis = lenis;

    // Helper: Detect if Projects or Experience section has entered the viewport
    // Triggers "as soon as projects section or experience section comes in the viewport"
    const isSlowSectionInViewport = (): boolean => {
      if (typeof window === "undefined" || typeof document === "undefined") return false;
      const vh = window.innerHeight;
      const selectors = ["#projects", "#experience"];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // As soon as the top edge of the section enters the bottom of the viewport (top <= vh * 0.98)
        // and stays active until the bottom edge leaves the top (bottom >= vh * 0.05)
        if (rect.top <= vh * 0.98 && rect.bottom >= vh * 0.05) {
          return true;
        }
      }
      return false;
    };

    // Helper: Detect if About section is in viewport
    const isAboutSectionInViewport = (): boolean => {
      if (typeof window === "undefined" || typeof document === "undefined") return false;
      const el = document.querySelector("#about");
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return rect.top <= vh * 0.85 && rect.bottom >= vh * 0.15;
    };

    // Direct touch target checks
    const isSlowTarget = (target?: EventTarget | null): boolean => {
      if (target && target instanceof Element) {
        return Boolean(target.closest("#projects, #experience, [data-section='projects'], [data-section='experience']"));
      }
      return false;
    };

    const isAboutTarget = (target?: EventTarget | null): boolean => {
      if (target && target instanceof Element) {
        return Boolean(target.closest("#about, [data-section='about']"));
      }
      return false;
    };

    let activeMode: "slow" | "about" | "native" = "native";
    let wasSlowActive = false;

    const applyPhysics = (target?: EventTarget | null) => {
      const isSlow = isSlowTarget(target) || isSlowSectionInViewport();
      const isAbout = !isSlow && (isAboutTarget(target) || isAboutSectionInViewport());

      // Active velocity brake: as soon as entering the slow section with momentum,
      // gently clamp the remaining scroll momentum so the user doesn't fly through the cards/canvas
      if (isSlow && !wasSlowActive) {
        if (lenis.isScrolling) {
          const delta = lenis.targetScroll - lenis.animatedScroll;
          lenis.targetScroll = lenis.animatedScroll + delta * 0.3;
        }
      }
      wasSlowActive = isSlow;

      const targetMode: "slow" | "about" | "native" = isSlow ? "slow" : isAbout ? "about" : "native";
      if (targetMode === activeMode) return;
      activeMode = targetMode;

      const config = targetMode === "slow" ? SLOW_PHYSICS : targetMode === "about" ? ABOUT_PHYSICS : NATIVE_TOUCH_PHYSICS;

      lenis.options.syncTouch = config.syncTouch;
      lenis.options.touchMultiplier = config.touchMultiplier;
      lenis.options.wheelMultiplier = config.wheelMultiplier;
      lenis.options.touchInertiaExponent = config.touchInertiaExponent;
      lenis.options.syncTouchLerp = config.syncTouchLerp;
      lenis.options.lerp = config.lerp;

      // Synchronize Lenis's internal VirtualScroll instance options
      const virtualScroll = (lenis as unknown as { virtualScroll?: { options?: { touchMultiplier?: number; wheelMultiplier?: number } } }).virtualScroll;
      if (virtualScroll?.options) {
        virtualScroll.options.touchMultiplier = config.touchMultiplier;
        virtualScroll.options.wheelMultiplier = config.wheelMultiplier;
      }
    };

    // Capture phase touchstart listener guarantees physics is configured BEFORE Lenis or browser handles touch
    const onTouchStartCapture = (e: TouchEvent) => {
      applyPhysics(e.target);
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

      // Dynamically detect boundary and slow down as soon as projects or experience enters
      applyPhysics(null);
    };

    lenis.on("scroll", onScroll);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const handleRefresh = () => {
      ScrollTrigger.refresh();
      applyPhysics(null);
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
