import { getAuthUrl } from "@/lib/gmail";
import { getGmailTokens } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tokens = getGmailTokens();
    if (tokens?.refresh_token) {
      return NextResponse.json({ authenticated: true });
    }
    const url = getAuthUrl();
    return NextResponse.json({ authenticated: false, authUrl: url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
