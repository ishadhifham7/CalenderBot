import express from "express";
import cors from "cors";
import chatRouter from "./modules/chat/chat.routes";
import { getActiveModel } from "./modules/ai/ai.model";

const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());
app.use(chatRouter);

// ===== Health Check Route =====
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Schedule Assistant backend is running",
    aiProvider: "groq",
    aiModel: getActiveModel(),
  });
});

export default app;
