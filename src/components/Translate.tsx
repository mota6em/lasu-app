"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const fakeTranslations = {
  arabic: "الترجمة هنا",
  english: "Translation here",
  hungarian: "Fordítás itt",
};

export function Translate() {
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("arabic");
  const [result, setResult] = useState(fakeTranslations);

  const handleTranslate = () => {
    // TODO: Call your API here later
    setResult({
      arabic: `🔁 ${text} بالعربية`,
      english: `🔁 ${text} in English`,
      hungarian: `🔁 ${text} magyarul`,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-row gap-x-4 w-full">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Translate</h2>
        <Textarea
          placeholder="Enter your sentence..."
          className="mb-4 min-h-[100px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={handleTranslate}>Translate</Button>
      </div>
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="arabic">Arabic 🇸🇦</TabsTrigger>
            <TabsTrigger value="english">English 🇺🇸</TabsTrigger>
            <TabsTrigger value="hungarian">Hungarian 🇭🇺</TabsTrigger>
          </TabsList>
          <TabsContent value="arabic">
            <div className="mt-4 p-4 bg-muted rounded">{result.arabic}</div>
          </TabsContent>
          <TabsContent value="english">
            <div className="mt-4 p-4 bg-muted rounded">{result.english}</div>
          </TabsContent>
          <TabsContent value="hungarian">
            <div className="mt-4 p-4 bg-muted rounded">{result.hungarian}</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
