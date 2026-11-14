"use client";

import { Suspense } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brandLogo";
import { EmailVerificationForm } from "@/features/auth/components/emailVerificationForm";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { ThemeSwitcher } from "@/components/themeSwitcher";
import { useLanguage } from "@/components/languageProvider";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyEmailPage() {
  const { text } = useLanguage();

  return (
    <main data-language-content className="flex min-h-screen bg-[#f8f8f5] text-[#18211c] dark:bg-[#111914] dark:text-[#e8eee9]">
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#173f2b] p-12 text-white lg:flex xl:p-16">
        <div className="absolute -right-28 top-24 size-96 rounded-full border border-white/10" />
        <Link href="/" className="relative inline-flex items-center gap-3"><BrandLogo inverse /></Link>
        <div className="relative max-w-lg">
          <p className="mb-5 text-sm font-medium text-[#b8d0bc]">{text.sidebarEyebrow}</p>
          <h1 className="text-5xl font-semibold leading-[1.1] tracking-[-0.05em]">{text.authMotto}</h1>
          <p className="mt-6 max-w-md leading-7 text-white/65">{text.authPitch}</p>
        </div>
        <p className="relative text-xs text-white/45">© 2026 Planify · {text.footerMotto}</p>
      </section>
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#315d3c] dark:text-[#a6c5a9] lg:hidden"><BrandLogo size="sm" /></Link>
            <span className="lg:hidden" />
            <div className="flex items-center gap-2"><ThemeSwitcher /><LanguageSwitcher /></div>
          </div>
          <div className="mb-8">
            <p className="text-sm font-medium text-[#6d9275]">{text.authWelcome}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{text.verifyEmailTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-[#768078] dark:text-[#b4c0b7]">{text.verifyEmailDescription}</p>
          </div>
          <Suspense fallback={<div role="status" className="flex items-center gap-2 text-sm text-[#526057] dark:text-[#c3cec6]"><Spinner />{text.loadingPage}</div>}>
            <EmailVerificationForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
