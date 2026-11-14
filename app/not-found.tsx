"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/languageProvider";

export default function NotFound() {
  const { text } = useLanguage();

  return (
    <main data-language-content className="grid min-h-screen place-items-center bg-[#f8f8f5] px-5 py-12 text-[#18211c] dark:bg-[#111914] dark:text-[#e8eee9]">
      <section className="w-full max-w-lg rounded-3xl border border-[#dfe5de] bg-white p-7 text-center shadow-sm dark:border-[#34443a] dark:bg-[#1a251e] sm:p-10" aria-labelledby="not-found-title">
        <p className="text-sm font-semibold tracking-wide text-[#6d9275]">Planify · 404</p>
        <h1 id="not-found-title" className="mt-3 text-2xl font-semibold tracking-tight">{text.notFoundTitle}</h1>
        <p className="mt-2 text-sm leading-6 text-[#718078] dark:text-[#aebbb1]">{text.notFoundDescription}</p>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#173f2b] px-5 text-sm font-semibold text-white outline-none transition hover:bg-[#24583b] focus-visible:ring-2 focus-visible:ring-[#719378] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1a251e]">
          <ArrowLeft className="size-4" aria-hidden="true" />{text.home}
        </Link>
      </section>
    </main>
  );
}
