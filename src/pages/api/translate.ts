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
  const langNames: Record<string, string> = {
    en: "English",
    ar: "Arabic",
    hun: "Hungarian",
    es: "Spanish",
    zh: "Chinese",
    hi: "Hindi",
    bn: "Bengali",
    fr: "French",
    ru: "Russian",
    pt: "Portuguese",
    ur: "Urdu",
  };

  const readableLangs = preferredLangs.map(
    (code: string) => langNames[code] || code
  );
  const isSingleWord = text.trim().split(/\s+/).length === 1;

  const formatLines = readableLangs
    .map((lang: string) => `${lang}: ...`)
    .join("\n");
  const userPrompt = isSingleWord
    ? `
      "${text}" is a single word.

      Respond in this JSON format only, using this structure only and no other text!!!:
       {
        "translations": { 
          ${readableLangs.map((lang: string) => `"${lang}": "..."`).join(",\n")}
        },
        "example": {
          ${readableLangs.map((lang: string) => `"${lang}": "..."`).join(",\n")}
        }
      }
     

      1. Detect its original language.
      2. Translate it into: ${readableLangs.join(", ")}.
      3. Write a short meaning in the word's language.
      4. Write real-life example sentence in each target language. Meaning must match.
      Important: Use ${translationType} tone. Respond with raw JSON only. Do NOT use markdown, backticks, or any extra text.
    `
    : `
     Translate the sentence: "${text}"

    Respond in this JSON format only, using this structure only and no other text!!!:
    {
      "translations": {
        ${readableLangs.map((lang: string) => `"${lang}": "..."`).join(",\n")}
      }
    }
  
    1. Detect the original language.
    2. Translate into: ${readableLangs.join(", ")}.
   Important: Use ${translationType} tone. Respond with raw JSON only. Do NOT use markdown, backticks, or any extra text.
    `;
  try {
    const chat = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
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
    res.json({ translation: reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Translation failed." });
  }
}
