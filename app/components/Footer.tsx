// app/components/Footer.tsx
"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setLocalTime(timeString);
    };

    updateTime(); // initial call
    const interval = setInterval(updateTime, 1000 * 30); // update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-[#10140d] px-0 py-12 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-none px-4 sm:px-6 md:px-8">
        {/* Heading */}
        <h2
          className="
            mb-8 text-left
            text-[32px] sm:text-[40px] md:text-[48px]
            font-bank uppercase tracking-[0.28em]
            text-[#e3ff6b]
          "
        >
          CONTACT ME
        </h2>

        {/* Name box */}
        <div
          className="
            mb-8 w-full max-w-none
            rounded-t-[1.8rem] rounded-b-[1.8rem]
            border border-[#d2c9a0]/60
            bg-[#e2dcb2]
            px-4 py-8
            sm:px-8 sm:py-10
            md:px-12 md:py-12
            shadow-[0_20px_60px_rgba(0,0,0,0.5)]
          "
        >
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            {/* Hindi */}
            <p
              className="
                text-[40px] sm:text-[56px] md:text-[72px]
                text-[#9b2420]
                tracking-[0.05em]
                drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]
              "
            >
              लावी
            </p>

            {/* English + Japanese */}
            <div className="flex items-center gap-4">
              <p
                className="
                  text-[22px] sm:text-[28px] md:text-[34px]
                  font-bank uppercase tracking-[0.22em]
                  text-[#11140b]
                "
              >
                LAVI
              </p>
              <p
                className="
                  text-[40px] sm:text-[56px] md:text-[72px]
                  text-[#9b2420]
                  tracking-[0.04em]
                  drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                "
              >
                ラヴィ
              </p>
            </div>
          </div>
        </div>

        {/* Made with + social + time */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Left: Made with */}
          <p
            className="
              text-[12px] sm:text-[13px] md:text-[14px]
              font-bank uppercase tracking-[0.24em]
              text-[#a7b693]
            "
          >
            Made with love and Next.js in Delhi, India
          </p>

          {/* Right: Social buttons + Local time */}
          <div className="flex items-center gap-6 sm:gap-8">
            {/* Social buttons */}
            <div className="flex items-center gap-2">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noreferrer"
                className="
                  rounded-full border border-[#e3ff6b]
                  bg-transparent p-2
                  transition-all duration-300
                  hover:bg-[#e3ff6b]
                  hover:text-[#11140b]
                  hover:scale-110
                "
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5 fill-current text-[#e3ff6b]" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.065 0 1.139-.925 2.065-2.064 2.065-1.143 0-2.063-.926-2.063-2.065z"/>
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/your-username"
                target="_blank"
                rel="noreferrer"
                className="
                  rounded-full border border-[#e3ff6b]
                  bg-transparent p-2
                  transition-all duration-300
                  hover:bg-[#e3ff6b]
                  hover:text-[#11140b]
                  hover:scale-110
                "
                aria-label="GitHub"
              >
                <svg className="h-5 w-5 fill-current text-[#e3ff6b]" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.185 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>

              {/* Twitter/X */}
              <a
                href="https://twitter.com/your-profile"
                target="_blank"
                rel="noreferrer"
                className="
                  rounded-full border border-[#e3ff6b]
                  bg-transparent p-2
                  transition-all duration-300
                  hover:bg-[#e3ff6b]
                  hover:text-[#11140b]
                  hover:scale-110
                "
                aria-label="Twitter"
              >
                <svg className="h-5 w-5 fill-current text-[#e3ff6b]" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/your-profile"
                target="_blank"
                rel="noreferrer"
                className="
                  rounded-full border border-[#e3ff6b]
                  bg-transparent p-2
                  transition-all duration-300
                  hover:bg-[#e3ff6b]
                  hover:text-[#11140b]
                  hover:scale-110
                "
                aria-label="Instagram"
              >
                <svg className="h-5 w-5 fill-current text-[#e3ff6b]" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            {/* Local Time */}
            <div className="text-right">
              <p className="text-[12px] sm:text-[13px] md:text-[14px] font-bank uppercase tracking-[0.24em] text-[#a7b693]">
                LOCAL TIME - {localTime}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[#283319]/50">
          <p className="text-[11px] sm:text-[12px] font-bank uppercase tracking-[0.22em] text-[#9fb68b] text-center">
            © 2026 Lavi Sharma. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
