"use client";
import { motion } from "framer-motion";

export default function CommHero({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 text-center flex flex-col justify-center items-center"
    >
      <h1 className="text-4xl font-bold text-yellow-600">
        Welcome back, {user.name.split(" ")[0]}! 🎉
      </h1>
      <p className="text-lg text-gray-500">
        Here is what your mates are learning. Join the fun!
      </p>
      <div className="flex w-md justify-center gap-6 mt-6 text-center">
        <div className="bg-purple-700/5 p-3 rounded-xl flex-1 shadow-md">
          <h3 className="text-yellow-400 text-md font-bold">XP</h3>
          <p className="text-white text-xl font-extrabold">1,250</p>
        </div>
        <div className="bg-purple-700/5 p-3 rounded-xl flex-1 shadow-md">
          <h3 className="text-yellow-400 text-md font-bold">Level</h3>
          <p className="text-white text-xl font-extrabold">12</p>
        </div>
        <div className="bg-purple-700/5 p-3 rounded-xl flex-1 shadow-md">
          <h3 className="text-yellow-400 text-md font-bold">Streak</h3>
          <p className="text-white text-xl font-extrabold">7 days</p>
        </div>
      </div>
    </motion.div>
  );
}
