export type IntentType = "availability" | "events" | "freeSlot" | "none";

export const THINKING_STEPS: Record<Exclude<IntentType, "none">, string[]> = {
  availability: [
    "Checking your availability...",
    "Looking through your schedule...",
  ],
  events: ["Fetching your events...", "Organizing your schedule..."],
  freeSlot: ["Searching for free time...", "Analyzing your schedule..."],
};

const GREETING_PATTERNS: RegExp[] = [
  /^\s*(hi|hello|hey|yo|heya|hiya|sup|hola)\b/i,
  /^\s*good\s+(morning|afternoon|evening)\b/i,
  /^\s*how\s+are\s+you\b/i,
  /^\s*what'?s\s+up\b/i,
];

const AVAILABILITY_PATTERNS: RegExp[] = [
  /\bam\s+i\s+free\b/i,
  /\bavailable\b/i,
  /\bavailability\b/i,
  /\bdo\s+i\s+have\s+time\b/i,
  /\bfree\s+today\b/i,
  /\bfree\s+this\b/i,
  /\bfree\s+in\b/i,
  /\bbusy\b/i,
];

const EVENT_LISTING_PATTERNS: RegExp[] = [
  /\blist\b.*\b(events|schedule)\b/i,
  /\bshow\b.*\b(events|schedule)\b/i,
  /\bmy\s+schedule\b/i,
  /\bmy\s+events\b/i,
  /\btoday'?s\s+schedule\b/i,
  /\bwhat\s+are\s+my\s+events\b/i,
];

const FREE_SLOT_PATTERNS: RegExp[] = [
  /\bfree\s+slot\b/i,
  /\bfree\s+time\b/i,
  /\bfind\b.*\btime\b/i,
  /\bschedule\b.*\b(meeting|call|appointment)\b/i,
  /\bbook\b.*\b(meeting|call|appointment)\b/i,
  /\bwhen\s+can\s+i\b/i,
  /\bnext\s+available\b/i,
  /\bslot\b/i,
];

const isGreetingOnly = (text: string): boolean =>
  GREETING_PATTERNS.some((pattern) => pattern.test(text));

export const getIntentType = (message: string): IntentType => {
  const trimmed = message.trim();
  const normalized = trimmed.toLowerCase();

  if (!trimmed) return "none";
  if (isGreetingOnly(normalized)) return "none";

  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  if (wordCount <= 2) return "none";

  if (FREE_SLOT_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return "freeSlot";
  }

  if (EVENT_LISTING_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return "events";
  }

  if (AVAILABILITY_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return "availability";
  }

  return "none";
};
