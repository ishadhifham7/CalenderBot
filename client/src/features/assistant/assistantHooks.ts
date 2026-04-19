import { useState } from "react";
import type { Message } from "./types";
import { askAssistantAPI } from "./assistantApi";

export const useAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

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
    } catch {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "I could not process your request right now. Please try again.",
        timestamp: Date.now(),
      };

      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading,
  };
};
