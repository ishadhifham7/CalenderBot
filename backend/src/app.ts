import express from "express";
import cors from "cors";
import chatRouter from "./modules/chat/chat.routes";
import { getActiveModel } from "./modules/ai/ai.model";
import calendarRoutes from "./modules/calender/calender.auth";

const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());
app.use(chatRouter);
app.use("/calenderbot/calenderbot-server/v1.0", calendarRoutes);

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
