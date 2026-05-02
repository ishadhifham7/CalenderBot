type PlanIntent = "date" | "range" | "search" | "schedule" | "find_slot";

type DatePlan = {
  intent: "date";
  date: string;
};

type RangePlan = {
  intent: "range";
  startDate: string;
  endDate: string;
};

type SearchPlan = {
  intent: "search";
  startDate: string;
  endDate: string;
  keyword: string;
};

type SchedulePlan = {
  intent: "schedule";
  date: string;
  time: string;
  durationMinutes: number;
};

type FindSlotPlan = {
  intent: "find_slot";
  startDate: string;
  endDate: string;
  durationMinutes: number;
};

type ValidatedPlan =
  | DatePlan
  | RangePlan
  | SearchPlan
  | SchedulePlan
  | FindSlotPlan;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

const parseDate = (value: string): Date | null => {
  if (!DATE_PATTERN.test(value)) {
    return null;
  }

  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

const assertValidDate = (value: unknown): string => {
  if (typeof value !== "string") {
    throw new Error("Missing date");
  }

  const trimmed = value.trim();
  const parsed = parseDate(trimmed);

  if (!parsed) {
    throw new Error("Invalid date format");
  }

  return trimmed;
};

const assertValidKeyword = (value: unknown): string => {
  if (typeof value !== "string") {
    throw new Error("Missing keyword");
  }

  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error("Missing keyword");
  }

  return trimmed;
};

const normalizeTime = (value: string): string | null => {
  const trimmed = value.trim().toLowerCase();

  if (TIME_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/i);

  if (!match) {
    return null;
  }

  const hourRaw = Number(match[1]);
  const minuteRaw = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3]?.toLowerCase();

  if (!Number.isInteger(hourRaw) || !Number.isInteger(minuteRaw)) {
    return null;
  }

  if (hourRaw < 0 || hourRaw > 23 || minuteRaw < 0 || minuteRaw > 59) {
    return null;
  }

  let hour = hourRaw;

  if (meridiem) {
    if (hourRaw < 1 || hourRaw > 12) {
      return null;
    }

    if (meridiem === "am") {
      hour = hourRaw === 12 ? 0 : hourRaw;
    } else {
      hour = hourRaw === 12 ? 12 : hourRaw + 12;
    }
  }

  return `${String(hour).padStart(2, "0")}:${String(minuteRaw).padStart(2, "0")}`;
};

const assertValidTime = (value: unknown): string => {
  if (typeof value !== "string") {
    throw new Error("Missing time");
  }

  const normalized = normalizeTime(value);

  if (!normalized) {
    throw new Error("Invalid time format");
  }

  return normalized;
};

const assertValidDuration = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Missing durationMinutes");
  }

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("Invalid durationMinutes");
  }

  return value;
};

const assertValidIntent = (value: unknown): PlanIntent => {
  if (
    value !== "date" &&
    value !== "range" &&
    value !== "search" &&
    value !== "schedule" &&
    value !== "find_slot"
  ) {
    throw new Error("Invalid plan intent");
  }

  return value;
};

export const validatePlan = (plan: unknown): ValidatedPlan => {
  if (!plan || typeof plan !== "object" || Array.isArray(plan)) {
    throw new Error("Invalid plan intent");
  }

  const rawPlan = plan as Record<string, unknown>;
  const intent = assertValidIntent(rawPlan.intent ?? rawPlan.type);
  const hasRange =
    rawPlan.startDate !== undefined || rawPlan.endDate !== undefined;

  if (intent === "date") {
    const date = assertValidDate(rawPlan.date);
    return { intent, date };
  }

  if (intent === "range") {
    const startDate = assertValidDate(rawPlan.startDate);
    const endDate = assertValidDate(rawPlan.endDate);

    if (startDate > endDate) {
      throw new Error("Invalid date range");
    }

    return { intent, startDate, endDate };
  }

  if (intent === "schedule") {
    const date = assertValidDate(rawPlan.date);
    const time = assertValidTime(rawPlan.time);
    const durationMinutes = assertValidDuration(rawPlan.durationMinutes);

    return { intent, date, time, durationMinutes };
  }

  if (intent === "find_slot") {
    const durationMinutes = assertValidDuration(rawPlan.durationMinutes);
    let startDate: string;
    let endDate: string;

    if (rawPlan.date !== undefined && rawPlan.date !== null) {
      const date = assertValidDate(rawPlan.date);
      startDate = date;
      endDate = date;
    } else {
      startDate = assertValidDate(rawPlan.startDate);
      endDate = assertValidDate(rawPlan.endDate);
    }

    if (startDate > endDate) {
      throw new Error("Invalid date range");
    }

    return { intent, startDate, endDate, durationMinutes };
  }

  if (!hasRange && rawPlan.date !== undefined) {
    const date = assertValidDate(rawPlan.date);
    const keyword = assertValidKeyword(rawPlan.keyword);

    return { intent, startDate: date, endDate: date, keyword };
  }

  const startDate = assertValidDate(rawPlan.startDate);
  const endDate = assertValidDate(rawPlan.endDate);

  if (startDate > endDate) {
    throw new Error("Invalid date range");
  }

  const keyword = assertValidKeyword(rawPlan.keyword);

  return { intent, startDate, endDate, keyword };
};

/*
Example usage:

console.log(
  validatePlan({
    intent: "search",
    startDate: "2026-05-01",
    endDate: "2026-05-07",
    keyword: "gym",
  }),
);
*/
