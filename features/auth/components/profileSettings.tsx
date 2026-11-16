"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Check, LoaderCircle, Mail, Phone, Trash2, UserRound, X } from "lucide-react";
import { BrandLogo } from "@/components/brandLogo";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { ThemeSwitcher } from "@/components/themeSwitcher";
import { useLanguage } from "@/components/languageProvider";
import { authClient } from "@/features/auth/client";
import { TaskSelect } from "@/features/tasks/components/taskSelect";
import { utcOffsetLabel } from "@/features/tasks/time";

type ProfileSettingsProps = {
  initialName: string;
  initialEmail: string;
  initialPhoneNumber: string;
  initialImage: string | null;
  initialPlanningMode: string;
  initialTimeZone: string;
};

export function ProfileSettings({ initialName, initialEmail, initialPhoneNumber, initialImage, initialPlanningMode, initialTimeZone }: ProfileSettingsProps) {
  const { text } = useLanguage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialName);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [image, setImage] = useState<string | null>(initialImage);
  const [planningMode, setPlanningMode] = useState(initialPlanningMode === "advanced" ? "advanced" : "basic");
  const [timeZone, setTimeZone] = useState(initialTimeZone);
  const [savedProfile, setSavedProfile] = useState({ name: initialName, phoneNumber: initialPhoneNumber, image: initialImage, planningMode: initialPlanningMode === "advanced" ? "advanced" : "basic", timeZone: initialTimeZone });
  const [isSaving, setIsSaving] = useState(false);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isRemovePhotoDialogOpen, setIsRemovePhotoDialogOpen] = useState(false);

  const hasChanges = name.trim() !== savedProfile.name || phoneNumber.trim() !== savedProfile.phoneNumber || image !== savedProfile.image || planningMode !== savedProfile.planningMode || timeZone !== savedProfile.timeZone;
  const timeZones = typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : ["Africa/Mogadishu", "Africa/Nairobi", "UTC", "Europe/London", "America/New_York"];
  if (!timeZones.includes("Africa/Mogadishu")) timeZones.unshift("Africa/Mogadishu");
  if (!timeZones.includes(timeZone)) timeZones.unshift(timeZone);

  useEffect(() => {
    if (!isRemovePhotoDialogOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsRemovePhotoDialogOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRemovePhotoDialogOpen]);

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    setSaved(false);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError(text.photoTypeError);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(text.photoSizeError);
      return;
    }

    setIsPreparingImage(true);
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 320 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("canvas");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const compactImage = canvas.toDataURL("image/webp", 0.8);
      if (compactImage.length > 450_000) throw new Error("size");
      setImage(compactImage);
    } catch {
      setError(text.profilePhotoError);
    } finally {
      setIsPreparingImage(false);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const cleanedPhone = phoneNumber.trim();
    if (cleanedPhone && !/^\+?[0-9][0-9\s().-]{5,24}$/.test(cleanedPhone)) {
      setError(text.invalidPhoneNumber);
      return;
    }

    setIsSaving(true);
    try {
      const result = await authClient.updateUser({
        name: name.trim(),
        phoneNumber: cleanedPhone,
        image,
        planningMode,
        timeZone,
      });
      if (result.error) {
        setError(text.profileSaveError);
        return;
      }

      setSavedProfile({ name: name.trim(), phoneNumber: cleanedPhone, image, planningMode, timeZone });
      setSaved(true);
      router.refresh();
    } catch {
      setError(text.profileSaveError);
    } finally {
      setIsSaving(false);
    }
  }

  function removePhoto() {
    setImage(null);
    setSaved(false);
    setIsRemovePhotoDialogOpen(false);
  }

  return (
    <main data-language-content className="min-h-screen bg-[#f8f8f5] text-[#18211c] dark:bg-[#111914] dark:text-[#e8eee9]">
      <header className="border-b border-[#e9ece7] bg-white/80 dark:border-[#2d3a31] dark:bg-[#18221b]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <Link href="/dashboard" className="flex items-center gap-3" aria-label={text.backToTasks}>
            <BrandLogo />
          </Link>
          <nav className="flex items-center gap-3" aria-label={text.accountNavigation}>
            <ThemeSwitcher />
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-[#5f7464] outline-none transition hover:text-[#17452d] focus-visible:ring-2 focus-visible:ring-[#719378] dark:text-[#b7c8ba] dark:hover:text-[#d7e6da]">
          <ArrowLeft className="size-4" aria-hidden="true" />{text.backToTasks}
        </Link>
        <div className="mt-6 rounded-3xl border border-[#e5eae3] bg-white p-6 shadow-sm shadow-[#183c22]/[0.04] dark:border-[#2d3a31] dark:bg-[#1a251e] sm:p-9">
          <p className="text-sm font-medium text-[#6d9275]">Planify</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em]">{text.profileTitle}</h1>
          <p className="mt-2 text-sm leading-6 text-[#768078] dark:text-[#b4c0b7]">{text.profileDescription}</p>

          <form onSubmit={saveProfile} className="mt-7 grid gap-6">
            <fieldset className="grid gap-3">
              <legend className="text-sm font-semibold text-[#425047] dark:text-[#d3ddd5]">{text.profilePhoto}</legend>
              <div className="flex flex-wrap items-center gap-4">
                <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border border-[#dfe5de] bg-[#edf3ec] text-[#315d3c] dark:border-[#34443a] dark:bg-[#253128] dark:text-[#c2ddc6]">
                  {image ? <Image src={image} alt={text.profilePhoto} width={320} height={320} unoptimized className="size-full object-cover" /> : <UserRound className="size-9" strokeWidth={1.5} aria-hidden="true" />}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#dfe5de] px-4 text-sm font-semibold text-[#425047] outline-none transition hover:bg-[#f4f6f2] focus-within:ring-2 focus-within:ring-[#719378] dark:border-[#34443a] dark:text-[#d3ddd5] dark:hover:bg-[#253128]">
                    <Camera className="size-4" aria-hidden="true" />
                    {isPreparingImage ? text.processing : text.uploadPhoto}
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void handleImageChange(event)} disabled={isPreparingImage} className="sr-only" />
                  </label>
                  {image && (
                    <button type="button" onClick={() => setIsRemovePhotoDialogOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-[#8c5a50] outline-none transition hover:bg-[#fff2ef] focus-visible:ring-2 focus-visible:ring-[#c27d70] dark:text-[#e4aaa0] dark:hover:bg-[#2a1c19]">
                      <X className="size-4" aria-hidden="true" />{text.removePhoto}
                    </button>
                  )}
                </div>
              </div>
            </fieldset>

            <label className="grid gap-1.5 text-sm font-medium text-[#425047] dark:text-[#d3ddd5]">
              <span className="inline-flex items-center gap-2"><UserRound className="size-4 text-[#78917c]" aria-hidden="true" />{text.displayName}</span>
              <input value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} required maxLength={100} autoComplete="name" className="h-11 rounded-xl border border-[#dfe5de] bg-[#fcfcfa] px-3.5 text-sm text-[#25342a] outline-none transition focus:border-[#719378] focus:ring-2 focus:ring-[#719378]/15 dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#e8eee9]" />
            </label>

            <label className="grid gap-1.5 text-sm font-medium text-[#425047] dark:text-[#d3ddd5]">
              <span className="inline-flex items-center gap-2"><Phone className="size-4 text-[#78917c]" aria-hidden="true" />{text.phoneNumber}</span>
              <input type="tel" value={phoneNumber} onChange={(event) => { setPhoneNumber(event.target.value); setSaved(false); }} maxLength={32} autoComplete="tel" placeholder="+252 61 234 5678" className="h-11 rounded-xl border border-[#dfe5de] bg-[#fcfcfa] px-3.5 text-sm text-[#25342a] outline-none transition placeholder:text-[#9aa39c] focus:border-[#719378] focus:ring-2 focus:ring-[#719378]/15 dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#e8eee9] dark:placeholder:text-[#839087]" />
            </label>

            <div className="grid gap-1.5 text-sm font-medium text-[#425047] dark:text-[#d3ddd5]">
              <span className="inline-flex items-center gap-2"><Mail className="size-4 text-[#78917c]" aria-hidden="true" />{text.emailAddress}</span>
              <div className="flex h-11 items-center rounded-xl border border-[#e6eae5] bg-[#f7f8f6] px-3.5 text-sm font-normal text-[#7a857d] dark:border-[#34443a] dark:bg-[#202b23] dark:text-[#aebbb1]">{initialEmail}</div>
            </div>

            <fieldset className="grid gap-4 rounded-2xl border border-[#e5eae3] bg-[#fcfcfa] p-4 dark:border-[#34443a] dark:bg-[#151e18] sm:p-5">
              <legend className="px-1 text-sm font-semibold text-[#25342a] dark:text-[#e2eae4]">{text.taskPlanningSettings}</legend>
              <p className="-mt-2 text-xs leading-5 text-[#768078] dark:text-[#aebbb1]">{text.taskPlanningDescription}</p>
              <div className="grid gap-1.5 text-sm font-medium text-[#425047] dark:text-[#d3ddd5]">
                {text.planningMode}
                <TaskSelect
                  label={text.planningMode}
                  hideLabel
                  value={planningMode}
                  onChange={(value) => { setPlanningMode(value); setSaved(false); }}
                  options={[{ value: "basic", label: text.basicMode }, { value: "advanced", label: text.advancedMode }]}
                />
                <span className="text-xs font-normal leading-5 text-[#768078] dark:text-[#aebbb1]">{planningMode === "advanced" ? text.advancedModeDescription : text.basicModeDescription}</span>
              </div>
              <div className="grid gap-1.5 text-sm font-medium text-[#425047] dark:text-[#d3ddd5]">
                {text.timeZone}
                <TaskSelect
                  label={text.timeZone}
                  hideLabel
                  value={timeZone}
                  onChange={(value) => { setTimeZone(value); setSaved(false); }}
                  options={timeZones.map((zone) => ({ value: zone, label: zone.split("/").map((part) => part.replaceAll("_", " ")).join(" · ") }))}
                />
                <span className="text-xs font-normal text-[#768078] dark:text-[#aebbb1]">{text.timeZoneDescription} · {utcOffsetLabel(timeZone)}</span>
              </div>
            </fieldset>

            {error && <p role="alert" className="rounded-xl border border-[#efd4cf] bg-[#fff5f2] px-4 py-3 text-sm text-[#9a4538] dark:border-[#69453f] dark:bg-[#2a1c19] dark:text-[#f0b6aa]">{error}</p>}
            {saved && <p role="status" className="inline-flex items-center gap-2 text-sm font-medium text-[#28613c] dark:text-[#b9d8bd]"><Check className="size-4" aria-hidden="true" />{text.profileSaved}</p>}

            <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#edf0eb] pt-5 dark:border-[#2d3a31] sm:flex-row">
              <Link href="/dashboard" className="inline-flex h-11 items-center justify-center rounded-xl border border-[#dfe5de] px-5 text-sm font-semibold text-[#526056] outline-none transition hover:bg-[#f4f6f2] focus-visible:ring-2 focus-visible:ring-[#315d3c] dark:border-[#34443a] dark:text-[#d3ddd5] dark:hover:bg-[#253128]">{text.cancel}</Link>
              <button type="submit" disabled={!hasChanges || isSaving || isPreparingImage || !name.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#17452d] px-6 text-sm font-semibold text-white outline-none transition hover:bg-[#103a24] focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 dark:bg-[#2f6a46] dark:hover:bg-[#397a53]">
                {isSaving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}
                {text.saveProfile}
              </button>
            </div>
          </form>
        </div>
      </section>
      {isRemovePhotoDialogOpen && (
        <div className="fixed inset-0 z-[200] grid place-items-center bg-[#101812]/55 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsRemovePhotoDialogOpen(false); }}>
          <section role="alertdialog" aria-modal="true" aria-labelledby="remove-photo-title" aria-describedby="remove-photo-description" className="w-full max-w-md rounded-2xl border border-[#e5eae3] bg-white p-6 shadow-2xl shadow-black/20 dark:border-[#3a4b3e] dark:bg-[#1b271f]">
            <div className="grid size-11 place-items-center rounded-full bg-[#fff2ef] text-[#9a5548] dark:bg-[#392522] dark:text-[#e4aaa0]"><Trash2 className="size-5" aria-hidden="true" /></div>
            <h2 id="remove-photo-title" className="mt-4 text-lg font-semibold text-[#25342a] dark:text-[#e8eee9]">{text.removePhoto}</h2>
            <p id="remove-photo-description" className="mt-2 text-sm leading-6 text-[#768078] dark:text-[#b4c0b7]">{text.confirmRemovePhoto}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" autoFocus onClick={() => setIsRemovePhotoDialogOpen(false)} className="h-10 rounded-xl border border-[#dfe5de] px-4 text-sm font-semibold text-[#526056] outline-none hover:bg-[#f4f6f2] focus-visible:ring-2 focus-visible:ring-[#719378] dark:border-[#34443a] dark:text-[#d3ddd5] dark:hover:bg-[#253128]">{text.cancel}</button>
              <button type="button" onClick={removePhoto} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#a34f42] px-4 text-sm font-semibold text-white outline-none hover:bg-[#8f4035] focus-visible:ring-2 focus-visible:ring-[#c27d70] focus-visible:ring-offset-2"><Trash2 className="size-4" aria-hidden="true" />{text.removePhoto}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
