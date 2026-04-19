import { apiClient } from "../../services/apiClient.ts";
import { ENDPOINTS } from "../../services/endpoints.ts";
import { generateFakeResponse } from "./assistantUtils";

export interface AskAssistantResponse {
  answer: string;
}

const MOCK_API_DELAY_MS = 800;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const askAssistantAPI = async (
  question: string,
): Promise<AskAssistantResponse> => {
  try {
    return await apiClient<AskAssistantResponse>(ENDPOINTS.ASK_ASSISTANT, {
      method: "POST",
      body: { question },
    });
  } catch {
    // Temporary mock backend contract until real API is available.
    await delay(MOCK_API_DELAY_MS);

    return {
      answer: generateFakeResponse(question),
    };
  }
};
