"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface MouseState {
  x: number;
  y: number;
  smoothX: number;
  smoothY: number;
  diff: number;
  lastSpawnX: number;
  lastSpawnY: number;
}

interface HeroRevealBackgroundProps {
  videoSrc?: string;
  imageSrc?: string;
  /**
   * "lo-fi": stylized cyber treatment with slight pixelation, CRT texture, and contrast
   * "pixelated": aggressive retro pixelation (decreased reveal quality)
   * "standard": clean photo resolution
   */
  qualityMode?: "lo-fi" | "pixelated" | "standard";
  className?: string;
}

class RevealParticle {
  size: number;
  x: number;
  y: number;
  el: SVGCircleElement;
  timeline: gsap.core.Timeline;

  constructor(
    x: number,
    y: number,
    targetSize: number,
    wrapper: SVGGElement,
    onKill: (p: RevealParticle) => void
  ) {
    this.x = x;
    this.y = y;
    // Controlled reveal size (scaled down from original 200px to maintain tight, crisp reveal)
    this.size = Math.min(Math.max(targetSize, 22), 58);

    this.el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.el.setAttribute("cx", this.x.toFixed(1));
    this.el.setAttribute("cy", this.y.toFixed(1));
    this.el.setAttribute("r", "0");
    this.el.setAttribute("fill", "#ffffff");

    wrapper.appendChild(this.el);

    this.timeline = gsap.timeline({
      onComplete: () => {
        this.destroy();
        onKill(this);
      },
    });

    // Expand quickly and dynamically with smooth overshoot
    this.timeline
      .to(this, {
        size: this.size * 1.25,
        duration: 0.32,
        ease: "power2.out",
        onUpdate: () => {
          if (this.el) {
            this.el.setAttribute("r", Math.max(0, this.size).toFixed(1));
          }
        },
      })
      // Snappy decay so the reveal doesn't flood the whole screen
      .to(
        this,
        {
          size: 0,
          duration: 1.35,
          ease: "power3.in",
          onUpdate: () => {
            if (this.el) {
              this.el.setAttribute("r", Math.max(0, this.size).toFixed(1));
            }
          },
        },
        "+=0.15"
      );
  }

  destroy() {
    this.timeline.kill();
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }
}

export default function HeroRevealBackground({
  videoSrc = "/images/ascii-art-21st.mp4",
  imageSrc = "/images/background_no_glitch.jpg",
  qualityMode = "lo-fi",
  className = "",
}: HeroRevealBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<SVGGElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const particlesRef = useRef<RevealParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const isHoveringRef = useRef<boolean>(false);

  const mouseRef = useRef<MouseState>({
    x: -1000,
    y: -1000,
    smoothX: -1000,
    smoothY: -1000,
    diff: 0,
    lastSpawnX: -1000,
    lastSpawnY: -1000,
  });

  const [svgSize, setSvgSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    // Ensure video autoplays safely
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback if browser policy delays autoplay
      });
    }

    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      if (container) {
        const rect = container.getBoundingClientRect();
        setSvgSize({
          width: Math.ceil(rect.width) || window.innerWidth,
          height: Math.ceil(rect.height) || window.innerHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const onPointerMove = (clientX: number, clientY: number) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;

      if (
        relX >= 0 &&
        relX <= rect.width &&
        relY >= 0 &&
        relY <= rect.height
      ) {
        isHoveringRef.current = true;
        const mouse = mouseRef.current;
        if (mouse.x === -1000) {
          mouse.x = relX;
          mouse.y = relY;
          mouse.smoothX = relX;
          mouse.smoothY = relY;
          mouse.lastSpawnX = relX;
          mouse.lastSpawnY = relY;
        } else {
          mouse.x = relX;
          mouse.y = relY;
        }
      } else {
        isHoveringRef.current = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      onPointerMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handlePointerLeave = () => {
      isHoveringRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    const removeParticle = (p: RevealParticle) => {
      const idx = particlesRef.current.indexOf(p);
      if (idx > -1) {
        particlesRef.current.splice(idx, 1);
      }
    };

    // Render loop with distance-based particle emission
    const loop = () => {
      const mouse = mouseRef.current;

      // Smooth cursor interpolation
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.2;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.2;
      mouse.diff = Math.hypot(mouse.x - mouse.smoothX, mouse.y - mouse.smoothY);

      if (isHoveringRef.current && wrapperRef.current) {
        const distFromLast = Math.hypot(
          mouse.smoothX - mouse.lastSpawnX,
          mouse.smoothY - mouse.lastSpawnY
        );

        // Throttle emissions by distance to prevent DOM bloating and maintain 60/120fps
        // "Decrease reveal quality / quantity": controlled radius and max cap
        if (distFromLast > 12 || (mouse.diff > 2 && distFromLast > 8)) {
          // Cap total active particles at 35 to prevent any frame drops
          if (particlesRef.current.length >= 35) {
            const oldest = particlesRef.current.shift();
            if (oldest) oldest.destroy();
          }

          const particleRadius = Math.min(mouse.diff * 0.35 + 18, 52);
          const particle = new RevealParticle(
            mouse.smoothX,
            mouse.smoothY,
            particleRadius,
            wrapperRef.current,
            removeParticle
          );
          particlesRef.current.push(particle);

          mouse.lastSpawnX = mouse.smoothX;
          mouse.lastSpawnY = mouse.smoothY;
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseleave", handlePointerLeave);

      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }

      // Memory cleanup: destroy all active particle timelines & nodes
      particlesRef.current.forEach((p) => p.destroy());
      particlesRef.current = [];
    };
  }, []);

  // Visual styling to decrease reveal quality for the photo (lo-fi / pixelated / retro)
  const getImageStyle = () => {
    switch (qualityMode) {
      case "pixelated":
        return {
          imageRendering: "pixelated" as const,
          filter: "contrast(1.2) saturate(1.1) brightness(0.95)",
        };
      case "lo-fi":
        return {
          imageRendering: "pixelated" as const,
          filter:
            "contrast(1.12) brightness(0.92) saturate(1.05) hue-rotate(-2deg)",
        };
      case "standard":
      default:
        return {
          filter: "brightness(0.98)",
        };
    }
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none ${className}`}
      style={{ backgroundColor: "#060906" }}
    >
      {/* 1. Underlying ASCII Glitch Video Loop */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* 2. SVG Cursor Gooey Mask & Revealed Background Photo */}
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gooey filter: stdDeviation=14 gives a tight, refined liquid droplet effect */}
          <filter
            id="hero-gooey-reveal"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -7"
              result="goo"
            />
          </filter>

          {/* Mask definition: black is hidden, gooey white particles reveal */}
          <mask id="hero-reveal-mask" maskUnits="userSpaceOnUse">
            <rect
              x="0"
              y="0"
              width={svgSize.width}
              height={svgSize.height}
              fill="#000000"
            />
            <g ref={wrapperRef} filter="url(#hero-gooey-reveal)" />
          </mask>
        </defs>

        {/* Revealed Image: uses xMidYMid slice which exactly matches HTML video object-cover */}
        <image
          href={imageSrc}
          x="0"
          y="0"
          width={svgSize.width}
          height={svgSize.height}
          preserveAspectRatio="xMidYMid slice"
          mask="url(#hero-reveal-mask)"
          style={getImageStyle()}
          className="transition-opacity duration-300"
        />
      </svg>

      {/* 3. Subtle Cyber Grid & Scanline Overlay (brings the hacker terminal vibe together) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(#e3ff6b 1px, transparent 1px),
            linear-gradient(90deg, #e3ff6b 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* 4. Subtle Vignette Shadow to emphasize center avatar */}
      <div className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-50" />
    </div>
  );
}
