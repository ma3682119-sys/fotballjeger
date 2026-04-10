import { getOAuth2Client } from "@/lib/gmail";
import { saveGmailTokens } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    const oauth2 = getOAuth2Client();
    const { tokens } = await oauth2.getToken(code);
    saveGmailTokens(tokens);
    return NextResponse.redirect(new URL("/inbox?gmail=connected", request.url));
  } catch (err) {
    console.error("OAuth callback error:", err.message);
    return NextResponse.redirect(new URL(`/inbox?error=${encodeURIComponent(err.message)}`, request.url));
  }
}
