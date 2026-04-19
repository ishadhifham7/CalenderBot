const DATE_REGEX = /\b(\d{4}-\d{2}-\d{2})\b/;

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
