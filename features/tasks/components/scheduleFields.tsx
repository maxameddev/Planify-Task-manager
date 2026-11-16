"use client";

import { Clock3 } from "lucide-react";
import { utcOffsetLabel } from "@/features/tasks/time";

type ScheduleFieldsProps = {
  date: string;
  time: string;
  duration: string;
  timeZone: string;
  labels: { date: string; time: string; duration: string; minutes: string; timeSavedUtc: string };
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onDurationChange: (value: string) => void;
};

const durations = [15, 30, 45, 60, 90, 120, 180, 240, 360, 480, 720];
const fieldClass = "h-10 min-w-0 rounded-xl border border-[#dfe5de] bg-[#fcfcfa] px-3 text-sm text-[#25342a] outline-none focus:border-[#719378] focus:ring-2 focus:ring-[#719378]/15 dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#e8eee9]";

export function ScheduleFields({ date, time, duration, timeZone, labels, onDateChange, onTimeChange, onDurationChange }: ScheduleFieldsProps) {
  return (
    <fieldset className="grid gap-3 rounded-xl border border-[#e4eae2] bg-[#f9fbf8] p-3 dark:border-[#34443a] dark:bg-[#18221b]">
      <legend className="px-1 text-xs font-semibold text-[#425047] dark:text-[#d3ddd5]">{labels.date}</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid min-w-0 gap-1.5 text-xs font-medium text-[#68736b] dark:text-[#b4c0b7]">
          {labels.date}
          <input type="date" value={date} onChange={(event) => onDateChange(event.target.value)} className={fieldClass} />
        </label>
        <label className="grid min-w-0 gap-1.5 text-xs font-medium text-[#68736b] dark:text-[#b4c0b7]">
          {labels.time}
          <span className="relative">
            <Clock3 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7d9180]" aria-hidden="true" />
            <input type="time" value={time} onChange={(event) => onTimeChange(event.target.value)} className={`${fieldClass} w-full pl-9`} />
          </span>
        </label>
        <label className="grid min-w-0 gap-1.5 text-xs font-medium text-[#68736b] dark:text-[#b4c0b7]">
          {labels.duration}
          <select value={duration} onChange={(event) => onDurationChange(event.target.value)} className={fieldClass}>
            {durations.map((minutes) => <option key={minutes} value={minutes}>{minutes} {labels.minutes}</option>)}
          </select>
        </label>
      </div>
      <p className="text-[11px] text-[#768078] dark:text-[#aebbb1]">{timeZone} · {utcOffsetLabel(timeZone)} · {labels.timeSavedUtc}</p>
    </fieldset>
  );
}
