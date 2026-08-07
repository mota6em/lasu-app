"use client";

import { useEffect, useState } from "react";
import { Loader2, Volume2 } from "lucide-react";
import { speak, speechSupported, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

interface SpeakButtonProps {
  text: string;
  lang: string;
  className?: string;
  size?: number;
}

export default function SpeakButton({
  text,
  lang,
  className,
  size = 15,
}: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(speechSupported());
    return () => stopSpeaking();
  }, []);

  if (!supported) return null;

  const play = async () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    await speak(text, lang);
    setSpeaking(false);
  };

  return (
    <button
      type="button"
      onClick={play}
      aria-label={`Listen in ${lang}`}
      title="Listen"
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-surface-2 hover:text-foreground active:scale-90",
        speaking && "text-brand-600 dark:text-brand-400",
        className
      )}
    >
      {speaking ? (
        <Loader2 size={size} className="animate-spin" />
      ) : (
        <Volume2 size={size} />
      )}
    </button>
  );
}
