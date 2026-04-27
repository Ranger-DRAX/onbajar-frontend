"use client";

import { useRef } from "react";
import Image from "next/image";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import ScrollEffectImage from "@/assets/image/ScrollEffectImage.png";

/* ------------------------------------------------------------------ */
/* Tokens — ABOUT is index 0, each sentence word follows               */
/* ------------------------------------------------------------------ */

const ALL_TOKENS = [
  { text: "ABOUT", bold: false, isHeading: true },
  { text: "Onbajar", bold: true, isHeading: false },
  { text: "delivers", bold: false, isHeading: false },
  { text: "authentic", bold: false, isHeading: false },
  { text: "club", bold: false, isHeading: false },
  { text: "jerseys,", bold: false, isHeading: false },
  { text: "sports", bold: false, isHeading: false },
  { text: "kits,", bold: false, isHeading: false },
  { text: "and", bold: false, isHeading: false },
  { text: "regular", bold: false, isHeading: false },
  { text: "essential", bold: false, isHeading: false },
  { text: "t-shirts,", bold: false, isHeading: false },
  { text: "building", bold: false, isHeading: false },
  { text: "Bangladesh's", bold: false, isHeading: false },
  { text: "brand", bold: false, isHeading: false },
  { text: "across", bold: false, isHeading: false },
  { text: "the", bold: false, isHeading: false },
  { text: "world.", bold: false, isHeading: false },
] as const;

const N = ALL_TOKENS.length; // 18

/*
 * Scroll window used for the animation: 5 % → 90 %
 * Gives a soft lead-in and a hold at the end.
 */
const ANIM_START = 0.05;
const ANIM_END = 0.9;
const RANGE = ANIM_END - ANIM_START; // 0.85
const STEP = RANGE / N; // ~0.047 per word
const OVERLAP = STEP * 0.6; // smooth cross-fade

/* ------------------------------------------------------------------ */
/* Single animated word                                                 */
/* ------------------------------------------------------------------ */

interface WordProps {
  text: string;
  bold: boolean;
  index: number; // 0-based in ALL_TOKENS
  progress: MotionValue<number>;
}

function AnimatedWord({ text, bold, index, progress }: WordProps) {
  const wordStart = ANIM_START + index * STEP;
  const wordEnd = wordStart + OVERLAP;

  /*
   * Dim → bright white via color so previously-lit words stay visible.
   * rgba(255,255,255,0.18) is the "unlit" state.
   * rgba(255,255,255,1.00) is the "highlighted" state.
   */
  const color = useTransform(
    progress,
    [wordStart, wordEnd],
    ["rgba(255,255,255,0.18)", "rgba(255,255,255,1.00)"],
  );

  return (
    <motion.span
      style={{ color }}
      className={`inline-block ${bold ? "font-bold" : "font-bold"}`}
    >
      {text}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Main section                                                         */
/* ------------------------------------------------------------------ */

export default function AboutScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // progress 0 = top of container at top of viewport
    // progress 1 = bottom of container at bottom of viewport
    offset: ["start start", "end end"],
  });

  const headingToken = ALL_TOKENS[0];
  const sentenceTokens = ALL_TOKENS.slice(1);

  return (
    /*
     * h-[300vh]: the extra 200vh is the scroll travel for the animation.
     * Increase this number for slower / more cinematic pacing.
     */
    <div ref={containerRef} className="relative h-[300vh]">
      {/* Sticky fullscreen panel */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ── Background image ── */}
        <Image
          src={ScrollEffectImage}
          alt="OnBazar about background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* ── Dark overlay ── */}
        <div className="absolute inset-0 bg-black/55" />

        {/* ── Centred content ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          {/* ABOUT heading — small tracking label */}
          <motion.span className="mb-5 block text-[13px] tracking-[0.35em] uppercase sm:text-sm">
            <AnimatedWord
              text={headingToken.text}
              bold={false}
              index={0}
              progress={scrollYProgress}
            />
          </motion.span>

          {/*
           * Body sentence
           * Figma: 32px / 43px lh / bold / max-w ~887px / centered
           */}
          <p className="w-full max-w-[887px] text-center text-[32px] leading-[1.35] font-bold sm:text-[32px]">
            {sentenceTokens.map((token, i) => (
              <span key={i}>
                <AnimatedWord
                  text={token.text}
                  bold={token.bold}
                  index={i + 1} /* offset by 1 (ABOUT = 0) */
                  progress={scrollYProgress}
                />
                {/* inter-word space */}
                {i < sentenceTokens.length - 1 && (
                  <span className="inline-block text-white/18">&nbsp;</span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
