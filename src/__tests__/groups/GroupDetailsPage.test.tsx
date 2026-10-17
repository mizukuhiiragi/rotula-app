import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import GroupDetails from "@/app/(dashboard)/groups/[id]/page";
import { groupsService } from "@/services/api/groups";
import { useParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}));

vi.mock("@/services/api/groups", () => ({
  groupsService: {
    getGroup: vi.fn(),
  },
}));

// Mock child components that might have complex internal sub-elements or SVGs
vi.mock("@/components/groups/GroupHeader", () => ({
  GroupHeader: ({ title }: { title: string }) => <div data-testid="group-header">{title}</div>,
}));

vi.mock("@/components/groups/NextMilestone", () => ({
  NextMilestone: () => <div data-testid="next-milestone" />,
}));

vi.mock("@/components/groups/RecentDeposits", () => ({
  RecentDeposits: () => <div data-testid="recent-deposits" />,
}));

vi.mock("@/components/groups/MembersList", () => ({
  MembersList: () => <div data-testid="members-list" />,
}));

vi.mock("@/components/groups/GroupStats", () => ({
  GroupStats: () => <div data-testid="group-stats" />,
}));

vi.mock("@/components/groups/HelpCard", () => ({
  HelpCard: () => <div data-testid="help-card" />,
}));

vi.mock("@/components/groups/InviteMemberModal", () => ({
  InviteMemberModal: () => <div data-testid="invite-member-modal" />,
}));

describe("GroupDetails Page - Missing Group Handling (#305)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders rich missing group panel with link back to groups index on null lookup", async () => {
    vi.mocked(useParams).mockReturnValue({ id: "invalid-group-999" });
    vi.mocked(groupsService.getGroup).mockResolvedValue(null);

    render(<GroupDetails />);

    // Initially loading state
    expect(screen.getByText("Loading group...")).toBeInTheDocument();

    // After async lookup finishes with null
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1, name: /group not found/i })).toBeInTheDocument();
    });

    // Acceptance criteria: names the destination, not only the failure
    expect(
      screen.getByText(/Return to the groups index to browse your active groups/i)
    ).toBeInTheDocument();

    // Acceptance criteria: offers a link back to the groups index reachable by keyboard
    const backLink = screen.getByRole("link", { name: /back to groups index/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/groups");
  });

  it("renders group details when group exists (successful path unchanged)", async () => {
    vi.mocked(useParams).mockReturnValue({ id: "valid-group-1" });
    vi.mocked(groupsService.getGroup).mockResolvedValue({
      id: "valid-group-1",
      name: "Stellar Builders Circle",
      description: "Community savings group",
      memberCount: 8,
      contributionAmount: 50,
      totalSaved: 480000,
      nextPayoutDate: "2026-11-01",
      members: [],
    } as any);

    render(<GroupDetails />);

    await waitFor(() => {
      expect(screen.getByTestId("group-header")).toHaveTextContent("Stellar Builders Circle");
    });

    expect(screen.queryByText(/group not found/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /back to groups index/i })).not.toBeInTheDocument();
  });
});
