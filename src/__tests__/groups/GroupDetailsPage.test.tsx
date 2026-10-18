import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GroupDetails from "@/app/(dashboard)/groups/[id]/page";
import { groupsService } from "@/services/api/groups";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "g1" }),
}));

describe("GroupDetails Page (Issue #287)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("handles a rejected lookup gracefully by leaving the loading state and offering retry", async () => {
    const user = userEvent.setup();
    // Simulate a rejected API call
    const getGroupMock = vi
      .spyOn(groupsService, "getGroup")
      .mockRejectedValueOnce(new Error("API network failure"))
      .mockResolvedValueOnce({
        id: "g1",
        name: "Lagos Savers Circle",
        memberCount: 8,
        currency: "NGN",
        contributionAmount: 10000,
      });

    render(<GroupDetails />);

    // Initially displays loading
    expect(screen.getByText("Loading group...")).toBeInTheDocument();

    // After rejection, leaves loading state and shows unavailable message with retry button
    await waitFor(() => {
      expect(screen.queryByText("Loading group...")).not.toBeInTheDocument();
    });
    expect(
      screen.getByText("Group not found or unavailable."),
    ).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /retry/i });
    expect(retryBtn).toBeInTheDocument();

    // Clicking retry fetches again and recovers
    await user.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText("Lagos Savers Circle")).toBeInTheDocument();
    });
    expect(getGroupMock).toHaveBeenCalledTimes(2);
  });

  it("renders group details on a successful lookup", async () => {
    vi.spyOn(groupsService, "getGroup").mockResolvedValueOnce({
      id: "g1",
      name: "Family Trust Circle",
      memberCount: 5,
      currency: "NGN",
      contributionAmount: 20000,
    });

    render(<GroupDetails />);

    await waitFor(() => {
      expect(screen.getByText("Family Trust Circle")).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading group...")).not.toBeInTheDocument();
    expect(screen.queryByText("Group not found or unavailable.")).not.toBeInTheDocument();
  });
});
