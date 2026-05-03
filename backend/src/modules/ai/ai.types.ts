export type AIInput = {
  message: string;
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
