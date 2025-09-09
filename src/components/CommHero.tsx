"use client";
import CountUp from "react-countup";
import { MdOutlineCelebration } from "react-icons/md";

export default function CommHero({ userName }: { userName: string }) {
  return (
    <div className="p-6 text-center flex flex-col justify-center items-center">
      <h1 className="text-4xl font-semibold flex items-center gap-2 animate-bounce">
        Hi{" "}
        <span className="italic text-yellow-500">{userName.split(" ")[0]}</span>{" "}
        <MdOutlineCelebration className="" />
      </h1>
      <p className="text-lg text-gray-500 dark:text-gray-400">
        Here’s what your mates are learning — join the fun!
      </p>
      <div className="flex w-md justify-center gap-6 mt-6 text-center">
        <div className="bg-purple-700/5 p-3 rounded-xl flex-1 shadow-md">
          <h3 className="text-yellow-400 text-md font-bold">XP</h3>
          <p className="text-white text-xl font-extrabold">
            <CountUp start={0} end={1250} duration={2} />
          </p>
        </div>
        <div className="bg-purple-700/5 p-3 rounded-xl flex-1 shadow-md">
          <h3 className="text-yellow-400 text-md font-bold">Level</h3>
          <p className="text-white text-xl font-extrabold">
            <CountUp start={1} end={12} duration={2} />
          </p>
        </div>
        <div className="bg-purple-700/5 p-3 rounded-xl flex-1 shadow-md">
          <h3 className="text-yellow-400 text-md font-bold">Streak</h3>
          <p className="text-white text-xl font-extrabold">
            <CountUp start={1} end={7} duration={2} /> days
          </p>
        </div>
      </div>
    </div>
  );
}
