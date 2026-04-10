import { getAllClubs } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clubs = getAllClubs();
    return NextResponse.json(clubs);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
