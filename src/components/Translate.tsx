"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import TranslationSettingDialog from "./TranslationSettingDialog";

export function Translate() {
  const [text, setText] = useState("");
  const [translationType, setTranslationType] = useState("formal");
  const [selectedLanguages, setSelectedLanguages] = useState([
    { value: "english", label: "English 🇺🇸" },
  ]);

  const handleTranslate = () => {
    const updated: Record<string, string> = {};
    selectedLanguages.forEach((lang) => {
      updated[
        lang.value
      ] = `🔁 ${text} translated (${translationType}) to ${lang.label}`;
    });
    setResult(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full space-y-6 flex flex-row gap-x-5">
      <div className="flex flex-col gap-4 flex-1 w-1/2">
        <Textarea
          placeholder="Enter your sentence..."
          className="min-h-[100px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button className="w-fit" onClick={handleTranslate}>
          Translate
        </Button>
      </div>

      <div className="flex flex-col w-1/2 ">
        <TranslationSettingDialog />
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-muted rounded shadow-sm border">
            <p className="font-semibold mb-1">Translation Result</p>
            <p>No translation yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
