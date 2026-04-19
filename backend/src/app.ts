import express from "express";
import cors from "cors";

const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());

// ===== Health Check Route =====
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Schedule Assistant backend is running",
  });
});

export default app;
