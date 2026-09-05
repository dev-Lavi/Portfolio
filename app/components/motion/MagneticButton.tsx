"use client";

import React, { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/app/lib/gsap";

interface MagneticButtonProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  strength?: number;
  innerStrength?: number;
  children: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

export default function MagneticButton({
  as: Component = "button",
  strength = 0.35,
  innerStrength = 0.45,
  className = "",
  style,
  children,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const shellRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    onMouseMove?.(e);
    if (prefersReducedMotion() || !shellRef.current) return;

    const rect = shellRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;

    gsap.to(shellRef.current, {
      x,
      y,
      duration: 0.6,
      ease: "power3.out",
    });

    if (innerRef.current) {
      gsap.to(innerRef.current, {
        x: x * innerStrength,
        y: y * innerStrength,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    onMouseLeave?.(e);
    if (!shellRef.current) return;

    gsap.to(shellRef.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.35)",
    });

    if (innerRef.current) {
      gsap.to(innerRef.current, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.35)",
      });
    }
  };

  return (
    <Component
      ref={shellRef}
      className={className}
      style={{
        display: "inline-block",
        willChange: "transform",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span
        ref={innerRef}
        style={{
          display: "inline-flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
          willChange: "transform",
        }}
      >
        {children}
      </span>
    </Component>
  );
}
