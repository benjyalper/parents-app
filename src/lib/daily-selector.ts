/**
 * Daily selector utility
 *
 * Deterministically picks an item from a list based on the current date.
 * The same item is returned for the entire calendar day, and it changes
 * automatically at midnight.
 *
 * Algorithm: hash the date string (YYYY-MM-DD) to an index using a simple
 * numeric hash, then take modulo of the list length.
 */

/**
 * Returns a stable numeric seed for a given date string "YYYY-MM-DD".
 */
function dateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0; // unsigned 32-bit
  }
  return hash;
}

/**
 * Pick one item from `items` deterministically for `date`.
 * date should be "YYYY-MM-DD" (today's date).
 */
export function pickForDay<T>(items: T[], date: string): T | null {
  if (!items || items.length === 0) return null;
  const seed = dateSeed(date);
  const index = seed % items.length;
  return items[index];
}

/**
 * Returns today's date as "YYYY-MM-DD" in local time.
 */
export function todayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
