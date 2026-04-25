import { Request, Response } from "express";
import {
  getGoogleAuthURL,
  exchangeCodeForTokens,
  createOAuthClient,
} from "./googleAuth.service";

// Step 1: Redirect user to Google login
export const googleLogin = (req: Request, res: Response) => {
  const url = getGoogleAuthURL();
  return res.redirect(url);
};

// Step 2: Handle Google redirect
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).send("No code provided");
    }

    const tokens = await exchangeCodeForTokens(code);

    console.log("TOKENS:", tokens);

    // 🔥 IMPORTANT: store this later (DB)
    // For now just test

    return res.send("Google Calendar connected successfully!");
  } catch (err) {
    console.error("OAuth Error:", err);
    return res.status(500).send("Authentication failed");
  }
};
