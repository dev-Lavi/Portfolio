# Cool Animations Catalog & Implementation Guide

This guide documents the animation libraries, architectural patterns, and individual animation techniques extracted from the reference Web3 project (`web3projects-landing`), ready to be integrated into your portfolio landing page.

---

## 1. Animation Libraries Identified

The reference project uses a high-performance, studio-grade animation stack:

| Library | Version | Role in Landing Page |
| :--- | :--- | :--- |
| **GSAP (GreenSock)** | `^3.13.0` | **Core scroll animation engine**. Powers scroll-triggered scrubbing, pinning, timelines, and tweening. |
| **ScrollTrigger** (GSAP plugin) | `^3.13.0` | Links scroll position and viewport visibility to GSAP tweens (scrubbing, pinning, triggers). |
| **Lenis (`lenis`)** | `^1.3.26` | **Smooth momentum scrolling**. Synchronized with `gsap.ticker` to ensure buttery 60/120fps animations without jitter. |
| **Framer Motion** | `^12.23.12` | Handles declarative React component states, enter/exit animations, and interactive UI micro-interactions. |
| **React Fast Marquee** | `^1.6.5` | Seamless infinite running marquees for client logos, tech stacks, and badges. |
| **Three.js / React Three Fiber** | `^9.7.0` | 3D interactive background canvases (used in signal fields / hero fields). |

---

## 2. The Featured Animation: Stacked Deck with Depth (`SelectedWork.jsx` / `D03StackDeck.jsx`)

This is the exact animation from the reference screenshot ("Traverse VPN", "Qyuro.City").

### How It Works
1. **CSS Sticky Stacking**:
   - Each card has `position: sticky; top: 100px;` (or whatever header offset is desired).
   - As you scroll down, card `1` stops at `top: 100px` and sticks.
   - Card `2` continues scrolling up from below and begins to cover card `1`.
2. **GSAP ScrollTrigger Scrubbing**:
   - As card `2` climbs across the viewport, a GSAP tween scrubs card `1`:
     - **Scale**: `scale: 0.9` (shrinks into the background)
     - **Lift**: `yPercent: -4` (lifts subtly upwards)
     - **Dim / Lighting**: `filter: "brightness(0.86)"` starting when card `2` reaches 55% of the viewport.
   - Result: Rather than cards feeling like flat 2D sheets sliding over each other, the viewport acquires **physical 3D depth**, like an accordion or deck of cards receding into the dark backdrop.

### Reference Code
```tsx
useIsomorphicLayoutEffect(() => {
  const el = deckRef.current;
  if (!el || prefersReducedMotion()) return;

  const ctx = gsap.context(() => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return; // Top card never recedes

      // 1. Depth & Scale Tween
      gsap.to(card, {
        scale: 0.9,
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: cards[i + 1],
          start: "top bottom",
          end: "top top+=110",
          scrub: 0.5,
        },
      });

      // 2. Dimming Tween (starts when next card reaches 55% height)
      gsap.fromTo(
        card,
        { filter: "brightness(1)" },
        {
          filter: "brightness(0.82)",
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top 55%",
            end: "top top+=110",
            scrub: 0.5,
          },
        }
      );
    });
  }, el);

  return () => ctx.revert();
}, []);
```

---

## 3. Other Cool Animations from the Web3 Landing

### 3.1. Lenis Smooth Momentum Scrolling (`SmoothScrollProvider.jsx`)
Standard browser scrolling can be choppy or jumpy, causing ScrollTrigger scrubs to stutter. Lenis intercepts the wheel and provides cinematic momentum, driven by GSAP's single animation loop:
```tsx
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "gsap";

const lenis = new Lenis({
  lerp: 0.12,         // Smooth catch-up factor
  wheelMultiplier: 1,
  smoothWheel: true,
  syncTouch: false,   // Native touch scrolling for iOS/Android
  autoRaf: false,     // Let GSAP drive the loop
});

// Pipe GSAP ticker to Lenis
const raf = (time: number) => lenis.raf(time * 1000);
gsap.ticker.add(raf);
gsap.ticker.lagSmoothing(0);
```

### 3.2. Magnetic Pointer Pull (`MagneticButton.jsx` / `D09TextAndMagnet.jsx`)
Interactive buttons or badges that lean smoothly toward the user's cursor when hovered, snapping back with an elastic physics spring on leave:
```tsx
const onMove = (e: React.MouseEvent<HTMLElement>) => {
  const r = shellRef.current.getBoundingClientRect();
  const x = (e.clientX - (r.left + r.width / 2)) * 0.35;
  const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
  gsap.to(shellRef.current, { x, y, duration: 0.7, ease: "power3.out" });
  gsap.to(innerRef.current, { x: x * 0.35, y: y * 0.35, duration: 0.7, ease: "power3.out" });
};

const onLeave = () => {
  gsap.to([shellRef.current, innerRef.current], {
    x: 0,
    y: 0,
    duration: 0.9,
    ease: "elastic.out(1, 0.4)",
  });
};
```
*Best for: "GitHub", "Live Demo", "Contact", and CTA buttons.*

### 3.3. Horizontal Pinned Scroll Showcase (`D02HorizontalPin.jsx`)
Pins the viewport in place while vertical scrolling translates horizontally across a wide track:
```tsx
const mm = gsap.matchMedia();
mm.add("(min-width: 768px)", () => {
  const distance = () => track.scrollWidth - window.innerWidth;
  gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: wrapper,
      start: "top top",
      end: () => "+=" + distance(),
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
});
```
*Best for: Motorcycle Showcase gallery or Skills timeline.*

### 3.4. Clip-Path Window Reveal with Counter-Parallax (`D04ClipReveal.jsx`)
Cards or project preview frames wipe open vertically via `clip-path` while the media inside gently pans the opposite direction:
```tsx
gsap.fromTo(
  frame,
  { clipPath: "inset(0% 0% 100% 0%)" },
  {
    clipPath: "inset(0% 0% 0% 0%)",
    duration: 1.4,
    ease: "expo.out",
    scrollTrigger: { trigger: frame, start: "top 82%", once: true },
  }
);
gsap.fromTo(
  media,
  { yPercent: -12, scale: 1.2 },
  {
    yPercent: 0,
    scale: 1,
    duration: 1.4,
    ease: "expo.out",
    scrollTrigger: { trigger: frame, start: "top 82%", once: true },
  }
);
```

### 3.5. Scroll-Scrubbed Number Counters (`D05ScrubCounters.jsx`)
Metrics (e.g. `20+ Projects Delivered`, `4+ Years Experience`, `100% Uptime`) that count up and down directly synced to the user's scrollbar.

### 3.6. Theme Morphing Surface (`ThemeMorph.jsx` / `D08ThemeMorph.jsx`)
Seamlessly morphs background and foreground colors across different sections as you scroll, removing harsh line breaks between dark and light sections.

---

## 4. Recommended Step-by-Step Plan for `my-portfolio`

1. **Install GSAP and Lenis**:
   ```bash
   npm install gsap lenis
   ```
2. **Setup GSAP utility helper**:
   Create `app/lib/gsap.ts` with SSR-safe `ScrollTrigger` registration.
3. **Upgrade `Projects.tsx`**:
   Replace the current simple list with the **Sticky Stacked Deck** matching the reference design, retaining all your existing projects (`CarbonSetu`, `TVIC`, `Laksh Closet`), with custom neon borders, tags, descriptions, and magnetic preview buttons.
4. **Wrap in Smooth Scrolling**:
   Add `SmoothScrollProvider` in `layout.tsx` so the entire portfolio feels weighted and responsive.
