import React from "react";
import ExpandableList from "./ExpandableList";

const LangsWordsChart = () => {
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <h2 className="text-2xl font-bold text-center mb-5">
        Top used Words and Languages Today
      </h2>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        <ExpandableList
          title="Most Translated Words Today"
          items={[
            "hello",
            "love",
            "friend",
            "world",
            "peace",
            "good",
            "beautiful",
          ]}
        />
        <ExpandableList
          title="Most Popular Languages Today"
          items={[
            "English",
            "Spanish",
            "Arabic",
            "Hungarian",
            "French",
            "German",
          ]}
        />
      </div>
    </div>
  );
};

export default LangsWordsChart;
