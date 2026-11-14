"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/features/auth/client";
import { useLanguage } from "@/components/languageProvider";
import { Spinner } from "@/components/ui/spinner";

export function EmailVerificationForm() {
  const searchParams = useSearchParams();
  const email = (searchParams.get("email") ?? "").trim().toLowerCase();
  const { text } = useLanguage();
  const router = useRouter();
  const [error, setError] = useState(searchParams.get("sendError") === "1" ? text.verificationSendError : "");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!email) {
      setError(text.verificationEmailMissing);
      return;
    }

    const otp = String(new FormData(event.currentTarget).get("otp") ?? "").trim();
    setBusy(true);
    try {
      const result = await authClient.emailOtp.verifyEmail({ email, otp });
      if (result.error) {
        setError(text.verificationError);
        return;
      }
      setNotice(text.verificationSuccess);
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError(text.verificationError);
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setError("");
    setNotice("");
    if (!email) {
      setError(text.verificationEmailMissing);
      return;
    }
    setBusy(true);
    try {
      const result = await fetch("/api/email-verification/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!result.ok) {
        setError(text.verificationResendError);
        return;
      }
      setNotice(text.verificationResent);
    } catch {
      setError(text.verificationResendError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8">
      {email && <p className="mb-5 text-sm text-[#526057] dark:text-[#c3cec6]">{email}</p>}
      <form className="space-y-5" onSubmit={verify}>
        <div>
          <label htmlFor="otp" className="mb-2 block text-sm font-medium text-[#344139] dark:text-[#dce5de]">{text.verificationCode}</label>
          <input id="otp" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} minLength={6} required aria-describedby={error ? "verification-error" : undefined} className="h-12 w-full rounded-xl border border-[#dfe5de] bg-white px-4 text-center text-lg font-semibold tracking-[0.4em] text-[#18211c] outline-none transition placeholder:text-[#a2aaa3] focus:border-[#6d9275] focus:ring-4 focus:ring-[#6d9275]/10 dark:border-[#34443a] dark:bg-[#1a251e] dark:text-[#e8eee9]" />
        </div>
        {error && <p id="verification-error" role="alert" className="rounded-xl bg-[#fff0ee] px-4 py-3 text-sm text-[#a23c30] dark:bg-[#3b2724] dark:text-[#ffb4a8]">{error}</p>}
        {notice && <p role="status" className="rounded-xl bg-[#edf5ed] px-4 py-3 text-sm text-[#315d3c] dark:bg-[#24372a] dark:text-[#b8d0bc]">{notice}</p>}
        <button type="submit" disabled={busy || !email} aria-busy={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173f2b] px-5 text-sm font-semibold text-white transition hover:bg-[#24583b] focus:outline-none focus:ring-4 focus:ring-[#6d9275]/25 disabled:cursor-wait disabled:opacity-60">
          {busy && <Spinner />}{text.verifyEmailAction}
        </button>
        <button type="button" onClick={resend} disabled={busy || !email} className="w-full rounded-lg py-2 text-sm font-semibold text-[#315d3c] underline-offset-4 hover:underline focus:outline-none focus:ring-4 focus:ring-[#6d9275]/20 disabled:opacity-60 dark:text-[#a6c5a9]">
          {text.resendCode}
        </button>
        <p className="text-center text-sm text-[#768078] dark:text-[#b4c0b7]">
          <Link href="/register" className="font-semibold text-[#315d3c] hover:underline dark:text-[#a6c5a9]">{text.signUp}</Link>
          {" · "}<Link href="/login" className="font-semibold text-[#315d3c] hover:underline dark:text-[#a6c5a9]">{text.login}</Link>
        </p>
      </form>
    </div>
  );
}
