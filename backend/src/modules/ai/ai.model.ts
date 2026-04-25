import Groq from "groq-sdk";

const DEFAULT_MODEL = "llama-3.1-8b-instant";
const FALLBACK_MODELS = ["llama-3.1-8b-instant", "llama3-70b-8192"];

let aiClient: Groq | null = null;
let activeModelName = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;

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

export const getActiveModel = (): string => {
  return activeModelName;
};

const getCandidateModels = (): string[] => {
  const preferredModel = getModelName();
  const unique = new Set<string>([preferredModel, ...FALLBACK_MODELS]);
  return Array.from(unique);
};

const isModelUnavailableError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("model_decommissioned") ||
    message.includes("decommissioned") ||
    message.includes("model not found") ||
    message.includes("does not exist")
  );
};

const getClient = (): Groq => {
  if (!aiClient) {
    aiClient = new Groq({
      apiKey: getApiKey(),
    });
  }

  return aiClient;
};

export const callAi = async (prompt: string): Promise<string> => {
  const sanitizedPrompt = prompt.trim();

  if (!sanitizedPrompt) {
    throw new Error("Prompt must not be empty");
  }

  const candidates = getCandidateModels();
  let lastError: unknown = null;

  for (const model of candidates) {
    try {
      const completion = await getClient().chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "You are a smart and precise calendar assistant.",
          },
          {
            role: "user",
            content: sanitizedPrompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 512,
      });

      const text = completion.choices?.[0]?.message?.content?.trim();

      if (!text) {
        throw new Error("LLaMA returned an empty response");
      }

      activeModelName = model;
      return text;
    } catch (error) {
      lastError = error;

      if (!isModelUnavailableError(error)) {
        break;
      }

      console.warn(`[ai] model unavailable: ${model}. trying next model.`);
    }
  }

  if (lastError instanceof Error) {
    throw new Error(`Groq API call failed: ${lastError.message}`);
  }

  throw new Error("Groq API call failed");
};
