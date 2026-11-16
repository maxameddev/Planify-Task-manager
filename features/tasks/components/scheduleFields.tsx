"use client";

import type { RefObject } from "react";
import { TaskDatePicker } from "@/features/tasks/components/taskDatePicker";
import { TaskSelect } from "@/features/tasks/components/taskSelect";
import { utcOffsetLabel } from "@/features/tasks/time";
import type { Locale } from "@/lib/i18n";

type ScheduleFieldsProps = {
  date: string;
  time: string;
  duration: string;
  timeZone: string;
  locale: Locale;
  portalContainer: RefObject<HTMLElement | null>;
  labels: {
    schedule: string;
    date: string;
    time: string;
    hour: string;
    minute: string;
    duration: string;
    minutes: string;
    timeSavedUtc: string;
    today: string;
    clear: string;
    previousMonth: string;
    nextMonth: string;
  };
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onDurationChange: (value: string) => void;
};

const durations = [15, 30, 45, 60, 90, 120, 180, 240, 360, 480, 720];
const twoDigits = (value: number) => String(value).padStart(2, "0");
const hours = Array.from({ length: 24 }, (_, hour) => ({ value: twoDigits(hour), label: twoDigits(hour) }));
const minutes = Array.from({ length: 60 }, (_, minute) => ({ value: twoDigits(minute), label: twoDigits(minute) }));

export function ScheduleFields({ date, time, duration, timeZone, locale, portalContainer, labels, onDateChange, onTimeChange, onDurationChange }: ScheduleFieldsProps) {
  const [selectedHour, selectedMinute] = time.split(":");
  const hour = selectedHour && /^\d{2}$/.test(selectedHour) ? selectedHour : "09";
  const minute = selectedMinute && /^\d{2}$/.test(selectedMinute) ? selectedMinute : "00";

  return (
    <fieldset className="grid gap-3 rounded-2xl border border-[#dce7da] bg-[#f7faf5] p-4 dark:border-[#34443a] dark:bg-[#18221b] sm:grid-cols-3">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-[#425047] dark:text-[#d3ddd5]">{labels.schedule}</legend>
      <TaskDatePicker
        label={labels.date}
        value={date}
        onChange={onDateChange}
        locale={locale}
        todayLabel={labels.today}
        clearLabel={labels.clear}
        previousMonthLabel={labels.previousMonth}
        nextMonthLabel={labels.nextMonth}
        portalContainer={portalContainer}
      />
      <div className="grid min-w-0 gap-1.5">
        <span className="text-sm font-medium text-[#425047] dark:text-[#d3ddd5]">{labels.time}</span>
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <TaskSelect
            label={labels.hour}
            hideLabel
            value={hour}
            onChange={(nextHour) => onTimeChange(`${nextHour}:${minute}`)}
            options={hours}
            portalContainer={portalContainer}
            triggerClassName="h-10 px-3"
          />
          <span aria-hidden="true" className="font-semibold text-[#718076]">:</span>
          <TaskSelect
            label={labels.minute}
            hideLabel
            value={minute}
            onChange={(nextMinute) => onTimeChange(`${hour}:${nextMinute}`)}
            options={minutes}
            portalContainer={portalContainer}
            triggerClassName="h-10 px-3"
          />
        </div>
      </div>
      <TaskSelect
        label={labels.duration}
        value={duration}
        onChange={onDurationChange}
        options={durations.map((value) => ({ value: String(value), label: `${value} ${labels.minutes}` }))}
        portalContainer={portalContainer}
        triggerClassName="h-10"
      />
      <p className="text-[11px] leading-5 text-[#768078] dark:text-[#aebbb1] sm:col-span-3">
        {timeZone} · {utcOffsetLabel(timeZone)} · {labels.timeSavedUtc}
      </p>
    </fieldset>
  );
}
