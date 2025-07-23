import React from "react";
import { useState } from "react";
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
import Language from "@/types/language";
import { useTranslateStore } from "@/store/useTranslateStore";
import { Button } from "./ui/button";

const TranslationSettingDialog = () => {
  const MAX_LANGS = 4;
  const MIN_LANGS = 1;
  const [activeTab, setActiveTab] = useState("english");
  const setSelectedLanguages = useTranslateStore((state) => state.setLanguages);

  const selectedLanguages = useTranslateStore(
    (state) => state.selectedLanguages
  );
  const translationType = useTranslateStore((state) => state.translationType);
  const setTranslationType = useTranslateStore(
    (state) => state.setTranslationType
  );
  const toggleLanguage = (lang: Language) => {
    const isSelected = selectedLanguages.some((l) => l.value === lang.value);
    if (isSelected) {
      if (selectedLanguages.length > MIN_LANGS) {
        const updated = selectedLanguages.filter((l) => l.value !== lang.value);
        setSelectedLanguages(updated);
        if (activeTab === lang.value) {
          setActiveTab(updated[0]?.value || "english");
        }
      }
    } else {
      if (selectedLanguages.length < MAX_LANGS) {
        setSelectedLanguages([...selectedLanguages, lang]);
      }
    }
  };

  return (
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
                Select up to 4 prefered languages:
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-3 rounded">
                {availableLanguages.map((lang) => (
                  <label
                    key={lang.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className={`cursor-pointer ${
                        selectedLanguages.length >= 4
                          ? "pointer-events-none opacity-50 "
                          : ""
                      }`}
                      checked={selectedLanguages.some(
                        (l) => l.value === lang.value
                      )}
                      onChange={() => toggleLanguage(lang)}
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
  );
};

export default TranslationSettingDialog;
