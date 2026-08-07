"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
      toast.success("Community settings updated");
      setOpen(false);
    } catch {
      toast.error("Could not save those settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-3.5 w-3.5" />
          Privacy
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Community privacy
          </DialogTitle>
          <DialogDescription>
            Control what other learners see about you.
          </DialogDescription>
        </DialogHeader>

        <PrivacyToggles value={privacy} onChange={setPrivacy} />

        <DialogFooter>
          <Button disabled={loading} onClick={save}>
            {loading ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
