const DATE_REGEX = /\b(\d{4}-\d{2}-\d{2})\b/;

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

type WeekdayName = (typeof WEEKDAYS)[number];

const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTodayDate = (): string => {
  return toDateKey(new Date());
};

export const addDays = (date: string, n: number): string => {
  const target = new Date(`${date}T00:00:00`);
  target.setDate(target.getDate() + n);
  return toDateKey(target);
};

export const extractDateFromText = (message: string): string | null => {
  const match = message.match(DATE_REGEX);
  return match ? match[1] : null;
};

const toTimestamp = (date: string): number => {
  return new Date(`${date}T00:00:00`).getTime();
};

const orderDateRange = (
  startDate: string,
  endDate: string,
): { startDate: string; endDate: string } => {
  if (toTimestamp(startDate) <= toTimestamp(endDate)) {
    return { startDate, endDate };
  }

  return {
    startDate: endDate,
    endDate: startDate,
  };
};

const getDateForWeekday = (weekday: WeekdayName, baseDate: string): string => {
  const base = new Date(`${baseDate}T00:00:00`);
  const targetDay = WEEKDAYS.indexOf(weekday);
  const currentDay = base.getDay();

  let diff = targetDay - currentDay;
  if (diff < 0) {
    diff += 7;
  }

  return addDays(baseDate, diff);
};

export const extractDateRangeFromText = (
  message: string,
): { startDate: string; endDate: string } | null => {
  const today = getTodayDate();

  const allDateMatches = Array.from(message.matchAll(DATE_REGEX)).map(
    (match) => match[1],
  );

  if (allDateMatches.length >= 2) {
    return orderDateRange(allDateMatches[0], allDateMatches[1]);
  }

  if (message.includes("this week")) {
    return {
      startDate: today,
      endDate: addDays(today, 6),
    };
  }

  const weekdayPattern = WEEKDAYS.join("|");
  const betweenWeekdaysRegex = new RegExp(
    `\\bbetween\\s+(${weekdayPattern})\\s+(?:and|to|through|thru|until|-)\\s+(${weekdayPattern})\\b`,
  );

  const toWeekdaysRegex = new RegExp(
    `\\b(${weekdayPattern})\\s*(?:to|through|thru|until|-)\\s*(${weekdayPattern})\\b`,
  );

  const betweenWeekdaysMatch = message.match(betweenWeekdaysRegex);
  const toWeekdaysMatch = message.match(toWeekdaysRegex);
  const weekdaysMatch = betweenWeekdaysMatch ?? toWeekdaysMatch;

  if (weekdaysMatch) {
    const start = getDateForWeekday(weekdaysMatch[1] as WeekdayName, today);
    const end = getDateForWeekday(weekdaysMatch[2] as WeekdayName, start);

    return orderDateRange(start, end);
  }

  return null;
};
