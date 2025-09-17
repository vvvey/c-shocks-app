import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { homeCountry, visitingCountry } = await req.json();

    const prompt = `
You are an expert in cultural differences. 
List the cultural shocks a person might experience when traveling from ${homeCountry} to ${visitingCountry}.
Return the output strictly in JSON format, with the following structure:

[
  {
    "shock": "Brief description of the shock",
    "severity": "Low, Medium, or High",
    "tips": "Advice to adapt"
  },
  ...
]

Only return JSON, no extra text. Do not include markdown code fences.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const messageContent = completion.choices[0].message?.content;

if (!messageContent) {
  return NextResponse.json(
    { error: "No content returned from OpenAI" },
    { status: 500 }
  );
}

const text = messageContent
  .trim()
  .replace(/^```json/, "")
  .replace(/^```/, "")
  .replace(/```$/, "")
  .trim();

let jsonResult = [];
try {
  jsonResult = JSON.parse(text);
} catch (e) {
  console.error("Failed to parse JSON:", e, text);
  return NextResponse.json(
    { error: "Failed to parse AI response" },
    { status: 500 }
  );
}

return NextResponse.json(jsonResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
