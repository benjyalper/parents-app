/**
 * Hebrew holiday lookup for the weekly calendar strip.
 *
 * This is a minimal static list for the current/near-future year.
 * For a production-grade solution, integrate a Hebrew calendar library
 * like `hebcal` or `@hebcal/core`.
 *
 * Key format: "MM-DD" (month-day, no year) for recurring holidays,
 * or "YYYY-MM-DD" for specific year.
 */

interface Holiday {
  nameHe: string;
  nameEn: string;
}

// Recurring holidays by month-day (Gregorian approximation — good enough for display)
const HOLIDAYS: Record<string, Holiday> = {
  // Fixed Gregorian-approximate dates for major holidays
  '2025-09-22': { nameHe: 'ר"ה', nameEn: "Rosh HaShana" },
  '2025-09-23': { nameHe: 'ר"ה', nameEn: "Rosh HaShana" },
  '2025-10-01': { nameHe: 'יוה"כ', nameEn: "Yom Kippur" },
  '2025-10-06': { nameHe: 'סוכות', nameEn: "Sukkot" },
  '2025-10-13': { nameHe: 'שמח"ת', nameEn: "Simchat Torah" },
  '2025-12-14': { nameHe: 'חנוכה', nameEn: "Hanukkah" },
  '2026-03-13': { nameHe: 'פורים', nameEn: "Purim" },
  '2026-04-01': { nameHe: 'פסח', nameEn: "Passover" },
  '2026-04-02': { nameHe: 'פסח', nameEn: "Passover" },
  '2026-04-07': { nameHe: 'פסח', nameEn: "Passover" },
  '2026-04-08': { nameHe: 'פסח', nameEn: "Passover" },
  '2026-05-22': { nameHe: 'שבועות', nameEn: "Shavuot" },
  '2026-09-11': { nameHe: 'ר"ה', nameEn: "Rosh HaShana" },
  '2026-09-20': { nameHe: 'יוה"כ', nameEn: "Yom Kippur" },
};

/**
 * Returns the holiday for a given date string "YYYY-MM-DD", or null.
 */
export function getHoliday(dateStr: string): Holiday | null {
  return HOLIDAYS[dateStr] ?? null;
}
