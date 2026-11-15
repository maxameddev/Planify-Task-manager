import { Check, FileCheck, Menu, MoreVertical, Sun } from "lucide-react";
import type { Messages } from "@/lib/i18n";

export function MobileHeroPreview({ text }: { text: Messages }) {
  const tasks = ["Gym", text.previewTaskTwo, text.previewTaskThree];

  return (
    <div role="img" aria-label={text.previewLabel} className="relative mx-auto mt-7 flex h-[400px] w-full max-w-[350px] items-center justify-center overflow-hidden sm:hidden">
      <div aria-hidden="true" className="absolute bottom-8 size-[280px] rounded-full bg-[#dcf1de] dark:bg-[#233b2a]" />
      <div aria-hidden="true" className="absolute -bottom-16 -left-20 h-32 w-[500px] -rotate-6 rounded-[50%] bg-[#e1f4e2] dark:bg-[#1c3323]" />
      <div aria-hidden="true" className="absolute right-3 top-12 z-10 grid size-[62px] place-items-center rounded-full bg-[#f8f8f5] text-center text-sm font-bold leading-tight text-[#14532d] shadow-sm ring-[6px] ring-[#99d7a4] dark:bg-[#18221b] dark:text-[#dcebdc]"><span>1/3<br /><span className="text-[9px]">{text.previewTasksStat}</span></span></div>
      <div aria-hidden="true" className="absolute right-[48px] top-[185px] z-10 h-[170px] w-[7px] rotate-[-10deg] rounded-t-full border border-[#38443d] bg-gradient-to-r from-[#25322b] via-[#78857d] to-[#27342d] shadow-md"><span className="absolute -bottom-[8px] left-1/2 h-[8px] w-[3px] -translate-x-1/2 rounded-b-full bg-[#202b24]" /></div>
      <div aria-hidden="true" className="relative h-[340px] w-[180px] -rotate-[5deg] overflow-hidden rounded-[25px] border-[4px] border-[#27332d] bg-[#fbfcfa] shadow-[7px_12px_20px_-10px_rgba(16,54,31,0.55)] ring-1 ring-[#a3afa7] dark:border-[#42614a] dark:bg-[#16221a]">
        <div className="absolute left-1/2 top-1.5 size-2 -translate-x-1/2 rounded-full bg-[#1d2b22]" />
        <div className="px-3 pb-3 pt-6 text-left text-[#17221b] dark:text-[#e8eee9]">
          <div className="flex items-center justify-between pb-2"><span className="flex items-center gap-1 text-[10px] font-bold"><span className="grid size-5 place-items-center rounded-md bg-[#10482e] text-white"><FileCheck className="size-3" /></span>Planify</span><span className="flex items-center gap-2"><Sun className="size-3" /><Menu className="size-3" /></span></div>
          <p className="mt-3 text-base font-bold tracking-tight">{text.previewTaskList}</p>
          <div className="mt-2 flex gap-1 text-[7px] font-medium"><span className="rounded-full bg-[#17984d] px-2 py-1 text-white">{text.today}</span><span className="rounded-full bg-[#edf1ec] px-2 py-1 text-[#4b5d50]">{text.previewProgressStat}</span><span className="rounded-full bg-[#edf1ec] px-2 py-1 text-[#4b5d50]">{text.completed}</span></div>
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
