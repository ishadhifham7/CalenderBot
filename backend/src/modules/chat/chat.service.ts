import { generateAIResponse } from "../ai/ai.service";
import { detectIntent } from "../intent/intent.service";
import {
  getScheduleForDate,
  getScheduleForRange,
} from "../calender/googleCalendar.service";

type ScheduleEvent = {
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

const formatEventScheduleAnswer = (events: ScheduleEvent[]): string => {
  if (events.length === 0) {
    return "You are fully free today. No events are scheduled.";
  }

  const eventNames = events.map((event) => event.title).join(", ");
  return `Yeah, you have ${events.length} event${events.length > 1 ? "s" : ""} today: ${eventNames}.`;
};

const getScheduleForIntent = async (
  intentResult: ReturnType<typeof detectIntent>,
): Promise<{
  events: ScheduleEvent[];
  freeSlots: { start: string; end: string }[];
}> => {
  if (intentResult.scheduleQuery.type === "range") {
    return getScheduleForRange(
      intentResult.scheduleQuery.startDate,
      intentResult.scheduleQuery.endDate,
    );
  }

  return getScheduleForDate(intentResult.scheduleQuery.date);
};

export const handleUserMessage = async (
  message: string,
): Promise<ChatResult> => {
  const intentResult = detectIntent(message);
  const { events, freeSlots } = await getScheduleForIntent(intentResult);

  if (isEventScheduleQuestion(message)) {
    return {
      answer: formatEventScheduleAnswer(events),
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
