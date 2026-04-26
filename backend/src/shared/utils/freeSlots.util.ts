type Event = {
  start: string;
  end: string;
};

type FreeSlot = {
  start: string;
  end: string;
};

export const calculateFreeSlots = (
  events: Event[],
  date: string,
): FreeSlot[] => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const slots: FreeSlot[] = [];

  let cursor = dayStart;

  for (const event of events) {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // gap before event
    if (eventStart > cursor) {
      slots.push({
        start: cursor.toISOString(),
        end: eventStart.toISOString(),
      });
    }

    // move cursor forward
    if (eventEnd > cursor) {
      cursor = eventEnd;
    }
  }

  // final gap
  if (cursor < dayEnd) {
    slots.push({
      start: cursor.toISOString(),
      end: dayEnd.toISOString(),
    });
  }

  return slots;
};
