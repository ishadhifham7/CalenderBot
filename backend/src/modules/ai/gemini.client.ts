import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-lite-preview";

let aiClient: GoogleGenerativeAI | null = null;

const getApiKey = (): string => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return apiKey;
};

const getModelName = (): string => {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
};

const getClient = (): GoogleGenerativeAI => {
  if (!aiClient) {
    aiClient = new GoogleGenerativeAI(getApiKey());
  }

  return aiClient;
};

export const callGemini = async (prompt: string): Promise<string> => {
  const sanitizedPrompt = prompt.trim();

  if (!sanitizedPrompt) {
    throw new Error("Prompt must not be empty");
  }

  try {
    const model = getClient().getGenerativeModel({
      model: getModelName(),
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 512,
      },
    });

    const result = await model.generateContent(sanitizedPrompt);
    const text = result.response.text().trim();

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Gemini API call failed: ${error.message}`);
    }

    throw new Error("Gemini API call failed");
  }
};
