import { mockCalendar } from "./schedule.data";
import { getDateKey } from "./schedule.utils";

type ScheduleEvent = {
  id: number;
  title: string;
  start: string;
  end: string;
};

type FreeSlot = {
  from: Date;
  to: Date;
};

const calendar = mockCalendar as Record<string, ScheduleEvent[]>;

export const getTodaySchedule = () => {
  const today = getDateKey(new Date());
  return calendar[today] || [];
};

export const getScheduleByDate = (date: string) => {
  return calendar[date] || [];
};

export const getNextEvent = () => {
  const now = new Date().getTime();

  const allEvents = Object.values(calendar).flat();

  const upcoming = allEvents
    .map((event) => ({
      ...event,
      startTime: new Date(event.start).getTime(),
    }))
    .filter((event) => event.startTime > now)
    .sort((a, b) => a.startTime - b.startTime);

  return upcoming[0] || null;
};

export const getFreeSlotsForDate = (date: string) => {
  const events = calendar[date] || [];

  const dayStart = new Date(`${date}T00:00:00`).getTime();
  const dayEnd = new Date(`${date}T23:59:59`).getTime();

  const sorted = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  const freeSlots: FreeSlot[] = [];

  let prevEnd = dayStart;

  for (const event of sorted) {
    const start = new Date(event.start).getTime();

    if (start > prevEnd) {
      freeSlots.push({
        from: new Date(prevEnd),
        to: new Date(start),
      });
    }

    prevEnd = new Date(event.end).getTime();
  }

  if (prevEnd < dayEnd) {
    freeSlots.push({
      from: new Date(prevEnd),
      to: new Date(dayEnd),
    });
  }

  return freeSlots;
};

export const getFreeSlots = (date?: string) => {
  const targetDate = date ?? getDateKey(new Date());
  return getFreeSlotsForDate(targetDate);
};
