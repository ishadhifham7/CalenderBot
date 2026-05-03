import {
  getScheduleForDate,
  getScheduleForRange,
  searchEvents,
} from "../../modules/calender/googleCalendar.service";

type DatePlan = {
  intent: "date";
  date: string;
};

type RangePlan = {
  intent: "range";
  startDate: string;
  endDate: string;
};

type SearchPlan = {
  intent: "search";
  startDate: string;
  endDate: string;
  keyword: string;
};

type SchedulePlan = {
  intent: "schedule";
  date: string;
  time: string;
  durationMinutes: number;
};

type FindSlotPlan = {
  intent: "find_slot";
  startDate: string;
  endDate: string;
  durationMinutes: number;
};

type ValidatedPlan =
  | DatePlan
  | RangePlan
  | SearchPlan
  | SchedulePlan
  | FindSlotPlan;

type ScheduleResult = {
  events: Array<{ title: string; start: string; end: string }>;
  freeSlots: Array<{ start: string; end: string }>;
};

export const executePlan = async (
  plan: ValidatedPlan,
): Promise<ScheduleResult> => {
  try {
    if (plan.intent === "date") {
      return await getScheduleForDate(plan.date);
    }

    if (plan.intent === "range") {
      return await getScheduleForRange(plan.startDate, plan.endDate);
    }

    if (plan.intent === "search") {
      return await searchEvents(plan.startDate, plan.endDate, plan.keyword);
    }

    if (plan.intent === "schedule") {
      return await getScheduleForDate(plan.date);
    }

    if (plan.intent === "find_slot") {
      return await getScheduleForRange(plan.startDate, plan.endDate);
    }
  } catch (error) {
    const details = error instanceof Error ? error.message : "unknown error";
    throw new Error(`Failed to execute plan: ${details}`);
  }

  throw new Error("Unsupported plan intent");
};

/*
Example usage:

(async () => {
  const result = await executePlan({
    intent: "search",
    startDate: "2026-05-01",
    endDate: "2026-05-07",
    keyword: "gym",
  });

  console.log(result);
})();
*/
