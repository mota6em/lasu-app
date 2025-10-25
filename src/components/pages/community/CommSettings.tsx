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
import { useSession } from "next-auth/react";

const CommSettings = () => {
  const [showName, setShowName] = useState(true);
  const [showPicture, setShowPicture] = useState(true);
  const [shareTranslations, setShareTranslations] = useState(true);
  const [loading, setLoading] = useState(false);

  const updateSettings = () => {};
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
              Update your visibility and sharing preferences anytime.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
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
                  Only the translated words are visible, nothing else you type.
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
