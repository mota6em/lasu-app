"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PrivacyToggles, { type PrivacyState } from "./PrivacyToggles";

export default function CommSettings() {
  const t = useTranslations("community");
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacyState>({
    showName: true,
    showPicture: true,
    shareTranslations: true,
  });

  useEffect(() => {
    if (!session?.user?.id) return;

    fetch(`/api/community/users/${session.user.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setPrivacy({
          showName: data.showName ?? true,
          showPicture: data.showPicture ?? true,
          shareTranslations: data.shareTranslations ?? true,
        });
      })
      .catch(() => null);
  }, [session]);

  const save = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/community/users/${session.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(privacy),
      });
      if (!res.ok) throw new Error();
      toast.success(t("settingsSaved"));
      setOpen(false);
    } catch {
      toast.error(t("settingsFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-3.5 w-3.5" />
          {t("privacy")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle className="font-display text-xl">
            {t("settingsTitle")}
          </DialogTitle>
          <DialogDescription>{t("settingsDescription")}</DialogDescription>
        </DialogHeader>

        <PrivacyToggles value={privacy} onChange={setPrivacy} />

        <DialogFooter>
          <Button disabled={loading} onClick={save}>
            {loading ? t("saving") : t("saveChanges")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
