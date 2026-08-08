import Translation from "@/types/translation";
import User from "@/types/user";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
} as SMTPTransport.Options);

export async function sendSummary(
  user: User,
  userTranslations: Translation[],
  type: "daily" | "weekly",
) {
  const summaryType = type === "daily" ? "Daily" : "Weekly";
  //Filter single words only (no phrases)
  const singleWords = userTranslations.filter(
    (t) => !t.sourceText.includes(" "),
  );

  //Merge languages for duplicate words
  const mergedMap: Record<
    string,
    {
      word: string;
      langs: Record<string, string>;
      examples: Record<string, string>;
      createdAt: Date;
    }
  > = {};

  singleWords.forEach((t) => {
    const key = t.sourceText.toLowerCase();
    if (!mergedMap[key]) {
      mergedMap[key] = {
        word: t.sourceText,
        langs: {},
        examples: {},
        createdAt: new Date(t.createdAt),
      };
    }
    Object.keys(t.result.translations).forEach((lang) => {
      if (!mergedMap[key].langs[lang]) {
        mergedMap[key].langs[lang] = t.result.translations[lang];
      }
      if (t.result.example) {
        mergedMap[key].examples[lang] = t.result.example[lang];
      }
    });
  });

  //Sort by date & limit 50
  const mergedList = Object.values(mergedMap)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 50);

  //return if no words
  if (mergedList.length === 0) return;

  //Pick a "word of the day/week"
  const selectedWord =
    mergedList.length > 0
      ? mergedList[Math.floor(Math.random() * mergedList.length)]
      : null;

  //Build HTML
  const cardsHtml = mergedList
    .map(
      (t) => `
      <div style="background:#fff; margin-bottom:15px; padding:15px; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
        <h3 style="margin:0; color:#333;">${t.word}</h3>
        <div style="margin-top:8px; font-size:14px; color:#555;">
          ${Object.entries(t.langs)
            .map(
              ([lang, val]) =>
                `
          <div style="margin-bottom:6px;">
            <span style="display:inline-block; background:#eef; padding:2px 8px; margin:2px; border-radius:12px; font-size:13px;">
              ${lang}: ${val}
            </span>
            ${
              t.examples && t.examples[lang]
                ? `<p style="margin:4px 0 0 12px; font-size:13px; color:#444;"><i>${t.examples[lang]}</i></p>`
                : ""
            }
          </div>`,
            )
            .join("")}
        </div> 
      </div>`,
    )
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px; background:#fafafa; border-radius:12px;">
      
      <h1 style="text-align:center; color:#333;">✨ Hi ${
        user.name?.split(" ")[0]
      }, here's your LaSu ${summaryType} Summary</h1>
      <p style="text-align:center; color:#666;">Your latest words (up to 50). To see all words & phrases, visit your history page 🚀</p>

      <!-- Progress Bar -->
      <div style="background:#eee; border-radius:10px; overflow:hidden; margin:20px 0;">
        <div style="background:#4cafef; height:12px; width:${Math.min(
          (mergedList.length / 50) * 100,
          100,
        )}%;"></div>
      </div>
      <p style="font-size:14px; color:#444; text-align:center;">You reviewed <b>${
        mergedList.length
      } words</b> this ${type === "daily" ? "day" : "week"}. Keep it up 🔥</p>

      <!-- Word of the Day/Week -->
      ${
        selectedWord
          ? `
        <div style="background:#fff7e6; border-left:4px solid #f90; padding:10px 15px; margin:20px 0; border-radius:8px;">
          <h3 style="margin:0; color:#f90;">⭐ Word of the ${
            type === "daily" ? "Day" : "Week"
          }: ${selectedWord.word}</h3>
          <div style="margin-top:8px; font-size:14px; color:#555;">
            ${Object.entries(selectedWord.langs)
              .map(
                ([lang, val]) =>
                  `<span style="display:inline-block; background:#eef; padding:2px 8px; margin:2px; border-radius:12px; font-size:13px;">${lang}: ${val}</span>`,
              )
              .join("")}
          </div>
            ${Object.entries(selectedWord.examples || {})
              .map(
                ([lang, ex]) =>
                  `<p style="color:#555; margin:4px 0;"><i>${lang}: ${ex}</i></p>`,
              )
              .join("")}
        </div>`
          : ""
      }

      <!-- Cards -->
      <div style="margin-top:20px;">
        ${cardsHtml}
      </div>

      <!-- CTA -->
      <div style="text-align:center; margin:30px 0;">
        <a href="https://lasu.online/dashboard/history" style="display:inline-block; background:#4cafef; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:bold;">
          🔎 See all your words & phrases
        </a>
      </div>

      <!-- Footer -->
      <p style="font-size:12px; color:#777; text-align:center;">
        💡 Pro tip: Reviewing 5 minutes a day beats cramming once a week. Keep your streak alive!  
      </p>
      <p style="font-size:11px; color:#999; text-align:center; margin-top:20px;">
        To stop receiving these email summaries, you can cancel them from your <a href="https://lasu.online/dashboard/profile" style="color:#999; text-decoration:underline;">Profile Settings</a>.
      </p>
    </div>
  `;

  return transporter.sendMail({
    from: `"LaSu - Your AI Language Support" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "✨ Your LaSu " + summaryType + " Summary",
    html: htmlContent,
  });
}
