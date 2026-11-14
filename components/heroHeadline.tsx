"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function HeroHeadline({ lead, middle, accent }: { lead: string; middle: string; accent: string }) {
  const reduced = useReducedMotion();
  const full = `${lead}${middle} ${accent}`;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(100, Math.floor((now - started) / 28));
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);
  const shown = reduced ? full.length : Math.floor(progress * full.length / 100);
  const middleText = `${middle} `;
  return <h1 aria-label={`${lead} ${middle} ${accent}`} className="text-balance text-[clamp(2.65rem,4.05vw,4.35rem)] font-semibold leading-[1.03] tracking-[-0.06em]">
    <span className="relative block"><span className="invisible" aria-hidden="true">{lead}</span><span aria-hidden="true" className="absolute inset-0">{lead.slice(0, shown)}</span></span>
    <span className="mt-1 block"><span className="relative"><span className="invisible whitespace-pre-wrap" aria-hidden="true">{middleText}</span><span aria-hidden="true" className="absolute inset-0 whitespace-pre">{middleText.slice(0, Math.max(0, shown - lead.length))}</span></span><span className="relative inline-block text-[#25613c] dark:text-[#a6c5a9]"><span className="invisible" aria-hidden="true">{accent}</span><span aria-hidden="true" className="absolute inset-0">{accent.slice(0, Math.max(0, shown - lead.length - middleText.length))}</span>{shown >= full.length && <span aria-hidden="true" className="hero-caret absolute left-[calc(100%+0.08em)] top-[0.1em] h-[0.8em] w-[0.045em] min-w-[2px] rounded-full bg-current" />}<span aria-hidden="true" className={`absolute -bottom-2 left-[28%] h-2 w-[62%] -rotate-2 rounded-[50%] border-t-[5px] border-[#93cba0]/70 transition-opacity ${shown >= full.length ? "opacity-100" : "opacity-0"}`} /></span></span>
  </h1>;
}
