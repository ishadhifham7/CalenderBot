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
  schedule: {
    events: Array<{
      id: number;
      title: string;
      start: string;
      end: string;
    }>;
    freeSlots: Array<{
      from: Date;
      to: Date;
    }>;
  };
};

export type AIResponse = {
  answer: string;
};
