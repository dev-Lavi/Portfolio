"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
}

const NAV_LINKS: NavItem[] = [
  { id: "#about", label: "ABOUT" },
  { id: "#projects", label: "PROJECTS" },
  { id: "#services", label: "SERVICES" },
  { id: "#experience", label: "EXPERIENCE" },
  { id: "#skills", label: "SKILLS" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    setMenuOpen(false);

    if (targetId === "#hero" || targetId === "#top") {
      if ((window as unknown as { lenis?: { scrollTo: (target: number | Element, opts?: object) => void } }).lenis) {
        (window as unknown as { lenis: { scrollTo: (target: number | Element, opts?: object) => void } }).lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const element = document.querySelector(targetId);
    if (element) {
      if ((window as unknown as { lenis?: { scrollTo: (target: number | Element, opts?: object) => void } }).lenis) {
        (window as unknown as { lenis: { scrollTo: (target: number | Element, opts?: object) => void } }).lenis.scrollTo(element, { offset: -10, duration: 1.4 });
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 font-sans ${
          scrolled
            ? "bg-[#060906]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.7)] py-3 sm:py-3.5"
            : "bg-gradient-to-b from-[#060906]/90 via-[#060906]/50 to-transparent py-4 sm:py-5"
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between relative">
          {/* Logo / Brand - scrolls to top */}
          <button
            onClick={(e) => handleScrollTo(e, "#hero")}
            className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
            aria-label="Scroll to top"
          >
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e3ff6b] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e3ff6b] shadow-[0_0_8px_#e3ff6b]" />
            </span>
            <span className="font-bank text-sm sm:text-base font-bold uppercase tracking-[0.22em] text-white transition-colors duration-300 group-hover:text-[#e3ff6b]">
              LAVI SHARMA
            </span>
          </button>

          {/* Desktop/Tablet Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {NAV_LINKS.map((link) => (
              <DesktopNavLink
                key={link.id}
                href={link.id}
                label={link.label}
                onClick={handleScrollTo}
              />
            ))}
          </div>

          {/* Right Action Button (Desktop/Tablet) */}
          <div className="hidden md:block">
            <button
              onClick={(e) => handleScrollTo(e, "#contact")}
              className="group relative overflow-hidden rounded-full border border-[#e3ff6b]/60 bg-black/60 px-4 py-1.5 lg:px-5 lg:py-2 text-[11px] lg:text-xs font-bank font-bold uppercase tracking-[0.2em] text-[#e3ff6b] transition-all duration-300 hover:bg-[#e3ff6b] hover:text-black hover:shadow-[0_0_20px_rgba(227,255,107,0.5)] active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>CONTACT</span>
              <span className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="md:hidden text-white p-2 -mr-2 focus:outline-none cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span
                className={`h-[2px] bg-white transition-all duration-300 rounded-full ${
                  menuOpen ? "w-6 translate-y-2 rotate-45 bg-[#e3ff6b]" : "w-6"
                }`}
              />
              <span
                className={`h-[2px] bg-[#e3ff6b] transition-all duration-300 rounded-full ${
                  menuOpen ? "opacity-0" : "w-4"
                }`}
              />
              <span
                className={`h-[2px] bg-white transition-all duration-300 rounded-full ${
                  menuOpen ? "w-6 -translate-y-2 -rotate-45 bg-[#e3ff6b]" : "w-5"
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide-in Menu Panel */}
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 w-[85%] max-w-[340px] h-screen z-[60] bg-[#070b05]/95 backdrop-blur-2xl border-l border-white/10 px-6 py-8 flex flex-col justify-between md:hidden shadow-[-10px_0_40px_rgba(0,0,0,0.8)]"
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#e3ff6b] shadow-[0_0_8px_#e3ff6b]" />
                    <span className="font-bank text-sm font-bold uppercase tracking-[0.2em] text-white">
                      NAVIGATION
                    </span>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Staggered Navigation Links */}
                <div className="flex flex-col gap-5">
                  {NAV_LINKS.map((link, idx) => (
                    <motion.a
                      key={link.id}
                      href={link.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx, duration: 0.25 }}
                      onClick={(e) => handleScrollTo(e, link.id)}
                      className="group flex items-center justify-between py-2 text-left font-bank text-base font-bold uppercase tracking-[0.18em] text-white/85 hover:text-[#e3ff6b] transition-colors"
                    >
                      <span>{link.label}</span>
                      <span className="text-xs text-[#e3ff6b] opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Bottom Contact Button in Drawer */}
              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={(e) => handleScrollTo(e, "#contact")}
                  className="w-full rounded-full border border-[#e3ff6b] bg-[#e3ff6b] py-3 text-center font-bank text-xs font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_20px_rgba(227,255,107,0.35)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>GET IN TOUCH</span>
                  <span>↗</span>
                </button>
                <div className="mt-4 text-center font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                  © 2025 LAVI SHARMA
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function DesktopNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: (e: React.MouseEvent, href: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      onClick={(e) => onClick(e, href)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative py-1 font-bank text-xs lg:text-[13px] tracking-[0.2em] uppercase font-bold text-white/75 transition-colors duration-200 hover:text-white cursor-pointer"
    >
      <span className="relative z-10">{label}</span>
      {/* Animated underline from web3landing */}
      <div
        className="absolute -bottom-1 left-0 h-[2px] bg-[#e3ff6b] shadow-[0_0_8px_#e3ff6b]"
        style={{
          width: isHovered ? "100%" : "0%",
          transition: "width 0.28s ease-in-out",
        }}
      />
    </a>
  );
}
