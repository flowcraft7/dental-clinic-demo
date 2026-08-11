import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Aria, the friendly AI receptionist for Bright Smile Dental. 
Help visitors with: booking appointments, service info (Teeth Cleaning $89, Cosmetic Whitening $249, Dental Implants from $1200, Root Canal $399, Orthodontics from $2999, Emergency Care $99), clinic hours (Mon-Sat 9am-6pm), and general questions.
Keep replies short (2-3 sentences max), warm, and professional. If someone wants to book, ask for their name, preferred service, and preferred date, then tell them their request has been noted and the team will confirm.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't process that.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Something went wrong. Please try again." }, { status: 500 });
  }
}