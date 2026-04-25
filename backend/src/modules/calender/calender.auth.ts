import express from "express";
import { googleLogin, googleCallback } from "../calender/auth.controller";

const router = express.Router();

// START LOGIN
router.get("/auth/google", googleLogin);

// GOOGLE REDIRECT TARGET
router.get("/oauth2callback", googleCallback);

export default router;
