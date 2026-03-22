/**
 * ============================================================
 * CENTRAL APP CONFIGURATION
 * ============================================================
 * Change the app name, person names, and default settings here.
 * All UI labels come from the translation files (src/translations/).
 * ============================================================
 */

export const APP_CONFIG = {
  // ── App Identity ───────────────────────────────────────────
  // Change this to rename the app everywhere
  appName: 'שותפים להורות',
  appNameEn: 'Parents as Partners',

  // ── Participants ───────────────────────────────────────────
  // These match the `label` field in the Participant table.
  // Change display names in the database (or the seed file).
  personALabel: 'personA',
  personBLabel: 'personB',

  // Fallback display names (used if DB is unavailable)
  personAFallbackHe: 'אחד',
  personAFallbackEn: 'Person A',
  personBFallbackHe: 'שתיים',
  personBFallbackEn: 'Person B',

  // ── Language ───────────────────────────────────────────────
  defaultLanguage: 'he' as 'he' | 'en',

  // ── Navigation Tabs ────────────────────────────────────────
  // To add a new tab, add an entry here AND create the page.
  // 'href' should match the Next.js App Router path.
  navTabs: [
    { key: 'home',       hrefKey: '/'           },
    { key: 'hurt',       hrefKey: '/hurt'       },
    { key: 'boundaries', hrefKey: '/boundaries' },
  ] as const,

  // ── Hurt Entry ─────────────────────────────────────────────
  maxHurtEntryChars: 120,

  // ── Boundary Message ──────────────────────────────────────
  maxBoundaryMessageChars: 200,
};
