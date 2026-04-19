import { useState } from "react";
import type { Message } from "./types";
import { askAssistantAPI } from "./assistantApi";

export const useAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setError(null);

    // USER MESSAGE
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setLoading(true);

    try {
      const response = await askAssistantAPI(text);

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        timestamp: Date.now(),
      };

      addMessage(aiMessage);
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : "I could not process your request right now. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    error,
  };
};
