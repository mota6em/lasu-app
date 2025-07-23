"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { availableLanguages } from "@/lib/languages";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CiSettings } from "react-icons/ci";

interface Language {
  value: string;
  label: string;
}

export function Translate() {
  const MAX_LANGS = 4;
  const MIN_LANGS = 1;

  const [text, setText] = useState("");
  const [result, setResult] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("english");
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [translationType, setTranslationType] = useState("formal");

  const [selectedLanguages, setSelectedLanguages] = useState([
    { value: "english", label: "English 🇺🇸" },
  ]);

  const toggleLanguage = (lang: Language) => {
    const isSelected = selectedLanguages.some((l) => l.value === lang.value);
    if (isSelected) {
      if (selectedLanguages.length > MIN_LANGS) {
        const updated = selectedLanguages.filter((l) => l.value !== lang.value);
        setSelectedLanguages(updated);
        if (activeTab === lang.value) {
          setActiveTab(updated[0].value);
        }
      }
    } else {
      if (selectedLanguages.length < MAX_LANGS) {
        setSelectedLanguages([...selectedLanguages, lang]);
      }
    }
  };

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
        <div>
          <Dialog>
            <DialogTrigger>
              <button className="btn btn-neutral  px-2 ">
                <CiSettings className="w-6 h-6" />
                Translation Settings
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl">Settings</DialogTitle>
                <DialogDescription>
                  Customize your translation experience
                </DialogDescription>
                <div>
                  <p className="font-medium mb-2">Translation style:</p>
                  <div className="flex flex-wrap gap-4">
                    {["formal", "casual", "slang", "academic", "funny"].map(
                      (type) => (
                        <label
                          key={type}
                          className="flex items-center space-x-2 capitalize cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="translationType"
                            value={type}
                            checked={translationType === type}
                            className="cursor-pointer flex items-center justify-center w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                            onChange={() => setTranslationType(type)}
                          />
                          <span>{type}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">
                    Select up to 3 prefered languages:
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-3 rounded">
                    {availableLanguages.map((lang) => (
                      <label
                        key={lang.value}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          value={lang.value}
                          checked={selectedLanguages.some(
                            (l) => l.value === lang.value
                          )}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            if (isChecked) {
                              if (selectedLanguages.length < 4) {
                                setSelectedLanguages([
                                  ...selectedLanguages,
                                  lang,
                                ]);
                              }
                            } else {
                              setSelectedLanguages(
                                selectedLanguages.filter(
                                  (l) => l.value !== lang.value
                                )
                              );
                            }
                          }}
                          disabled={
                            !selectedLanguages.some(
                              (l) => l.value === lang.value
                            ) && selectedLanguages.length >= 4
                          }
                        />
                        <span>{lang.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </DialogHeader>
              <div className="flex justify-end">
                <Button className="w-fit">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
