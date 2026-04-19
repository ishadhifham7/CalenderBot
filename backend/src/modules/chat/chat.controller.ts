import {
  getTodaySchedule,
  getNextEvent,
  getFreeSlots,
} from "../schedule/schedule.service";

console.log("TODAY:", getTodaySchedule());
console.log("NEXT:", getNextEvent());
console.log("FREE:", getFreeSlots());
