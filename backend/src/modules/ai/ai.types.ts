export type IntentType =
  | "FREE_TIME"
  | "NEXT_EVENT"
  | "DAILY_SCHEDULE"
  | "UNKNOWN";

export type IntentResult = {
  intent: IntentType;
  date: string;
};

export type AIInput = {
  message: string;
  intent: IntentResult;
  schedule: Array<{
    id: number;
    title: string;
    start: string;
    end: string;
  }>;
};

export type AIResponse = {
  answer: string;
};
