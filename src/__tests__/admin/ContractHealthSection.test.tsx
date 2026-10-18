import { render, screen, within } from "@testing-library/react";
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

  it("renders the contract status exactly once per card without duplicate coloured dots", () => {
    const { container } = render(<ContractHealthSection contracts={mockContracts} />);

    // Check each card has status rendered once via StatusBadge
    const cards = container.querySelectorAll(".rounded-xl.border");
    expect(cards).toHaveLength(2);

    cards.forEach((card, index) => {
      const cardScope = within(card as HTMLElement);
      const expectedStatus = mockContracts[index].status;

      // Status text appears in StatusBadge
      const badges = cardScope.getAllByText(expectedStatus);
      expect(badges).toHaveLength(1);

      // Verify no redundant status dot (h-2.5 w-2.5 rounded-full) is rendered in the card header
      const dots = card.querySelectorAll("span.rounded-full.h-2\\.5, span.h-2\\.5.w-2\\.5");
      expect(dots).toHaveLength(0);
    });
  });
});
