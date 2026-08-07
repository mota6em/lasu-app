"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function JoinCommModal() {
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

      toast.success("You're in — welcome to the community");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Could not join right now. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Join the community</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Welcome to the{" "}
            <span className="newyork text-2xl text-brand-600 dark:text-brand-400">
              LaSu
            </span>{" "}
            community
          </DialogTitle>
          <DialogDescription>
            Choose what other learners can see. You can change all of this later.
          </DialogDescription>
        </DialogHeader>

        <PrivacyToggles value={privacy} onChange={setPrivacy} />

        <label className="flex cursor-pointer items-center justify-end gap-2 text-sm text-muted-foreground">
          <Checkbox
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="cursor-pointer"
          />
          I agree to the terms &amp; conditions
        </label>

        <DialogFooter>
          <Button disabled={!agreed || loading} onClick={joinCommunity}>
            {loading ? "Joining…" : "Enter community"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
