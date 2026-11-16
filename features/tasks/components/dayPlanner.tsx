"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, PencilLine, Search } from "lucide-react";
import type { TaskDto, TaskPriority, TaskStatus } from "@/features/tasks/contracts";
import { dateInTimeZone, dateLabelInTimeZone, timeInTimeZone, utcOffsetLabel } from "@/features/tasks/time";

type DayPlannerLabels = {
  today: string;
  upcoming: string;
  overdue: string;
  allTasks: string;
  filterStatus: string;
  filterPriority: string;
  allStatuses: string;
  allPriorities: string;
  searchTasks: string;
  unscheduled: string;
  noTasksForDay: string;
  minutes: string;
  editTask: string;
  previousDay: string;
  nextDay: string;
  dayPlanner: string;
};

type DayPlannerProps = {
  tasks: TaskDto[];
  timeZone: string;
  locale: "so" | "en";
  labels: DayPlannerLabels;
  statusOptions: { value: TaskStatus; label: string }[];
  priorityOptions: { value: TaskPriority; label: string }[];
  onEdit: (task: TaskDto) => void;
  onStatusChange: (task: TaskDto, status: TaskStatus) => void;
};

type DateFilter = "day" | "upcoming" | "overdue" | "all";

function shiftDate(value: string, amount: number) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount, 12));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function DayPlanner({ tasks, timeZone, locale, labels, statusOptions, priorityOptions, onEdit, onStatusChange }: DayPlannerProps) {
  const now = new Date();
  const today = dateInTimeZone(now, timeZone);
  const [selectedDate, setSelectedDate] = useState(today);
  const [dateFilter, setDateFilter] = useState<DateFilter>("day");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filteredTasks = tasks.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
      if (query.trim() && !`${task.title} ${task.description}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
      const scheduledDate = task.scheduledAt ? dateInTimeZone(new Date(task.scheduledAt), timeZone) : null;
      if (dateFilter === "day") return scheduledDate === selectedDate || (!task.scheduledAt && (task.dueDate === selectedDate || dateInTimeZone(new Date(task.createdAt), timeZone) === selectedDate));
      if (dateFilter === "upcoming") return task.status !== "completed" && ((scheduledDate && scheduledDate > today) || (task.dueDate && task.dueDate > today));
      if (dateFilter === "overdue") return task.status !== "completed" && ((task.dueDate && task.dueDate < today) || (task.scheduledAt && new Date(task.scheduledAt).getTime() < now.getTime()));
      return true;
    }).sort((left, right) => {
      if (left.scheduledAt && right.scheduledAt) return left.scheduledAt.localeCompare(right.scheduledAt);
      if (left.scheduledAt) return -1;
      if (right.scheduledAt) return 1;
      return (left.dueDate ?? "9999").localeCompare(right.dueDate ?? "9999") || right.createdAt.localeCompare(left.createdAt);
    });

  const dayLabel = dateLabelInTimeZone(selectedDate, timeZone, locale);
  const filters: { value: DateFilter; label: string }[] = [
    { value: "day", label: labels.today },
    { value: "upcoming", label: labels.upcoming },
    { value: "overdue", label: labels.overdue },
    { value: "all", label: labels.allTasks },
  ];

  return (
    <section className="mt-6" aria-label={labels.today}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex h-10 items-center gap-1 rounded-xl border border-[#dfe5de] bg-white p-1 dark:border-[#34443a] dark:bg-[#1a251e]">
            <button type="button" onClick={() => { setDateFilter("day"); setSelectedDate(shiftDate(selectedDate, -1)); }} aria-label={labels.previousDay} className="grid size-8 place-items-center rounded-lg text-[#526056] hover:bg-[#f0f4ef] focus-visible:ring-2 focus-visible:ring-[#719378] dark:text-[#d3ddd5] dark:hover:bg-[#253128]"><ChevronLeft className="size-4" aria-hidden="true" /></button>
            <span className="inline-flex min-w-52 items-center justify-center gap-2 px-2 text-sm font-medium"><CalendarDays className="size-4 text-[#6d9275]" aria-hidden="true" />{dayLabel}</span>
            <button type="button" onClick={() => { setDateFilter("day"); setSelectedDate(shiftDate(selectedDate, 1)); }} aria-label={labels.nextDay} className="grid size-8 place-items-center rounded-lg text-[#526056] hover:bg-[#f0f4ef] focus-visible:ring-2 focus-visible:ring-[#719378] dark:text-[#d3ddd5] dark:hover:bg-[#253128]"><ChevronRight className="size-4" aria-hidden="true" /></button>
          </div>
          {selectedDate !== today && <button type="button" onClick={() => { setSelectedDate(today); setDateFilter("day"); }} className="h-10 rounded-xl px-3 text-sm font-semibold text-[#315d3c] hover:bg-[#edf3ec] focus-visible:ring-2 focus-visible:ring-[#719378] dark:text-[#b7cfba] dark:hover:bg-[#253128]">{labels.today}</button>}
          <span className="rounded-full bg-[#edf3ec] px-3 py-2 text-xs font-medium text-[#526c57] dark:bg-[#253128] dark:text-[#c2ddc6]">{timeZone} · {utcOffsetLabel(timeZone)}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#e9ece7] bg-white p-3 dark:border-[#2d3a31] dark:bg-[#1a251e] lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={labels.dayPlanner}>
          {filters.map((filter) => (
            <button key={filter.value} type="button" onClick={() => { setDateFilter(filter.value); if (filter.value === "day") setSelectedDate(today); }} aria-pressed={dateFilter === filter.value} className={`h-9 rounded-xl px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#719378] ${dateFilter === filter.value ? "bg-[#17452d] text-white dark:bg-[#2f6a46]" : "text-[#5e6b61] hover:bg-[#f1f4ef] dark:text-[#c2cec5] dark:hover:bg-[#253128]"}`}>{filter.label}</button>
          ))}
        </div>
        <div className="flex flex-1 flex-wrap gap-2 lg:justify-end">
          <label className="sr-only" htmlFor="planner-status-filter">{labels.filterStatus}</label>
          <select id="planner-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 min-w-36 rounded-xl border border-[#dfe5de] bg-[#fcfcfa] px-3 text-sm text-[#425047] outline-none focus-visible:ring-2 focus-visible:ring-[#719378] dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#d3ddd5]">
            <option value="all">{labels.allStatuses}</option>
            {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <label className="sr-only" htmlFor="planner-priority-filter">{labels.filterPriority}</label>
          <select id="planner-priority-filter" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="h-10 min-w-36 rounded-xl border border-[#dfe5de] bg-[#fcfcfa] px-3 text-sm text-[#425047] outline-none focus-visible:ring-2 focus-visible:ring-[#719378] dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#d3ddd5]">
            <option value="all">{labels.allPriorities}</option>
            {priorityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <label className="relative min-w-48 flex-1 lg:max-w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#87928a]" aria-hidden="true" />
            <span className="sr-only">{labels.searchTasks}</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.searchTasks} className="h-10 w-full rounded-xl border border-[#dfe5de] bg-[#fcfcfa] pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#719378] dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#e8eee9]" />
          </label>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-[#cbd8ca] bg-white/70 px-6 py-14 text-center text-sm text-[#768078] dark:border-[#405546] dark:bg-[#1a251e] dark:text-[#b4c0b7]">{labels.noTasksForDay}</div>
      ) : (
        <div className="mt-4 grid gap-3">
          {filteredTasks.map((task) => (
            <article key={task.id} className="grid gap-3 rounded-2xl border border-[#e0e8de] bg-white p-4 shadow-sm shadow-[#183c22]/[0.03] dark:border-[#34443a] dark:bg-[#1a251e] sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#315d3c] dark:text-[#b7cfba]">
                <Clock3 className="size-4 shrink-0" aria-hidden="true" />
                {task.scheduledAt ? <span>{timeInTimeZone(task.scheduledAt, timeZone, locale)}{task.durationMinutes ? ` · ${task.durationMinutes} ${labels.minutes}` : ""}</span> : <span>{labels.unscheduled}</span>}
              </div>
              <div className="min-w-0">
                <h3 className={`break-words text-sm font-semibold ${task.status === "completed" ? "text-[#6e7b70] line-through dark:text-[#adbbb0]" : "text-[#1d3023] dark:text-[#e2eae4]"}`}>{task.title}</h3>
                {task.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#768078] dark:text-[#aebbb1]">{task.description}</p>}
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full bg-[#f1f4ef] px-2.5 py-1 text-[#526056] dark:bg-[#253128] dark:text-[#c2cec5]">{priorityOptions.find((option) => option.value === task.priority)?.label}</span>
                  {task.dueDate && <span className="rounded-full bg-[#f1f4ef] px-2.5 py-1 text-[#526056] dark:bg-[#253128] dark:text-[#c2cec5]">{task.dueDate}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <select aria-label={labels.filterStatus} value={task.status} onChange={(event) => onStatusChange(task, event.target.value as TaskStatus)} className="h-9 min-w-32 rounded-lg border border-[#dfe5de] bg-[#fcfcfa] px-2.5 text-xs text-[#425047] outline-none focus-visible:ring-2 focus-visible:ring-[#719378] dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#d3ddd5]">
                  {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <button type="button" onClick={() => onEdit(task)} aria-label={`${labels.editTask}: ${task.title}`} className="grid size-9 place-items-center rounded-lg text-[#5e7662] transition hover:bg-[#f0f4ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#719378] dark:text-[#bbd1be] dark:hover:bg-[#253128]"><PencilLine className="size-4" aria-hidden="true" /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
