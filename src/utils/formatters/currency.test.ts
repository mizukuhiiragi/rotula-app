import { describe, expect, it } from "vitest";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  normalizeCurrencyCode,
} from "./currency";

describe("currency formatters", () => {
  describe("normalizeCurrencyCode", () => {
    it("returns uppercase valid currency code", () => {
      expect(normalizeCurrencyCode("USD")).toBe("USD");
      expect(normalizeCurrencyCode("EUR")).toBe("EUR");
    });

    it("normalizes lowercase valid currency codes to uppercase", () => {
      expect(normalizeCurrencyCode("usd")).toBe("USD");
      expect(normalizeCurrencyCode("eur")).toBe("EUR");
    });

    it("safely falls back to USD for invalid or unsupported codes without throwing", () => {
      expect(normalizeCurrencyCode("INVALID")).toBe("USD");
      expect(normalizeCurrencyCode("123")).toBe("USD");
      expect(normalizeCurrencyCode("")).toBe("USD");
      expect(normalizeCurrencyCode(undefined)).toBe("USD");
    });
  });

  describe("formatCurrency", () => {
    it("formats amounts as standard USD currency", () => {
      expect(formatCurrency(12500)).toBe("$12,500.00");
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("formats amounts with lowercase currency code properly", () => {
      expect(formatCurrency(100, "usd")).toBe("$100.00");
    });

    it("does not throw on invalid currency code and falls back safely to USD", () => {
      expect(() => formatCurrency(100, "INVALID_CODE")).not.toThrow();
      expect(formatCurrency(100, "INVALID_CODE")).toBe("$100.00");
      expect(formatCurrency(100, "xyz123")).toBe("$100.00");
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

    it("supports lowercase currency codes", () => {
      const formatted = formatCompactCurrency(12500, "eur");
      expect(formatted).toMatch(/€12\.5K|12\.5K\s?€/);
    });

    it("does not throw on invalid currency code and falls back safely to USD", () => {
      expect(() => formatCompactCurrency(12500, "INVALID")).not.toThrow();
      expect(formatCompactCurrency(12500, "INVALID")).toBe("$12.5K");
    });
  });
});
