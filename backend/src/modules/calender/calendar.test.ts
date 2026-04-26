import {
  getScheduleForDate,
  getScheduleForRange,
} from "../calender/googleCalendar.service";

const test = async () => {
  console.log("Running calendar test...");

  const schedule = await getScheduleForRange("2026-04-26", "2026-04-30");

  console.log("SCHEDULE:");
  console.log(JSON.stringify(schedule, null, 2));
};

test();
