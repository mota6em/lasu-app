import type { DigestSchedule } from "@/lib/summarySchedule";

interface Settings {
  selectedLanguages: { value: string; label: string }[];
  translationType: string;
  uiLocale?: string;
  emailSummary?: boolean;
  emailDigest?: DigestSchedule;
}

export default Settings;
