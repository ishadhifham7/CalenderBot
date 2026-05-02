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
  const plan = await callPlanner(message);
  const validatedPlan = validatePlan(plan);
  const schedule = await executePlan(validatedPlan);
  const aiResult = await generateAIResponse({
    message,
    schedule,
  });

  return {
    answer: aiResult.answer,
  };
};
