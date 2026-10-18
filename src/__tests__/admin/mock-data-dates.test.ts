import { describe, expect, it } from "vitest";
import {
  buildAdminDashboardData,
  getAdminDashboardData,
  FIXED_REFERENCE_TIME,
  DAY_MS,
  resolveBaseTime,
} from "@/lib/admin/mock-data";

describe("admin mock-data date anchoring", () => {
  it("defaults to anchoring to current time when referenceTime is omitted", async () => {
    const before = Date.now();
    const data = await getAdminDashboardData();
    const after = Date.now();

    // The most recent contract invocation should be within minutes of execution time
    const invocationTimes = data.contracts.map((c) =>
      Date.parse(c.lastInvocationAt),
    );
    const maxInvocation = Math.max(...invocationTimes);
    expect(maxInvocation).toBeGreaterThanOrEqual(before - 24 * 60 * 60 * 1000);
    expect(maxInvocation).toBeLessThanOrEqual(after);
  });

  it("ensures no group's nextPayoutAt is in the past relative to execution base", () => {
    const base = Date.now();
    const data = buildAdminDashboardData(base);

    for (const group of data.groups) {
      const payoutTime = Date.parse(group.nextPayoutAt);
      expect(payoutTime).toBeGreaterThan(base);
    }
  });

  it("ensures transaction dates stay within the recent window (last 30 days)", () => {
    const base = Date.now();
    const data = buildAdminDashboardData(base);

    for (const txn of data.transactions) {
      const txnTime = Date.parse(txn.createdAt);
      expect(txnTime).toBeLessThanOrEqual(base);
      expect(txnTime).toBeGreaterThanOrEqual(base - 30 * DAY_MS);
    }
  });

  it("produces identical, deterministic datasets when provided the same reference date", () => {
    const run1 = buildAdminDashboardData(FIXED_REFERENCE_TIME);
    const run2 = buildAdminDashboardData(FIXED_REFERENCE_TIME);

    expect(run1).toEqual(run2);
    expect(run1.groups[0].nextPayoutAt).toBe(run2.groups[0].nextPayoutAt);
    expect(run1.contracts[0].lastInvocationAt).toBe(
      run2.contracts[0].lastInvocationAt,
    );
  });

  it("accepts Date object or ISO string as reference timestamp", () => {
    const dateObj = new Date("2026-11-01T00:00:00.000Z");
    const isoString = "2026-11-01T00:00:00.000Z";

    const fromDate = buildAdminDashboardData(dateObj);
    const fromString = buildAdminDashboardData(isoString);

    expect(fromDate).toEqual(fromString);
  });

  it("resolveBaseTime helper correctly resolves numbers, Dates, strings and default", () => {
    const now = Date.now();
    expect(resolveBaseTime(1700000000000)).toBe(1700000000000);
    expect(resolveBaseTime(new Date(1700000000000))).toBe(1700000000000);
    expect(resolveBaseTime("2026-07-20T12:00:00.000Z")).toBe(
      Date.parse("2026-07-20T12:00:00.000Z"),
    );
    expect(resolveBaseTime()).toBeGreaterThanOrEqual(now);
  });
});
