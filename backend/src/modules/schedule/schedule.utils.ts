export const getDateKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const toTimestamp = (dateString: string): number => {
  return new Date(dateString).getTime();
};

export const formatTime = (date: Date): string => {
  return date.toISOString().substring(11, 16); // HH:MM format
};
