import { generateAIResponse } from "../ai/ai.service";
import { detectIntent } from "../intent/intent.service";
import {
  getFreeSlotsForDate,
  getNextEvent,
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

  let schedule: ScheduleEvent[] = [];

  if (intentResult.intent === "FREE_TIME") {
    const freeSlots = getFreeSlotsForDate(intentResult.date);
    schedule = freeSlots.map((slot, index) => ({
      id: index + 1,
      title: "Free Slot",
      start: slot.from.toISOString(),
      end: slot.to.toISOString(),
    }));
  } else if (intentResult.intent === "NEXT_EVENT") {
    const nextEvent = getNextEvent();
    schedule = nextEvent ? [toScheduleEvent(nextEvent)] : [];
  } else if (intentResult.intent === "DAILY_SCHEDULE") {
    schedule = getScheduleByDate(intentResult.date).map(toScheduleEvent);
  }

  const aiResult = await generateAIResponse({
    message,
    intent: intentResult,
    schedule,
  });

  return {
    answer: aiResult.answer,
    intent: intentResult.intent,
    date: intentResult.date,
  };
};
