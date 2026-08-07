"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DayPoint } from "@/lib/series";

interface DailyTranslationsChartProps {
  chartData: DayPoint[];
  isMobile: boolean;
}

function formatTick(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-[var(--shadow-lift)]">
      <p className="text-[11px] text-muted-foreground">
        {new Date(label).toLocaleDateString(undefined, {
          weekday: "short",
          day: "numeric",
          month: "short",
        })}
      </p>
      <p className="font-display text-lg font-bold tabular-nums leading-tight">
        {payload[0].value}
        <span className="ms-1 text-xs font-normal text-muted-foreground">
          {payload[0].value === 1 ? "translation" : "translations"}
        </span>
      </p>
    </div>
  );
}

export default function DailyTranslationsChart({
  chartData,
  isMobile,
}: DailyTranslationsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={chartData}
        margin={{ top: 8, right: 8, left: isMobile ? -24 : -12, bottom: 0 }}
      >
        <defs>
          <linearGradient id="translationsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          stroke="var(--border)"
          strokeDasharray="4 4"
        />
        <XAxis
          dataKey="date"
          tickFormatter={formatTick}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          minTickGap={isMobile ? 32 : 20}
        />
        <YAxis
          allowDecimals={false}
          width={40}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ stroke: "var(--border-strong)", strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="var(--color-brand-500)"
          strokeWidth={2.25}
          fill="url(#translationsFill)"
          activeDot={{
            r: 4,
            strokeWidth: 2,
            stroke: "var(--surface)",
            fill: "var(--color-brand-500)",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
