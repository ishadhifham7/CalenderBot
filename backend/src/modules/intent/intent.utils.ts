const padTwoDigits = (value: number): string =>
  value.toString().padStart(2, "0");

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = padTwoDigits(date.getMonth() + 1);
  const day = padTwoDigits(date.getDate());

  return `${year}-${month}-${day}`;
};

export const getTodayDate = (): string => {
  return formatLocalDate(new Date());
};

export const addDays = (date: string, daysToAdd: number): string => {
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return date;
  }

  const nextDate = new Date(year, month - 1, day);
  nextDate.setDate(nextDate.getDate() + daysToAdd);

  return formatLocalDate(nextDate);
};

export const extractDateFromText = (message: string): string | null => {
  const match = message.match(/\b(?:on\s+)?(\d{4}-\d{2}-\d{2})\b/i);
  if (!match) {
    return null;
  }

  const extractedDate = match[1];
  const date = new Date(`${extractedDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return extractedDate;
};
