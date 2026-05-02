import { google } from "googleapis";
import { normalizeEvents } from "./calender.mapper";
import { calculateFreeSlots } from "../../utils/freeSlots.util";
import { getColomboDayBounds } from "../../utils/time.utils";

const CALENDAR_SCOPES = ["https://www.googleapis.com/auth/calendar"];

import fs from "fs";
import path from "path";

const buildGoogleAuth = () => {
  const rawCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const keyFilePath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;

  // ✅ OPTION 1 — ENV JSON (Production)
  if (rawCredentials) {
    try {
      const credentials = JSON.parse(rawCredentials);

      return new google.auth.GoogleAuth({
        credentials,
        scopes: CALENDAR_SCOPES,
      });
    } catch {
      throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_KEY JSON");
    }
  }

  // ✅ OPTION 2 — FILE (Local Dev)
  if (keyFilePath) {
    const resolvedPath = path.resolve(process.cwd(), keyFilePath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Service account file not found at ${resolvedPath}`);
    }

    return new google.auth.GoogleAuth({
      keyFile: resolvedPath,
      scopes: CALENDAR_SCOPES,
    });
  }

  throw new Error(
    "No Google credentials found. Set GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SERVICE_ACCOUNT_KEY_FILE",
  );
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
  const { start: startOfDay, end: endOfDay } = getColomboDayBounds(date);
  const calendarId = "ishadhifham@gmail.com";

  const response = await calendar.events.list({
    calendarId,
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    timeZone: "Asia/Colombo",
    singleEvents: true,
    orderBy: "startTime",
  });

  const rawEvents = response.data.items || [];

  console.log("[calendar] date query", {
    calendarId,
    date,
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    events: rawEvents.length,
  });

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
  const { start: rangeStart } = getColomboDayBounds(startDate);
  const { end: rangeEnd } = getColomboDayBounds(endDate);
  const calendarId = "ishadhifham@gmail.com";

  const response = await calendar.events.list({
    calendarId,
    timeMin: rangeStart.toISOString(),
    timeMax: rangeEnd.toISOString(),
    timeZone: "Asia/Colombo",
    singleEvents: true,
    orderBy: "startTime",
  });

  const rawEvents = response.data.items || [];

  console.log("[calendar] range query", {
    calendarId,
    startDate,
    endDate,
    timeMin: rangeStart.toISOString(),
    timeMax: rangeEnd.toISOString(),
    events: rawEvents.length,
  });

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
  const addDays = (value: string, days: number) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().split("T")[0];
  };

  let current = startDate;

  while (current <= endDate) {
    const dayKey = current;

    const dayEvents = eventsByDay[dayKey] || [];

    // reuse your existing engine
    const freeSlots = calculateFreeSlots(dayEvents, dayKey);

    allFreeSlots.push(...freeSlots);

    current = addDays(current, 1);
  }

  return {
    events: allEvents,
    freeSlots: allFreeSlots,
  };
};

export const searchEvents = async (
  startDate: string,
  endDate: string,
  keyword: string,
) => {
  // 🔁 reuse existing range function
  const schedule = await getScheduleForRange(startDate, endDate);

  const normalizedKeyword = keyword.toLowerCase().trim();

  // 🧠 basic keyword filtering (can upgrade later)
  const filteredEvents = schedule.events.filter((event) =>
    event.title.toLowerCase().includes(normalizedKeyword),
  );

  return {
    events: filteredEvents,
    freeSlots: schedule.freeSlots,
  };
};
