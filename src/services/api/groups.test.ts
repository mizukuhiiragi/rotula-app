import { beforeEach, describe, expect, it } from "vitest";

import {
  groupsService,
  INVITES_KEY,
  MEMBERSHIPS_KEY,
  membershipKey,
} from "@/services/api/groups";

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

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: createStorage(),
  });
});

describe("groupsService.listGroups / getGroup", () => {
  it("returns the seeded groups", async () => {
    const groups = await groupsService.listGroups();
    expect(groups.map((group) => group.id)).toEqual(["g1", "g2"]);
  });

  it("resolves a group by id and returns null when missing", async () => {
    await expect(groupsService.getGroup("g1")).resolves.toMatchObject({
      id: "g1",
      name: "Lagos Savers Circle",
    });
    await expect(groupsService.getGroup("nope")).resolves.toBeNull();
  });

  it("returns copies from listGroups so mutations cannot reach the seed", async () => {
    const [first] = await groupsService.listGroups();
    first.memberCount = 999;

    const groups = await groupsService.listGroups();
    expect(groups.find((group) => group.id === "g1")?.memberCount).toBe(8);
  });

  it("returns a copy from getGroup so mutations cannot reach the seed", async () => {
    const group = await groupsService.getGroup("g1");
    expect(group).not.toBeNull();
    group!.memberCount = 999;

    await expect(groupsService.getGroup("g1")).resolves.toMatchObject({
      memberCount: 8,
    });
  });
});

describe("groupsService.createInvite / getInvite", () => {
  it("persists a new invite under INVITES_KEY and round-trips it", async () => {
    const invite = await groupsService.createInvite("g1");

    const stored = JSON.parse(
      window.localStorage.getItem(INVITES_KEY) as string,
    ) as Record<string, string>;
    expect(stored[invite.code]).toBe("g1");

    await expect(groupsService.getInvite(invite.code)).resolves.toMatchObject({
      code: invite.code,
      group: { id: "g1" },
    });
  });

  it("rejects an invite for an unknown group", async () => {
    await expect(groupsService.createInvite("missing")).rejects.toThrow(
      "Unknown group: missing",
    );
  });

  it("returns null for an unknown invite code", async () => {
    await expect(groupsService.getInvite("does-not-exist")).resolves.toBeNull();
  });

  it("treats malformed JSON under INVITES_KEY as empty", async () => {
    window.localStorage.setItem(INVITES_KEY, "{not valid json");
    await expect(groupsService.getInvite("anything")).resolves.toBeNull();
  });
});

describe("groupsService.joinGroup / hasJoined", () => {
  it("records membership under MEMBERSHIPS_KEY scoped by user and group", async () => {
    await expect(groupsService.hasJoined("g1", "user-1")).resolves.toBe(false);

    await groupsService.joinGroup("g1", "user-1");

    await expect(groupsService.hasJoined("g1", "user-1")).resolves.toBe(true);
    const stored = JSON.parse(
      window.localStorage.getItem(MEMBERSHIPS_KEY) as string,
    ) as Record<string, string>;
    const expectedKey = membershipKey("user-1", "g1");
    expect(stored[expectedKey]).toBeTruthy();
    expect(new Date(stored[expectedKey]).toISOString()).toBe(stored[expectedKey]);
  });

  it("does not report a second user on the same browser as already a member", async () => {
    await groupsService.joinGroup("g1", "user-1");

    // user-2 on the same browser has not joined
    await expect(groupsService.hasJoined("g1", "user-2")).resolves.toBe(false);

    // user-1 has not joined another group
    await expect(groupsService.hasJoined("g2", "user-1")).resolves.toBe(false);

    // user-2 can join g1 independently
    await groupsService.joinGroup("g1", "user-2");
    await expect(groupsService.hasJoined("g1", "user-1")).resolves.toBe(true);
    await expect(groupsService.hasJoined("g1", "user-2")).resolves.toBe(true);
  });

  it("re-joining a group the user is already in does not overwrite timestamp or record a duplicate", async () => {
    await groupsService.joinGroup("g1", "user-1");
    const storedBefore = JSON.parse(
      window.localStorage.getItem(MEMBERSHIPS_KEY) as string,
    ) as Record<string, string>;
    const initialTimestamp = storedBefore[membershipKey("user-1", "g1")];
    expect(initialTimestamp).toBeTruthy();

    // Call joinGroup again for the same user and group
    await groupsService.joinGroup("g1", "user-1");

    const storedAfter = JSON.parse(
      window.localStorage.getItem(MEMBERSHIPS_KEY) as string,
    ) as Record<string, string>;
    expect(storedAfter[membershipKey("user-1", "g1")]).toBe(initialTimestamp);
    expect(Object.keys(storedAfter)).toHaveLength(1);
  });

  it("returns false and avoids writing when groupId or userId is empty", async () => {
    await expect(groupsService.hasJoined("", "user-1")).resolves.toBe(false);
    await expect(groupsService.hasJoined("g1", "")).resolves.toBe(false);

    await groupsService.joinGroup("", "user-1");
    await groupsService.joinGroup("g1", "");
    expect(window.localStorage.getItem(MEMBERSHIPS_KEY)).toBeNull();
  });

  it("treats malformed JSON under MEMBERSHIPS_KEY as empty", async () => {
    window.localStorage.setItem(MEMBERSHIPS_KEY, "not json either");
    await expect(groupsService.hasJoined("g1", "user-1")).resolves.toBe(false);
  });
});
