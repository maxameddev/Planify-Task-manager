"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/components/languageProvider";

export function AudienceCarousel({ children, count }: { children: ReactNode; count: number }) {
  const { locale } = useLanguage();
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const so = locale === "so";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReducedMotion(media.matches); };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (focused || !visible || reducedMotion) return;
    const timer = window.setInterval(() => {
      const element = rail.current;
      if (!element || !window.matchMedia("(max-width: 639px)").matches || document.hidden) return;
      const items = element.children;
      const next = (Math.round(element.scrollLeft / (items[0]?.getBoundingClientRect().width + 20 || 1)) + 1) % count;
      const target = items[next] as HTMLElement | undefined;
      if (target) element.scrollTo({ left: target.offsetLeft - element.offsetLeft, behavior: "smooth" });
    }, 3500);
    return () => window.clearInterval(timer);
  }, [count, focused, visible, reducedMotion]);

  function goTo(index: number) {
    const element = rail.current;
    const target = element?.children[index] as HTMLElement | undefined;
    if (element && target) element.scrollTo({ left: target.offsetLeft - element.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
    setActive(index);
  }

  return (
    <div role="region" aria-label={so ? "Dadka loogu talagalay Planify" : "Who Planify is for"}>
      <div ref={rail} tabIndex={0} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onScroll={(event) => {
        const element = event.currentTarget;
        if (window.matchMedia("(min-width: 640px)").matches) return;
        const width = element.children[0]?.getBoundingClientRect().width || 1;
        setActive(Math.min(count - 1, Math.round(element.scrollLeft / (width + 20))));
      }} className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:auto-rows-fr sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-4 xl:gap-4 2xl:gap-5">
        {children}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
        {Array.from({ length: count }, (_, index) => <button key={index} type="button" onClick={() => goTo(index)} aria-label={so ? `Muuji kaarka ${index + 1}` : `Show card ${index + 1}`} aria-current={active === index ? "true" : undefined} className="grid size-9 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c]"><span className={`h-2 rounded-full transition-all ${active === index ? "w-5 bg-[#24583b] dark:bg-[#a6c5a9]" : "w-2 bg-[#b6c8b8]"}`} /></button>)}
      </div>
    </div>
  );
}
