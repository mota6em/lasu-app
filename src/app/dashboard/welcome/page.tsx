"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md";
import { CgDanger } from "react-icons/cg";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import Link from "next/link";
export default function WelcomePage() {
  const [open, setOpen] = useState(false);

  const handleLogIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-10 max-w-xl text-center -mt-20">
        <h1 className="text-4xl font-extrabold mb-6 flex items-center justify-center gap-3">
          <MdOutlineWavingHand className="text-yellow-600 animate-bounce" />
          Welcome to{" "}
          <span className="text-yellow-600 newyork text-6xl animate-bounce">
            LaSu
          </span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
          LaSu helps you learn languages smarter! <br />
          Highlight text online, get AI-powered translations, examples, and save
          your words to history.
        </p>
        <div className="flex flex-col gap-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
            onClick={() => handleLogIn()}
          >
            <FaGoogle /> Login & Get Started
          </Button>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="py-3 rounded-xl text-lg">
                Skip for now
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Wait!{" "}
                  <CgDanger
                    className="text-red-600 animate-bounce inline-block"
                    size={24}
                  />
                </AlertDialogTitle>
                <AlertDialogDescription>
                  If you skip login, you'll lose many features like saving
                  translations, history tracking, and personalized learning. Are
                  you sure you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <AlertDialogCancel className="cursor-pointer">
                  <Link href="/dashboard">Skip and Continue to main page</Link>
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleLogIn()}
                  className="cursor-pointer"
                >
                  I'll login in now
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
