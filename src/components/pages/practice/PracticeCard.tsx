"use client";
import { usePracticeSession } from "@/hooks/usePracticeSession";
import PracticeCardSettings from "./PracticeCardSettings";
import PracticeCardContent from "./PracticeCardContent";

const PracticeCard = () => {
  const session = usePracticeSession("recall");
  return (
    <div className="flex flex-col">
      <PracticeCardSettings {...session} />
      <PracticeCardContent {...session} />
    </div>
  );
};
export default PracticeCard;
