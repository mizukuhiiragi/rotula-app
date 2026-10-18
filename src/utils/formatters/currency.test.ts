import { describe, expect, it } from "vitest";
import {
  formatAmount,
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
} from "./currency";

describe("currency formatters", () => {
  describe("formatCurrency", () => {
    it("formats amounts as standard USD currency with consistent fraction digits", () => {
      expect(formatCurrency(12500)).toBe("$12,500.00");
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("ensures whole-number and fractional inputs use the exact same fraction width (2 decimals)", () => {
      expect(formatCurrency(100)).toBe("$100.00");
      expect(formatCurrency(100.5)).toBe("$100.50");
      expect(formatCurrency(100.555)).toBe("$100.56");
    });
  });

  describe("formatAmount", () => {
    it("formats amounts with consistent fraction digits without currency symbol", () => {
      expect(formatAmount(12450)).toBe("12,450.00");
      expect(formatAmount(0)).toBe("0.00");
    });

    it("ensures whole numbers and fractional numbers align with 2 decimal places", () => {
      expect(formatAmount(50)).toBe("50.00");
      expect(formatAmount(50.2)).toBe("50.20");
      expect(formatAmount(50.25)).toBe("50.25");
    });
  });

  describe("formatCompactNumber", () => {
    it("formats large numbers compactly without currency symbols", () => {
      expect(formatCompactNumber(12500)).toBe("12.5K");
      expect(formatCompactNumber(1000000)).toBe("1M");
      expect(formatCompactNumber(0)).toBe("0");
    });
  });

  describe("formatCompactCurrency", () => {
    it("formats numbers compactly with a currency symbol", () => {
      expect(formatCompactCurrency(12500)).toBe("$12.5K");
      expect(formatCompactCurrency(1000000)).toBe("$1M");
      expect(formatCompactCurrency(0)).toBe("$0");
    });

    it("supports custom currency symbols", () => {
      const formatted = formatCompactCurrency(12500, "EUR");
      expect(formatted).toMatch(/€12\.5K|12\.5K\s?€/);
    });
  });
});
