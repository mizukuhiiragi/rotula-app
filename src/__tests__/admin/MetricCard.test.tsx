import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricCard, formatMetricValue } from "@/components/admin/ui/MetricCard";
import type { PlatformMetric } from "@/types/admin";

describe("MetricCard", () => {
  it("formats standard number metrics using locale grouping", () => {
    const metric: PlatformMetric = {
      id: "users",
      label: "Total Users",
      value: 8420,
      kind: "number",
      changePct: 12.4,
      trend: "up",
      hint: "vs. last 30 days",
    };

    render(<MetricCard metric={metric} />);

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("8,420")).toBeInTheDocument();
    expect(screen.getByText(/12\.4%/)).toBeInTheDocument();
  });

  it("formats compact currency metrics through formatCompactCurrency helper", () => {
    const metric: PlatformMetric = {
      id: "saved",
      label: "Total Value Saved",
      value: 1240000,
      kind: "currency-compact",
      changePct: 8.1,
      trend: "up",
      hint: "across all groups",
    };

    render(<MetricCard metric={metric} />);

    expect(screen.getByText("Total Value Saved")).toBeInTheDocument();
    expect(screen.getByText("$1.2M")).toBeInTheDocument();
  });

  it("formats standard currency metrics using formatCurrency helper", () => {
    const metric: PlatformMetric = {
      id: "pool",
      label: "Reserve Pool",
      value: 5000,
      kind: "currency",
      currency: "USD",
      changePct: 2.5,
      trend: "up",
      hint: "held in escrow",
    };

    render(<MetricCard metric={metric} />);

    expect(screen.getByText("Reserve Pool")).toBeInTheDocument();
    expect(screen.getByText("$5,000.00")).toBeInTheDocument();
  });

  it("formats percent metrics with percent suffix", () => {
    const metric: PlatformMetric = {
      id: "success",
      label: "Success Rate",
      value: 98.6,
      kind: "percent",
      changePct: 0.4,
      trend: "up",
      hint: "transaction success",
    };

    render(<MetricCard metric={metric} />);

    expect(screen.getByText("Success Rate")).toBeInTheDocument();
    expect(screen.getByText("98.6%")).toBeInTheDocument();
  });

  it("formats decimal metrics with single decimal place", () => {
    const metric: PlatformMetric = {
      id: "avg-size",
      label: "Avg. Group Size",
      value: 7.8,
      kind: "decimal",
      changePct: -1.2,
      trend: "down",
      hint: "members per group",
    };

    render(<MetricCard metric={metric} />);

    expect(screen.getByText("Avg. Group Size")).toBeInTheDocument();
    expect(screen.getByText("7.8")).toBeInTheDocument();
  });

  it("renders text metrics verbatim when kind is text", () => {
    const metric: PlatformMetric = {
      id: "status",
      label: "Network State",
      value: "HEALTHY",
      kind: "text",
      changePct: 0,
      trend: "flat",
      hint: "operational",
    };

    render(<MetricCard metric={metric} />);

    expect(screen.getByText("Network State")).toBeInTheDocument();
    expect(screen.getByText("HEALTHY")).toBeInTheDocument();
  });

  it("enables direct numeric sorting and comparison without string parsing", () => {
    const metrics: PlatformMetric[] = [
      {
        id: "m1",
        label: "Small",
        value: 100,
        changePct: 1,
        trend: "up",
        hint: "",
      },
      {
        id: "m2",
        label: "Large",
        value: 50000,
        changePct: 2,
        trend: "up",
        hint: "",
      },
      {
        id: "m3",
        label: "Medium",
        value: 1200,
        changePct: 3,
        trend: "up",
        hint: "",
      },
    ];

    // Numbers can be directly compared
    const sorted = [...metrics].sort((a, b) => {
      const aVal = typeof a.value === "number" ? a.value : 0;
      const bVal = typeof b.value === "number" ? b.value : 0;
      return aVal - bVal;
    });

    expect(sorted.map((m) => m.id)).toEqual(["m1", "m3", "m2"]);
  });

  it("formatMetricValue helper returns expected strings across kinds", () => {
    expect(
      formatMetricValue({
        id: "1",
        label: "Num",
        value: 12345,
        changePct: 0,
        trend: "flat",
        hint: "",
      }),
    ).toBe("12,345");

    expect(
      formatMetricValue({
        id: "2",
        label: "Compact",
        value: 2500000,
        kind: "currency-compact",
        changePct: 0,
        trend: "flat",
        hint: "",
      }),
    ).toBe("$2.5M");
  });
});
