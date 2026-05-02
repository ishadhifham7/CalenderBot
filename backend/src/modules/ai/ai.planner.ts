import Groq from "groq-sdk";
import { toColomboDateOnly } from "../../utils/time.utils";

type PlannerIntent = "date" | "range" | "search" | "schedule" | "find_slot";

type PlannerResult = {
  intent: PlannerIntent;
  date?: string;
  startDate?: string;
  endDate?: string;
  time?: string;
  durationMinutes?: number;
  keyword?: string;
};

const DEFAULT_MODEL = "llama-3.1-8b-instant";

const buildSystemPrompt = (context: {
  currentDate: string;
  timeZone: string;
  repairError?: string;
}): string => {
  const repairNote = context.repairError
    ? `\nPREVIOUS ERROR:\n${context.repairError}\nFix the JSON to satisfy the schema.\n`
    : "";

  return `You are a calendar planning engine.

Your ONLY job is to convert user messages into structured JSON commands.

You MUST follow these rules:
- Output ONLY valid JSON
- No explanations
- No extra text
- No markdown

Allowed output format:

{
  "intent": "date" | "range" | "search" | "schedule" | "find_slot",
  "date": "YYYY-MM-DD",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "time": "HH:mm",
  "durationMinutes": number,
  "keyword": "string"
}

Rules:
- Single day → intent = date
- Multiple days/week → intent = range
- If keyword present → intent = search (with date or range)
- "schedule" → when user asks to add/check a specific time event
- "find_slot" → when user asks for available time suggestions
- Always convert time to 24h format (HH:mm)
- Always convert durations to minutes (default to 60 if not provided)
- Always infer dates logically
- If unclear, assume nearest future date using the current date as the anchor
- Never hallucinate data
- Required fields by intent:
  - date: must include date
  - range: must include startDate and endDate
  - search: must include keyword and (date or range)
  - schedule: must include date, time, and durationMinutes
  - find_slot: must include durationMinutes and (date or range)

Current date: ${context.currentDate}
Time zone: ${context.timeZone}
${repairNote}`;
};

const getApiKey = (): string => {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  return apiKey;
};

const getModelName = (): string => {
  return process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;
};

const stripCodeFences = (raw: string): string => {
  const trimmed = raw.trim();
  const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return match ? match[1].trim() : trimmed;
};

const parsePlannerJson = (raw: string): PlannerResult => {
  const cleaned = stripCodeFences(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    const details = error instanceof Error ? error.message : "unknown error";
    throw new Error(`Planner response was not valid JSON: ${details}`);
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Planner response must be a JSON object");
  }

  const result = parsed as Partial<PlannerResult> & { type?: PlannerIntent };
  const inferredIntent = result.intent ?? result.type;
  const validIntents: PlannerIntent[] = [
    "date",
    "range",
    "search",
    "schedule",
    "find_slot",
  ];

  if (!inferredIntent || !validIntents.includes(inferredIntent)) {
    throw new Error("Planner response has invalid or missing 'intent'");
  }

  result.intent = inferredIntent;

  const stringFields: Array<keyof PlannerResult> = [
    "date",
    "startDate",
    "endDate",
    "time",
    "keyword",
  ];

  for (const field of stringFields) {
    const value = result[field];
    if (value !== undefined && typeof value !== "string") {
      throw new Error(`Planner response has invalid '${field}'`);
    }

    if (typeof value === "string" && !value.trim()) {
      throw new Error(`Planner response has empty '${field}'`);
    }
  }

  if (result.durationMinutes !== undefined) {
    if (
      typeof result.durationMinutes !== "number" ||
      !Number.isFinite(result.durationMinutes)
    ) {
      throw new Error("Planner response has invalid 'durationMinutes'");
    }
  }

  const hasDate = typeof result.date === "string" && !!result.date.trim();
  const hasStartDate =
    typeof result.startDate === "string" && !!result.startDate.trim();
  const hasEndDate =
    typeof result.endDate === "string" && !!result.endDate.trim();
  const hasRange = hasStartDate || hasEndDate;

  if (hasRange && !(hasStartDate && hasEndDate)) {
    throw new Error(
      "Planner response must include both 'startDate' and 'endDate'",
    );
  }

  if (result.intent === "date" && !hasDate) {
    throw new Error("Planner response missing required 'date'");
  }

  if (result.intent === "range" && !hasStartDate) {
    throw new Error("Planner response missing required 'startDate'");
  }

  if (result.intent === "search") {
    if (typeof result.keyword !== "string" || !result.keyword.trim()) {
      throw new Error("Planner response missing required 'keyword'");
    }

    if (!hasDate && !hasStartDate) {
      throw new Error(
        "Planner response missing required date or range for 'search'",
      );
    }
  }

  if (result.intent === "schedule") {
    if (!hasDate) {
      throw new Error("Planner response missing required 'date'");
    }

    if (typeof result.time !== "string" || !result.time.trim()) {
      throw new Error("Planner response missing required 'time'");
    }

    if (typeof result.durationMinutes !== "number") {
      throw new Error("Planner response missing required 'durationMinutes'");
    }
  }

  if (result.intent === "find_slot") {
    if (typeof result.durationMinutes !== "number") {
      throw new Error("Planner response missing required 'durationMinutes'");
    }

    if (!hasDate && !hasStartDate) {
      throw new Error(
        "Planner response missing required date or range for 'find_slot'",
      );
    }
  }

  return result as PlannerResult;
};

const getCurrentDate = (): string => {
  return toColomboDateOnly(new Date());
};

const getTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
};

const addDays = (date: string, days: number): string => {
  const [year, month, day] = date.split("-").map(Number);
  const base = new Date(Date.UTC(year, month - 1, day));
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().split("T")[0];
};

const normalizeRelativeDates = (
  message: string,
  result: PlannerResult,
  currentDate: string,
): PlannerResult => {
  const lower = message.toLowerCase();
  const mentionsTomorrow =
    lower.includes("tomorrow") || /tomorr\w*/.test(lower);

  if (!mentionsTomorrow) {
    return result;
  }

  if (result.date && result.date === currentDate) {
    return { ...result, date: addDays(currentDate, 1) };
  }

  if (
    result.startDate &&
    result.endDate &&
    result.startDate === currentDate &&
    result.endDate === currentDate
  ) {
    const nextDate = addDays(currentDate, 1);
    return { ...result, startDate: nextDate, endDate: nextDate };
  }

  return result;
};

export const callPlanner = async (
  message: string,
  options?: { repairError?: string },
): Promise<PlannerResult> => {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    throw new Error("Planner message must not be empty");
  }

  const client = new Groq({
    apiKey: getApiKey(),
  });

  const completion = await client.chat.completions.create({
    model: getModelName(),
    messages: [
      {
        role: "system",
        content: buildSystemPrompt({
          currentDate: getCurrentDate(),
          timeZone: getTimeZone(),
          repairError: options?.repairError,
        }),
      },
      {
        role: "user",
        content: trimmedMessage,
      },
    ],
    temperature: 0,
    max_tokens: 256,
  });

  const response = completion.choices?.[0]?.message?.content?.trim();

  if (!response) {
    throw new Error("Planner model returned an empty response");
  }

  const parsed = parsePlannerJson(response);
  return normalizeRelativeDates(message, parsed, getCurrentDate());
};

/*
Example usage:

callPlanner("Do I have anything next Tuesday?")
  .then((result) => console.log("Planner result:", result))
  .catch((error) => console.error("Planner error:", error));
*/
