export type ZonedDateParts = { year: number; month: number; day: number; hour: number; minute: number };

function partsInTimeZone(date: Date, timeZone: string): ZonedDateParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    calendar: "gregory",
    numberingSystem: "latn",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
  };
}

export function isValidTimeZone(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 100) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export function dateInTimeZone(date: Date, timeZone: string) {
  const parts = partsInTimeZone(date, timeZone);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export function dateTimeInputsInTimeZone(value: string | null, timeZone: string) {
  if (!value) return { date: "", time: "" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: "", time: "" };
  const parts = partsInTimeZone(date, timeZone);
  return {
    date: `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`,
    time: `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`,
  };
}

export function localDateTimeToIso(date: string, time: string, timeZone: string): string | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);
  if (!dateMatch || !timeMatch || !isValidTimeZone(timeZone)) return null;
  const [, yearText, monthText, dayText] = dateMatch;
  const [, hourText, minuteText] = timeMatch;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  const check = new Date(localAsUtc);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month || check.getUTCDate() !== day || hour > 23 || minute > 59) return null;

  let instant = localAsUtc;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const zoned = partsInTimeZone(new Date(instant), timeZone);
    const offset = Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute) - instant;
    const next = localAsUtc - offset;
    if (next === instant) break;
    instant = next;
  }

  const result = partsInTimeZone(new Date(instant), timeZone);
  if (result.year !== year || result.month !== month || result.day !== day || result.hour !== hour || result.minute !== minute) return null;
  return new Date(instant).toISOString();
}

export function timeInTimeZone(value: string, timeZone: string, locale: "so" | "en") {
  return new Intl.DateTimeFormat(locale === "so" ? "so-SO" : "en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function dateLabelInTimeZone(value: string, timeZone: string, locale: "so" | "en") {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "so" ? "so-SO" : "en-US", {
    timeZone,
    dateStyle: "full",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export function utcOffsetLabel(timeZone: string, date = new Date()) {
  const value = new Intl.DateTimeFormat("en", { timeZone, timeZoneName: "longOffset" })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
  if (!value || value === "GMT" || value === "GMT+00:00" || value === "GMT-00:00") return "UTC+00:00";
  return value.replace(/^GMT/, "UTC");
}
