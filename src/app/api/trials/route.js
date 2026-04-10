import { getAllTrials } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const trials = getAllTrials();
    return NextResponse.json(trials);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
