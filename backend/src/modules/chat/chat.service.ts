import { generateAIResponse } from "../ai/ai.service";
import { callPlanner } from "../ai/ai.planner";
import { validatePlan } from "../ai/ai.plan.validator";
import { executePlan } from "../../services/calendar/calendar.executor";

type ChatResult = {
  answer: string;
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
  const aiResult = await generateAIResponse({
    message,
    schedule,
  });

  return {
    answer: aiResult.answer,
  };
};
