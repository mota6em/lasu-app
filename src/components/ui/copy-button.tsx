"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  size?: number;
}

export default function CopyButton({
  value,
  label,
  className,
  size = 15,
}: CopyButtonProps) {
  const t = useTranslations("result");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard permission denied, nothing useful to fall back to
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? t("copied") : label ?? t("copy")}
      title={copied ? t("copied") : label ?? t("copy")}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-surface-2 hover:text-foreground active:scale-90",
        copied && "text-success hover:text-success",
        className
      )}
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
    </button>
  );
}
