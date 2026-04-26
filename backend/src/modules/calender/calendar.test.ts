import { getScheduleForDate } from "../calender/googleCalendar.service";

const test = async () => {
  console.log("Running calendar test...");

  const schedule = await getScheduleForDate("2026-04-26");

  console.log("SCHEDULE:");
  console.log(JSON.stringify(schedule, null, 2));
};

test();
