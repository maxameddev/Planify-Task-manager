"use client";

import { Spinner } from "@/components/ui/spinner";
import { useOptionalLanguage } from "@/components/languageProvider";
import { messages } from "@/lib/i18n";

export default function Loading() {
  const text = useOptionalLanguage()?.text ?? messages.so;

  return (
    <main data-language-content className="grid min-h-[60vh] place-items-center bg-[#f8f8f5] text-[#173f2b] dark:bg-[#111914] dark:text-[#a6c5a9]">
      <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-2xl border border-[#dfe5de] bg-white/80 px-5 py-4 text-sm font-medium shadow-sm dark:border-[#34443a] dark:bg-[#1a251e]">
        <Spinner className="size-5" />
        <span>{text.loadingPage}</span>
      </div>
    </main>
  );
}
