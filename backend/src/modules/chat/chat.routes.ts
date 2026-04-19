import { Router } from "express";
import { postChat } from "./chat.controller";

const chatRouter = Router();

chatRouter.post("/chat", postChat);

export default chatRouter;
