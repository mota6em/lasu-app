"use client";

import { Switch } from "@/components/ui/switch";

export interface PrivacyState {
  showName: boolean;
  showPicture: boolean;
  shareTranslations: boolean;
}

const FIELDS: {
  key: keyof PrivacyState;
  label: string;
  hint: string;
}[] = [
  {
    key: "showName",
    label: "Show my name",
    hint: "Otherwise you appear as an anonymous learner.",
  },
  {
    key: "showPicture",
    label: "Show my picture",
    hint: "A medal icon stands in when this is off.",
  },
  {
    key: "shareTranslations",
    label: "Share my translated words",
    hint: "Single words only — full sentences are never shared.",
  },
];

export default function PrivacyToggles({
  value,
  onChange,
}: {
  value: PrivacyState;
  onChange: (next: PrivacyState) => void;
}) {
  return (
    <div className="divide-y divide-border rounded-xl border border-border">
      {FIELDS.map((field) => (
        <label
          key={field.key}
          className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3"
        >
          <span>
            <span className="block text-sm font-medium">{field.label}</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
              {field.hint}
            </span>
          </span>
          <Switch
            checked={value[field.key]}
            onCheckedChange={(checked) =>
              onChange({ ...value, [field.key]: checked })
            }
            className="cursor-pointer data-[state=checked]:bg-primary"
          />
        </label>
      ))}
    </div>
  );
}
