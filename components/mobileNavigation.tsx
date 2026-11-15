"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, Globe, Home, Layers, LayoutGrid, Menu, MessageCircle, Users, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { ThemeSwitcher } from "@/components/themeSwitcher";
import { useLanguage } from "@/components/languageProvider";
import { ProfileAvatar } from "@/components/profileAvatar";

export function MobileNavigation({ isSignedIn, isPending, userName, userEmail, userImage }: { isSignedIn: boolean; isPending: boolean; userName?: string | null; userEmail?: string | null; userImage?: string | null }) {
  const { text } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    const desktop = window.matchMedia("(min-width: 1024px)");
    function onBreakpoint() { if (desktop.matches) setOpen(false); }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  const links = [
    { href: "#features", label: text.featuresLink, icon: Home },
    { href: "#pricing", label: text.pricingLink, icon: Layers },
    { href: "#audience", label: text.audienceNavLink, icon: Users },
    { href: "#testimonials", label: text.testimonialsNavLink, icon: MessageCircle },
  ];
  const displayName = userName?.trim() || userEmail?.trim() || "Planify";

  return (
    <div ref={rootRef} className="flex items-center gap-1 lg:hidden">
      <ThemeSwitcher />
      <button ref={triggerRef} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? text.closeMobileMenu : text.openMobileMenu} className="grid size-11 place-items-center rounded-full text-[#173f2b] transition-colors hover:bg-[#edf3eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] dark:text-[#dce5de] dark:hover:bg-[#253128]">
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>
      {open && (
        <nav id="mobile-navigation" aria-label={text.mainNavigation} className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-[#e3e9e2] bg-white p-4 shadow-[0_20px_50px_-25px_rgba(23,63,43,0.4)] dark:border-[#34443a] dark:bg-[#18221b] sm:inset-x-auto sm:right-0 sm:w-[24rem] sm:p-3">
          <div className="pb-4 sm:border-b sm:border-[#edf0eb] sm:pb-3 dark:sm:border-[#34443a]">
            {isPending ? <span aria-live="polite" aria-busy="true" className="flex min-h-11 items-center justify-center text-sm text-[#657168] dark:text-[#b4c0b7]">{text.checkingSession}</span> : isSignedIn ? (
              <>
                <div className="mb-4 flex min-w-0 items-center gap-3 px-1 py-1 sm:mb-3">
                  <ProfileAvatar key={userImage || "initial"} image={userImage} name={userName} email={userEmail} className="size-12 sm:size-10" />
                  <span className="min-w-0"><span className="block truncate text-sm font-semibold text-[#26352b] dark:text-[#e0e9e2]">{displayName}</span>{userEmail && <span className="block truncate text-xs text-[#657168] dark:text-[#b4c0b7]">{userEmail}</span>}</span>
                </div>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="flex min-h-11 items-center justify-center rounded-full bg-[#173f2b] px-5 text-sm font-semibold text-white outline-none transition-colors hover:bg-[#24583b] focus-visible:ring-2 focus-visible:ring-[#719378]"><LayoutGrid aria-hidden="true" className="mr-2 size-4 sm:hidden" />{text.goToDashboard}<span aria-hidden="true" className="ml-2">→</span></Link>
              </>
            ) : (
              <div className="grid gap-2">
                <Link href="/register" onClick={() => setOpen(false)} className="flex min-h-11 items-center justify-center rounded-full bg-[#173f2b] px-5 text-sm font-semibold text-white outline-none transition-colors hover:bg-[#24583b] focus-visible:ring-2 focus-visible:ring-[#719378]">{text.heroPrimary}<span aria-hidden="true" className="ml-2">→</span></Link>
                <Link href="/login" onClick={() => setOpen(false)} className="flex min-h-11 items-center justify-center rounded-full border border-[#dfe5de] px-5 text-sm font-semibold text-[#315d3c] outline-none transition-colors hover:bg-[#eef3eb] focus-visible:ring-2 focus-visible:ring-[#719378] dark:border-[#34443a] dark:text-[#dce5de] dark:hover:bg-[#253128]">{text.signInLink}</Link>
              </div>
            )}
          </div>
          <div className="divide-y divide-[#e3e9e2] overflow-hidden rounded-xl border border-[#e3e9e2] bg-[#f8faf7] dark:divide-[#34443a] dark:border-[#34443a] dark:bg-[#1b271f] sm:divide-y-0 sm:rounded-none sm:border-0 sm:bg-transparent sm:py-2 dark:sm:bg-transparent">
            {links.map(({ href, label, icon: Icon }) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center gap-3 px-3 text-sm font-medium text-[#26352b] outline-none transition-colors hover:bg-[#eef3eb] hover:text-[#173f2b] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#719378] dark:text-[#c3cec6] dark:hover:bg-[#253128] dark:hover:text-[#e0e9e2] sm:min-h-11 sm:rounded-lg sm:text-[#526057]"><Icon className="size-5 shrink-0 text-[#315d3c] dark:text-[#a6c5a9] sm:hidden" aria-hidden="true" /><span className="min-w-0 flex-1">{label}</span><ChevronRight className="size-4 shrink-0 text-[#526b58] dark:text-[#a6c5a9] sm:hidden" aria-hidden="true" /></a>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#e3e9e2] px-3 py-2 text-sm font-medium text-[#526057] dark:border-[#34443a] dark:text-[#c3cec6] sm:mt-0 sm:rounded-none sm:border-x-0 sm:border-b-0 sm:border-t sm:border-[#edf0eb] sm:px-1 sm:pb-0 sm:pt-3 dark:sm:border-[#34443a]"><span className="flex items-center gap-3"><Globe className="size-5 text-[#315d3c] dark:text-[#a6c5a9] sm:hidden" aria-hidden="true" />{text.language}</span><LanguageSwitcher /></div>
        </nav>
      )}
    </div>
  );
}
