"use client";

import { HeroHeadline } from "@/components/heroHeadline";
import { MobileNavigation } from "@/components/mobileNavigation";
import { ProfileAvatar } from "@/components/profileAvatar";

import Link from "next/link";
import { BrandLogo } from "@/components/brandLogo";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { ThemeSwitcher } from "@/components/themeSwitcher";
import { useLanguage } from "@/components/languageProvider";
import { MobileAppPromo } from "@/components/mobileAppPromo";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Briefcase, ChartNoAxesColumnIncreasing, Check, GraduationCap, Laptop, ListChecks, LogIn, Play, ShieldCheck, UserRound, Users, Zap } from "lucide-react";
import { LandingDashboardPreview } from "@/components/landingDashboardPreview";
import { authClient } from "@/features/auth/client";

export default function Home() {
  const { text } = useLanguage();
  const { data: session, isPending } = authClient.useSession();
  const isSignedIn = Boolean(session?.user);
  const features = [
    { number: "01", icon: ListChecks, title: text.featureOneTitle, description: text.featureOneBody },
    { number: "02", icon: ChartNoAxesColumnIncreasing, title: text.featureTwoTitle, description: text.featureTwoBody },
    { number: "03", icon: UserRound, title: text.featureThreeTitle, description: text.featureThreeBody },
  ];
  const testimonials = [
    { name: text.testimonialNameOne, role: text.testimonialRoleOne, quote: text.testimonialQuoteOne, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=85" },
    { name: text.testimonialNameTwo, role: text.testimonialRoleTwo, quote: text.testimonialQuoteTwo, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=85" },
    { name: text.testimonialNameThree, role: text.testimonialRoleThree, quote: text.testimonialQuoteThree, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=85" },
  ];
  const audiences = [
    { kind: "manager", icon: Briefcase, title: text.audienceManagerTitle, description: text.audienceManagerBody, image: "https://images.unsplash.com/photo-1758598306493-99e22e718e08?auto=format&fit=crop&w=1200&h=675&q=85" },
    { kind: "student", icon: GraduationCap, title: text.audienceStudentTitle, description: text.audienceStudentBody, image: "https://images.unsplash.com/photo-1758685848895-e724272475d2?auto=format&fit=crop&w=1200&h=675&q=85" },
    { kind: "professional", icon: Laptop, title: text.audienceProfessionalTitle, description: text.audienceProfessionalBody, image: "https://images.unsplash.com/photo-1758611970983-ff9f0ec0b0c0?auto=format&fit=crop&w=1200&h=675&q=85" },
    { kind: "team", icon: Users, title: text.audienceTeamTitle, description: text.audienceTeamBody, image: "https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5?auto=format&fit=crop&w=1200&h=675&q=85" },
  ] as const;

  return (
    <main data-language-content className="min-h-screen overflow-x-clip bg-[#f8f8f5] text-[#18211c] dark:bg-[#111914] dark:text-[#e8eee9]">
      <header className="sticky top-3 z-50 mx-auto mt-3 flex w-[calc(100%-2rem)] max-w-[1500px] items-center justify-between gap-2 rounded-full border border-[#e3e9e2] bg-white/95 px-4 py-1 shadow-[0_12px_32px_-20px_rgba(23,63,43,0.3)] backdrop-blur-md dark:border-[#34443a] dark:bg-[#18221b]/95 sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)] lg:px-6 lg:py-2 2xl:px-8">
        <Link href="/" aria-label={text.homeLabel} className="shrink-0">
          <BrandLogo size="sm" />
        </Link>
        <nav className="hidden items-center gap-0 lg:flex" aria-label={text.mainNavigation}>
          <a href="#features" className="rounded-full px-2 py-2 text-[13px] font-medium text-[#526057] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 dark:text-[#c3cec6] dark:hover:bg-[#29372e] xl:px-2.5 xl:text-sm">
            {text.featuresLink}
          </a>
          <a href="#pricing" className="rounded-full px-2 py-2 text-[13px] font-medium text-[#526057] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 dark:text-[#c3cec6] dark:hover:bg-[#29372e] xl:px-2.5 xl:text-sm">
            {text.pricingLink}
          </a>
          <a href="#audience" className="rounded-full px-2 py-2 text-[13px] font-medium text-[#526057] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 dark:text-[#c3cec6] dark:hover:bg-[#29372e] xl:px-2.5 xl:text-sm">
            {text.audienceNavLink}
          </a>
          <a href="#testimonials" className="rounded-full px-2 py-2 text-[13px] font-medium text-[#526057] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 dark:text-[#c3cec6] dark:hover:bg-[#29372e] xl:px-2.5 xl:text-sm">
            {text.testimonialsNavLink}
          </a>
        </nav>
        <nav className="hidden shrink-0 items-center gap-1 sm:gap-1.5 lg:flex xl:gap-2" aria-label={text.accountNavigation}>
          <ThemeSwitcher />
          <LanguageSwitcher />
          {isPending ? (
            <span aria-live="polite" aria-busy="true" className="rounded-full bg-[#173f2b]/70 px-3.5 py-2.5 text-xs font-semibold text-white sm:px-5 sm:text-sm">{text.checkingSession}</span>
          ) : isSignedIn ? (
            <Link href="/dashboard" aria-label={text.goToDashboard} className="inline-flex items-center gap-2 rounded-full bg-[#173f2b] py-1.5 pl-1.5 pr-4 text-xs font-semibold text-white transition hover:bg-[#24583b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 sm:text-sm">
              <ProfileAvatar key={session?.user?.image || "initial"} image={session?.user?.image} name={session?.user?.name} email={session?.user?.email} className="size-8" />
              <span>{text.goToDashboard}</span><span aria-hidden="true">→</span>
            </Link>
          ) : (
            <>
              <Link href="/login" aria-label={text.signInLink} className="inline-flex size-9 items-center justify-center rounded-full text-sm font-medium text-[#526057] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 dark:text-[#c3cec6] dark:hover:bg-[#29372e] sm:h-auto sm:w-auto sm:px-3 sm:py-2">
                <LogIn className="size-4 sm:hidden" aria-hidden="true" /><span className="hidden sm:inline">{text.signInLink}</span>
              </Link>
              <Link href="/register" className="rounded-full bg-[#173f2b] px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#24583b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 sm:px-5 sm:text-sm">
                <span className="hidden sm:inline">{text.heroPrimary}</span><span className="sm:hidden">{text.startNow}</span><span aria-hidden="true" className="ml-1">→</span>
              </Link>
            </>
          )}
        </nav>
        <MobileNavigation isSignedIn={isSignedIn} isPending={isPending} userName={session?.user?.name} userEmail={session?.user?.email} userImage={session?.user?.image} />
      </header>

      <section className="relative mx-auto grid w-full max-w-[1600px] items-center gap-10 px-5 pb-12 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[0.96fr_1.04fr] lg:gap-4 lg:px-8 lg:pb-2 lg:pt-3 xl:gap-5 2xl:px-10">
        <div className="relative z-10 max-w-[700px]">
          <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#d7e1d9] bg-white/75 px-4 py-2.5 text-xs font-semibold text-[#173f2b] shadow-sm dark:border-[#34443a] dark:bg-[#18221b]/80 dark:text-[#b5cfb8] sm:text-sm">
            <span className="size-2.5 rounded-full bg-[#17984d] shadow-[0_0_0_3px_rgba(23,152,77,0.12)]" />{text.heroEyebrow}
          </p>
          <HeroHeadline lead={text.headlineLead} middle={text.headlineMiddle} accent={text.headlineAccent} />
          <p className="mt-5 max-w-[630px] text-base leading-7 text-[#525d55] dark:text-[#b4c0b7] xl:mt-6 xl:text-lg xl:leading-8">{text.heroDescription}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center xl:mt-7">
            {isPending ? (
              <span aria-live="polite" aria-busy="true" className="inline-flex h-12 items-center justify-center rounded-full bg-[#10482e]/70 px-7 text-sm font-semibold text-white xl:h-14 xl:px-8 xl:text-base">{text.checkingSession}</span>
            ) : (
              <Link href={isSignedIn ? "/dashboard" : "/register"} className="inline-flex h-12 items-center justify-center rounded-full bg-[#10482e] px-7 text-sm font-semibold text-white shadow-[0_10px_25px_-14px_rgba(16,72,46,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1b5c3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 xl:h-14 xl:px-8 xl:text-base">
                {isSignedIn ? text.viewMyTasks : text.heroPrimary}<span aria-hidden="true" className="ml-2 text-lg">→</span>
              </Link>
            )}
            <a href="#features" className="inline-flex h-12 items-center justify-center rounded-full border border-[#cfd7d0] bg-white/70 px-6 text-sm font-semibold text-[#17221b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 dark:border-[#435247] dark:bg-[#18221b] dark:text-[#e8eee9] dark:hover:bg-[#24352a] xl:h-14 xl:px-7 xl:text-base">
              <Play className="mr-2 size-5 fill-current" aria-hidden="true" />{text.heroSecondary}
            </a>
          </div>
        </div>
        <div className="relative z-0 py-3 lg:py-0"><LandingDashboardPreview text={text} /></div>
      </section>

      <section aria-label={text.trustOrganizeTitle} className="mx-auto grid w-full max-w-[1500px] gap-6 px-6 pb-14 pt-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:px-8 lg:py-4 2xl:px-10">
        {[
          { icon: Users, title: text.trustOrganizeTitle, detail: text.trustOrganizeBody },
          { icon: ChartNoAxesColumnIncreasing, title: text.trustProgressTitle, detail: text.trustProgressBody },
          { icon: ShieldCheck, title: text.trustPrivateTitle, detail: text.trustPrivateBody },
          { icon: Zap, title: text.trustSimpleTitle, detail: text.trustSimpleBody },
        ].map(({ icon: Icon, title, detail }, index) => (
          <div key={index} className={`flex items-center gap-4 ${index ? "lg:border-l lg:border-[#cfd7d0] lg:pl-8 xl:pl-12" : ""}`}>
            <Icon className="size-9 shrink-0 text-[#176b3a] dark:text-[#a6c5a9]" aria-hidden="true" />
            <div><p className="text-base font-semibold leading-tight">{title}</p><p className="mt-1 text-sm text-[#59665d] dark:text-[#b4c0b7]">{detail}</p></div>
          </div>
        ))}
      </section>

      <section id="features" className="scroll-mt-24 border-t border-[#e9ece7] bg-white/55 dark:border-[#2d3a31] dark:bg-[#18221b]/70">
        <div className="mx-auto w-full max-w-[1500px] px-6 py-14 lg:px-10 lg:py-16">
          <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-11">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#eaf1e9] px-4 py-2 text-sm font-semibold text-[#214d31] dark:bg-[#24352a] dark:text-[#b9d1bc]">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-[#17984d] shadow-[0_0_0_3px_rgba(23,152,77,0.12)]" />{text.featuresLink}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl lg:text-5xl">{text.howItWorksTitle}</h2>
            <p className="mt-3 text-base leading-7 text-[#626f65] dark:text-[#b4c0b7]">{text.howItWorksDescription}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {features.map(({ number, icon: Icon, title, description }) => (
              <article key={number} className="h-full min-h-[220px] rounded-[1.5rem] border border-[#dfe5de] bg-[#fcfcf9]/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9d8ca] hover:shadow-[0_18px_45px_-32px_rgba(23,63,43,0.35)] dark:border-[#34443a] dark:bg-[#151e18] dark:hover:border-[#526b58] sm:p-7">
                <span className="mb-5 grid size-[68px] place-items-center rounded-[1.3rem] bg-[#e8f0e6] text-[#17482e] dark:bg-[#24392b] dark:text-[#b5cfb8]">
                  <Icon className="size-9 stroke-[1.8]" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold tracking-[-0.025em] sm:text-xl">{title}</h3>
                <p className="mt-2 max-w-[34ch] text-base leading-7 text-[#626f65] dark:text-[#b4c0b7]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 px-5 pb-14 sm:px-6 lg:px-10 lg:pb-16">
        <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-6 overflow-hidden rounded-[1.75rem] border border-[#e3e9df] bg-[#f0f4ed] px-6 py-7 dark:border-[#34443a] dark:bg-[#1a291e] sm:px-9 sm:py-8 lg:grid-cols-[minmax(0,1fr)_150px_auto] lg:gap-8 lg:px-12 lg:py-8 xl:px-16">
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-12 size-52 rounded-full bg-[#74ad7c]/20 blur-[1px] dark:bg-[#31533a]/25" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 size-56 rounded-full bg-[#c7dfbd]/35 dark:bg-[#31533a]/30" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{text.pricingTitle}</h2>
            <p className="mt-2 text-base leading-6 text-[#626f65] dark:text-[#b4c0b7]">{text.pricingDescription}</p>
          </div>
          <div aria-hidden="true" className="relative z-10 hidden h-[108px] w-[150px] place-self-center rounded-2xl border border-white/90 bg-white/75 p-3 shadow-[0_14px_32px_-24px_rgba(23,63,43,0.45)] dark:border-[#3b4c40] dark:bg-[#202e24] sm:block">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-[#e7f0e5] text-[#235d38] dark:bg-[#2d4433] dark:text-[#b5cfb8]"><ListChecks className="size-4" /></span>
              <span className="h-2 w-14 rounded-full bg-[#dce5dc] dark:bg-[#405346]" />
            </div>
            <div className="space-y-2.5">
              {[0, 1, 2].map((item) => <div key={item} className="flex items-center gap-2"><span className={`grid size-3.5 place-items-center rounded-full ${item === 0 ? "bg-[#4d8b5e] text-white" : "border border-[#c6d4c8] bg-white dark:border-[#657a69] dark:bg-[#1a291e]"}`}>{item === 0 && <Check className="size-2.5" />}</span><span className={`h-1.5 rounded-full ${item === 0 ? "w-20 bg-[#d5e1d5] dark:bg-[#405346]" : "w-24 bg-[#e6ebe5] dark:bg-[#34443a]"}`} /></div>)}
            </div>
          </div>
          {isPending ? (
            <span aria-live="polite" aria-busy="true" className="relative z-10 inline-flex h-12 w-fit shrink-0 items-center justify-center rounded-full bg-[#10482e]/70 px-7 text-sm font-semibold text-white sm:text-base">{text.checkingSession}</span>
          ) : (
            <Link href={isSignedIn ? "/dashboard" : "/register"} className="relative z-10 inline-flex h-12 w-fit shrink-0 items-center justify-center rounded-full bg-[#10482e] px-7 text-sm font-semibold text-white shadow-[0_10px_25px_-14px_rgba(16,72,46,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1b5c3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 sm:text-base">{isSignedIn ? text.viewMyTasks : text.pricingCta}<span aria-hidden="true" className="ml-2 text-lg">→</span></Link>
          )}
        </div>
      </section>

      <section id="audience" className="scroll-mt-24 border-t border-[#e9ece7] bg-[#f1f4ef] dark:border-[#2d3a31] dark:bg-[#151e18]">
        <div className="mx-auto w-full max-w-[1600px] px-6 py-14 lg:px-10 lg:py-16">
          <div className="mx-auto mb-9 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{text.audienceTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-[#626f65] dark:text-[#b4c0b7]">{text.audienceDescription}</p>
          </div>
          <div className="grid auto-rows-fr items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4 2xl:gap-5">
            {audiences.map(({ kind, icon: Icon, title, description, image }) => (
              <Card key={kind} className="h-full min-h-[390px] gap-0 rounded-3xl border-[#e3e9e2] bg-white py-0 shadow-sm ring-0 transition-shadow duration-300 hover:shadow-[0_18px_45px_-32px_rgba(23,63,43,0.35)] dark:border-[#2d3a31] dark:bg-[#1a251e]">
                <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-t-3xl bg-[#e8eee8]">
                  <Image src={image} alt={title} fill unoptimized sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw" className="object-cover object-center brightness-[0.94] saturate-[0.88] transition-transform duration-500 hover:scale-[1.03]" />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#173f2b]/10 via-transparent to-[#f1dfbf]/10" />
                </div>
                <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex min-h-12 items-center gap-3">
                    <Icon className="size-9 shrink-0 text-[#567b43] dark:text-[#a6c5a9]" strokeWidth={1.9} aria-hidden="true" />
                    <h3 className="text-lg font-semibold leading-tight tracking-[-0.02em]">{title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#626f65] dark:text-[#b4c0b7]">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="scroll-mt-24 border-t border-[#e9ece7] dark:border-[#2d3a31]">
        <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
          <div className="mx-auto mb-9 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{text.testimonialsTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-[#626f65] dark:text-[#b4c0b7]">{text.testimonialsDescription}</p>
          </div>
          <div className="grid items-start gap-7 md:grid-cols-3 md:gap-5 xl:gap-8">
            {testimonials.map((testimonial, index) => (
              <article key={testimonial.name} className="flex h-full flex-col">
                <div className="mb-4 flex min-w-0 items-center gap-3">
                  <Image src={testimonial.photo} alt={testimonial.name} width={96} height={96} sizes="48px" className="size-12 shrink-0 rounded-full object-cover ring-2 ring-[#e5ede4] dark:ring-[#34443a]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#26352b] dark:text-[#e0e9e2]">{testimonial.name}</p>
                    <p className="mt-0.5 text-xs text-[#626f65] dark:text-[#aab7ad]">{testimonial.role}</p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-[#eaf1e9] px-2.5 py-1 text-[10px] font-semibold text-[#41604a] dark:bg-[#24352a] dark:text-[#c3d9c5]">{text.testimonialSampleLabel}</span>
                </div>
                <div className={`relative flex-1 rounded-[1.5rem] border p-6 shadow-[0_14px_36px_-30px_rgba(23,63,43,0.35)] ${index === 1 ? "border-[#e3e9e2] bg-white dark:border-[#34443a] dark:bg-[#1a251e]" : "border-[#dfe8dc] bg-[#eef3eb] dark:border-[#34443a] dark:bg-[#202d24]"}`}>
                  <span aria-hidden="true" className={`absolute -top-2 left-7 size-4 rotate-45 border-l border-t ${index === 1 ? "border-[#e3e9e2] bg-white dark:border-[#34443a] dark:bg-[#1a251e]" : "border-[#dfe8dc] bg-[#eef3eb] dark:border-[#34443a] dark:bg-[#202d24]"}`} />
                  <blockquote className="relative text-base leading-7 text-[#344139] dark:text-[#dce5de]">{testimonial.quote}</blockquote>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MobileAppPromo text={text} />

      <footer className="mx-auto max-w-7xl px-6 py-8 text-[#626f65] dark:text-[#a3b0a7] lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-2">
            <BrandLogo size="sm" />
            <p className="text-sm text-[#59665d] dark:text-[#b4c0b7]">{text.footerLine}</p>
          </div>
          <nav aria-label={text.sectionNavigation} className="flex items-center gap-5 text-sm font-medium">
            <a href="#features" className="transition-colors hover:text-[#173f2b] dark:hover:text-[#b5cfb8]">{text.featuresLink}</a>
            <a href="#pricing" className="transition-colors hover:text-[#173f2b] dark:hover:text-[#b5cfb8]">{text.pricingLink}</a>
            {isPending ? <span aria-live="polite" aria-busy="true">{text.checkingSession}</span> : <Link href={isSignedIn ? "/dashboard" : "/login"} className="transition-colors hover:text-[#173f2b] dark:hover:text-[#b5cfb8]">{isSignedIn ? text.goToDashboard : text.signInLink}</Link>}
          </nav>
        </div>
        <div className="mt-6 border-t border-[#e3e9e2] pt-4 text-xs dark:border-[#34443a]">
          <span>© 2026 Planify</span>
        </div>
      </footer>
    </main>
  );
}
