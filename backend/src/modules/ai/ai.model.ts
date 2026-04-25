import Groq from "groq-sdk";

const DEFAULT_MODEL = "llama3-8b-8192";

let aiClient: Groq | null = null;

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

  try {
    const completion = await getClient().chat.completions.create({
      model: getModelName(),
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

    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Groq API call failed: ${error.message}`);
    }

    throw new Error("Groq API call failed");
  }
};
