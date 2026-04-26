import type { IntentResult } from "../intent/intent.service";

export type AIInput = {
  message: string;
  intent: IntentResult;
  schedule: {
    events: Array<{
      title: string;
      start: string;
      end: string;
    }>;
    freeSlots: Array<{
      start: string;
      end: string;
    }>;
  };
};

export type AIResponse = {
  answer: string;
};
