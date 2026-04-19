import type { Request, Response } from "express";
import { handleUserMessage } from "./chat.service";

type ChatRequestBody = {
  message?: unknown;
};

export const postChat = async (
  req: Request<unknown, unknown, ChatRequestBody>,
  res: Response,
): Promise<void> => {
  const { message } = req.body;

  if (typeof message !== "string" || !message.trim()) {
    res.status(400).json({
      error: "message is required",
    });
    return;
  }

  try {
    const result = await handleUserMessage(message);
    res.status(200).json(result);
  } catch {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
