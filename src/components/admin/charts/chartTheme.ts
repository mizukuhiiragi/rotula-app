import type { CSSProperties } from "react";

/** Standard chart container margins for Cartesian charts. */
export const chartMargin = {
  top: 8,
  right: 8,
  left: -8,
  bottom: 0,
} as const;

/** Shared CartesianGrid stroke and direction properties. */
export const chartGridProps = {
  strokeDasharray: "3 3",
  stroke: "#f1f5f9",
  vertical: false,
} as const;

/** Shared XAxis and YAxis tick and line styling. */
export const chartAxisProps = {
  tick: { fontSize: 12, fill: "#94a3b8" },
  axisLine: false,
  tickLine: false,
} as const;

/** Shared Tooltip content container style. */
export const chartTooltipContentStyle: CSSProperties = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  fontSize: 12,
};

/** Tooltip cursor styling for bar charts. */
export const chartTooltipCursor = {
  fill: "#f8fafc",
} as const;
