import { FaTwitter } from "react-icons/fa";
import { FaSquareGithub } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { Check, Copy } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { IoCodeSlashOutline } from "react-icons/io5";
export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("support@lasu.online");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <footer className="border-t bg-white dark:bg-[#1212125d] text-foreground mt-10">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LaSu. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6 text-sm">
          {/* About dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="hover:text-primary transition-colors">
                About
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>About LaSu</DialogTitle>
                <DialogDescription>
                  LaSu - Your AI Language Support Extension & Web App
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  LaSu is a Chrome extension combined with a web application
                  designed to support language learners directly in their
                  browsing flow.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Context-aware translations with real-life examples</li>
                  <li>
                    Personalized translation history with spaced-repetition
                    reminders
                  </li>
                  <li>Settings for preferred languages and translation type</li>
                  <li>Dashboard with stats, streaks, and test/practice mode</li>
                  <li>Authentication and cloud storage with MongoDB</li>
                </ul>
                <p>
                  Technologies used: Chrome Extension APIs, Next.js, TypeScript,
                  Zustand, MongoDB. The goal is to make learning effortless,
                  continuous, and integrated into daily browsing.
                </p>
              </div>
              <div className="text-sm mt-1 text-muted-foreground gap-x-0.5 w-full flex justify-start items-start flex-row">
                <IoCodeSlashOutline size={18} className="mt-0.5" /> by{" "}
                <a
                  href="https://motasem.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary text-yellow-800 dark:text-yellow-600"
                >
                  @
                  <span className="border-b border-yellow-600 transition-colors">
                    motasem
                  </span>
                </a>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Nice 🙌</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Contact dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="hover:text-primary transition-colors">
                Contact
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Contact us</DialogTitle>
                <DialogDescription>
                  Questions, partnerships, or feedback? We&#39;d love to hear
                  from you.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <Button asChild className="w-full">
                  <a
                    href="https://forms.gle/gNaxyuWNybqstX9ZA"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Fill out the form
                  </a>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <a href="mailto:support@lasu.online">Send us an email</a>
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Privacy dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="hover:text-primary transition-colors">
                Privacy
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Privacy & Data</DialogTitle>
                <DialogDescription>
                  Short version: your data stays yours. We collect the minimum
                  needed to run LaSu.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    What we collect
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Account info (name, email) for user login and sending
                      translation history via email
                    </li>
                    <li>
                      Translation history (text + results) to show past items,
                      stats, and practice
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Storage & control
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Data is stored securely in our database.</li>
                    <li>
                      Access to your data is limited to authorized team members
                      only
                    </li>
                    <li>
                      We don't sell or share your personal information with
                      third parties
                    </li>
                  </ul>
                </div>

                <p>
                  Your privacy matters to us — we protect your information with
                  strong security measures and never sell it.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Got it</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4 items-center">
          <a
            href="#"
            aria-label="Twitter"
            className="hover:text-primary flex items-center justify-center"
          >
            <FaTwitter size={18} />
          </a>
          <a
            href="#"
            aria-label="GitHub"
            className="hover:text-primary flex items-center justify-center"
          >
            <FaSquareGithub size={18} />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="hover:text-primary flex items-center justify-center"
          >
            <FaInstagramSquare size={18} />
          </a>
          <a
            href="#"
            aria-label="TikTok"
            className="hover:text-primary flex items-center justify-center"
          >
            <AiFillTikTok size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
