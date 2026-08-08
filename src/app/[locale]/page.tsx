import { Metadata } from "next";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "LaSu - Your AI Language Support",
  description:
    "Learn languages effortlessly with LaSu - the Chrome extension that offers AI-powered translations, real-life examples, and contextual understanding as you browse.",
};

export default function Home() {
  redirect("/dashboard");
}
