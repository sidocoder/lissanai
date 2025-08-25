import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { text } = await req.json();

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
