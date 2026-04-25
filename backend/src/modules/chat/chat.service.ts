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

const isEventScheduleQuestion = (message: string): boolean => {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("events scheduled") ||
    normalized.includes("any events") ||
    normalized.includes("do i have events") ||
    normalized.includes("what events")
  );
};

const formatEventScheduleAnswer = (
  date: string,
  events: ScheduleEvent[],
): string => {
  if (events.length === 0) {
    return "You are fully free today. No events are scheduled.";
  }

  const eventNames = events.map((event) => event.title).join(", ");
  return `Yeah, you have ${events.length} event${events.length > 1 ? "s" : ""} today: ${eventNames}.`;
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

  if (isEventScheduleQuestion(message)) {
    return {
      answer: formatEventScheduleAnswer(intentResult.date, events),
      intent: intentResult.intent,
      date: intentResult.date,
    };
  }

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
