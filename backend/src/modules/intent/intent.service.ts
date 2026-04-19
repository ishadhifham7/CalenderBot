import { addDays, extractDateFromText, getTodayDate } from "./intent.utils";

export type IntentType =
  | "FREE_TIME"
  | "NEXT_EVENT"
  | "DAILY_SCHEDULE"
  | "UNKNOWN";

export interface IntentResult {
  intent: IntentType;
  date: string;
}

const FREE_TIME_PATTERNS: RegExp[] = [
  /when\s+am\s+i\s+free/i,
  /free\s*time/i,
  /\bfree\b/i,
];

const NEXT_EVENT_PATTERNS: RegExp[] = [
  /next\s+event/i,
  /next\s+class/i,
  /what\s+is\s+my\s+next\s+class/i,
];

const DAILY_SCHEDULE_PATTERNS: RegExp[] = [
  /\bschedule\b/i,
  /\bplan\b/i,
  /\btoday\b/i,
  /\btomorrow\b/i,
];

const includesAnyPattern = (message: string, patterns: RegExp[]): boolean => {
  return patterns.some((pattern) => pattern.test(message));
};

const resolveDateFromMessage = (message: string): string => {
  const today = getTodayDate();

  if (/\btomorrow\b/i.test(message)) {
    return addDays(today, 1);
  }

  const extractedDate = extractDateFromText(message);
  if (extractedDate) {
    return extractedDate;
  }

  return today;
};

export const detectIntent = (message: string): IntentResult => {
  const normalizedMessage = message.trim().toLowerCase();
  const date = resolveDateFromMessage(normalizedMessage);

  if (includesAnyPattern(normalizedMessage, FREE_TIME_PATTERNS)) {
    return {
      intent: "FREE_TIME",
      date,
    };
  }

  if (includesAnyPattern(normalizedMessage, NEXT_EVENT_PATTERNS)) {
    return {
      intent: "NEXT_EVENT",
      date,
    };
  }

  if (
    includesAnyPattern(normalizedMessage, DAILY_SCHEDULE_PATTERNS) ||
    Boolean(extractDateFromText(normalizedMessage))
  ) {
    return {
      intent: "DAILY_SCHEDULE",
      date,
    };
  }

  return {
    intent: "UNKNOWN",
    date,
  };
};
