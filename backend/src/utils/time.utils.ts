const COLOMBO_TIME_ZONE = "Asia/Colombo";
const COLOMBO_OFFSET_MINUTES = 5 * 60 + 30;

const toDateFromInput = (value: string | Date): Date => {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error("Invalid Date object provided");
    }

    return value;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return getColomboDayBounds(value).start;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date string: ${value}`);
  }

  return parsed;
};

const pad2 = (value: number): string => value.toString().padStart(2, "0");

const formatParts = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: COLOMBO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");

  if (!year || !month || !day || !hour || !minute) {
    throw new Error("Failed to format Colombo time");
  }

  return { year, month, day, hour, minute };
};

export const toColomboDateTime = (value: string | Date): string => {
  const date = toDateFromInput(value);
  const { year, month, day, hour, minute } = formatParts(date);
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

export const parseColomboDateTime = (value: string): Date => {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})\s([01]\d|2[0-3]):([0-5]\d)$/,
  );

  if (!match) {
    throw new Error(`Invalid Colombo date-time format: ${value}`);
  }

  const [, year, month, day, hour, minute] = match;
  const utcMillis =
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      0,
      0,
    ) -
    COLOMBO_OFFSET_MINUTES * 60 * 1000;

  return new Date(utcMillis);
};

export const getColomboDayBounds = (
  date: string,
): { start: Date; end: Date } => {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
  }

  const [, year, month, day] = match;
  const startUtcMillis =
    Date.UTC(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0) -
    COLOMBO_OFFSET_MINUTES * 60 * 1000;

  const start = new Date(startUtcMillis);
  const end = new Date(startUtcMillis + 24 * 60 * 60 * 1000 - 1);

  return { start, end };
};

export const toColomboDateOnly = (value: string | Date): string => {
  const date = toDateFromInput(value);
  const { year, month, day } = formatParts(date);
  return `${year}-${month}-${day}`;
};

export const toColomboTimeOnly = (value: string | Date): string => {
  const date = toDateFromInput(value);
  const { hour, minute } = formatParts(date);
  return `${hour}:${minute}`;
};
