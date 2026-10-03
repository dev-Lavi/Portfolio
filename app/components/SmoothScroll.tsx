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

    // Detect Android or small width devices to decrease scroll speed
    const isAndroid = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
    const isSmallDevice = typeof window !== "undefined" && (window.innerWidth < 768 || window.matchMedia("(max-width: 768px)").matches);
    const isTouchDamped = isAndroid || isSmallDevice;

    const lenis = new Lenis({
      lerp: isTouchDamped ? 0.095 : 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: isTouchDamped, // Synchronize touch for Android and small-width screens
      touchMultiplier: isTouchDamped ? 0.88 : 1, // Responsive touch scroll speed on Android & small devices
      touchInertiaExponent: isTouchDamped ? 1.3 : 1.7, // Tames aggressive fling momentum
      syncTouchLerp: isTouchDamped ? 0.075 : 0.075,
      autoRaf: false,   // Driven directly by GSAP ticker for synchronized 60/120fps frames
    });

    (window as unknown as { lenis: Lenis }).lenis = lenis;

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
    };

    lenis.on("scroll", onScroll);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", handleRefresh);
    if (document.fonts) {
      document.fonts.ready.then(handleRefresh);
    }

    const syncLenis = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", syncLenis);

    return () => {
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
