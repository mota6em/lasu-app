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

export async function sendWeeklySummary(
  user: User,
  userTranslations: Translation[]
) {
  const translationsHtml = userTranslations
    .map((t) => {
      const langsHtml = user.selectedLanguages
        .map((lang) => `<li>${lang}: ${t.result.translations[lang] ?? ""}</li>`)
        .join("");
      const exampleHtml = t.result.example
        ? `<i>Example: ${t.result.example.english}</i>`
        : "";
      return `
        <li>
          <b>${t.sourceText}</b> (${t.translationType})
          <ul>${langsHtml}</ul>
          ${exampleHtml}
        </li>
      `;
    })
    .join("");

  const htmlContent = `
    <h1>Hi ${user.name} 👋</h1>
    <p>Here's your LaSu weekly summary:</p>
    <ul>${translationsHtml}</ul>
    <p>Keep learning and see you next week! 🚀</p>
  `;

  return transporter.sendMail({
    from: `"LaSu - Your AI Language Support" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "✨ Your LaSu Weekly Summary",
    html: htmlContent,
  });
}
