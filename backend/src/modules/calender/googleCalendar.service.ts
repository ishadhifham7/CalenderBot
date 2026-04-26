import { google } from "googleapis";
import { normalizeEvents } from "./calender.mapper";
import { calculateFreeSlots } from "../../utils/freeSlots.util";

const CALENDAR_SCOPES = ["https://www.googleapis.com/auth/calendar"];

const buildGoogleAuth = () => {
  const rawCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!rawCredentials) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_KEY is not set. Add the full service account JSON as an environment variable.",
    );
  }

  let credentials: Record<string, unknown>;

  try {
    credentials = JSON.parse(rawCredentials) as Record<string, unknown>;
  } catch {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON. Paste the full service account JSON string as-is.",
    );
  }

  return new google.auth.GoogleAuth({
    credentials,
    scopes: CALENDAR_SCOPES,
  });
};

let calendarClient: ReturnType<typeof google.calendar> | null = null;

const getCalendarClient = () => {
  if (!calendarClient) {
    const auth = buildGoogleAuth();
    calendarClient = google.calendar({
      version: "v3",
      auth,
    });
  }

  return calendarClient;
};

/**
 * MAIN FUNCTION
 */
export const getScheduleForDate = async (date: string) => {
  const calendar = getCalendarClient();

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const response = await calendar.events.list({
    calendarId: "ishadhifham@gmail.com",
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const rawEvents = response.data.items || [];

  const events = normalizeEvents(rawEvents);
  const freeSlots = calculateFreeSlots(events, date);

  return {
    events,
    freeSlots,
  };
};

export const getScheduleForRange = async (
  startDate: string,
  endDate: string,
) => {
  const calendar = getCalendarClient();

  const start = new Date(startDate);
  const end = new Date(endDate);

  // normalize boundaries
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const response = await calendar.events.list({
    calendarId: "ishadhifham@gmail.com",
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const rawEvents = response.data.items || [];

  // normalize ALL events first
  const allEvents = normalizeEvents(rawEvents);

  // 🧠 group events by day
  const eventsByDay: Record<string, typeof allEvents> = {};

  for (const event of allEvents) {
    const day = event.start.split(" ")[0]; // "YYYY-MM-DD"

    if (!eventsByDay[day]) {
      eventsByDay[day] = [];
    }

    eventsByDay[day].push(event);
  }

  const allFreeSlots: { start: string; end: string }[] = [];

  // 🧠 iterate day-by-day
  let current = new Date(start);

  while (current <= end) {
    const dayKey = current.toISOString().split("T")[0];

    const dayEvents = eventsByDay[dayKey] || [];

    // reuse your existing engine
    const freeSlots = calculateFreeSlots(dayEvents, dayKey);

    allFreeSlots.push(...freeSlots);

    current.setDate(current.getDate() + 1);
  }

  return {
    events: allEvents,
    freeSlots: allFreeSlots,
  };
};
