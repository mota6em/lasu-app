"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useRouter } from "@/i18n/routing";

export default function JoinCommModal() {
  const t = useTranslations("community");
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacyState>({
    showName: true,
    showPicture: true,
    shareTranslations: true,
  });
  const router = useRouter();

  const joinCommunity = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/community/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(privacy),
      });
      if (!res.ok) throw new Error();

      toast.success(t("joined"));
      setOpen(false);
      router.refresh();
    } catch {
      toast.error(t("joinFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">{t("joinButton")}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle className="font-display text-xl">
            {t.rich("modalTitle", {
              brand: (chunks) => (
                <span className="newyork text-2xl text-brand-600 dark:text-brand-400">
                  {chunks}
                </span>
              ),
            })}
          </DialogTitle>
          <DialogDescription>{t("modalDescription")}</DialogDescription>
        </DialogHeader>

        <PrivacyToggles value={privacy} onChange={setPrivacy} />

        <label className="flex cursor-pointer items-center justify-end gap-2 text-sm text-muted-foreground">
          <Checkbox
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="cursor-pointer"
          />
          {t("agree")}
        </label>

        <DialogFooter>
          <Button disabled={!agreed || loading} onClick={joinCommunity}>
            {loading ? t("joining") : t("enter")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
