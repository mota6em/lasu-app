import { Session } from "next-auth";
import Settings from "@/types/settings";

export const saveSettings = async (
  settings: Settings,
  session: Session | null
) => {
  if (!session?.user?.id) {
    localStorage.setItem("lasu-settings", JSON.stringify(settings));
    return;
  }

  const res = await fetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: session.user.id, settings }),
  });

  if (!res.ok) throw new Error("Could not save your preferences.");
};

export default saveSettings;
