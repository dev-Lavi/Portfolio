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

    // 1. Projects physics for small devices:
    // Calibrated so that on mobile phones, each card is stacked in EXACTLY 2 swipes/scrolls
    const PROJECTS_PHYSICS = {
      lerp: 0.085,
      syncTouch: isSmallOrAndroid,
      touchMultiplier: 1.48,
      wheelMultiplier: 0.85,
      touchInertiaExponent: 1.55,
      syncTouchLerp: 0.085,
    };

    // 2. Experience physics for small devices:
    // Cinematic motorcycle sequence scrubbing across 234 frames
    const EXPERIENCE_PHYSICS = {
      lerp: 0.065,
      syncTouch: isSmallOrAndroid,
      touchMultiplier: 0.72,
      wheelMultiplier: 0.60,
      touchInertiaExponent: 1.2,
      syncTouchLerp: 0.065,
    };

    // 3. Last sections physics for small devices (Deployment, Skills, Contact, Footer):
    // Fluid, highly responsive 60/120fps with zero lag
    const LAST_SECTIONS_PHYSICS = {
      lerp: 0.12,
      syncTouch: isSmallOrAndroid,
      touchMultiplier: 1.15,
      wheelMultiplier: 1.0,
      touchInertiaExponent: 1.7,
      syncTouchLerp: 0.11,
    };

    // 4. General custom touch physics for earlier sections on Android or small devices
    const GENERAL_CUSTOM_PHYSICS = {
      lerp: 0.095,
      syncTouch: isSmallOrAndroid,
      touchMultiplier: 1.05,
      wheelMultiplier: 1.0,
      touchInertiaExponent: 1.5,
      syncTouchLerp: 0.085,
    };

    // 5. Desktop / large device default settings (native touch if touch-enabled)
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

    // Cached document-relative boundaries — measured on load/resize, NEVER on every scroll event
    const bounds = {
      projectsTop: 0,
      projectsBottom: 0,
      experienceTop: 0,
      experienceBottom: 0,
      lastSectionsTop: 0,
    };

    const updateBounds = () => {
      if (typeof window === "undefined" || typeof document === "undefined") return;
      const scrollY = window.scrollY || window.pageYOffset || 0;

      const projEl = document.querySelector("#projects");
      if (projEl) {
        const rect = projEl.getBoundingClientRect();
        bounds.projectsTop = rect.top + scrollY;
        bounds.projectsBottom = rect.bottom + scrollY;
      }

      const expEl = document.querySelector("#experience");
      if (expEl) {
        const rect = expEl.getBoundingClientRect();
        bounds.experienceTop = rect.top + scrollY;
        bounds.experienceBottom = rect.bottom + scrollY;
      }

      const depEl = document.querySelector("#deployment");
      if (depEl) {
        const rect = depEl.getBoundingClientRect();
        bounds.lastSectionsTop = rect.top + scrollY;
      }
    };

    // Determine target physics mode based on touch target or viewport position
    const getTargetMode = (target?: EventTarget | null): "projects" | "experience" | "last" | "general" | "desktop" => {
      if (!isSmallOrAndroid) return "desktop";

      // 1. Direct touch target check (instantaneous, 0ms latency)
      if (target && target instanceof Element) {
        if (target.closest("#projects, [data-section='projects']")) return "projects";
        if (target.closest("#experience, [data-section='experience']")) return "experience";
        if (target.closest("#deployment, #skills, #contact, #footer")) return "last";
      }

      const scrollY = lenis.scroll;
      const vh = window.innerHeight;

      // 2. Viewport range checks against cached boundaries (O(1) numerical comparison)
      if (
        bounds.projectsBottom > 0 &&
        scrollY + vh * 0.95 >= bounds.projectsTop &&
        scrollY + vh * 0.05 <= bounds.projectsBottom
      ) {
        return "projects";
      }

      if (
        bounds.experienceBottom > 0 &&
        scrollY + vh * 0.95 >= bounds.experienceTop &&
        scrollY + vh * 0.05 <= bounds.experienceBottom
      ) {
        return "experience";
      }

      if (
        bounds.lastSectionsTop > 0 &&
        scrollY + vh * 0.85 >= bounds.lastSectionsTop
      ) {
        return "last";
      }

      return "general";
    };

    type PhysicsMode = "projects" | "experience" | "last" | "general" | "desktop";
    let activeMode: PhysicsMode = isSmallOrAndroid ? "general" : "desktop";
    let wasSlowActive = false;

    const applyPhysics = (target?: EventTarget | null) => {
      const targetMode = getTargetMode(target);

      const isSlow = targetMode === "projects" || targetMode === "experience";
      if (isSlow && !wasSlowActive) {
        if (lenis.isScrolling) {
          const delta = lenis.targetScroll - lenis.animatedScroll;
          lenis.targetScroll = lenis.animatedScroll + delta * 0.3;
        }
      }
      wasSlowActive = isSlow;

      if (targetMode === activeMode) return;
      activeMode = targetMode;

      const config =
        targetMode === "projects"
          ? PROJECTS_PHYSICS
          : targetMode === "experience"
          ? EXPERIENCE_PHYSICS
          : targetMode === "last"
          ? LAST_SECTIONS_PHYSICS
          : targetMode === "general"
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

    const onScroll = () => {
      ScrollTrigger.update();
      // O(1) comparison against cached bounds — zero getBoundingClientRect / zero forced reflow
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
      PROJECTS_PHYSICS.syncTouch = isSmallOrAndroid;
      EXPERIENCE_PHYSICS.syncTouch = isSmallOrAndroid;
      LAST_SECTIONS_PHYSICS.syncTouch = isSmallOrAndroid;
      GENERAL_CUSTOM_PHYSICS.syncTouch = isSmallOrAndroid;
      updateBounds();
      ScrollTrigger.refresh();
      applyPhysics(null);
    };

    updateBounds();
    window.addEventListener("load", handleRefresh);
    window.addEventListener("resize", handleRefresh);
    if (document.fonts) {
      document.fonts.ready.then(handleRefresh);
    }

    const syncLenis = () => {
      updateBounds();
      lenis.resize();
    };
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
