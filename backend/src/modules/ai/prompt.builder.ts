import { AIInput } from "./ai.types";

export const buildPrompt = (input: AIInput): string => {
  return `
You are an AI scheduling assistant.

You MUST only use the provided schedule data.
Do NOT hallucinate or assume events.

USER MESSAGE:
${input.message}

INTENT:
${input.intent.intent}

DATE:
${input.intent.date}

SCHEDULE DATA:
${JSON.stringify(input.schedule, null, 2)}

RULES:
- If FREE_TIME → find available time slots
- If NEXT_EVENT → return next upcoming event
- If DAILY_SCHEDULE → summarize the day's schedule
- Keep response clear and human-friendly
- Do not invent events

Return only the final answer.
`;
};
