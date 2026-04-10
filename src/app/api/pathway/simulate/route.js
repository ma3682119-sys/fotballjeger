import { runSimulation } from "@/lib/simulate";
import { saveSim } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { targetLevel = "senior", targetAge = 18, numSims = 100000 } = await request.json();
    const results = runSimulation(targetLevel, Math.min(Math.max(targetAge, 17), 21), Math.min(numSims, 200000));
    saveSim(targetLevel, targetAge, results);
    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
