import { getEventsForDate } from "../calender/googleCalendar.service";

const test = async () => {
  const fakeAuth = {}; // we will replace later

  const events = await getEventsForDate(fakeAuth, "2026-04-25");

  console.log(events);
};

test();
