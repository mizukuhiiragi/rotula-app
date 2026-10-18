const toDate = (value: Date | string | number): Date | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    // Interpret pure integer strings as epoch milliseconds rather than parsing as date strings
    if (/^-?\d+$/.test(trimmed)) {
      const num = Number(trimmed);
      if (!Number.isFinite(num)) return null;
      const d = new Date(num);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(trimmed);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
};

/** Formats a date as e.g. "Jul 20, 2026", returning a stable placeholder for invalid inputs. */
export const formatDate = (
  date: Date | string | number,
  fallback = "—",
): string => {
  const d = toDate(date);
  if (!d) return fallback;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/** Formats a date and time as e.g. "Jul 20, 2026, 2:30 PM", returning a stable placeholder for invalid inputs. */
export const formatDateTime = (
  date: Date | string | number,
  fallback = "—",
): string => {
  const d = toDate(date);
  if (!d) return fallback;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
