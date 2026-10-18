import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GroupStatusChart } from "@/components/admin/charts/GroupStatusChart";
import { SavingsGrowthChart } from "@/components/admin/charts/SavingsGrowthChart";
import { TransactionVolumeChart } from "@/components/admin/charts/TransactionVolumeChart";
import { UserGrowthChart } from "@/components/admin/charts/UserGrowthChart";
import {
  chartAxisProps,
  chartGridProps,
  chartMargin,
  chartTooltipContentStyle,
  chartTooltipCursor,
} from "@/components/admin/charts/chartTheme";

describe("chartTheme", () => {
  it("exports expected standard chart style properties", () => {
    expect(chartMargin).toEqual({ top: 8, right: 8, left: -8, bottom: 0 });
    expect(chartGridProps).toEqual({
      strokeDasharray: "3 3",
      stroke: "#f1f5f9",
      vertical: false,
    });
    expect(chartAxisProps).toEqual({
      tick: { fontSize: 12, fill: "#94a3b8" },
      axisLine: false,
      tickLine: false,
    });
    expect(chartTooltipContentStyle).toEqual({
      borderRadius: 12,
      border: "1px solid #e2e8f0",
      fontSize: 12,
    });
    expect(chartTooltipCursor).toEqual({
      fill: "#f8fafc",
    });
  });

  it("renders all four charts using shared styles without error", () => {
    const dummyTimeSeries = [
      { label: "Jan", value: 100 },
      { label: "Feb", value: 200 },
    ];
    const dummyGroupStatus = [
      { status: "active" as const, count: 10 },
      { status: "forming" as const, count: 5 },
    ];

    expect(
      render(<SavingsGrowthChart data={dummyTimeSeries} />).container,
    ).toBeDefined();
    expect(
      render(<TransactionVolumeChart data={dummyTimeSeries} />).container,
    ).toBeDefined();
    expect(
      render(<UserGrowthChart data={dummyTimeSeries} />).container,
    ).toBeDefined();
    expect(
      render(<GroupStatusChart data={dummyGroupStatus} />).container,
    ).toBeDefined();
  });
});
