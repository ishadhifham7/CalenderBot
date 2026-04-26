import { getEventsForDate } from "../calender/googleCalendar.service";

const test = async () => {
  console.log("Running calendar test...");

  const events = await getEventsForDate("2026-04-26");

  console.log("EVENTS:");
  console.log(JSON.stringify(events, null, 2));
};

test();
