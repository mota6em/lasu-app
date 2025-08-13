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
export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("support@lasu.app");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <footer className="border-t bg-white dark:bg-[#1212125d] text-foreground mt-10">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} LaSu. All rights reserved.
        </p>

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
                  Learn as you surf — AI-powered translations that feel natural
                  and stick.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  LaSu helps you learn languages directly on the web. Select
                  text anywhere to get context-aware translations, real-life
                  examples, and quick explanations.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Smart single-word & sentence translation</li>
                  <li>History with spaced-repetition reminders</li>
                  <li>Practice/Test mode built from your own browsing</li>
                  <li>Multi-language support, daily stats, and streaks</li>
                </ul>
                <p>
                  Built with Next.js + TypeScript. The goal: make learning
                  effortless and continuous, not another chore.
                </p>
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
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Contact us</DialogTitle>
                <DialogDescription>
                  Questions, partnerships, or feedback? We’d love to hear from
                  you.
                </DialogDescription>
              </DialogHeader>

              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO later - send email message
                  alert(
                    "Thanks! We'll get back to you within 2-3 business days."
                  );
                }}
              >
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input name="name" placeholder="Your name" required />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    name="message"
                    placeholder="Tell us how we can help…"
                    className="min-h-[120px]"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Send message</Button>
                </DialogFooter>
              </form>

              <div className="pt-2 text-xs text-muted-foreground flex items-center gap-2">
                Or email: <span className="font-medium">support@lasu.app</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={handleCopy}
                  aria-label="Copy email"
                >
                  {copied ? (
                    <Check className="h-2 w-2 text-green-500" />
                  ) : (
                    <Copy className="h-2 w-2" />
                  )}
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
                    <li>Account info (name, email) for login and support</li>
                    <li>
                      Translation history (text + results) to show past items,
                      stats, and practice
                    </li>
                    <li>
                      Basic analytics (anonymous) to improve performance and UX
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Storage & control
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Data is stored securely in our database using encryption
                      where possible
                    </li>
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
