import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export const createOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!,
  );
};

export const getGoogleAuthURL = () => {
  const client = createOAuthClient();

  return client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
};

export const exchangeCodeForTokens = async (code: string) => {
  const client = createOAuthClient();

  const { tokens } = await client.getToken(code);

  return tokens;
};
