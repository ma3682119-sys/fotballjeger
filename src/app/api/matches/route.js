import { getAllMatches, addMatch } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const matches = getAllMatches();
    return NextResponse.json(matches);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const match = await request.json();
    match.id = match.id || `m${Date.now()}`;
    addMatch(match);
    return NextResponse.json({ success: true, match });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
