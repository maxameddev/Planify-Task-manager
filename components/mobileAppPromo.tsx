import { Apple, Check, Circle, Play, Plus, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/brandLogo";
import type { Messages } from "@/lib/i18n";

type MobileAppPromoProps = { text: Messages };

export function MobileAppPromo({ text }: MobileAppPromoProps) {
  const tasks = [text.samplePlan, text.firstTask, text.reviewProgress];

  return (
    <section className="px-5 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 rounded-[2rem] border border-[#e4e9df] bg-[#f4f6f0] p-6 text-[#18211c] shadow-[0_24px_70px_-45px_rgba(23,63,43,0.3)] dark:border-[#34443a] dark:bg-[#17231a] dark:text-[#e8eee9] sm:p-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:p-12 xl:p-14">
        <div className="flex min-w-0 flex-col justify-center">
          <Badge className="h-auto w-fit gap-2 rounded-full border border-[#315d3c]/35 bg-white/70 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.16em] text-[#214d31] hover:bg-white/70 dark:border-[#8fbd98]/40 dark:bg-[#24352a] dark:text-[#c3d9c5] dark:hover:bg-[#24352a]">
            <span className="size-1.5 rounded-full bg-[#27834a] dark:bg-[#a9d4a8]" />
            {text.mobileEyebrow}
          </Badge>
          <h2 className="mt-5 max-w-[18ch] text-3xl font-semibold tracking-[-0.045em] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">{text.mobileTitle}</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-[#59665d] dark:text-[#b4c0b7] sm:text-base">{text.mobileDescription}</p>

          <div className="mt-7 grid max-w-lg gap-3 sm:grid-cols-2">
            <div aria-label={`${text.appStore}: ${text.comingSoon}`} className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#315d3c]/30 bg-white/75 px-4 py-3.5 dark:border-[#526b58] dark:bg-[#1c2a20]">
              <Apple className="size-5 shrink-0 text-[#17482e] dark:text-[#b5cfb8]" aria-hidden="true" />
              <span className="min-w-0"><span className="block truncate text-sm font-semibold">{text.appStore}</span><span className="mt-0.5 block text-[10px] font-medium text-[#567b5d] dark:text-[#b5cfb8]">{text.comingSoon}</span></span>
            </div>
            <div aria-label={`${text.googlePlay}: ${text.comingSoon}`} className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#315d3c]/30 bg-white/75 px-4 py-3.5 dark:border-[#526b58] dark:bg-[#1c2a20]">
              <Play className="size-5 shrink-0 text-[#17482e] dark:text-[#b5cfb8]" aria-hidden="true" />
              <span className="min-w-0"><span className="block truncate text-sm font-semibold">{text.googlePlay}</span><span className="mt-0.5 block text-[10px] font-medium text-[#567b5d] dark:text-[#b5cfb8]">{text.comingSoon}</span></span>
            </div>
          </div>
        </div>

        <div role="img" aria-label={text.mobilePreviewLabel} className="relative mx-auto flex min-h-[540px] w-full max-w-[620px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#eaf0e5] px-3 py-8 dark:bg-[#202e23] sm:min-h-[520px] sm:px-6">
          <div aria-hidden="true" className="absolute -bottom-24 -left-12 size-80 rounded-full bg-[#d7e5d2] dark:bg-[#2b4131]" />
          <div aria-hidden="true" className="absolute -right-20 -top-16 size-80 rounded-full bg-[#dce8d7] dark:bg-[#273a2b]" />

          <div className="absolute left-[3%] top-[2%] z-20 w-[40%] max-w-[190px] rounded-2xl border border-white/80 bg-white/95 p-2 shadow-[0_18px_40px_-22px_rgba(23,63,43,0.35)] dark:border-[#405346] dark:bg-[#19251d] sm:left-[1%] sm:top-[27%] sm:w-[22%] sm:p-3">
            <div className="flex items-center justify-between gap-2 text-[8px] sm:text-[10px]"><span className="font-semibold">{text.mobileProgressTitle}</span><span className="font-semibold text-[#315d3c] dark:text-[#a9d4a8]">40%</span></div>
            <p className="mt-1 text-[7px] leading-tight text-[#718078] dark:text-[#a3b0a7] sm:text-[9px]">{text.mobileProgressCount}</p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#e5ece3] dark:bg-[#34443a]"><div className="h-full w-2/5 rounded-full bg-[#5c9567]" /></div>
          </div>

          <div className="relative z-10 h-[410px] w-[min(80%,240px)] rounded-[2rem] border-[3px] border-[#34433b] bg-[#34433b] p-[3px] shadow-[0_28px_65px_-25px_rgba(0,0,0,0.38)] ring-1 ring-[#9daaa0] sm:h-[460px] sm:w-[min(58%,270px)]">
            <div className="relative h-full overflow-hidden rounded-[1.65rem] bg-[#fafaf7] px-3.5 pb-3 pt-4 text-[#18211c] sm:px-4 sm:pt-5">
              <span aria-hidden="true" className="absolute left-1/2 top-1.5 size-2 -translate-x-1/2 rounded-full bg-[#17211a]" />
              <div className="mt-3 flex items-center justify-between">
                <BrandLogo size="sm" />
                <span className="grid size-7 place-items-center rounded-full bg-[#e7efe4] text-[10px] font-bold text-[#315d3c]">A</span>
              </div>
              <h3 className="mt-4 text-[13px] font-semibold leading-tight sm:text-[15px]">{text.mobileGreeting}</h3>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-[12px] font-semibold sm:text-sm">{text.mobileYourTasks}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#17482e] px-2 py-1 text-[8px] font-medium text-white sm:text-[9px]"><Plus className="size-3" />{text.mobileAddTask}</span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {[{ count: "3", label: text.waiting }, { count: "2", label: text.inProgress }, { count: "5", label: text.completed }].map(({ count, label }) => (
                  <div key={label} className="rounded-xl bg-[#edf2e9] px-2 py-2 dark:bg-[#e6ece3]">
                    <p className="text-[13px] font-semibold leading-none text-[#173f2b]">{count}</p>
                    <p className="mt-1 truncate text-[7px] text-[#59665d] sm:text-[8px]">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-xl border border-[#e7ebe4] bg-white p-2.5 shadow-sm">
                <div className="flex items-center justify-between text-[8px] sm:text-[9px]"><span className="font-semibold">{text.mobileProgressTitle}</span><span className="font-semibold text-[#315d3c]">40%</span></div>
                <p className="mt-1 text-[7px] text-[#718078] sm:text-[8px]">{text.mobileProgressCount}</p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#eaf1e9]"><div className="h-full w-2/5 rounded-full bg-[#6d9275]" /></div>
              </div>

              <div className="mt-3 space-y-2">
                {tasks.map((task, index) => (
                  <div key={task} className="flex items-center gap-2 rounded-xl border border-[#e9ece7] bg-white px-2.5 py-2 shadow-sm">
                    <span className={`grid size-4 shrink-0 place-items-center rounded-full ${index === 0 ? "bg-[#5c9567] text-white" : "border border-[#cbd7cb] text-transparent"}`}>{index === 0 ? <Check className="size-2.5" /> : <Circle className="size-2" />}</span>
                    <span className={`min-w-0 flex-1 truncate text-[8px] sm:text-[9px] ${index === 0 ? "text-[#89928a] line-through" : "font-medium text-[#344139]"}`}>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-3 left-3 z-20 flex max-w-[38%] items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-2.5 py-1.5 text-[8px] text-[#59665d] shadow-sm dark:border-[#405346] dark:bg-[#19251d] dark:text-[#b4c0b7] sm:bottom-4 sm:left-5 sm:text-[9px]">
            <TrendingUp className="size-3 shrink-0 text-[#315d3c] dark:text-[#a9d4a8]" />
            <span className="truncate">{text.mobileIllustrationNote}</span>
          </div>

          <div className="absolute bottom-[2%] right-[3%] z-20 w-[42%] max-w-[190px] rounded-2xl border border-white/80 bg-white/95 p-2 shadow-[0_18px_40px_-22px_rgba(23,63,43,0.35)] dark:border-[#405346] dark:bg-[#19251d] sm:bottom-[20%] sm:right-[1%] sm:w-[22%] sm:p-3">
            <div className="flex min-w-0 items-center gap-2 text-[8px] leading-tight sm:text-[9px]">
              <span className="grid size-4 shrink-0 place-items-center rounded-full bg-[#5c9567] text-white"><Check className="size-2.5" /></span>
              <span className="min-w-0 text-[#718078] line-through">{text.samplePlan}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
