type PlanType = "date" | "range" | "search";

type DatePlan = {
  type: "date";
  date: string;
};

type RangePlan = {
  type: "range";
  startDate: string;
  endDate: string;
};

type SearchPlan = {
  type: "search";
  startDate: string;
  endDate: string;
  keyword: string;
};

type ValidatedPlan = DatePlan | RangePlan | SearchPlan;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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

const assertValidType = (value: unknown): PlanType => {
  if (value !== "date" && value !== "range" && value !== "search") {
    throw new Error("Invalid plan type");
  }

  return value;
};

export const validatePlan = (plan: unknown): ValidatedPlan => {
  if (!plan || typeof plan !== "object" || Array.isArray(plan)) {
    throw new Error("Invalid plan type");
  }

  const rawPlan = plan as Record<string, unknown>;
  const type = assertValidType(rawPlan.type);

  if (type === "date") {
    const date = assertValidDate(rawPlan.date);
    return { type, date };
  }

  if (type === "range") {
    const startDate = assertValidDate(rawPlan.startDate);
    const endDate = assertValidDate(rawPlan.endDate);

    if (startDate > endDate) {
      throw new Error("Invalid date range");
    }

    return { type, startDate, endDate };
  }

  const startDate = assertValidDate(rawPlan.startDate);
  const endDate = assertValidDate(rawPlan.endDate);

  if (startDate > endDate) {
    throw new Error("Invalid date range");
  }

  const keyword = assertValidKeyword(rawPlan.keyword);

  return { type, startDate, endDate, keyword };
};

/*
Example usage:

console.log(
  validatePlan({
    type: "search",
    startDate: "2026-05-01",
    endDate: "2026-05-07",
    keyword: "gym",
  }),
);
*/
