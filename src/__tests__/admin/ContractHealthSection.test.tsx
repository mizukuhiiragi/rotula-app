import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContractHealthSection } from "@/components/admin/sections/ContractHealthSection";
import type { ContractHealthIndicator } from "@/types/admin";

describe("ContractHealthSection", () => {
  const mockContracts: ContractHealthIndicator[] = [
    {
      id: "contract-1",
      name: "Rotula Vault",
      contractId: "CA3D5KRYMCMUG7O272CSO4WIOQ74A3P2G2F2M74JBC7V46F46QG64I7N",
      network: "testnet",
      status: "healthy",
      uptimePct: 99.9,
      avgLatencyMs: 145,
      invocations24h: 1204,
      lastInvocationAt: "2026-10-18T12:00:00.000Z",
    },
    {
      id: "contract-2",
      name: "Stellar Pool",
      contractId: "CB4D5KRYMCMUG7O272CSO4WIOQ74A3P2G2F2M74JBC7V46F46QG64I8O",
      network: "testnet",
      status: "degraded",
      uptimePct: 98.5,
      avgLatencyMs: 320,
      invocations24h: 1249,
      lastInvocationAt: "2026-10-18T12:15:00.000Z",
    },
  ];

  it("renders exact 24h invocation counts with grouping separators instead of rounded figures", () => {
    render(<ContractHealthSection contracts={mockContracts} />);

    // Assert that exact figures with thousands separator are rendered, not "1.2K"
    expect(screen.getByText("1,204")).toBeInTheDocument();
    expect(screen.getByText("1,249")).toBeInTheDocument();
    expect(screen.queryByText("1.2K")).not.toBeInTheDocument();
  });

  it("verifies fixture contracts have distinct and status-correlated last-invocation timestamps", async () => {
    const { getAdminDashboardData } = await import("@/lib/admin/mock-data");
    const data = await getAdminDashboardData();
    const contracts = data.contracts;

    // No two contracts share the same lastInvocationAt
    const distinctTimestamps = new Set(
      contracts.map((contract) => contract.lastInvocationAt),
    );
    expect(distinctTimestamps.size).toBe(contracts.length);

    // Each timestamp parses as a valid ISO date
    for (const contract of contracts) {
      const parsed = Date.parse(contract.lastInvocationAt);
      expect(Number.isNaN(parsed)).toBe(false);
    }

    // Degraded/down contracts have older lastInvocationAt than healthy contracts
    const healthy = contracts.filter((c) => c.status === "healthy");
    const degraded = contracts.filter(
      (c) => c.status === "degraded" || c.status === "down",
    );
    if (healthy.length > 0 && degraded.length > 0) {
      const latestDegraded = Math.max(
        ...degraded.map((c) => Date.parse(c.lastInvocationAt)),
      );
      const earliestHealthy = Math.min(
        ...healthy.map((c) => Date.parse(c.lastInvocationAt)),
      );
      expect(latestDegraded).toBeLessThan(earliestHealthy);
    }
  });
});
