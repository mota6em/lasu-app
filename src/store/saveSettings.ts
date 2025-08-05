import { Session } from "next-auth";

export const saveSettings = async (settings: any, session: Session | null) => {
  try {
    if (session?.user) {
      await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          settings,
        }),
      });
    } else {
      localStorage.setItem("lasu-settings", JSON.stringify(settings));
    }
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

export default saveSettings;
