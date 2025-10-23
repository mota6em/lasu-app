import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CiCircleQuestion } from "react-icons/ci";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";

const JoinCommModal = () => {
  const [agreed, setAgreed] = useState(false);
  const [showName, setShowName] = useState(true);
  const [showPicture, setShowPicture] = useState(true);
  const [shareTranslations, setShareTranslations] = useState(true);

  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const joinCommunity = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch("/api/community/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showName, showPicture, shareTranslations }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-white mt-4 ms-3 text-purple-600 hover:bg-white/90 shadow-md animate-bounce">
          Join Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-[#161616]">
        <DialogHeader>
          <DialogTitle className="text-yellow-100">
            Welcome to{" "}
            <span className="text-yellow-400 newyork text-4xl">LaSu</span>{" "}
            Community!
          </DialogTitle>
          <DialogDescription>
            Please review our terms and choose your privacy preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Your raw texts will never be shared—only translated words and
            phrases.
          </p>

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
          <div
            className="flex items-center gap-2 justify-end cursor-pointer"
            onClick={() => setAgreed(!agreed)}
          >
            <Checkbox checked={agreed} className="cursor-pointer"></Checkbox>
            <p className="text-sm text-gray-500">
              {" "}
              I agree to the Terms & Conditions
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={!agreed || loading}
            className="bg-purple-600 text-white hover:bg-purple-700"
            onClick={joinCommunity}
          >
            {loading ? "Joining..." : "Enter Community"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCommModal;
