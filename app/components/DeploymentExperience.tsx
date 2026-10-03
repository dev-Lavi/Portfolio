"use client";

import React from "react";
import CssImageStacking, { StackingImageItem } from "./ui/CssImageStacking";

const DEPLOYMENT_IMAGES: readonly StackingImageItem[] = [
  {
    id: "aws-architecture",
    src: "/deployment/aws-architecture.webp",
    alt: "AWS Cost Explorer & Multi-Service Architecture Management",
    tag: "AWS Cloud Infrastructure & Cost Governance",
  },
  {
    id: "render-services",
    src: "/deployment/render-services.webp",
    alt: "Render Cloud Platform 25 Microservices Management",
    tag: "Render Cloud Microservices & Zero-Downtime CI/CD",
  },
  {
    id: "vercel-edge-network",
    src: "/deployment/vercel-edge-network.webp",
    alt: "Vercel Global Edge Network Fast Data Transfer",
    tag: "Vercel Multi-Region Edge CDN & Routing",
  },
  {
    id: "vercel-cdn-requests",
    src: "/deployment/vercel-cdn-requests.webp",
    alt: "Vercel CDN Observability & Traffic Telemetry",
    tag: "Vercel CDN Telemetry & Traffic Management",
  },
  {
    id: "google-play-console",
    src: "/deployment/google-play-console.webp",
    alt: "Google Play Console Android Vitals & Production Release Experience",
    tag: "Google Play Console Production Vitals & Release Management",
  },
];

export default function DeploymentExperience() {
  return (
    <div className="relative w-full bg-[#070b05] text-white">
      {/* Background Ambient Glow & Blueprint Grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] max-w-full rounded-full bg-[#e3ff6b]/[0.03] blur-[150px]" />
        <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-emerald-500/[0.02] blur-[120px]" />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:54px_54px]"
          style={{
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, #000 60%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, #000 60%, transparent 100%)",
          }}
        />
      </div>

      {/* Section Sticky Header */}
      <div className="w-full pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e3ff6b] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e3ff6b]" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#e3ff6b] font-semibold">
            PRODUCTION OPERATIONS & PLATFORM MANAGEMENT
          </span>
        </div>

        <h2 className="font-bank text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white leading-tight max-w-4xl">
          AWS, HOSTING & APPLICATION DEPLOYMENTS
        </h2>

        <p className="mt-4 font-mono text-xs sm:text-sm text-white/50 tracking-wider uppercase flex items-center gap-2">
          <span>Scroll to explore hands-on experience managing and scaling these live applications</span>
          <span className="text-[#e3ff6b] animate-bounce">↓</span>
        </p>
      </div>

      {/* CSS Sticky Stacking Images Showcase — Pure images, no side text */}
      <section className="relative w-full pb-28 sm:pb-36">
        <CssImageStacking images={DEPLOYMENT_IMAGES} />
      </section>
    </div>
  );
}
