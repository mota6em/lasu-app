"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaUserEdit, FaCrown, FaFireAlt, FaLock } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { GiBookshelf, GiBrain } from "react-icons/gi";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useProfile from "@/hooks/useProfile";

export default function ProfilePage() {
  const {
    user,
    stats,
    icons,
    name,
    setName,
    icon,
    setIcon,
    loading,
    handleSave,
  } = useProfile();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setIcon(user.image || "/imgs/userIcon.png");
    }
  }, [user]);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-3xl font-bold text-center mb-2 text-yellow-600 flex items-center justify-center gap-2">
        <FaCrown className="text-yellow-600" /> My Profile
      </h2>
      <p className="text-center text-gray-600">Manage your info and rewards.</p>

      <Card className="shadow-md border border-yellow-100 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
        <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <div className="relative flex flex-col items-center">
            <Image
              src={icon}
              alt="Profile Icon"
              width={120}
              height={120}
              className="rounded-full border-4 border-yellow-600 shadow-lg bg-white"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-3 bg-yellow-600 hover:bg-yellow-600 text-white w-fit">
                  Change Icon
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-yellow-600 font-bold text-xl">
                    Choose Your Icon
                  </DialogTitle>
                </DialogHeader>{" "}
                <div className="space-y-4">
                  {/* Available */}
                  <section>
                    <h3 className="font-semibold text-yellow-700 mb-2">
                      Available
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {icons.available.map((ic) => (
                        <Image
                          key={ic.id}
                          src={ic.src}
                          alt={ic.label}
                          width={70}
                          height={70}
                          onClick={() => setIcon(ic.src)}
                          className={`cursor-pointer rounded-full border-2 transition bg-white ${
                            icon === ic.src
                              ? "border-yellow-600 scale-110"
                              : "border-transparent hover:opacity-80"
                          }`}
                        />
                      ))}
                    </div>
                  </section>

                  {/* Locked */}
                  <section>
                    <h3 className="font-semibold text-gray-600 mb-2 flex items-center gap-1">
                      <FaLock /> Locked (Reach more XP)
                    </h3>
                    <div className="grid grid-cols-4 gap-3 opacity-50">
                      {icons.locked.map((ic) => (
                        <div
                          key={ic.id}
                          className="relative flex items-center justify-center"
                        >
                          <div className="relative w-[70px] h-[70px] rounded-full overflow-hidden">
                            <Image
                              src={ic.src}
                              alt={ic.label}
                              fill
                              className="object-cover grayscale bg-white"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold bg-black/50 text-white">
                              {ic.requiredXP} XP
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Premium */}
                  <section>
                    <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-1">
                      <FaCrown className="text-yellow-600" /> Premium Users
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {icons.premium.map((ic) => (
                        <Image
                          key={ic.id}
                          src={ic.src}
                          alt={ic.label}
                          width={70}
                          height={70}
                          className={`rounded-full border-2 bg-white ${
                            stats.premium
                              ? "border-yellow-600 cursor-pointer"
                              : "grayscale opacity-60 cursor-no-drop"
                          }`}
                          onClick={() => stats.premium && setIcon(ic.src)}
                        />
                      ))}
                    </div>
                  </section>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-3 flex-1 w-full">
            <div className="flex items-center gap-2">
              <FaUserEdit className="text-yellow-600" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MdOutlineEmail className="text-yellow-600" />
              <span>{user.email || "no email"}</span>
            </div>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-600 text-white w-fit mt-2 flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="text-center bg-yellow-50 dark:bg-yellow-900/10 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <GiBookshelf className="text-3xl text-yellow-600 mb-1" />
            <p className="text-3xl font-bold text-yellow-600">
              {stats.totalTranslations}
            </p>
            <p className="text-sm text-gray-600">Total Translations</p>
          </CardContent>
        </Card>
        <Card className="text-center bg-yellow-50 dark:bg-yellow-900/10 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <GiBrain className="text-3xl text-yellow-600 mb-1" />
            <p className="text-3xl font-bold text-yellow-600">
              {stats.wordsLearned}
            </p>
            <p className="text-sm text-gray-600">Words Learned</p>
          </CardContent>
        </Card>
        <Card className="text-center bg-yellow-50 dark:bg-yellow-900/10 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <FaFireAlt className="text-3xl text-yellow-600 mb-1" />
            <p className="text-3xl font-bold text-yellow-600">
              {stats.streakDays}
            </p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-gray-400 text-sm mt-4 flex items-center justify-center gap-1">
        <FaCrown className="text-yellow-600" /> LaSu — Language learning made
        powerful.
      </p>
    </div>
  );
}
