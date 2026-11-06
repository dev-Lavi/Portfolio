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

    // Detect Android or small devices (< 768px)
    const checkIsAndroidOrSmallDevice = (): boolean => {
      if (typeof window === "undefined") return false;
      const isAndroid = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
      const isSmall = window.innerWidth < 768 || window.matchMedia("(max-width: 768px)").matches;
      return isAndroid || isSmall;
    };

    let isSmallOrAndroid = checkIsAndroidOrSmallDevice();

    // 1. Slowed-down custom physics specifically when Projects or Experience is in the viewport
    const SLOW_PHYSICS = {
      lerp: 0.065,
      syncTouch: isSmallOrAndroid,
      touchMultiplier: 0.72,
      wheelMultiplier: 0.60,
      touchInertiaExponent: 1.2,
      syncTouchLerp: 0.065,
    };

    // 2. Custom touch physics for all other sections on Android or small devices
    const GENERAL_CUSTOM_PHYSICS = {
      lerp: 0.095,
      syncTouch: isSmallOrAndroid,
      touchMultiplier: 1.05,
      wheelMultiplier: 1.0,
      touchInertiaExponent: 1.5,
      syncTouchLerp: 0.075,
    };

    // 3. Desktop / large device default settings (native touch if touch-enabled)
    const DESKTOP_DEFAULT_PHYSICS = {
      lerp: 0.1,
      syncTouch: false,
      touchMultiplier: 1.0,
      wheelMultiplier: 1.0,
      touchInertiaExponent: 1.7,
      syncTouchLerp: 0.075,
    };

    // Initial state
    const initialConfig = isSmallOrAndroid ? GENERAL_CUSTOM_PHYSICS : DESKTOP_DEFAULT_PHYSICS;

    const lenis = new Lenis({
      lerp: initialConfig.lerp,
      wheelMultiplier: initialConfig.wheelMultiplier,
      smoothWheel: true,
      syncTouch: initialConfig.syncTouch,
      touchMultiplier: initialConfig.touchMultiplier,
      touchInertiaExponent: initialConfig.touchInertiaExponent,
      syncTouchLerp: initialConfig.syncTouchLerp,
      autoRaf: false, // Driven directly by GSAP ticker for synchronized 60/120fps frames
    });

    (window as unknown as { lenis: Lenis }).lenis = lenis;

    // Helper: Detect if Projects or Experience section has entered the viewport
    const isSlowSectionInViewport = (): boolean => {
      if (typeof window === "undefined" || typeof document === "undefined") return false;
      const vh = window.innerHeight;
      const selectors = ["#projects", "#experience"];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= vh * 0.98 && rect.bottom >= vh * 0.05) {
          return true;
        }
      }
      return false;
    };

    // Direct touch target checks
    const isSlowTarget = (target?: EventTarget | null): boolean => {
      if (target && target instanceof Element) {
        return Boolean(target.closest("#projects, #experience, [data-section='projects'], [data-section='experience']"));
      }
      return false;
    };

    let activeMode: "slow" | "custom" | "desktop" = isSmallOrAndroid ? "custom" : "desktop";
    let wasSlowActive = false;

    const applyPhysics = (target?: EventTarget | null) => {
      const isSlow = isSlowTarget(target) || isSlowSectionInViewport();

      // Active velocity brake: gently clamp incoming momentum when entering slow sections
      if (isSlow && !wasSlowActive) {
        if (lenis.isScrolling) {
          const delta = lenis.targetScroll - lenis.animatedScroll;
          lenis.targetScroll = lenis.animatedScroll + delta * 0.3;
        }
      }
      wasSlowActive = isSlow;

      const targetMode: "slow" | "custom" | "desktop" = isSlow
        ? "slow"
        : isSmallOrAndroid
        ? "custom"
        : "desktop";

      if (targetMode === activeMode) return;
      activeMode = targetMode;

      const config = targetMode === "slow"
        ? SLOW_PHYSICS
        : targetMode === "custom"
        ? GENERAL_CUSTOM_PHYSICS
        : DESKTOP_DEFAULT_PHYSICS;

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
      isSmallOrAndroid = checkIsAndroidOrSmallDevice();
      SLOW_PHYSICS.syncTouch = isSmallOrAndroid;
      GENERAL_CUSTOM_PHYSICS.syncTouch = isSmallOrAndroid;
      ScrollTrigger.refresh();
      applyPhysics(null);
    };

    window.addEventListener("load", handleRefresh);
    window.addEventListener("resize", handleRefresh);
    if (document.fonts) {
      document.fonts.ready.then(handleRefresh);
    }

    const syncLenis = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", syncLenis);

    return () => {
      window.removeEventListener("touchstart", onTouchStartCapture, { capture: true });
      window.removeEventListener("resize", handleRefresh);
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
