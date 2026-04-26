import { google } from "googleapis";
import fs from "fs";
import path from "path";

const resolveServiceAccountKeyFile = () => {
  const candidates = [
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
    path.resolve(process.cwd(), "service-account.json"),
    path.resolve(process.cwd(), "src/modules/calender/service-account.json"),
    path.resolve(
      process.cwd(),
      "src/modules/calender/service-account.json.json",
    ),
    path.resolve(__dirname, "service-account.json"),
    path.resolve(__dirname, "service-account.json.json"),
  ].filter((candidate): candidate is string => Boolean(candidate));

  const existing = candidates.find((candidate) => fs.existsSync(candidate));
  if (!existing) {
    throw new Error(
      "Google service account key file not found. Set GOOGLE_SERVICE_ACCOUNT_KEY_FILE or place the file at src/modules/calender/service-account.json(.json).",
    );
  }

  return existing;
};

const auth = new google.auth.GoogleAuth({
  keyFile: resolveServiceAccountKeyFile(),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

export const getEventsForDate = async (date: string) => {
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

  return response.data.items || [];
};
