"use client";
import { MdOutlineCelebration } from "react-icons/md";

import UserStats from "./UserStats";

export default function CommHero({
  userName,
  userId,
}: {
  userName: string;
  userId: string;
}) {
  return (
    <div className="p-6 text-center flex flex-col justify-center items-center">
      <h1 className="text-4xl font-semibold flex items-center gap-2 animate-bounce">
        Hi{" "}
        <span className="italic text-yellow-600 dark:text-yellow-500">
          {userName.split(" ")[0]}
        </span>{" "}
        <MdOutlineCelebration className="" />
      </h1>
      <p className="text-lg text-gray-500 dark:text-gray-400">
        Here's what your mates are learning —{" "}
        <span className="text-yellow-600 dark:text-yellow-500">
          join the fun!
        </span>
      </p>
      <UserStats userId={userId} />
    </div>
  );
}
