"use client";
import React, { useEffect, useState } from "react";
import ExpandableList from "./ExpandableList";
import { FiTrendingUp } from "react-icons/fi";
const LangsWordsChart = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = () => {
      fetch("/api/community/stats")
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch(console.error);
    };

    fetchStats(); // initial fetch

    const interval = setInterval(fetchStats, 60000); //refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return <p className="text-center mt-10">Loading stats...</p>;
  }
  return (
    <div className="flex flex-col items-center justify-center my-10 gap-y-8">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-center mb-5 flex items-center justify-center gap-x-2 ">
          <FiTrendingUp className="w-6 h-6 text-yellow-500 mt-1" />
          Top used Words
          <FiTrendingUp className="w-6 h-6 text-yellow-500 mt-1 -ms-1" />
        </h2>
        <div className="flex flex-col md:flex-row flex-wrap gap-4 items-start justify-center">
          <ExpandableList
            title="Today"
            items={stats.daily.words.map((w: any) => ({
              word: w._id,
              count: w.count,
            }))}
          />
          <ExpandableList
            title="This Month"
            items={stats.monthly.words.map((w: any) => ({
              word: w._id,
              count: w.count,
            }))}
          />
          <ExpandableList
            title="All Time"
            items={stats.allTime.words.map((w: any) => ({
              word: w._id,
              count: w.count,
            }))}
          />
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-2xl font-bold text-center mb-5 flex items-center justify-center gap-x-2 ">
          <FiTrendingUp className="w-6 h-6 text-yellow-500 mt-1" />
          Top used Languages
          <FiTrendingUp className="w-6 h-6 text-yellow-500 mt-1 -ms-1" />
        </h2>
        <div className="flex flex-col md:flex-row flex-wrap gap-4 items-start justify-center">
          <ExpandableList
            title="Today"
            items={stats.daily.languages.map((l: any) => ({
              word: l._id,
              count: l.count,
            }))}
          />
          <ExpandableList
            title="This Month"
            items={stats.monthly.languages.map((l: any) => ({
              word: l._id,
              count: l.count,
            }))}
          />
          <ExpandableList
            title="All Time"
            items={stats.allTime.languages.map((l: any) => ({
              word: l._id,
              count: l.count,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default LangsWordsChart;
