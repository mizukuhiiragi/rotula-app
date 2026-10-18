import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartEmptyState } from "@/components/admin/charts/ChartEmptyState";
import { SavingsGrowthChart } from "@/components/admin/charts/SavingsGrowthChart";
import { TransactionVolumeChart } from "@/components/admin/charts/TransactionVolumeChart";
import { UserGrowthChart } from "@/components/admin/charts/UserGrowthChart";
import { GroupStatusChart } from "@/components/admin/charts/GroupStatusChart";

describe("Chart empty state handling", () => {
  it("renders ChartEmptyState with accessible role and text", () => {
    render(<ChartEmptyState />);
    const emptyNotice = screen.getByRole("status");
    expect(emptyNotice).toHaveTextContent("No data available");
  });

  it("renders empty state in SavingsGrowthChart when data is empty", () => {
    render(<SavingsGrowthChart data={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("No data available");
  });

  it("renders empty state in TransactionVolumeChart when data is empty", () => {
    render(<TransactionVolumeChart data={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("No data available");
  });

  it("renders empty state in UserGrowthChart when data is empty", () => {
    render(<UserGrowthChart data={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("No data available");
  });

  it("renders empty state in GroupStatusChart when data is empty", () => {
    render(<GroupStatusChart data={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("No data available");
  });
});
