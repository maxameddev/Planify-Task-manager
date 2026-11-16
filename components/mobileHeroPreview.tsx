import { Check, Menu, MoreVertical, Sun } from "lucide-react";
import { BrandMark } from "@/components/brandLogo";
import type { Messages } from "@/lib/i18n";

export function MobileHeroPreview({ text }: { text: Messages }) {
  const tasks = ["Gym", text.previewTaskTwo, text.previewTaskThree];

  return (
    <div role="img" aria-label={text.previewLabel} className="relative mx-auto mt-3 flex h-[360px] w-full max-w-[390px] items-center justify-center overflow-hidden sm:hidden">
      <div aria-hidden="true" className="absolute bottom-8 size-[265px] rounded-full bg-[#ddf4df] dark:bg-[#233b2a]" />
      <div aria-hidden="true" className="absolute -bottom-[73px] -left-24 h-36 w-[480px] -rotate-6 rounded-[50%] bg-[#d8f1dd] dark:bg-[#1c3323]" />
      <div aria-hidden="true" className="absolute -bottom-[83px] -right-24 h-36 w-[480px] rotate-6 rounded-[50%] bg-[#e9f8eb] dark:bg-[#223c29]" />
      <div aria-hidden="true" className="absolute right-[8%] top-9 z-20 grid size-[62px] place-items-center rounded-full bg-[conic-gradient(#16a34a_0deg_120deg,#d2efda_120deg_360deg)] p-[6px] shadow-sm"><span className="grid size-full place-content-center rounded-full bg-[#f8f8f5] text-center text-sm font-bold leading-tight text-[#14532d] dark:bg-[#18221b] dark:text-[#dcebdc]">1/3<br /><span className="text-[9px]">{text.previewTasksStat}</span></span></div>
      <div aria-hidden="true" className="absolute right-[21%] top-[158px] z-20 h-[164px] w-[8px] -rotate-[11deg] rounded-full border border-[#7f8983] bg-gradient-to-r from-[#69756d] via-[#e0e5e1] to-[#59665e] shadow-[2px_3px_3px_rgba(0,0,0,.25)]"><span className="absolute -bottom-[7px] left-1/2 h-[7px] w-[3px] -translate-x-1/2 rounded-b-full bg-[#323d36]" /></div>
      <div aria-hidden="true" className="relative z-10 h-[320px] w-[175px] -rotate-[5deg] overflow-hidden rounded-[9px] border-[4px] border-[#35413a] bg-[#fbfcfa] shadow-[5px_10px_16px_-7px_rgba(16,54,31,0.55)] ring-2 ring-[#a3afa7] dark:border-[#42614a] dark:bg-[#16221a]">
        <div className="absolute left-1/2 top-1.5 size-2 -translate-x-1/2 rounded-full bg-[#1d2b22]" />
        <div className="px-3 pb-3 pt-6 text-left text-[#17221b] dark:text-[#e8eee9]">
          <div className="flex items-center justify-between pb-2"><span className="flex items-center gap-1 text-[10px] font-bold text-[#173f2b] dark:text-[#dcebdc]"><BrandMark className="h-4 w-6" />Planify</span><span className="flex items-center gap-2"><Sun className="size-3" /><Menu className="size-3" /></span></div>
          <p className="mt-3 text-base font-bold tracking-tight">{text.previewTaskList}</p>
          <div className="mt-2 flex gap-1 whitespace-nowrap text-[6px] font-medium"><span className="rounded-full bg-[#17984d] px-1.5 py-1 text-white">{text.today}</span><span className="rounded-full bg-[#edf1ec] px-1.5 py-1 text-[#4b5d50]">{text.previewProgressStat}</span><span className="rounded-full bg-[#edf1ec] px-1.5 py-1 text-[#4b5d50]">{text.completed}</span></div>
          <div className="mt-4 space-y-3">
            {tasks.map((task, index) => (
              <div key={task} className="flex min-w-0 items-center gap-1.5 text-[9px]">
                <span className={`grid size-4 shrink-0 place-items-center rounded border ${index === 0 ? "border-[#17984d] bg-[#17984d] text-white" : "border-[#aabaae]"}`}>{index === 0 && <Check className="size-3" />}</span>
                <span className="min-w-0 flex-1 truncate">{task}</span><MoreVertical className="size-3 shrink-0" />
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-white p-2 shadow-sm dark:bg-[#24352a]"><div className="flex items-center justify-between text-[10px] font-bold"><span>{text.previewProgressTitle}</span><span>1/3</span></div><div className="mt-2 h-2 rounded-full bg-[#e3ebe2] dark:bg-[#34443a]"><div className="h-full w-1/3 rounded-full bg-[#17984d]" /></div></div>
        </div>
      </div>
    </div>
  );
}
