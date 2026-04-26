import { toColomboDateTime } from "../../utils/time.utils";

type CalendarEventItem = {
  summary?: string | null;
  start?: { dateTime?: string | null; date?: string | null } | null;
  end?: { dateTime?: string | null; date?: string | null } | null;
};

export const normalizeEvents = (items: CalendarEventItem[]) => {
  return items
    .map((event) => {
      const rawStart = event.start?.dateTime || event.start?.date;
      const rawEnd = event.end?.dateTime || event.end?.date;

      if (!rawStart || !rawEnd) {
        return null;
      }

      return {
        title: event.summary || "Untitled Event",
        start: toColomboDateTime(rawStart),
        end: toColomboDateTime(rawEnd),
        sortValue: new Date(rawStart).getTime(),
      };
    })
    .filter((event): event is NonNullable<typeof event> => event !== null)
    .sort((a, b) => a.sortValue - b.sortValue)
    .map(({ sortValue, ...event }) => event);
};
