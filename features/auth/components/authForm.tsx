"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/components/languageProvider";
import { authClient } from "@/features/auth/client";
import { getSignUpErrorMessage, validateSignUpField, validateSignUpFields, type SignUpField, type SignUpFieldErrors } from "@/features/auth/validation";
import { Spinner } from "@/components/ui/spinner";

type AuthFormProps = { mode: "login" | "register"; initialEmail?: string };

function isRateLimitError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "status" in error && error.status === 429;
}

export function RegisterAuthForm() {
  const searchParams = useSearchParams();
  return <AuthForm mode="register" initialEmail={searchParams.get("email") ?? ""} />;
}

export function AuthForm({ mode, initialEmail }: AuthFormProps) {
  const { text } = useLanguage();
  const router = useRouter();
  const isRegister = mode === "register";
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<SignUpFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  function updateSignUpField(field: SignUpField, value: string) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const message = validateSignUpField(field, value, text);
      const next = { ...current };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
    if (error) setError("");
  }

  function updateLoginField(field: "email" | "password", value: string) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const message = field === "email"
        ? !value.trim() ? text.emailRequired : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? text.emailInvalid : undefined
        : !value ? text.passwordRequired : !value.trim() ? text.passwordSpaceError : undefined;
      const next = { ...current };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
    if (error) setError("");
  }

  function fieldClassName(field: SignUpField) {
    return `h-12 w-full rounded-xl border bg-white dark:bg-[#1a251e] px-4 text-sm text-[#18211c] dark:text-[#e8eee9] outline-none transition placeholder:text-[#a2aaa3] dark:placeholder:text-[#89968d] ${fieldErrors[field] ? "border-[#d99a91] dark:border-[#b9756c] focus:border-[#c66f63] focus:ring-4 focus:ring-[#c66f63]/10" : "border-[#dfe5de] dark:border-[#34443a] focus:border-[#6d9275] focus:ring-4 focus:ring-[#6d9275]/10"}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const name = String(formData.get("name") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (isRegister) {
      const errors = validateSignUpFields({ name, email, password }, text);
      setFieldErrors(errors);
      if (errors.name) {
        nameInputRef.current?.focus();
        return;
      }
      if (errors.email) {
        emailInputRef.current?.focus();
        return;
      }
      if (errors.password) {
        passwordInputRef.current?.focus();
        return;
      }
    } else {
      const errors: SignUpFieldErrors = {};
      if (!email) errors.email = text.emailRequired;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = text.emailInvalid;
      if (!password) errors.password = text.passwordRequired;
      else if (!password.trim()) errors.password = text.passwordSpaceError;
      setFieldErrors(errors);
      if (errors.email) {
        emailInputRef.current?.focus();
        return;
      }
      if (errors.password) {
        passwordInputRef.current?.focus();
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = isRegister
        ? await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: "/dashboard",
          })
        : await authClient.signIn.email({
            email,
            password,
            rememberMe: true,
            callbackURL: "/dashboard",
          });

      if (result.error) {
        if (isRateLimitError(result.error)) {
          setError(text.authRateLimited);
          return;
        }
        setError(isRegister ? getSignUpErrorMessage(text, result.error.code) : text.authError);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError(isRateLimitError(error) ? text.authRateLimited : isRegister ? text.registerError : text.authError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setIsSubmitting(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      if (result.error) setError(isRateLimitError(result.error) ? text.authRateLimited : text.googleError);
    } catch (error) {
      setError(isRateLimitError(error) ? text.authRateLimited : text.googleError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#dfe5de] dark:border-[#34443a] bg-white dark:bg-[#1a251e] px-5 text-sm font-semibold text-[#344139] dark:text-[#dce5de] transition hover:bg-[#f8faf7] dark:hover:bg-[#29372e] focus:outline-none focus:ring-4 focus:ring-[#6d9275]/15 disabled:cursor-wait disabled:opacity-60"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.09-1.92 3.27-4.74 3.27-8.1Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.15a11 11 0 0 0 0 9.9l3.69-2.84Z" />
          <path fill="#EA4335" d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0a11 11 0 0 0-9.85 7.05l3.69 2.84c.87-2.6 3.3-5.53 6.16-5.53Z" />
        </svg>
        {isSubmitting && <Spinner />}
        {isSubmitting ? text.processing : text.google}
      </button>

      <div className="my-6 flex items-center gap-4 text-xs text-[#9aa39b] dark:text-[#a3b0a7]">
        <span className="h-px flex-1 bg-[#e8ece7] dark:bg-[#34443a]" />
        <span>{text.or}</span>
        <span className="h-px flex-1 bg-[#e8ece7] dark:bg-[#34443a]" />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {isRegister && (
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#344139] dark:text-[#dce5de]">{text.name}</label>
            <input ref={nameInputRef} id="name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "name-error" : undefined} onChange={(event) => updateSignUpField("name", event.currentTarget.value)} placeholder={text.namePlaceholder} className={fieldClassName("name")} />
            {fieldErrors.name && <p id="name-error" className="mt-1.5 text-xs font-medium text-[#a34d43] dark:text-[#efaaa1]">{fieldErrors.name}</p>}
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#344139] dark:text-[#dce5de]">{text.email}</label>
          <input ref={emailInputRef} id="email" name="email" type="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} required maxLength={254} defaultValue={isRegister ? initialEmail : undefined} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined} onChange={(event) => isRegister ? updateSignUpField("email", event.currentTarget.value) : updateLoginField("email", event.currentTarget.value)} placeholder={text.emailPlaceholder} className={fieldClassName("email")} />
          {fieldErrors.email && <p id="email-error" className="mt-1.5 text-xs font-medium text-[#a34d43] dark:text-[#efaaa1]">{fieldErrors.email}</p>}
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="password" className="text-sm font-medium text-[#344139] dark:text-[#dce5de]">{text.password}</label>
            <span className="text-xs text-[#8a938b] dark:text-[#a3b0a7]">{text.passwordHint}</span>
          </div>
          <div className="relative">
            <input ref={passwordInputRef} id="password" name="password" type={isPasswordVisible ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} required minLength={isRegister ? 12 : undefined} maxLength={128} aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? "password-error" : undefined} onChange={(event) => isRegister ? updateSignUpField("password", event.currentTarget.value) : updateLoginField("password", event.currentTarget.value)} placeholder="••••••••••••" className={`${fieldClassName("password")} pr-12`} />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              aria-label={isPasswordVisible ? text.hidePassword : text.showPassword}
              aria-pressed={isPasswordVisible}
              className="absolute inset-y-0 right-3 flex items-center justify-center rounded-md px-1 text-[#768078] transition hover:text-[#315d3c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d9275]/40 dark:text-[#a3b0a7] dark:hover:text-[#a6c5a9]"
            >
              {isPasswordVisible ? <EyeOff aria-hidden="true" size={20} /> : <Eye aria-hidden="true" size={20} />}
            </button>
          </div>
          {fieldErrors.password && <p id="password-error" className="mt-1.5 text-xs font-medium text-[#a34d43] dark:text-[#efaaa1]">{fieldErrors.password}</p>}
        </div>
        {error && <p role="alert" className="rounded-xl bg-[#fff0ee] px-4 py-3 text-sm text-[#a23c30] dark:bg-[#3b2724] dark:text-[#ffb4a8]">{error}</p>}
        <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173f2b] px-5 text-sm font-semibold text-white transition hover:bg-[#24583b] focus:outline-none focus:ring-4 focus:ring-[#6d9275]/25 disabled:cursor-wait disabled:opacity-60">
          {isSubmitting && <Spinner />}
          {isSubmitting ? text.processing : isRegister ? text.createAccount : text.signIn}
          {!isSubmitting && <span className="ml-2 text-lg" aria-hidden="true">→</span>}
        </button>
        <p className="pt-1 text-center text-sm text-[#768078] dark:text-[#b4c0b7]">
          {isRegister ? `${text.haveAccount} ` : `${text.noAccount} `}
          <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-[#315d3c] dark:text-[#a6c5a9] hover:underline">
            {isRegister ? text.login : text.signUp}
          </Link>
        </p>
      </form>
    </div>
  );
}



