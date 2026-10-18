import type { PlatformMetric } from "@/types/admin";
import { formatNumber } from "@/utils/formatters/number";
import {
  formatCurrency,
  formatCompactCurrency,
} from "@/utils/formatters/currency";

const TREND_TONE: Record<PlatformMetric["trend"], string> = {
  up: "text-emerald-600",
  down: "text-rose-600",
  flat: "text-slate-500",
};

const TREND_ARROW: Record<PlatformMetric["trend"], string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

/** Formats a platform metric into its presentation string based on its kind/type. */
export function formatMetricValue(metric: PlatformMetric): string {
  if (typeof metric.value === "string") {
    return metric.value;
  }

  const { value, kind = "number", currency = "USD" } = metric;
  switch (kind) {
    case "currency":
      return formatCurrency(value, currency);
    case "currency-compact":
      return formatCompactCurrency(value, currency);
    case "percent":
      return `${value}%`;
    case "decimal":
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value);
    case "number":
    default:
      return formatNumber(value);
  }
}

/** Headline KPI card used on the admin overview. */
export function MetricCard({ metric }: { metric: PlatformMetric }) {
  const displayValue = formatMetricValue(metric);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{metric.label}</p>
      <p className="mt-2 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-slate-900">
        {displayValue}
      </p>
      <div className="mt-2 flex items-center gap-1.5 text-xs">
        <span className={`font-semibold ${TREND_TONE[metric.trend]}`}>
          {TREND_ARROW[metric.trend]} {Math.abs(metric.changePct)}%
        </span>
        <span className="text-slate-400">{metric.hint}</span>
      </div>
    </div>
  );
}
