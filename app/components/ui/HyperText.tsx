"use client";

import { AnimatePresence, motion, Variants, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface HyperTextProps {
  text: string;
  duration?: number;
  framerProps?: Variants;
  className?: string;
  animateOnLoad?: boolean;
}

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export function HyperText({
  text,
  duration = 800,
  framerProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 3 },
  },
  className,
  animateOnLoad = true,
}: HyperTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [displayText, setDisplayText] = useState(text.split(""));
  const [trigger, setTrigger] = useState(false);
  const interations = useRef(0);
  const isFirstRender = useRef(true);
  const hasTriggeredRef = useRef(false);

  const triggerAnimation = () => {
    interations.current = 0;
    setTrigger(true);
  };

  useEffect(() => {
    if (isInView && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      triggerAnimation();
    }
  }, [isInView]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!animateOnLoad && isFirstRender.current) {
          clearInterval(interval);
          isFirstRender.current = false;
          return;
        }
        if (interations.current < text.length) {
          setDisplayText((t) =>
            t.map((l, i) =>
              l === " "
                ? l
                : i <= interations.current
                  ? text[i]
                  : alphabets[getRandomInt(26)],
            ),
          );
          interations.current = interations.current + 0.1;
        } else {
          setTrigger(false);
          clearInterval(interval);
        }
      },
      duration / (text.length * 10),
    );
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [text, duration, trigger, animateOnLoad]);

  return (
    <div
      ref={containerRef}
      className="flex scale-100 cursor-default overflow-hidden py-1"
      onMouseEnter={triggerAnimation}
    >
      <AnimatePresence mode="wait">
        {displayText.map((letter, i) => (
          <motion.span
            key={i}
            className={cn("font-mono", letter === " " ? "inline-block w-[0.28em]" : "", className)}
            {...framerProps}
          >
            {letter.toUpperCase()}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface HyperTextParagraphProps {
  text: string;
  className?: string;
  duration?: number;
}

export function HyperTextParagraph({
  text,
  className,
  duration = 1400,
}: HyperTextParagraphProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });
  const [displayText, setDisplayText] = useState(text);
  const iterations = useRef(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasTriggeredRef = useRef(false);

  const startAnimation = () => {
    iterations.current = 0;
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isInView && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      startAnimation();
    }
  }, [isInView]);

  useEffect(() => {
    if (!isAnimating) return;

    // Advance roughly 8-12 characters per 25ms tick for smooth, cinematic decryption
    const stepSize = Math.max(2, Math.ceil(text.length / (duration / 25)));
    const interval = setInterval(() => {
      if (iterations.current < text.length) {
        iterations.current += stepSize;
        const currentIter = iterations.current;

        const chars = text.split("").map((char, i) => {
          if (char === " " || char === "\n") return char;
          if (i <= currentIter) return text[i];
          return alphabets[getRandomInt(26)];
        });
        setDisplayText(chars.join(""));
      } else {
        setDisplayText(text);
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isAnimating, text, duration]);

  const words = displayText.split(" ");

  return (
    <p
      ref={containerRef}
      onMouseEnter={() => {
        if (!isAnimating) startAnimation();
      }}
      className={cn("cursor-default select-none", className)}
    >
      {words.map((word, wIdx) => {
        const isPronoun = word.includes("(HE/HIM)");
        return (
          <span key={wIdx} className="inline-block whitespace-nowrap">
            {isPronoun ? (
              <span className="text-[0.65em] tracking-[0.12em] align-middle text-[#a7b693]">
                {word}
              </span>
            ) : (
              word
            )}
            {wIdx < words.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </p>
  );
}

