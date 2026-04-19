import { generateAIResponse } from "../ai/ai.service";
import { detectIntent } from "../intent/intent.service";
import {
  getFreeSlotsForDate,
  getScheduleByDate,
} from "../schedule/schedule.service";

type ScheduleEvent = {
  id: number;
  title: string;
  start: string;
  end: string;
};

type ChatResult = {
  answer: string;
  intent: "FREE_TIME" | "NEXT_EVENT" | "DAILY_SCHEDULE" | "UNKNOWN";
  date: string;
};

const toScheduleEvent = (
  event: Pick<ScheduleEvent, "id" | "title" | "start" | "end">,
): ScheduleEvent => ({
  id: event.id,
  title: event.title,
  start: event.start,
  end: event.end,
});

export const handleUserMessage = async (
  message: string,
): Promise<ChatResult> => {
  const intentResult = detectIntent(message);

  const events = getScheduleByDate(intentResult.date).map(toScheduleEvent);
  const freeSlots = getFreeSlotsForDate(intentResult.date);

  const aiResult = await generateAIResponse({
    message,
    intent: intentResult,
    schedule: {
      events,
      freeSlots,
    },
  });

  return {
    answer: aiResult.answer,
    intent: intentResult.intent,
    date: intentResult.date,
  };
};
