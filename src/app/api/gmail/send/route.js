import { sendEmail } from "@/lib/gmail";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { to, subject, body } = await request.json();
    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing to, subject, or body" }, { status: 400 });
    }
    const result = await sendEmail(to, subject, body);
    return NextResponse.json({ success: true, messageId: result.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
