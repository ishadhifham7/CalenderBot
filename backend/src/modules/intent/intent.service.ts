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
    }
  | {
      type: "search";
      startDate: string;
      endDate: string;
      keyword: string;
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

const hasSearchIntent = (text: string): boolean => {
  const naturalSearchPattern =
    /\b(?:is there|are there|do i have)\s+(?:any\s+)?(?:an?\s+)?[a-z0-9][a-z0-9\s-]{1,60}\s+(?:on|between|from|this week|today|tomorrow|\d{4}-\d{2}-\d{2})\b/i;

  return (
    text.includes("search") ||
    text.includes("find") ||
    text.includes("look for") ||
    naturalSearchPattern.test(text)
  );
};

const extractSearchKeyword = (text: string): string | null => {
  const keywordPattern = /\bkeyword\s+"?([a-z0-9][a-z0-9\s-]{0,60})"?/i;
  const keywordMatch = text.match(keywordPattern);

  if (keywordMatch?.[1]) {
    return keywordMatch[1].trim();
  }

  const quotedPattern = /"([^"]{1,60})"/;
  const quotedMatch = text.match(quotedPattern);

  if (quotedMatch?.[1] && hasSearchIntent(text)) {
    return quotedMatch[1].trim();
  }

  const searchPattern =
    /\b(?:search|find|look for)\s+(?:events?\s+)?(?:for|about|with|containing)?\s*([a-z0-9][a-z0-9\s-]{0,60}?)(?=\s+(?:on|between|from|this week|today|tomorrow|\d{4}-\d{2}-\d{2})\b|$)/i;
  const searchMatch = text.match(searchPattern);

  if (searchMatch?.[1]) {
    return searchMatch[1].trim();
  }

  const naturalQuestionPattern =
    /\b(?:is there|are there|do i have)\s+(?:any\s+)?(?:an?\s+)?([a-z0-9][a-z0-9\s-]{1,60}?)(?=\s+(?:on|between|from|this week|today|tomorrow|\d{4}-\d{2}-\d{2})\b|[?.!]|$)/i;
  const naturalQuestionMatch = text.match(naturalQuestionPattern);

  if (naturalQuestionMatch?.[1]) {
    return naturalQuestionMatch[1].trim();
  }

  return null;
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

  if (hasSearchIntent(text)) {
    const date = resolveDate(text);
    const keyword = extractSearchKeyword(text) ?? "event";

    if (dateRange) {
      return {
        type: "search",
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        keyword,
      };
    }

    return {
      type: "search",
      startDate: date,
      endDate: date,
      keyword,
    };
  }

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
