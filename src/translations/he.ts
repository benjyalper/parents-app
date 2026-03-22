/**
 * Hebrew translation strings
 * All visible text lives here — change wording without touching components.
 */
export const he = {
  // ── App ─────────────────────────────────────────────────────
  appName: 'שותפים להורות',
  tagline: 'שותפות מכבדת למען הילדים',

  // ── Navigation ───────────────────────────────────────────────
  nav: {
    home:       'דף הבית',
    hurt:       'נפגעתי ממך',
    boundaries: 'גבולות',
  },

  // ── Language Toggle ──────────────────────────────────────────
  switchToEnglish: 'English',
  switchToHebrew:  'עברית',

  // ── Home Page ────────────────────────────────────────────────
  home: {
    pictureOfTheDay: 'תמונת היום',
    sayingOfTheDay:  'ציטוט היום',
    by:              'מאת',
  },

  // ── Hurt Page (נפגעתי ממך) ────────────────────────────────────
  hurt: {
    pageTitle:         'נפגעתי ממך',
    pageSubtitle:      'מקום בטוח להביע פגיעה בדרך מכבדת',
    dotCount:          'נקודות',
    entryFormTitle:    'הוסף רשומה',
    writerLabel:       'מי כותב?',
    targetLabel:       'על מי?',
    textPlaceholder:   'נפגעתי כשאמרת...',
    submitButton:      'שמור',
    submitting:        'שומר...',
    entriesTitle:      'רשומות',
    noEntries:         'אין רשומות עדיין.',
    modalWrittenBy:    'נכתב על ידי',
    modalAbout:        'לגבי',
    modalDate:         'תאריך',
    modalClose:        'סגור',
    charCount:         'תווים',
    selectPerson:      'בחר...',
    validationText:    'יש להזין טקסט.',
    validationWriter:  'יש לבחור מי כותב.',
    validationTarget:  'יש לבחור על מי.',
    samePersonError:   'לא ניתן לכתוב על עצמך.',
    successMessage:    'הרשומה נשמרה!',
    errorMessage:      'שגיאה בשמירה. נסה שוב.',
  },

  // ── Boundaries Page (גבולות) ──────────────────────────────────
  boundaries: {
    pageTitle:         'גבולות',
    kingTitle:         'המלך אמר...',
    textPlaceholder:   'המסר הזה הועבר לילדים ללא הסכמתי',
    submitButton:      'פרסם',
    submitting:        'שומר...',
    messagesTitle:     'הודעות',
    noMessages:        'אין הודעות עדיין.',
    writerLabel:       'מי כותב?',
    selectPerson:      'בחר...',
    validationText:    'יש להזין טקסט.',
    validationWriter:  'יש לבחור מי כותב.',
    successMessage:    'ההודעה נשמרה!',
    errorMessage:      'שגיאה בשמירה. נסה שוב.',
    charCount:         'תווים',
  },

  // ── Week Calendar ────────────────────────────────────────────
  calendar: {
    title:   'לוח שבועי',
    today:   'היום',
    days: ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'],
    // Hebrew day names for tooltip
    daysFull: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
  },

  // ── General UI ───────────────────────────────────────────────
  loading:  'טוען...',
  error:    'שגיאה בטעינה',
  retry:    'נסה שוב',
  close:    'סגור',
};

export type Translations = typeof he;
