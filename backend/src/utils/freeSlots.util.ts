type Event = {
  start: string;
  end: string;
};

type FreeSlot = {
  start: string;
  end: string;
};

import {
  getColomboDayBounds,
  parseColomboDateTime,
  toColomboDateTime,
} from "./time.utils";

export const calculateFreeSlots = (
  events: Event[],
  date: string,
): FreeSlot[] => {
  const { start: dayStart, end: dayEnd } = getColomboDayBounds(date);

  const slots: FreeSlot[] = [];

  let cursor = new Date(dayStart.getTime());

  for (const event of events) {
    const eventStart = parseColomboDateTime(event.start);
    const eventEnd = parseColomboDateTime(event.end);

    if (eventEnd <= dayStart || eventStart >= dayEnd) {
      continue;
    }

    const clampedStart = eventStart < dayStart ? dayStart : eventStart;
    const clampedEnd = eventEnd > dayEnd ? dayEnd : eventEnd;

    // gap before event
    if (clampedStart > cursor) {
      slots.push({
        start: toColomboDateTime(cursor),
        end: toColomboDateTime(clampedStart),
      });
    }

    // move cursor forward
    if (clampedEnd > cursor) {
      cursor = clampedEnd;
    }
  }

  // final gap
  if (cursor < dayEnd) {
    slots.push({
      start: toColomboDateTime(cursor),
      end: toColomboDateTime(dayEnd),
    });
  }

  return slots;
};
