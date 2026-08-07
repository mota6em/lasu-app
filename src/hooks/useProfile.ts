import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useOverviewCards } from "./useOverviewCards";
import { useUserStats } from "./useUserStats";

interface UseProfileProps {
  sUserId?: string; // optional, for public profiles
}

async function fetchUser(userId: string) {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

const useProfile = ({ sUserId }: UseProfileProps = {}) => {
  const { data: session, update } = useSession();
  const sessionUser = session?.user;
  const queryClient = useQueryClient();

  const { data: publicUser, isLoading: publicUserLoading } = useQuery({
    queryKey: ["profile-user", sUserId],
    queryFn: () => fetchUser(sUserId as string),
    enabled: !!sUserId,
  });

  const { data: selfUser } = useQuery({
    queryKey: ["profile-user", sessionUser?.id],
    queryFn: () => fetchUser(sessionUser!.id),
    enabled: !sUserId && !!sessionUser?.id,
  });

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [emailSummary, setEmailSummary] = useState(true);

  // seed the editable emailSummary toggle once the owning user's data lands
  useEffect(() => {
    const source = sUserId ? publicUser : selfUser;
    if (source) setEmailSummary(source.emailSummary ?? true);
  }, [sUserId, publicUser, selfUser]);

  // stats and cards
  const { cards } = useOverviewCards();
  const { stats } = useUserStats(sUserId || sessionUser?.id || "");

  const user = sUserId ? publicUser ?? null : sessionUser;
  const totalTranslations = sUserId
    ? (stats?.allTimeTranslations ?? "-")
    : (cards.find((c) => c.title === "Total Translations")?.value ?? "-");

  const saveMutation = useMutation({
    mutationFn: async () => {
      const userId = sessionUser?.id;
      if (!userId) throw new Error("Not signed in");

      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: icon, emailSummary }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Update failed");
      return data.user;
    },
    onSuccess: async (updatedUser) => {
      await update?.({ name: updatedUser.name, image: updatedUser.image });
      queryClient.invalidateQueries({
        queryKey: ["profile-user", sessionUser?.id],
      });
      toast.success("Profile updated successfully 🎉");
    },
    onError: (err: any) => {
      toast.error(err.message || "Error updating profile ⚠️");
    },
  });

  const handleSave = () => {
    saveMutation.mutate();
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
    emailSummary,
    setEmailSummary,
    loading: saveMutation.isPending,
    publicUserLoading,
    handleSave,
  };
};

export default useProfile;
