import { describe, expect, it } from "vitest";

import { formatDate, formatDateTime } from "./date";

describe("date formatters", () => {
  const isoString = "2026-07-20T14:30:00.000Z";
  const dateObj = new Date("2026-07-20T14:30:00.000Z");
  const epochNumber = dateObj.getTime();
  const epochString = epochNumber.toString();

  describe("formatDate", () => {
    it("formats a valid ISO string correctly", () => {
      const result = formatDate(isoString);
      expect(result).toMatch(/Jul 20, 2026/);
    });

    it("formats a valid Date object correctly", () => {
      const result = formatDate(dateObj);
      expect(result).toMatch(/Jul 20, 2026/);
    });

    it("interprets epoch milliseconds number correctly", () => {
      const result = formatDate(epochNumber);
      expect(result).toMatch(/Jul 20, 2026/);
    });

    it("interprets epoch numeric string correctly", () => {
      const result = formatDate(epochString);
      expect(result).toMatch(/Jul 20, 2026/);
    });

    it("returns stable placeholder for malformed string and never 'Invalid Date'", () => {
      const result = formatDate("invalid-date-string");
      expect(result).toBe("—");
      expect(result).not.toContain("Invalid Date");
    });

    it("returns stable placeholder for Invalid Date object", () => {
      const result = formatDate(new Date("invalid"));
      expect(result).toBe("—");
    });

    it("supports custom fallback placeholder", () => {
      const result = formatDate("not-valid", "N/A");
      expect(result).toBe("N/A");
    });
  });

  describe("formatDateTime", () => {
    it("formats a valid ISO string correctly with time", () => {
      const result = formatDateTime(isoString);
      expect(result).toMatch(/Jul 20, 2026/);
      expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
    });

    it("formats a valid Date object correctly", () => {
      const result = formatDateTime(dateObj);
      expect(result).toMatch(/Jul 20, 2026/);
    });

    it("interprets epoch number correctly", () => {
      const result = formatDateTime(epochNumber);
      expect(result).toMatch(/Jul 20, 2026/);
    });

    it("interprets epoch numeric string correctly", () => {
      const result = formatDateTime(epochString);
      expect(result).toMatch(/Jul 20, 2026/);
    });

    it("returns stable placeholder for malformed string and never 'Invalid Date'", () => {
      const result = formatDateTime("garbage-input");
      expect(result).toBe("—");
      expect(result).not.toContain("Invalid Date");
    });

    it("returns stable placeholder for Invalid Date object", () => {
      const result = formatDateTime(new Date(NaN));
      expect(result).toBe("—");
    });
  });
});
