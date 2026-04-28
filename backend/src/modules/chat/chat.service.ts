import { generateAIResponse } from "../ai/ai.service";
import { detectIntent } from "../intent/intent.service";
import {
  getScheduleForDate,
  getScheduleForRange,
  searchEvents,
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

const formatSearchResultAnswer = (
  events: ScheduleEvent[],
  keyword: string,
): string => {
  if (events.length === 0) {
    return `No ${keyword} events found in that period.`;
  }

  const details = events
    .slice(0, 3)
    .map((event) => `${event.title} on ${event.start} to ${event.end}`)
    .join("; ");

  const extraCount = events.length - 3;
  const extraNote = extraCount > 0 ? ` and ${extraCount} more.` : ".";

  return `${events.length} ${keyword} event${events.length > 1 ? "s" : ""} found: ${details}${extraNote}`;
};

const getScheduleForIntent = async (
  intentResult: ReturnType<typeof detectIntent>,
): Promise<{
  events: ScheduleEvent[];
  freeSlots: { start: string; end: string }[];
}> => {
  if (intentResult.scheduleQuery.type === "search") {
    return searchEvents(
      intentResult.scheduleQuery.startDate,
      intentResult.scheduleQuery.endDate,
      intentResult.scheduleQuery.keyword,
    );
  }

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

  if (intentResult.scheduleQuery.type === "search") {
    return {
      answer: formatSearchResultAnswer(
        events,
        intentResult.scheduleQuery.keyword,
      ),
      intent: intentResult.intent,
      date: intentResult.date,
    };
  }

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
