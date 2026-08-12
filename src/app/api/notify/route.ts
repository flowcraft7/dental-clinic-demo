import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name, service, date, status } = await req.json();

    const subject =
      status === "approved"
        ? "Your appointment is confirmed — Bright Smile Dental"
        : "Your appointment request update — Bright Smile Dental";

    const message =
      status === "approved"
        ? `Hi ${name}, your appointment for ${service} on ${date} has been confirmed. We look forward to seeing you!`
        : `Hi ${name}, unfortunately your appointment request for ${service} on ${date} could not be confirmed. Please contact us to reschedule.`;

    await resend.emails.send({
      from: "Bright Smile Dental <onboarding@resend.dev>",
      to: email,
      subject,
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}