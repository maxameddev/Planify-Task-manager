import {
  Bell,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  CheckCircle2,
  CircleUserRound,
  Folder,
  Home,
  ListChecks,
  Search,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import type { Messages } from "@/lib/i18n";

type LandingDashboardPreviewProps = { text: Messages };

export function LandingDashboardPreview({ text }: LandingDashboardPreviewProps) {
  const navigation = [
    { label: text.previewHome, icon: Home, active: true },
    { label: text.previewMyTasks, icon: ListChecks, active: false },
    { label: text.previewProjects, icon: Folder, active: false },
    { label: text.previewCalendar, icon: CalendarDays, active: false },
    { label: text.previewTeam, icon: Users, active: false },
    { label: text.previewSettings, icon: Settings, active: false },
  ];
  const stats = [
    { value: "12", label: text.previewTasksStat, icon: CheckCircle2, tone: "bg-[#dcf7e7] text-[#16a34a]" },
    { value: "5", label: text.previewProgressStat, icon: ChartNoAxesColumnIncreasing, tone: "bg-[#e0efff] text-[#3b82f6]" },
    { value: "7", label: text.previewCompletedStat, icon: CheckCircle2, tone: "bg-[#dcf7e7] text-[#16a34a]" },
    { value: "2", label: text.previewOverdueStat, icon: Zap, tone: "bg-[#fff0ec] text-[#ef6545]" },
  ];
  const tasks = [
    { title: text.previewTaskOne, tag: text.previewTagVideo, complete: true, tagStyle: "bg-[#dcf7e7] text-[#198044]" },
    { title: text.previewTaskTwo, tag: text.previewTagWeb, complete: false, tagStyle: "bg-[#e2f0ff] text-[#2872c7]" },
    { title: text.previewTaskThree, tag: text.previewTagResearch, complete: false, tagStyle: "bg-[#fff0df] text-[#bd641c]" },
    { title: text.previewTaskFour, tag: text.previewTagPlanning, complete: false, tagStyle: "bg-[#f0e8ff] text-[#7140bd]" },
  ];

  return (
    <div role="img" aria-label={text.previewLabel} className="relative mx-auto w-full max-w-[780px] lg:justify-self-end">
      <div aria-hidden="true" className="absolute -inset-x-3 inset-y-5 -z-10 rotate-[-8deg] rounded-[3rem] bg-gradient-to-br from-[#a6dcac] via-[#72bd83] to-[#39935d] opacity-90 sm:-inset-x-6 sm:inset-y-8" />
      <div aria-hidden="true" className="absolute -bottom-5 left-1/3 -z-10 size-24 rounded-full bg-[#72bd83]/30 blur-2xl sm:size-36" />
      <div className="overflow-hidden rounded-[1.45rem] border-[5px] border-white/90 bg-white shadow-[0_30px_90px_-36px_rgba(14,58,34,0.48)] ring-1 ring-[#174c31]/10 transition-transform duration-500 ease-out motion-safe:hover:-translate-y-1 motion-reduce:transition-none dark:border-[#26382d] dark:bg-[#16221a] dark:ring-white/10 sm:rounded-[1.8rem] sm:border-[7px]">
        <div aria-hidden="true" className="grid min-h-[360px] grid-cols-[48px_minmax(0,1fr)] sm:min-h-[400px] sm:grid-cols-[132px_minmax(0,1fr)] lg:min-h-[clamp(350px,29vw,410px)] lg:grid-cols-[130px_minmax(0,1fr)] xl:grid-cols-[150px_minmax(0,1fr)]">
          <aside className="flex flex-col bg-gradient-to-b from-[#0c3a29] to-[#082f22] px-1.5 py-3 text-white sm:px-3 sm:py-4">
            <div className="mb-5 flex items-center justify-center gap-2 sm:mb-7 sm:justify-start">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Check className="size-4" aria-hidden="true" />
              </span>
              <span className="hidden text-sm font-semibold tracking-tight sm:inline">Planify</span>
            </div>
            <nav aria-label={text.mainNavigation} className="space-y-1">
              {navigation.map(({ label, icon: Icon, active }) => (
                <div key={label} className={`flex h-9 items-center justify-center gap-2 rounded-lg px-1 text-[10px] sm:justify-start sm:px-2 sm:text-[11px] ${active ? "bg-[#286044] text-white shadow-sm" : "text-white/70"}`}>
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="hidden truncate sm:inline">{label}</span>
                </div>
              ))}
            </nav>
            <div className="mt-auto hidden items-center gap-2 border-t border-white/10 pt-4 sm:flex">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#d8e4d9] text-[10px] font-bold text-[#17452e]">M</span>
              <span className="min-w-0 text-[10px] leading-4"><span className="block truncate font-medium">Maxamed M.</span><span className="text-white/55">Planify</span></span>
            </div>
          </aside>

          <div className="min-w-0 bg-[#fbfcfa] p-2.5 text-[#17221b] dark:bg-[#121a15] dark:text-[#e8eee9] sm:p-4 lg:p-5">
            <div className="mb-4 flex items-center justify-between gap-2 sm:mb-5">
              <div className="min-w-0">
                <h2 className="truncate text-[11px] font-bold tracking-tight sm:text-base">{text.previewGreeting}</h2>
                <p className="mt-0.5 hidden truncate text-[10px] text-[#68746c] dark:text-[#a4b1a7] sm:block">{text.previewWelcome}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <div className="hidden h-8 w-28 items-center gap-1.5 rounded-full border border-[#e6eae5] bg-white px-2.5 text-[9px] text-[#838d86] dark:border-[#2d3a31] dark:bg-[#1b271f] sm:flex lg:w-32">
                  <Search className="size-3.5" aria-hidden="true" />{text.previewSearch}
                </div>
                <span className="grid size-7 place-items-center rounded-full border border-[#e8ece7] bg-white dark:border-[#2d3a31] dark:bg-[#1b271f]"><Bell className="size-3.5" aria-hidden="true" /></span>
                <span className="grid size-7 place-items-center rounded-full bg-[#dbe7dc] text-[#345e40]"><CircleUserRound className="size-4" aria-hidden="true" /></span>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-1.5 xl:grid-cols-4 sm:gap-2">
              {stats.map(({ value, label, icon: Icon, tone }) => (
                <div key={label} className="flex min-w-0 items-center gap-1.5 rounded-xl border border-[#edf0ec] bg-white px-2 py-2 shadow-[0_4px_14px_-10px_rgba(17,42,24,.25)] dark:border-[#29362e] dark:bg-[#19241d] sm:gap-2 sm:px-2.5">
                  <span className={`grid size-6 shrink-0 place-items-center rounded-md ${tone}`}><Icon className="size-3.5" aria-hidden="true" /></span>
                  <span className="min-w-0"><span className="block text-sm font-bold leading-4 sm:text-base">{value}</span><span className="block truncate text-[8px] text-[#748078] dark:text-[#aab5ac] sm:text-[9px]">{label}</span></span>
                </div>
              ))}
            </div>

            <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_118px] lg:grid-cols-[minmax(0,1fr)_140px]">
              <section className="min-w-0 rounded-xl border border-[#edf0ec] bg-white p-2.5 shadow-[0_6px_20px_-14px_rgba(17,42,24,.25)] dark:border-[#29362e] dark:bg-[#19241d] sm:p-3">
                <h3 className="mb-2 text-[10px] font-bold sm:text-[11px]">{text.previewTaskList}</h3>
                <div className="divide-y divide-[#f0f2ef] dark:divide-[#29362e]">
                  {tasks.map((task) => (
                    <div key={task.title} className="flex min-w-0 items-center gap-1.5 py-2 sm:gap-2">
                      <span className={`grid size-4 shrink-0 place-items-center rounded border ${task.complete ? "border-[#19a755] bg-[#19a755] text-white" : "border-[#cbd3cc] dark:border-[#59665c]"}`}>
                        {task.complete && <Check className="size-3" aria-hidden="true" />}
                      </span>
                      <span className={`min-w-0 flex-1 truncate text-[10px] sm:text-[11px] ${task.complete ? "text-[#8a938c] line-through dark:text-[#8b998e]" : "text-[#303b33] dark:text-[#d5ded7]"}`}>{task.title}</span>
                      <span className={`hidden shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium sm:inline ${task.tagStyle}`}>{task.tag}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex flex-col items-center rounded-xl border border-[#edf0ec] bg-white p-2.5 shadow-[0_6px_20px_-14px_rgba(17,42,24,.25)] dark:border-[#29362e] dark:bg-[#19241d]">
                <h3 className="mb-2 self-start text-[10px] font-bold sm:text-[11px]">{text.previewProgressTitle}</h3>
                <div className="grid size-[88px] place-items-center rounded-full p-[7px] lg:size-[102px]" style={{ background: "conic-gradient(#20a854 0deg 209deg, #e7ebe7 209deg 360deg)" }}>
                  <div className="grid size-full place-items-center rounded-full bg-white text-center dark:bg-[#19241d]">
                    <span><span className="block text-xl font-bold leading-6 lg:text-2xl">58%</span><span className="block text-[8px] text-[#7c877f] dark:text-[#a4b1a7]">{text.previewCompletedWord}</span></span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
