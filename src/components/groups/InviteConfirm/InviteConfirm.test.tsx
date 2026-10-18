import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { InviteConfirm } from "./InviteConfirm";
import { groupsService, MEMBERSHIPS_KEY, membershipKey } from "@/services/api/groups";
import type { Group } from "@/types/group";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

let mockAuthState = {
  isAuthenticated: true,
  isLoading: false,
  user: { id: "user-alpha", name: "Alpha", email: "alpha@example.com" } as { id: string; name: string; email: string } | null,
};

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockAuthState,
}));

function createStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
  };
}

describe("InviteConfirm Component", () => {
  const sampleGroup: Group = {
    id: "g1",
    name: "Lagos Savers Circle",
    description: "Weekly ajo group",
    memberCount: 8,
    currency: "NGN",
    contributionAmount: 10000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: createStorage(),
    });
    mockAuthState = {
      isAuthenticated: true,
      isLoading: false,
      user: { id: "user-alpha", name: "Alpha", email: "alpha@example.com" },
    };
    vi.spyOn(groupsService, "getInvite").mockImplementation(async (code: string) => {
      if (code === "VALID1234") {
        return { code: "VALID1234", group: sampleGroup };
      }
      return null;
    });
  });

  it("redirects unauthenticated users to register with encoded redirect parameter", async () => {
    mockAuthState = {
      isAuthenticated: false,
      isLoading: false,
      user: null,
    };

    render(<InviteConfirm code="VALID1234" />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        `/register?redirect=${encodeURIComponent("/invite/VALID1234")}`,
      );
    });
  });

  it("shows confirm screen and allows a new member to join", async () => {
    render(<InviteConfirm code="VALID1234" />);

    expect(await screen.findByText("Lagos Savers Circle")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Join Group" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Join Group" }));

    await waitFor(() => {
      expect(
        screen.getByText("Welcome to Lagos Savers Circle!"),
      ).toBeInTheDocument();
    });

    // Verify localStorage has the user-scoped membership
    const stored = JSON.parse(
      window.localStorage.getItem(MEMBERSHIPS_KEY) || "{}",
    );
    expect(stored[membershipKey("user-alpha", "g1")]).toBeTruthy();
  });

  it("shows joined state immediately if the user has already joined", async () => {
    await groupsService.joinGroup("g1", "user-alpha");

    render(<InviteConfirm code="VALID1234" />);

    await waitFor(() => {
      expect(
        screen.getByText("Welcome to Lagos Savers Circle!"),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: "Join Group" }),
    ).not.toBeInTheDocument();
  });

  it("scopes membership to the user, allowing a second account on same browser to join", async () => {
    // User Alpha joins
    await groupsService.joinGroup("g1", "user-alpha");

    // User Beta logs in on same browser
    mockAuthState = {
      isAuthenticated: true,
      isLoading: false,
      user: { id: "user-beta", name: "Beta", email: "beta@example.com" },
    };

    render(<InviteConfirm code="VALID1234" />);

    // User Beta sees confirm screen and "Join Group" button
    expect(await screen.findByRole("button", { name: "Join Group" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Join Group" }));

    await waitFor(() => {
      expect(
        screen.getByText("Welcome to Lagos Savers Circle!"),
      ).toBeInTheDocument();
    });

    // Both users are registered in storage under separate keys
    const stored = JSON.parse(
      window.localStorage.getItem(MEMBERSHIPS_KEY) || "{}",
    );
    expect(stored[membershipKey("user-alpha", "g1")]).toBeTruthy();
    expect(stored[membershipKey("user-beta", "g1")]).toBeTruthy();
  });
});
