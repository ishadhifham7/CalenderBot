export const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const toTimestamp = (dateString: string): number => {
  return new Date(dateString).getTime();
};

export const formatTime = (date: Date): string => {
  return date.toISOString().substring(11, 16); // HH:MM format
};
