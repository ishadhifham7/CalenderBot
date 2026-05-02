import {
  getScheduleForDate,
  getScheduleForRange,
  searchEvents,
} from "../../modules/calender/googleCalendar.service";

type DatePlan = {
  type: "date";
  date: string;
};

type RangePlan = {
  type: "range";
  startDate: string;
  endDate: string;
};

type SearchPlan = {
  type: "search";
  startDate: string;
  endDate: string;
  keyword: string;
};

type ValidatedPlan = DatePlan | RangePlan | SearchPlan;

type ScheduleResult = {
  events: Array<{ title: string; start: string; end: string }>;
  freeSlots: Array<{ start: string; end: string }>;
};

export const executePlan = async (
  plan: ValidatedPlan,
): Promise<ScheduleResult> => {
  try {
    if (plan.type === "date") {
      return await getScheduleForDate(plan.date);
    }

    if (plan.type === "range") {
      return await getScheduleForRange(plan.startDate, plan.endDate);
    }

    if (plan.type === "search") {
      return await searchEvents(plan.startDate, plan.endDate, plan.keyword);
    }
  } catch (error) {
    const details = error instanceof Error ? error.message : "unknown error";
    throw new Error(`Failed to execute plan: ${details}`);
  }

  throw new Error("Unsupported plan type");
};

/*
Example usage:

(async () => {
  const result = await executePlan({
    type: "search",
    startDate: "2026-05-01",
    endDate: "2026-05-07",
    keyword: "gym",
  });

  console.log(result);
})();
*/
