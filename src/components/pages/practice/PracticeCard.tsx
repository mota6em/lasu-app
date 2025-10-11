import PracticeCardSettings from "./PracticeCardSettings";
import PracticeCardContent from "./PracticeCardContent";

const PracticeCard = () => {
  return (
    <div className="flex flex-col">
      <PracticeCardSettings />
      <PracticeCardContent />
    </div>
  );
};

export default PracticeCard;
