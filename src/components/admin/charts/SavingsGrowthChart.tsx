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

import type { TimeSeriesPoint } from "@/types/admin";
import {
  formatCompactCurrency,
  formatCurrency,
} from "@/utils/formatters/currency";
import {
  chartAxisProps,
  chartGridProps,
  chartMargin,
  chartTooltipContentStyle,
} from "./chartTheme";

/** Area chart of cumulative platform savings over time (USD). */
export function SavingsGrowthChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={chartMargin}>
        <defs>
          <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#006c49" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#006c49" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="label" {...chartAxisProps} />
        <YAxis
          {...chartAxisProps}
          width={56}
          tickFormatter={(value: number) => formatCompactCurrency(value)}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value ?? 0)), "Saved"]}
          contentStyle={chartTooltipContentStyle}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#006c49"
          strokeWidth={2}
          fill="url(#savingsFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
