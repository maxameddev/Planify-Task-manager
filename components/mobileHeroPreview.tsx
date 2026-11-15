import { Check, Menu } from "lucide-react";
import type { Messages } from "@/lib/i18n";

export function MobileHeroPreview({ text }: { text: Messages }) {
  const tasks = ["Gym", text.previewTaskTwo, text.previewTaskThree];

  return (
    <div role="img" aria-label={text.previewLabel} className="relative mx-auto mt-6 flex h-[268px] w-full max-w-[340px] items-center justify-center sm:hidden">
      <div aria-hidden="true" className="absolute size-[240px] rounded-full bg-[#e9f1e5] dark:bg-[#233b2a]" />
      <div aria-hidden="true" className="absolute right-3 top-7 z-10 grid size-12 place-items-center rounded-full bg-[#f8f8f5] text-xs font-bold text-[#235d38] shadow-sm ring-[5px] ring-[#73a97b] dark:bg-[#18221b] dark:text-[#dcebdc]">1/3</div>
      <div aria-hidden="true" className="relative h-[250px] w-[158px] rotate-[-5deg] overflow-hidden rounded-[27px] border-[6px] border-[#19382a] bg-[#fbfcfa] shadow-[0_16px_28px_-14px_rgba(16,54,31,0.55)] dark:border-[#42614a] dark:bg-[#16221a]">
        <div className="absolute left-1/2 top-1 h-2 w-11 -translate-x-1/2 rounded-full bg-[#18362a]" />
        <div className="px-2.5 pb-3 pt-5 text-[#17221b] dark:text-[#e8eee9]">
          <div className="flex items-center justify-between border-b border-[#e6ebe5] pb-2 dark:border-[#34443a]"><span className="text-[10px] font-bold">✓ Planify</span><Menu className="size-3" /></div>
          <p className="mt-3 text-xs font-bold">{text.previewTaskList}</p>
          <div className="mt-2 space-y-2.5">
            {tasks.map((task, index) => (
              <div key={task} className="flex min-w-0 items-center gap-1.5 text-[8px]">
                <span className={`grid size-3.5 shrink-0 place-items-center rounded border ${index === 0 ? "border-[#317a49] bg-[#317a49] text-white" : "border-[#aabaae]"}`}>{index === 0 && <Check className="size-2.5" />}</span>
                <span className="truncate">{task}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-[#e6ebe5] pt-2 dark:border-[#34443a]"><div className="flex items-center justify-between text-[8px] font-semibold"><span>{text.previewProgressTitle}</span><span>1/3</span></div><div className="mt-1.5 h-1.5 rounded-full bg-[#e3ebe2] dark:bg-[#34443a]"><div className="h-full w-1/3 rounded-full bg-[#4d8b5e]" /></div></div>
        </div>
      </div>
    </div>
  );
}
