export type ScheduleEvent = {
  id: number;
  title: string;
  start: string;
  end: string;
};

export type FreeSlot = {
  from: Date;
  to: Date;
};

export type Calendar = Record<string, ScheduleEvent[]>;
