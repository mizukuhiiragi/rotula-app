import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { groupsService, INVITES_KEY } from "@/services/api/groups";
import { InviteButton } from "@/components/groups/InviteButton";
import type { Group } from "@/types/group";

const mockGroup: Group = {
  id: "g1",
  name: "Target Savings Circle",
  contributionAmount: 50,
  currency: "NGN",
  memberCount: 5,
};

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

describe("Invite Code Reuse and Rotation", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: createStorage(),
    });
  });

  it("reuses the existing active invite for a group on repeated calls", async () => {
    // First call mints a new invite code
    const first = await groupsService.createInvite("g1");
    expect(first.code).toBeDefined();
    expect(first.groupId).toBe("g1");

    // Second call for the same group reuses the same code
    const second = await groupsService.createInvite("g1");
    expect(second.code).toBe(first.code);
    expect(second.groupId).toBe("g1");

    // Only one entry stored in localStorage
    const stored = JSON.parse(window.localStorage.getItem(INVITES_KEY) || "{}");
    expect(Object.keys(stored)).toHaveLength(1);
    expect(stored[first.code]).toBe("g1");
  });

  it("rotates the invite code only when explicitly requested", async () => {
    const first = await groupsService.createInvite("g1");

    // Explicit rotation produces a fresh code
    const rotated = await groupsService.createInvite("g1", { rotate: true });
    expect(rotated.code).not.toBe(first.code);
    expect(rotated.groupId).toBe("g1");

    // Old code no longer resolves, new code resolves
    const oldResolution = await groupsService.getInvite(first.code);
    expect(oldResolution).toBeNull();

    const newResolution = await groupsService.getInvite(rotated.code);
    expect(newResolution?.group.id).toBe("g1");
  });

  it("InviteButton UI generates a stable link and allows deliberate rotation", async () => {
    const user = userEvent.setup();
    render(<InviteButton group={mockGroup} />);

    // Generate link
    const inviteBtn = screen.getByRole("button", { name: /invite member/i });
    await user.click(inviteBtn);

    const input = (await screen.findByLabelText(/invite link/i)) as HTMLInputElement;
    const initialUrl = input.value;
    expect(initialUrl).toContain("/invite/");

    // Rotate link
    const rotateBtn = screen.getByRole("button", { name: /rotate link/i });
    await user.click(rotateBtn);

    const rotatedInput = (await screen.findByLabelText(/invite link/i)) as HTMLInputElement;
    const rotatedUrl = rotatedInput.value;

    expect(rotatedUrl).toContain("/invite/");
    expect(rotatedUrl).not.toBe(initialUrl);
  });
});
