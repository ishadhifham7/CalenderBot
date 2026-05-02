import Groq from "groq-sdk";

type PlannerType = "date" | "range" | "search";

type PlannerResult = {
  type: PlannerType;
  date?: string;
  startDate?: string;
  endDate?: string;
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
  "type": "date" | "range" | "search",
  "date": "YYYY-MM-DD",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "keyword": "string"
}

Rules:
- Single day → type = date
- Multiple days/week → type = range
- If keyword present → type = search
- Always infer dates logically
- If unclear, assume nearest future date using the current date as the anchor
- Never hallucinate data
- Required fields by type:
  - date: must include date
  - range: must include startDate and endDate
  - search: must include startDate, endDate, and keyword

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

  const result = parsed as Partial<PlannerResult>;
  const validTypes: PlannerType[] = ["date", "range", "search"];

  if (!result.type || !validTypes.includes(result.type)) {
    throw new Error("Planner response has invalid or missing 'type'");
  }

  const stringFields: Array<keyof PlannerResult> = [
    "date",
    "startDate",
    "endDate",
    "keyword",
  ];

  for (const field of stringFields) {
    const value = result[field];
    if (value !== undefined && typeof value !== "string") {
      throw new Error(`Planner response has invalid '${field}'`);
    }
  }

  const requiredFieldsByType: Record<
    PlannerType,
    Array<keyof PlannerResult>
  > = {
    date: ["date"],
    range: ["startDate", "endDate"],
    search: ["startDate", "endDate", "keyword"],
  };

  const requiredFields = requiredFieldsByType[result.type];

  for (const field of requiredFields) {
    const value = result[field];
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`Planner response missing required '${field}'`);
    }
  }

  return result as PlannerResult;
};

const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

const getTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
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

  return parsePlannerJson(response);
};

/*
Example usage:

callPlanner("Do I have anything next Tuesday?")
  .then((result) => console.log("Planner result:", result))
  .catch((error) => console.error("Planner error:", error));
*/
