import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { text, langs, translationType } = req.body;
  if (!text || text.length > 1000) {
    return res.status(400).json({ error: "Please provide a short text." });
  }

  const preferredLangs = langs || ["en"];

  const isSingleWord = text.trim().split(/\s+/).length === 1;

  const userPrompt = isSingleWord
    ? `
      "${text}" is a single word.

      Respond in this JSON format only, using this structure only and no other text!!!:
       {
        "translations": { 
          ${preferredLangs
            .map((lang: string) => `"${lang}": "..."`)
            .join(",\n")}
        },
        "example": {
          ${preferredLangs
            .map((lang: string) => `"${lang}": "..."`)
            .join(",\n")}
        }
      }
     

      1. Detect its original language.
      2. Translate it into: ${preferredLangs.join(", ")}.
      3. Write a short meaning in the word's language.
      4. Write real-life example sentence in each target language. Meaning must match.
      Important: Use ${translationType} tone. Respond with raw JSON only. Do NOT use markdown, backticks, or any extra text.
    `
    : `
     Translate the sentence: "${text}"

    Respond in this JSON format only, using this structure only and no other text!!!:
    {
      "translations": {
        ${preferredLangs.map((lang: string) => `"${lang}": "..."`).join(",\n")}
      }
    }
  
    1. Detect the original language.
    2. Translate into: ${preferredLangs.join(", ")}.
   Important: Use ${translationType} tone. Respond with raw JSON only. Do NOT use markdown, backticks, or any extra text.
    `;
  try {
    const chat = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI that translates and explains language clearly.",
        },
        { role: "user", content: userPrompt },
      ],
    });

    const reply = chat.choices[0].message.content;
    const translation = reply?.replace("```json", "").replace("```", "");
    res.json({ translation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Translation failed." });
  }
}
