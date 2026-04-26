import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { normalizeEvents } from "./calender.mapper";
import { calculateFreeSlots } from "../../utils/freeSlots.util";

const CALENDAR_SCOPES = ["https://www.googleapis.com/auth/calendar"];

const resolveServiceAccountKeyFile = () => {
  const candidates = [
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
    path.resolve(process.cwd(), "service-account.local.json"),
    path.resolve(process.cwd(), "service-account.json"),
    path.resolve(
      process.cwd(),
      "src/modules/calender/service-account.local.json",
    ),
    path.resolve(process.cwd(), "src/modules/calender/service-account.json"),
    path.resolve(
      process.cwd(),
      "src/modules/calender/service-account.json.json",
    ),
    path.resolve(__dirname, "service-account.local.json"),
    path.resolve(__dirname, "service-account.json"),
    path.resolve(__dirname, "service-account.json.json"),
  ].filter(Boolean) as string[];

  const existing = candidates.find((p) => fs.existsSync(p));

  return existing;
};

const buildGoogleAuth = () => {
  const keyFile = resolveServiceAccountKeyFile();
  if (keyFile) {
    return new google.auth.GoogleAuth({
      keyFile,
      scopes: CALENDAR_SCOPES,
    });
  }

  throw new Error(
    "Service account file not found. Set GOOGLE_SERVICE_ACCOUNT_KEY_FILE or add an untracked key at backend/service-account.local.json.",
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
