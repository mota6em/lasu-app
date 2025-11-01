"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import JoinCommModal from "@/components/pages/community/JoinCommModal";
import { FaStar, FaFire, FaUsers } from "react-icons/fa";
import { useSession, signIn } from "next-auth/react";

const JoinCommHero = () => {
  const { data: session } = useSession();
  return (
    <section className="bg-gradient-to-r from-purple-800 to-indigo-500 dark:from-purple-950 dark:to-indigo-800 text-white py-6 md:py-16 mx-3 md:mx-1 lg:mx-0 px-3 md:px-6 rounded-2xl shadow-lg">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-4 ">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Welcome to the{" "}
            <span className="text-yellow-400 newyork text-5xl md:text-7xl">
              LaSu
            </span>{" "}
            Community
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Check out what fellow learners are translating, learn with them and
            boost your XP as you go!
          </p>

          <div className="flex items-center justify-center flex-wrap gap-4 mt-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <FaStar /> Streak Tracker
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Keep your streak going!</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <FaFire /> Start Earning XP
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Your adventure begins here!</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <FaUsers /> Global Learners
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Join thousands of learners!</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex-1">
          <Card className="bg-gradient-to-r w-full from-purple-700 to-indigo-500 border-none dark:from-purple-700 dark:to-indigo-800 text-gray-900 border-r-0 dark:text-gray-100 shadow-2xl  p-6 animate-fade-in">
            <CardContent>
              <h3 className="text-xl text-white  font-bold mb-2 flex items-center gap-1 flex-row">
                Trending Words <FaFire className="text-yellow-500" />
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="font-medium text-purple-100">Bonjour</span>
                  <span className="text-purple-100 font-semibold">+15 XP</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-purple-200">Hola</span>
                  <span className="text-purple-200 font-semibold">+12 XP</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-purple-300">Ciao</span>
                  <span className="text-purple-300 font-semibold">+10 XP</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          {session ? (
            <JoinCommModal />
          ) : (
            <div className="flex items-center justify-start">
              <div className="flex flex-col items-start">
                <span className="text-red-500 dark:text-red-300">
                  You are not logged in!
                </span>{" "}
                <span className="text-gray-200">
                  Log in to join the community
                </span>
              </div>
              <Button
                onClick={() => signIn("google")}
                className="bg-white mt-4 ms-3 text-purple-600 hover:bg-white/90 shadow-md animate-bounce"
              >
                Log In
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JoinCommHero;
