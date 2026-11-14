"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Popover } from "@base-ui/react/popover";
import type { Locale } from "@/lib/i18n";

type TaskDatePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  locale: Locale;
  todayLabel: string;
  clearLabel: string;
  previousMonthLabel: string;
  nextMonthLabel: string;
  portalContainer: RefObject<HTMLElement | null>;
};

function dateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day ? parsed : null;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonthsClamped(date: Date, amount: number) {
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
  return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), Math.min(date.getDate(), lastDay));
}

export function TaskDatePicker({
  label,
  value,
  onChange,
  locale,
  todayLabel,
  clearLabel,
  previousMonthLabel,
  nextMonthLabel,
  portalContainer,
}: TaskDatePickerProps) {
  const localeName = locale === "so" ? "so-SO" : "en-US";
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeDayRef = useRef<HTMLButtonElement>(null);
  const initialDate = parseDate(value) ?? new Date();
  const [open, setOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(() => startOfMonth(initialDate));
  const [focusedDate, setFocusedDate] = useState(() => dateKey(initialDate));
  const selectedDate = parseDate(value);
  const today = new Date();
  const todayKey = dateKey(today);
  const monthLabel = new Intl.DateTimeFormat(localeName, { month: "long", year: "numeric" }).format(displayMonth);
  const selectedLabel = selectedDate
    ? new Intl.DateTimeFormat(localeName, { dateStyle: "medium" }).format(selectedDate)
    : "";
  const dayLabelFormatter = new Intl.DateTimeFormat(localeName, { dateStyle: "full" });
  const weekdayFormatter = new Intl.DateTimeFormat(localeName, { weekday: "short" });
  const weekdayHeaders = Array.from({ length: 7 }, (_, day) => weekdayFormatter.format(new Date(2024, 0, 7 + day)));
  const firstVisibleDay = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1 - displayMonth.getDay());
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(firstVisibleDay);
    day.setDate(firstVisibleDay.getDate() + index);
    return day;
  });
  const calendarWeeks = Array.from({ length: 6 }, (_, week) => calendarDays.slice(week * 7, week * 7 + 7));

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => activeDayRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [focusedDate, open]);

  function openCalendar() {
    const startDate = parseDate(value) ?? new Date();
    setDisplayMonth(startOfMonth(startDate));
    setFocusedDate(dateKey(startDate));
    setOpen(true);
  }

  function chooseDate(date: Date | null) {
    onChange(date ? dateKey(date) : "");
    setOpen(false);
  }

  function focusDate(date: Date) {
    setFocusedDate(dateKey(date));
    if (date.getMonth() !== displayMonth.getMonth() || date.getFullYear() !== displayMonth.getFullYear()) {
      setDisplayMonth(startOfMonth(date));
    }
  }

  function changeMonth(amount: number) {
    const nextDate = addMonthsClamped(parseDate(focusedDate) ?? displayMonth, amount);
    setDisplayMonth(startOfMonth(nextDate));
    setFocusedDate(dateKey(nextDate));
  }

  function handleDayKeyDown(event: KeyboardEvent<HTMLButtonElement>, day: Date) {
    let nextDate: Date | null = null;
    if (event.key === "ArrowRight") nextDate = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
    if (event.key === "ArrowLeft") nextDate = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
    if (event.key === "ArrowDown") nextDate = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 7);
    if (event.key === "ArrowUp") nextDate = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 7);
    if (event.key === "PageDown") nextDate = addMonthsClamped(day, event.shiftKey ? 12 : 1);
    if (event.key === "PageUp") nextDate = addMonthsClamped(day, event.shiftKey ? -12 : -1);
    if (event.key === "Home") nextDate = new Date(day.getFullYear(), day.getMonth(), day.getDate() - day.getDay());
    if (event.key === "End") nextDate = new Date(day.getFullYear(), day.getMonth(), day.getDate() + (6 - day.getDay()));
    if (!nextDate) return;
    event.preventDefault();
    focusDate(nextDate);
  }

  return (
    <Popover.Root open={open} onOpenChange={(nextOpen) => setOpen(nextOpen)}>
      <div className="grid gap-1.5">
        <span id={id} className="text-sm font-medium text-[#425047] dark:text-[#d3ddd5]">{label}</span>
        <Popover.Trigger
          ref={triggerRef}
          type="button"
          aria-labelledby={id}
          aria-label={selectedLabel ? `${label}: ${selectedLabel}` : label}
          onClick={() => {
            if (!open) openCalendar();
          }}
          className="inline-flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-[#dfe5de] bg-[#fcfcfa] px-3.5 text-left text-sm text-[#314037] outline-none transition hover:border-[#bdcbbd] focus-visible:ring-2 focus-visible:ring-[#719378]/40 data-[popup-open]:border-[#719378] dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#e8eee9] dark:hover:border-[#526b57] dark:data-[popup-open]:border-[#719378]"
        >
          <span className={selectedLabel ? "" : "text-[#9aa39c] dark:text-[#839087]"}>{selectedLabel || label}</span>
          <CalendarDays className="size-4 shrink-0 text-[#819087] dark:text-[#a3b0a7]" aria-hidden="true" />
        </Popover.Trigger>
      </div>
      <Popover.Portal container={portalContainer}>
        <Popover.Positioner side="bottom" align="start" sideOffset={8} collisionPadding={12} className="z-[100] outline-none">
          <Popover.Popup className="planify-popup w-[19rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-[#dfe5de] bg-white p-4 text-[#25342a] shadow-xl shadow-[#153521]/15 outline-none dark:border-[#3a4b3e] dark:bg-[#1b271f] dark:text-[#e4ece6]">
            <Popover.Title className="sr-only">{label}</Popover.Title>
            <div className="mb-3 flex items-center justify-between gap-2">
              <button type="button" onClick={() => changeMonth(-1)} aria-label={previousMonthLabel} className="grid size-9 place-items-center rounded-lg text-[#59695d] transition hover:bg-[#f0f5ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#719378] dark:text-[#c4d0c6] dark:hover:bg-[#29382d]">
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <p aria-live="polite" className="text-sm font-semibold capitalize">{monthLabel}</p>
              <button type="button" onClick={() => changeMonth(1)} aria-label={nextMonthLabel} className="grid size-9 place-items-center rounded-lg text-[#59695d] transition hover:bg-[#f0f5ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#719378] dark:text-[#c4d0c6] dark:hover:bg-[#29382d]">
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div role="grid" aria-label={monthLabel} className="grid grid-cols-7 gap-1">
              <div role="row" className="col-span-7 grid grid-cols-7 gap-1">
                {weekdayHeaders.map((weekday, index) => (
                  <div key={`${weekday}-${index}`} role="columnheader" className="grid h-8 place-items-center text-[11px] font-medium text-[#859188] dark:text-[#9daa9f]">
                    {weekday}
                  </div>
                ))}
              </div>
              {calendarWeeks.map((week) => (
                <div key={dateKey(week[0])} role="row" className="col-span-7 grid grid-cols-7 gap-1">
                  {week.map((day) => {
                    const key = dateKey(day);
                    const isSelected = value === key;
                    const isToday = key === todayKey;
                    const isDisplayedMonth = day.getMonth() === displayMonth.getMonth();
                    return (
                      <div key={key} role="gridcell" aria-selected={isSelected}>
                        <button
                          ref={key === focusedDate ? activeDayRef : undefined}
                          type="button"
                          tabIndex={key === focusedDate ? 0 : -1}
                          aria-label={dayLabelFormatter.format(day)}
                          aria-pressed={isSelected}
                          aria-current={isToday ? "date" : undefined}
                          data-calendar-day={key}
                          onClick={() => chooseDate(day)}
                          onFocus={() => setFocusedDate(key)}
                          onKeyDown={(event) => handleDayKeyDown(event, day)}
                          className={`grid size-9 place-items-center rounded-full text-xs outline-none transition focus-visible:ring-2 focus-visible:ring-[#719378] ${isSelected ? "bg-[#17452d] font-semibold text-white shadow-sm dark:bg-[#4a8058]" : isToday ? "font-semibold text-[#17452d] ring-1 ring-[#86a68a] dark:text-[#b7d7bb] dark:ring-[#678b6d]" : isDisplayedMonth ? "text-[#45534a] hover:bg-[#edf3ec] dark:text-[#d2ddd4] dark:hover:bg-[#2a392e]" : "text-[#a6aea7] hover:bg-[#f2f5f1] dark:text-[#68756c] dark:hover:bg-[#26342a]"}`}
                        >
                          {day.getDate()}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#edf0eb] pt-3 dark:border-[#34443a]">
              <button type="button" onClick={() => chooseDate(new Date())} className="rounded-lg px-3 py-2 text-xs font-semibold text-[#285c38] transition hover:bg-[#eff5ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#719378] dark:text-[#b9d8bd] dark:hover:bg-[#29382d]">
                {todayLabel}
              </button>
              <button type="button" onClick={() => chooseDate(null)} disabled={!value} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-[#738078] transition hover:bg-[#f3f5f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#719378] disabled:cursor-not-allowed disabled:opacity-45 dark:text-[#b1bdb4] dark:hover:bg-[#29382d]">
                <X className="size-3.5" aria-hidden="true" />{clearLabel}
              </button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
