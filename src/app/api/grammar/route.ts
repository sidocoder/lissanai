import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { text } = await req.json();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/grammar/check`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  );

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a grammar correction assistant." },
      { role: "user", content: `Analyze and correct this text:\n${text}` },
    ],
  });

  // For now return mock structured response
  return NextResponse.json({
    issues: [
      { type: "Grammar", message: "Use 'makes' → 'make'", suggestion: "make" },
    ],
    improvedText: "This is the corrected version.",
    score: 92,
    wordCount: text.split(" ").length,
    readability: "Good",
  });
}
