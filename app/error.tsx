"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/languageProvider";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { text } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main data-language-content className="grid min-h-screen place-items-center bg-[#f8f8f5] px-5 py-12 text-[#18211c] dark:bg-[#111914] dark:text-[#e8eee9]">
      <section className="w-full max-w-lg rounded-3xl border border-[#dfe5de] bg-white p-7 text-center shadow-sm dark:border-[#34443a] dark:bg-[#1a251e] sm:p-10" aria-labelledby="error-title">
        <p className="text-sm font-semibold tracking-wide text-[#6d9275]">Planify</p>
        <h1 id="error-title" className="mt-3 text-2xl font-semibold tracking-tight">{text.unexpectedErrorTitle}</h1>
        <p className="mt-2 text-sm leading-6 text-[#718078] dark:text-[#aebbb1]">{text.unexpectedErrorDescription}</p>
        <button type="button" onClick={retry} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#173f2b] px-5 text-sm font-semibold text-white outline-none transition hover:bg-[#24583b] focus-visible:ring-2 focus-visible:ring-[#719378] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1a251e]">
          <RotateCcw className="size-4" aria-hidden="true" />{text.retry}
        </button>
      </section>
    </main>
  );
}
