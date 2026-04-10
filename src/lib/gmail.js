import { google } from "googleapis";
import { getGmailTokens, saveGmailTokens } from "./db";

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/callback`
  );
}

export function getAuthUrl() {
  const oauth2 = getOAuth2Client();
  return oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
}

export async function getAuthedClient() {
  const tokens = getGmailTokens();
  if (!tokens) return null;

  const oauth2 = getOAuth2Client();
  oauth2.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expiry_date,
  });

  // Refresh if expired
  if (tokens.expiry_date && Date.now() > tokens.expiry_date - 60000) {
    try {
      const { credentials } = await oauth2.refreshAccessToken();
      saveGmailTokens(credentials);
      oauth2.setCredentials(credentials);
    } catch {
      return null;
    }
  }

  return oauth2;
}

export async function fetchInbox(query = "") {
  const auth = await getAuthedClient();
  if (!auth) return { authenticated: false, messages: [] };

  const gmail = google.gmail({ version: "v1", auth });

  // Search for emails matching club names
  const clubNames = ["Kjelsås", "Frigg", "Grei", "Vålerenga", "Skeid", "Lyn", "Stabæk", "Bærum", "fotball", "trening", "trial", "prøvetrening"];
  const searchQuery = query || clubNames.map(c => `subject:${c} OR from:${c}`).join(" OR ");

  try {
    const res = await gmail.users.messages.list({
      userId: "me",
      q: searchQuery,
      maxResults: 20,
    });

    if (!res.data.messages) return { authenticated: true, messages: [] };

    const messages = await Promise.all(
      res.data.messages.slice(0, 15).map(async (msg) => {
        const detail = await gmail.users.messages.get({ userId: "me", id: msg.id, format: "full" });
        const headers = detail.data.payload.headers;
        const subject = headers.find(h => h.name === "Subject")?.value || "";
        const from = headers.find(h => h.name === "From")?.value || "";
        const date = headers.find(h => h.name === "Date")?.value || "";
        const snippet = detail.data.snippet || "";

        // Extract body
        let body = "";
        if (detail.data.payload.body?.data) {
          body = Buffer.from(detail.data.payload.body.data, "base64").toString();
        } else if (detail.data.payload.parts) {
          const textPart = detail.data.payload.parts.find(p => p.mimeType === "text/plain");
          if (textPart?.body?.data) {
            body = Buffer.from(textPart.body.data, "base64").toString();
          }
        }

        return {
          id: msg.id,
          subject,
          from,
          date: new Date(date).toLocaleDateString("no-NO"),
          snippet,
          body,
          gmailId: msg.id,
        };
      })
    );

    return { authenticated: true, messages };
  } catch (err) {
    console.error("Gmail fetch error:", err.message);
    return { authenticated: true, messages: [], error: err.message };
  }
}

export async function sendEmail(to, subject, body) {
  const auth = await getAuthedClient();
  if (!auth) throw new Error("Not authenticated with Gmail");

  const gmail = google.gmail({ version: "v1", auth });

  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    body,
  ].join("\n");

  const encodedMessage = Buffer.from(message).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage },
  });

  return res.data;
}
