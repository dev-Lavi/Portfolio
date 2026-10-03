"use client";

import React, { useState, useEffect } from "react";
import ContributionSkyline, { ContributionDay } from "./ui/ContributionSkyline";

type Platform = "github" | "leetcode";

export default function ContributionsSection() {
  const [platform, setPlatform] = useState<Platform>("github");
  const [githubData, setGithubData] = useState<ContributionDay[] | undefined>(undefined);
  const [leetcodeData, setLeetcodeData] = useState<ContributionDay[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/contributions");
        if (!res.ok) throw new Error("Failed to load contributions");
        const json = await res.json();
        if (isMounted && json.success) {
          if (Array.isArray(json.github) && json.github.length > 0) {
            setGithubData(json.github);
          }
          if (Array.isArray(json.leetcode) && json.leetcode.length > 0) {
            setLeetcodeData(json.leetcode);
          }
        }
      } catch (err) {
        console.error("Contributions data fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeData = platform === "github" ? githubData : leetcodeData;
  const activePalette = platform === "github" ? "github" : "ember";
  const activeUnit = platform === "github" ? "contribution" : "problem solved";
  const activeUnitPlural = platform === "github" ? "contributions" : "problems solved";

  return (
    <div className="relative w-full bg-[#070b05] py-20 sm:py-28 text-white overflow-hidden">
      {/* Background Ambient Glow & Blueprint Grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[450px] w-[750px] max-w-full rounded-full bg-[#e3ff6b]/[0.025] blur-[150px]" />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:54px_54px]"
          style={{
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 50%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 50%, transparent 100%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Clean, minimalist controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e3ff6b] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e3ff6b]" />
            </span>
            <span className="font-bank text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/90">
              ACTIVITY
            </span>
          </div>

          {/* Clean Segmented Platform Switcher */}
          <div className="inline-flex items-center rounded-xl border border-white/[0.08] bg-[#0c110d]/90 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setPlatform("github")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                platform === "github"
                  ? "bg-[#e3ff6b] text-black font-semibold shadow-[0_0_15px_rgba(227,255,107,0.3)]"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform("leetcode")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                platform === "leetcode"
                  ? "bg-[#ffa116] text-black font-semibold shadow-[0_0_15px_rgba(255,161,22,0.3)]"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c.058-.087.122-.171.192-.25l5.406-5.788a1.374 1.374 0 0 0-.961-2.076h-.284z" />
                <path d="M9.816 11.517a1.38 1.38 0 0 0-1.378 1.378v.002a1.38 1.38 0 0 0 1.378 1.378h9.806a1.38 1.38 0 0 0 1.378-1.378v-.002a1.38 1.38 0 0 0-1.378-1.378H9.816z" />
              </svg>
              <span>LeetCode</span>
            </button>
          </div>
        </div>

        {/* 3D Skyline Isometric Component */}
        <div className="relative">
          <ContributionSkyline
            key={platform}
            data={activeData}
            palette={activePalette}
            defaultView="3d"
            unit={activeUnit}
            unitPlural={activeUnitPlural}
            title={
              <div className="flex items-center gap-2">
                <span className="font-bank text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                  {platform === "github" ? "GitHub Activity (dev-Lavi)" : "LeetCode Solved (Lavi10)"}
                </span>
                {loading && (
                  <span className="text-[11px] font-mono text-white/40 animate-pulse">
                    · syncing live data…
                  </span>
                )}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
