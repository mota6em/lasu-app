"use client";

import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";

export interface PrivacyState {
  showName: boolean;
  showPicture: boolean;
  shareTranslations: boolean;
}

const FIELDS: (keyof PrivacyState)[] = [
  "showName",
  "showPicture",
  "shareTranslations",
];

export default function PrivacyToggles({
  value,
  onChange,
}: {
  value: PrivacyState;
  onChange: (next: PrivacyState) => void;
}) {
  const t = useTranslations("community");

  return (
    <div className="divide-y divide-border rounded-xl border border-border">
      {FIELDS.map((field) => (
        <label
          key={field}
          className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3"
        >
          <span>
            <span className="block text-sm font-medium">{t(field)}</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
              {t(`${field}Hint`)}
            </span>
          </span>
          <Switch
            checked={value[field]}
            onCheckedChange={(checked) => onChange({ ...value, [field]: checked })}
            className="cursor-pointer data-[state=checked]:bg-primary"
          />
        </label>
      ))}
    </div>
  );
}
