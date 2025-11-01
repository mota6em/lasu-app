import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const useProfile = () => {
  const { data: session, update } = useSession();
  const user = session?.user;
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    const userId =  user?.id;
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
        await update({
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

  const stats = {
    totalTranslations: 128,
    wordsLearned: 42,
    streakDays: 7,
    xp: 1600,
    premium: false,
  };

  const icons = {
    available: [
      { id: 1, src: "/imgs/icons/lion.jpg", label: "Lion" },
      { id: 2, src: "/imgs/icons/fox.jpg", label: "Fox" },
    ],
    locked: [
      { id: 3, src: "/imgs/icons/eagle.jpg", label: "Eagle", requiredXP: 2000 },
      { id: 4, src: "/imgs/icons/tiger.jpg", label: "Tiger", requiredXP: 3000 },
    ],
    premium: [
      { id: 5, src: "/imgs/icons/dragon.jpg", label: "Dragon" },
      { id: 6, src: "/imgs/icons/phoenix.jpg", label: "Phoenix" },
    ],
  };

  return {
    user,
    stats,
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
