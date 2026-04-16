import { NextRequest, NextResponse } from "next/server";

const API_LLM = "https://api.openai.com/v1/chat/completions";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 500 }
    );
  }

  const res = await fetch(API_LLM, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for code analysis.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    return NextResponse.json(
      { error: "LLM request failed", details: error },
      { status: res.status }
    );
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? null;

  return NextResponse.json({ content });
}
