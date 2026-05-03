import { useRef, useState } from "react";
import type { Message } from "./types";
import { askAssistantAPI } from "./assistantApi";
import {
  getIntentType,
  THINKING_STEPS,
  type IntentType,
} from "./assistantUtils";

export const useAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [thinkingStep, setThinkingStep] = useState<string | null>(null);
  const thinkingTimeoutsRef = useRef<number[]>([]);

  const clearThinkingTimers = () => {
    thinkingTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    thinkingTimeoutsRef.current = [];
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const startThinkingSteps = (intent: IntentType) => {
    if (intent === "none") return;

    const steps = THINKING_STEPS[intent];
    if (!steps || steps.length === 0) return;

    // Show first step immediately
    setThinkingStep(steps[0]);

    const initialDelayMs = 250;
    const stepDelayMs = 1500;

    steps.forEach((step, index) => {
      if (index === 0) return; // already set

      const timeoutId = window.setTimeout(
        () => {
          setThinkingStep(step);
        },
        initialDelayMs + index * stepDelayMs,
      );

      thinkingTimeoutsRef.current.push(timeoutId);
    });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setError(null);
    clearThinkingTimers();
    setThinkingStep(null);

    // USER MESSAGE
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setLoading(true);

    const intent = getIntentType(text);
    if (intent !== "none") {
      startThinkingSteps(intent);
    }

    try {
      const response = await askAssistantAPI(text);

      clearThinkingTimers();
      setThinkingStep(null);

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
      clearThinkingTimers();
      setThinkingStep(null);
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    error,
    thinkingStep,
  };
};
