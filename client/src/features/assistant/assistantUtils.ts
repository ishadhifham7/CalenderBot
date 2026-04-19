export const generateFakeResponse = (input: string): string => {
  const text = input.toLowerCase();

  if (text.includes("free")) {
    return "You are free between 11 AM and 2 PM.";
  }

  if (text.includes("schedule")) {
    return "You have 2 events today: Meeting and Study session.";
  }

  if (text.includes("hello")) {
    return "Hello 👋 I am your AI assistant.";
  }

  if (text.includes("busy")) {
    return "You have a packed schedule today.";
  }

  return "I am analyzing your schedule... (fake AI response)";
};
