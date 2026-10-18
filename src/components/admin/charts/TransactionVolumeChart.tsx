"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
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
  chartTooltipCursor,
} from "./chartTheme";

/** Bar chart of monthly on-chain transaction counts. */
export function TransactionVolumeChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={chartMargin}>
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
            "Transactions",
          ]}
          cursor={chartTooltipCursor}
          contentStyle={chartTooltipContentStyle}
        />
        <Bar
          dataKey="value"
          fill="#006c49"
          radius={[6, 6, 0, 0]}
          maxBarSize={36}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
