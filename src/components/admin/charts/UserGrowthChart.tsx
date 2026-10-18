"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TimeSeriesPoint } from "@/types/admin";
import { formatCompactNumber } from "@/utils/formatters/currency";
import {
  chartAxisProps,
  chartGridProps,
  chartMargin,
  chartTooltipContentStyle,
} from "./chartTheme";

/** Line chart of new users onboarded per month. */
export function UserGrowthChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={chartMargin}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="label" {...chartAxisProps} />
        <YAxis
          {...chartAxisProps}
          width={52}
          tickFormatter={(value: number) => formatCompactNumber(value)}
        />
        <Tooltip
          formatter={(value) => [
            formatCompactNumber(Number(value ?? 0)),
            "Users",
          ]}
          contentStyle={chartTooltipContentStyle}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#0ea5e9"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
