import { describe, it, expect } from "vitest";
import { metadata } from "@/app/invite/[code]/page";

describe("Invite Page Metadata", () => {
  it("declares explicit invitation metadata rather than relying on root defaults", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("Join a Savings Circle — Kolo");
    expect(metadata.description).toMatch(/invited to join a community savings circle/i);
  });

  it("provides comprehensive OpenGraph and Twitter card previews for external sharing", () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.title).toBe("Join a Savings Circle — Kolo");
    expect(metadata.openGraph?.description).toMatch(/invited to join a community savings circle/i);
    expect(metadata.openGraph?.type).toBe("website");

    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter?.card).toBe("summary");
    expect(metadata.twitter?.title).toBe("Join a Savings Circle — Kolo");
    expect(metadata.twitter?.description).toMatch(/invited to join a community savings circle/i);
  });
});
