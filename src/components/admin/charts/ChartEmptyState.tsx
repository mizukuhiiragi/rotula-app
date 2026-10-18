"use client";

/** Shared accessible empty state displayed when a chart series has no data points. */
export function ChartEmptyState({
  message = "No data available",
}: {
  message?: string;
}) {
  return (
    <div
      role="status"
      className="flex h-[260px] w-full items-center justify-center text-sm text-slate-400"
    >
      <p>{message}</p>
    </div>
  );
}
