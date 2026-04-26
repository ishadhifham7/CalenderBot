import {
  addDays,
  extractDateFromText,
  extractDateRangeFromText,
  getTodayDate,
} from "./intent.utils";

export type IntentType =
  | "FREE_TIME"
  | "NEXT_EVENT"
  | "DAILY_SCHEDULE"
  | "UNKNOWN";

export type ScheduleQuery =
  | {
      type: "date";
      date: string;
    }
  | {
      type: "range";
      startDate: string;
      endDate: string;
    };

export type IntentResult = {
  intent: IntentType;
  date: string;
  scheduleQuery: ScheduleQuery;
};

const hasFreeTimeIntent = (text: string): boolean => {
  return (
    text.includes("free time") ||
    text.includes("when am i free") ||
    text.includes("am i free")
  );
};

const hasNextEventIntent = (text: string): boolean => {
  return text.includes("next event") || text.includes("next class");
};

const hasScheduleIntent = (text: string): boolean => {
  return (
    text.includes("schedule") ||
    text.includes("today") ||
    text.includes("tomorrow")
  );
};

const resolveDate = (text: string): string => {
  const today = getTodayDate();
  const extracted = extractDateFromText(text);

  if (extracted) {
    return extracted;
  }

  if (text.includes("tomorrow")) {
    return addDays(today, 1);
  }

  return today;
};

const resolveScheduleQuery = (text: string): ScheduleQuery => {
  const dateRange = extractDateRangeFromText(text);

  if (dateRange) {
    return {
      type: "range",
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    };
  }

  return {
    type: "date",
    date: resolveDate(text),
  };
};

export const detectIntent = (message: string): IntentResult => {
  const normalized = message.trim().toLowerCase();
  const scheduleQuery = resolveScheduleQuery(normalized);
  const date =
    scheduleQuery.type === "date"
      ? scheduleQuery.date
      : scheduleQuery.startDate;

  if (hasFreeTimeIntent(normalized)) {
    return { intent: "FREE_TIME", date, scheduleQuery };
  }

  if (hasNextEventIntent(normalized)) {
    return { intent: "NEXT_EVENT", date, scheduleQuery };
  }

  if (hasScheduleIntent(normalized) || extractDateFromText(normalized)) {
    return { intent: "DAILY_SCHEDULE", date, scheduleQuery };
  }

  return { intent: "UNKNOWN", date, scheduleQuery };
};
