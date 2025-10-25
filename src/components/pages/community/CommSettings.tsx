"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CiSettings, CiCircleQuestion } from "react-icons/ci";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

const CommSettings = () => {
  const { data: session } = useSession();
  const [showName, setShowName] = useState(true);
  const [showPicture, setShowPicture] = useState(true);
  const [shareTranslations, setShareTranslations] = useState(true);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`/api/community/users/${session.user.id}`);
        if (!res.ok) return;
        const data = await res.json();

        setShowName(data.showName);
        setShowPicture(data.showPicture);
        setShareTranslations(data.shareTranslations);
        setName(data.name || session.user.name || "");
        setImage(data.image || session.user.image || "");
      } catch (err) {
        console.error("Failed to fetch community user:", err);
      }
    };
    fetchSettings();
  }, [session]);

  // update settings
  const updateSettings = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/community/users/${session.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          image,
          showName,
          showPicture,
          shareTranslations,
        }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Error updating settings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute right-3">
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="bg-transparent hover:bg-transparent focus-visible:ring-0 focus:outline-none shadow-none"
              >
                <CiSettings className="!w-8 !h-8 cursor-pointer" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>LaSu Community Settings</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="sm:max-w-lg bg-[#161616]">
          <DialogHeader>
            <DialogTitle className="text-yellow-100">
              LaSu Community Settings
            </DialogTitle>
            <DialogDescription>
              Update your name, profile picture, and visibility preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-sm text-gray-300">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-gray-800 text-white border-none focus-visible:ring-1 focus-visible:ring-purple-600"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm text-gray-300">Profile Image URL</Label>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="bg-gray-800 text-white border-none focus-visible:ring-1 focus-visible:ring-purple-600"
              />
            </div>
            <div
              onClick={() => setShowName(!showName)}
              className="flex items-center justify-between"
            >
              <span>Show your name in the community?</span>
              <Switch checked={showName} className="cursor-pointer" />
            </div>

            <div
              onClick={() => setShowPicture(!showPicture)}
              className="flex items-center justify-between"
            >
              <span>Show your profile picture?</span>
              <Switch checked={showPicture} className="cursor-pointer" />
            </div>

            <div
              onClick={() => setShareTranslations(!shareTranslations)}
              className="flex items-center justify-between"
            >
              <Tooltip>
                <TooltipTrigger>
                  <span>
                    Share your translated words publicly?{" "}
                    <CiCircleQuestion
                      className="inline-block cursor-pointer mb-0.5"
                      size={18}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Only translated words are visible, nothing else you type.
                  <span className="block font-semibold">
                    Translated phrases are NOT shared!
                  </span>
                </TooltipContent>
              </Tooltip>
              <Switch checked={shareTranslations} className="cursor-pointer" />
            </div>
          </div>

          <DialogFooter>
            <Button
              disabled={loading}
              onClick={updateSettings}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommSettings;
