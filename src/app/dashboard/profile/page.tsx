"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FaCamera, FaUserEdit, FaCrown, FaFireAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { GiBookshelf, GiBrain } from "react-icons/gi";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/session");
      const data = await res.json();
      setUser(data.user);
      setName(data.user.name);
      setImage(data.user.image);
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setUser((prev: any) => ({ ...prev, name, image }));
  };

  const stats = user.stats || {
    totalTranslations: 128,
    wordsLearned: 42,
    streakDays: 7,
  };

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-center mb-2 text-yellow-600 flex items-center justify-center gap-2">
        <FaCrown className="text-yellow-500" /> My Profile
      </h2>
      <p className="text-center text-gray-500">
        Manage your personal info and see your learning stats.
      </p>

      {/* Profile Info */}
      <Card className="shadow-md border border-yellow-100 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
        <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <div className="relative">
            <Image
              src={image}
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full border-4 border-yellow-500 shadow-lg"
            />
            <label className="absolute bottom-2 right-2 bg-yellow-500 text-white p-2 rounded-full cursor-pointer hover:bg-yellow-600 transition">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
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
            <div className="flex items-center gap-2 text-gray-500">
              <MdOutlineEmail className="text-yellow-600" />
              <span>{user.email || "no email"}</span>
            </div>
            <Button
              onClick={handleSave}
              className="bg-yellow-500 hover:bg-yellow-600 text-white w-fit mt-2"
            >
              Save Changes
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
            <p className="text-sm text-gray-500">Total Translations</p>
          </CardContent>
        </Card>
        <Card className="text-center bg-yellow-50 dark:bg-yellow-900/10 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <GiBrain className="text-3xl text-yellow-600 mb-1" />
            <p className="text-3xl font-bold text-yellow-600">
              {stats.wordsLearned}
            </p>
            <p className="text-sm text-gray-500">Words Learned</p>
          </CardContent>
        </Card>
        <Card className="text-center bg-yellow-50 dark:bg-yellow-900/10 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <FaFireAlt className="text-3xl text-yellow-600 mb-1" />
            <p className="text-3xl font-bold text-yellow-600">
              {stats.streakDays}
            </p>
            <p className="text-sm text-gray-500">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-gray-400 text-sm mt-4 flex items-center justify-center gap-1">
        <FaCrown className="text-yellow-500" />
        LaSu — Language learning made powerful.
      </p>
    </div>
  );
}
