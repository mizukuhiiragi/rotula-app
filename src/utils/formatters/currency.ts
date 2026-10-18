/**
 * Normalizes and validates a currency code (e.g. "usd" -> "USD").
 * If the provided currency code is malformed or unsupported by the runtime Intl engine,
 * it safely falls back to "USD" rather than throwing a RangeError.
 *
 * @param currency - The currency code to validate.
 * @returns A validated ISO 4217 currency code, defaulting to "USD".
 */
export const normalizeCurrencyCode = (currency = "USD"): string => {
  if (typeof currency !== "string") return "USD";
  const normalized = currency.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(normalized)) {
    return "USD";
  }
  try {
    new Intl.NumberFormat("en-US", { style: "currency", currency: normalized });
    return normalized;
  } catch {
    return "USD";
  }
};

/**
 * Formats a numeric amount as a localized currency string.
 *
 * @param amount - The value to format.
 * @param currency - ISO 4217 currency code (defaults to USD; falls back to USD if invalid).
 */
export const formatCurrency = (amount: number, currency = "USD"): string => {
  const safeCurrency = normalizeCurrencyCode(currency);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: safeCurrency,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a numeric amount compactly with a localized currency symbol,
 * e.g. 12_500 -> "$12.5K".
 *
 * @param value - The value to format.
 * @param currency - ISO 4217 currency code (defaults to USD; falls back to USD if invalid).
 */
export const formatCompactCurrency = (
  value: number,
  currency = "USD",
): string => {
  const safeCurrency = normalizeCurrencyCode(currency);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: safeCurrency,
    notation: "compact",
    // Pin the minimum to zero so whole amounts render as "$1M" rather than
    // "$1.0M" on ICU versions that pad the compact unit to one decimal.
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};

// Re-exported so existing imports from this module keep working while the
// implementations live together in `number.ts`.
export { formatCompactNumber } from "./number";
