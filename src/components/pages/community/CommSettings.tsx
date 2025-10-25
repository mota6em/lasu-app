import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CiSettings } from "react-icons/ci";

const CommSettings = () => {
  return (
    <div className="absolute right-5">
      <Tooltip>
        <TooltipTrigger asChild>
          <CiSettings className="w-8 h-8 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent>
          <p>LaSu Community Settings</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default CommSettings;
