import { apiClient } from "../../services/apiClient.ts";
import { ENDPOINTS } from "../../services/endpoints.ts";

export interface AskAssistantResponse {
  answer: string;
  intent: "FREE_TIME" | "NEXT_EVENT" | "DAILY_SCHEDULE" | "UNKNOWN";
  date: string;
}

export const askAssistantAPI = async (
  question: string,
): Promise<AskAssistantResponse> => {
  return apiClient<AskAssistantResponse>(ENDPOINTS.ASK_ASSISTANT, {
    method: "POST",
    body: { message: question },
  });
};
