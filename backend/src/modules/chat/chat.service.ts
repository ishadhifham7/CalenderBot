import { generateAIResponse } from "../ai/ai.service";
import { callPlanner } from "../ai/ai.planner";
import { validatePlan } from "../ai/ai.plan.validator";
import { executePlan } from "../../services/calendar/calendar.executor";
import { parseColomboDateTime } from "../../utils/time.utils";

type ChatResult = {
  answer: string;
};

const hasScheduleConflict = (
  events: Array<{ start: string; end: string }>,
  date: string,
  time: string,
  durationMinutes: number,
): boolean => {
  const slotStart = parseColomboDateTime(`${date} ${time}`);
  const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

  return events.some((event) => {
    const eventStart = parseColomboDateTime(event.start);
    const eventEnd = parseColomboDateTime(event.end);
    return eventStart < slotEnd && eventEnd > slotStart;
  });
};

export const handleUserMessage = async (
  message: string,
): Promise<ChatResult> => {
  let validatedPlan: ReturnType<typeof validatePlan> | null = null;
  let lastError: Error | null = null;

  // Try once, then retry with a repair prompt if validation fails.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const plan = await callPlanner(
        message,
        attempt === 0 ? undefined : { repairError: lastError?.message },
      );
      validatedPlan = validatePlan(plan);
      break;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");

      if (attempt === 1) {
        throw lastError;
      }
    }
  }

  if (!validatedPlan) {
    throw lastError ?? new Error("Failed to generate a valid plan");
  }

  const schedule = await executePlan(validatedPlan);

  if (validatedPlan.intent === "schedule") {
    const conflict = hasScheduleConflict(
      schedule.events,
      validatedPlan.date,
      validatedPlan.time,
      validatedPlan.durationMinutes,
    );

    if (conflict) {
      return {
        answer: `You already have something at ${validatedPlan.time} on ${validatedPlan.date}, so that slot is not free.`,
      };
    }
  }

  const aiResult = await generateAIResponse({
    message,
    schedule,
  });

  return {
    answer: aiResult.answer,
  };
};
