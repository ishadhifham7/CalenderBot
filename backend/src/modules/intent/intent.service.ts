import { addDays, extractDateFromText, getTodayDate } from "./intent.utils";

export type IntentType =
  | "FREE_TIME"
  | "NEXT_EVENT"
  | "DAILY_SCHEDULE"
  | "UNKNOWN";

export type IntentResult = {
  intent: IntentType;
  date: string;
};

const hasFreeTimeIntent = (text: string): boolean => {
  return text.includes("free time") || text.includes("when am i free");
};

const hasNextEventIntent = (text: string): boolean => {
  return text.includes("next event") || text.includes("next class");
};

const hasScheduleIntent = (text: string): boolean => {
  return text.includes("schedule") || text === "today" || text === "tomorrow";
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

export const detectIntent = (message: string): IntentResult => {
  const normalized = message.trim().toLowerCase();
  const date = resolveDate(normalized);

  if (hasFreeTimeIntent(normalized)) {
    return { intent: "FREE_TIME", date };
  }

  if (hasNextEventIntent(normalized)) {
    return { intent: "NEXT_EVENT", date };
  }

  if (hasScheduleIntent(normalized) || extractDateFromText(normalized)) {
    return { intent: "DAILY_SCHEDULE", date };
  }

  return { intent: "UNKNOWN", date };
};
