"use client";

import React from "react";

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export interface FlowButtonProps {
  text?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

export function FlowButton({
  text = "Submit Message",
  type = "submit",
  disabled = false,
  className = "",
}: FlowButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`group relative flex items-center justify-center gap-1 overflow-hidden rounded-[100px] border-2 border-[#D6003C]/70 bg-transparent px-8 py-3.5 text-sm font-bank font-bold uppercase tracking-[0.16em] text-[#111111] cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[#D6003C] hover:text-white hover:rounded-[14px] active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${className}`}
    >
      {/* Left arrow (arr-2) */}
      <ArrowRightIcon
        className="absolute w-4 h-4 left-[-25%] stroke-[#111111] fill-none z-[9] group-hover:left-4 group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      />

      {/* Text */}
      <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
        {text}
      </span>

      {/* Circle expanding wave */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#D6003C] rounded-[50%] opacity-0 group-hover:w-[320px] group-hover:h-[320px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
      />

      {/* Right arrow (arr-1) */}
      <ArrowRightIcon
        className="absolute w-4 h-4 right-4 stroke-[#111111] fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      />
    </button>
  );
}
