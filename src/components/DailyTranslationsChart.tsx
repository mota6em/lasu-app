import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

const DailyTranslationsChart = ({ chartData, isMobile }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        ss
        margin={
          isMobile
            ? { top: 2, right: 2, left: 0, bottom: 0 }
            : { top: 10, right: 30, left: 0, bottom: 0 }
        }
      >
        <Line
          type="monotone"
          dataKey="count"
          stroke={isDark ? "#93C5FD" : "#4F46E5"}
          strokeWidth={2}
        />
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? "#444" : "#ccc"}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: isMobile ? 10 : 12 }}
          interval={isMobile ? "preserveStartEnd" : 0}
          stroke={isDark ? "#aaa" : "#333"}
        />
        <YAxis
          tick={{ fontSize: isMobile ? 10 : 12 }}
          stroke={isDark ? "#aaa" : "#333"}
          hide={isMobile}
        />{" "}
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#fff", // bg-zinc-800
            border: "none",
            borderRadius: 8,
            fontSize: 12,
            color: isDark ? "#fff" : "#000",
          }}
          labelStyle={{ color: isDark ? "#ccc" : "#333" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DailyTranslationsChart;
