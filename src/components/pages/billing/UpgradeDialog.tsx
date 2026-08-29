"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PricingPlans from "./PricingPlans";
import { useUpgradeDialog } from "@/store/useUpgradeDialog";
import { useBilling, useBillingActions } from "@/hooks/useBilling";
import { ERROR_KEY } from "./errors";

export default function UpgradeDialog() {
  const t = useTranslations("billing");
  const { isOpen, close } = useUpgradeDialog();
  const { status: authStatus } = useSession();
  const { status } = useBilling();
  const { checkout, pending, error, setError } = useBillingActions();

  useEffect(() => {
    if (!error) return;
    toast.error(t(ERROR_KEY[error] ?? "errGeneric"));
    setError(null);
  }, [error, setError, t]);

  if (authStatus === "unauthenticated") {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{t("signInTitle")}</DialogTitle>
            <DialogDescription>{t("errLogin")}</DialogDescription>
          </DialogHeader>
          <button
            onClick={() => signIn("google")}
            className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition-transform active:scale-[0.98]"
          >
            {t("signInCta")}
          </button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[92dvh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-700 dark:text-brand-300">
            <Sparkles className="h-3 w-3" />
            {t("eyebrow")}
          </span>
          <DialogTitle className="font-display text-2xl font-bold tracking-tight">
            {t("heading")}
          </DialogTitle>
          <DialogDescription className="text-sm">{t("subtitle")}</DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <PricingPlans
            status={status}
            pending={pending}
            onChoose={(plan) => checkout(plan)}
            disabled={!status?.billingEnabled}
          />
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">{t("stripeNote")}</p>
      </DialogContent>
    </Dialog>
  );
}
