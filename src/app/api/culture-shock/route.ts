import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
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

    let text = completion.choices[0].message.content;

    // Strip code fences if ChatGPT adds them
    text = text.trim().replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();

    let jsonResult = [];
    try {
      jsonResult = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON:", e, "\nText was:", text);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json({ result: jsonResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
