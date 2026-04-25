import { callAi } from "./ai.model";
import { buildPrompt } from "./prompt.builder";
import { AIInput, AIResponse } from "./ai.types";

export const generateAIResponse = async (
  input: AIInput,
): Promise<AIResponse> => {
  const message = input.message.trim();

  if (!message) {
    return {
      answer: "Please ask a schedule-related question.",
    };
  }

  const prompt = buildPrompt({
    ...input,
    message,
  });

  const result = await callAi(prompt);

  return {
    answer: result.trim(),
  };
};
