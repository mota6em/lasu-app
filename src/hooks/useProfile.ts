import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useOverviewCards } from "./useOverviewCards";
import { useUserStats } from "./useUserStats";

interface UseProfileProps {
  sUserId?: string; // optional, for public profiles
}

const useProfile = ({ sUserId }: UseProfileProps = {}) => {
  const { data: session, update } = useSession();
  const user = session?.user;
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);

  // stats and cards
  const { cards } = useOverviewCards();
  const totalTranslations =
    cards.find((c) => c.title === "Total Translations")?.value ?? "-";
  const { stats } = useUserStats(sUserId || user?.id || "");

  const handleSave = async () => {
    const userId = sUserId || user?.id;
    if (!userId) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: icon }),
      });

      const data = await res.json();
      if (data.success) {
        await update?.({
          name: data.user.name,
          image: data.user.image,
        });

        toast.success("Profile updated successfully 🎉");
      } else {
        toast.error(data.error || "Update failed ❌");
      }
    } catch (err) {
      toast.error("Error updating profile ⚠️");
    } finally {
      setLoading(false);
    }
  };

  const allStats = {
    totalTranslations,
    streakDays: stats?.streak ?? "-",
    xp: stats?.xp ?? "-",
    level: stats?.level ?? "-",
    premium: false,
  };
  const icons = [
    { id: 1, src: "/imgs/icons/lion.jpg", label: "Lion", requiredXP: 0 },
    { id: 2, src: "/imgs/icons/aqrab.jpg", label: "Aqrab", requiredXP: 50 },
    { id: 3, src: "/imgs/icons/bogy.jpg", label: "Bogy", requiredXP: 150 },
    { id: 4, src: "/imgs/icons/dragon2.jpg", label: "Dragon", requiredXP: 250 },
    { id: 5, src: "/imgs/icons/fox2.jpg", label: "Fox", requiredXP: 750 },
    { id: 6, src: "/imgs/icons/snack.jpg", label: "Snack", requiredXP: 1000 },
    { id: 7, src: "/imgs/icons/widcat.jpg", label: "Cat", requiredXP: 500 },
    { id: 8, src: "/imgs/icons/eagle.jpg", label: "Eagle", requiredXP: 2000 },
    { id: 9, src: "/imgs/icons/tiger.jpg", label: "Tiger", requiredXP: 3000 },
    {
      id: 10,
      src: "/imgs/icons/dragon.jpg",
      label: "Dragon",
      requiredXP: 4000,
    },
    {
      id: 11,
      src: "/imgs/icons/phoenix.jpg",
      label: "Phoenix",
      requiredXP: 5000,
    },
  ];
  return {
    user,
    allStats,
    icons,
    name,
    setName,
    icon,
    setIcon,
    loading,
    handleSave,
  };
};

export default useProfile;
