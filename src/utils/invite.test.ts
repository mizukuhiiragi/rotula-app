import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildInviteUrl,
  buildWhatsAppShareUrl,
  FALLBACK_INVITE_ORIGIN,
  generateInviteCode,
  isValidInviteCode,
  INVITE_CODE_LENGTH,
} from "@/utils/invite";

describe("isValidInviteCode", () => {
  it("validates well-formed generated codes", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateInviteCode();
      expect(isValidInviteCode(code)).toBe(true);
    }
  });

  it("rejects codes of incorrect length", () => {
    expect(isValidInviteCode("")).toBe(false);
    expect(isValidInviteCode("abc")).toBe(false);
    expect(isValidInviteCode("12345678")).toBe(false);
    expect(isValidInviteCode("1234567890")).toBe(false);
  });

  it("rejects codes with invalid characters", () => {
    expect(isValidInviteCode("abc_12345")).toBe(false);
    expect(isValidInviteCode("abc-12345")).toBe(false);
    expect(isValidInviteCode("abc!12345")).toBe(false);
    expect(isValidInviteCode("   123456")).toBe(false);
  });

  it("rejects non-string values including object prototypes", () => {
    expect(isValidInviteCode(null)).toBe(false);
    expect(isValidInviteCode(undefined)).toBe(false);
    expect(isValidInviteCode(123456789)).toBe(false);
    expect(isValidInviteCode({})).toBe(false);
    expect(isValidInviteCode("__proto__")).toBe(false);
    expect(isValidInviteCode("constructor")).toBe(false);
    expect(isValidInviteCode("toString")).toBe(false);
  });
});

describe("generateInviteCode", () => {
  it("produces a URL-safe code of the requested length", () => {
    const code = generateInviteCode(12);
    expect(code).toMatch(/^[A-Za-z0-9]+$/);
    expect(code).toHaveLength(12);
  });

  it("defaults to a 9-character code", () => {
    expect(generateInviteCode()).toHaveLength(9);
  });

  it("produces different codes across calls", () => {
    expect(generateInviteCode()).not.toBe(generateInviteCode());
  });
});

describe("buildInviteUrl", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses an explicit origin when provided", () => {
    expect(buildInviteUrl("abc123", "https://example.com")).toBe(
      "https://example.com/invite/abc123",
    );
  });

  it("defaults to the current window origin on the client", () => {
    expect(buildInviteUrl("clientcode")).toBe(
      `${window.location.origin}/invite/clientcode`,
    );
  });

  it("falls back to FALLBACK_INVITE_ORIGIN when window is unavailable", () => {
    vi.stubGlobal("window", undefined);
    expect(buildInviteUrl("servercode")).toBe(
      `${FALLBACK_INVITE_ORIGIN}/invite/servercode`,
    );
  });
});

describe("buildWhatsAppShareUrl", () => {
  it("encodes the message text and url into the wa.me deep link", () => {
    const inviteUrl = `${FALLBACK_INVITE_ORIGIN}/invite/abc123`;
    expect(buildWhatsAppShareUrl(inviteUrl, "Join my group")).toBe(
      `https://wa.me/?text=${encodeURIComponent(`Join my group ${inviteUrl}`)}`,
    );
  });

  it("shares the bare url when no text is provided", () => {
    const inviteUrl = `${FALLBACK_INVITE_ORIGIN}/invite/abc123`;
    expect(buildWhatsAppShareUrl(inviteUrl)).toBe(
      `https://wa.me/?text=${encodeURIComponent(inviteUrl)}`,
    );
  });
});
