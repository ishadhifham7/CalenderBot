export const normalizeEvents = (items: any[]) => {
  return items
    .map((event) => ({
      title: event.summary || "Untitled Event",
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
    }))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
};
