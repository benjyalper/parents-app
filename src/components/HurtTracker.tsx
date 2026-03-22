'use client';

/**
 * HurtTracker — the full "נפגעתי ממך" page component.
 *
 * Features:
 * - Two-column dot counter (one column per participant)
 * - Entry form with writer/target selection
 * - "נפגעתי כשאמרת..." text field
 * - "אפשר להגיד את זה ככה..." suggestion panel (reframing the hurt gently)
 * - Entries list with click-to-expand modal
 */

import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { APP_CONFIG } from '@/config/app.config';
import Modal from './ui/Modal';
import WeekCalendar from './WeekCalendar';

// ── Types ─────────────────────────────────────────────────────

interface Participant {
  id: string;
  name: string;
  label: string;
}

interface HurtEntry {
  id: string;
  text: string;
  createdAt: string;
  writer: Participant;
  target: Participant;
}

// ── Reframing suggestions ─────────────────────────────────────
// These offer a calmer way to express the same hurt.
// Keys match substrings we look for in the text (case-insensitive).
// In production you could store these in the DB or a config file.
const REFRAME_SUGGESTIONS_HE = [
  'כשאמרת שאני לא טוב, הרגשתי לא מוערך. אפשר לנסות: "זה פגע בי כשאמרת..."',
  'כשפעלת בלעדי, הרגשתי מוחרג. אפשר לנסות: "הייתי רוצה שנחליט יחד..."',
  'כשהורדת אותי בפני הילדים, הרגשתי בושה. אפשר לנסות: "חשוב לי שנדבר בנפרד..."',
  'כשלא ענית לי, הרגשתי מובהל. אפשר לנסות: "אשמח אם תגיב גם אם זה קצר..."',
  'כשהעברת מסר דרך הילדים, הרגשתי נעקף. אפשר לנסות: "בואו נדבר ישירות..."',
];

const REFRAME_SUGGESTIONS_EN = [
  'When you said I wasn\'t good, I felt undervalued. Try: "It hurt me when you said..."',
  'When you acted without me, I felt excluded. Try: "I\'d like us to decide together..."',
  'When you put me down in front of the kids, I felt embarrassed. Try: "Let\'s talk privately..."',
  'When you didn\'t reply, I felt anxious. Try: "A short reply would mean a lot..."',
  'When you sent a message through the kids, I felt bypassed. Try: "Let\'s speak directly..."',
];

function getReframeSuggestion(text: string, lang: 'he' | 'en'): string {
  // Simple hash to pick a consistent suggestion for each entry
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  const list = lang === 'he' ? REFRAME_SUGGESTIONS_HE : REFRAME_SUGGESTIONS_EN;
  return list[hash % list.length];
}

// ── Main Component ────────────────────────────────────────────

export default function HurtTracker() {
  const { t, language, isRTL } = useLanguage();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [entries, setEntries]           = useState<HurtEntry[]>([]);
  const [loadingData, setLoadingData]   = useState(true);
  const [dataError, setDataError]       = useState(false);

  // Form state
  const [text, setText]         = useState('');
  const [writerId, setWriterId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Editable reframe suggestion — auto-updates when text changes, but user can edit it
  const [reframeText, setReframeText] = useState('');
  useEffect(() => {
    if (text.trim()) {
      setReframeText(getReframeSuggestion(text, language));
    } else {
      setReframeText('');
    }
  }, [text, language]);

  // Modal state
  const [selectedEntry, setSelectedEntry] = useState<HurtEntry | null>(null);

  // ── Fetch data ──────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [pRes, eRes] = await Promise.all([
        fetch('/api/participants'),
        fetch('/api/hurt-entries'),
      ]);
      if (!pRes.ok || !eRes.ok) throw new Error('fetch failed');
      const [p, e] = await Promise.all([pRes.json(), eRes.json()]);
      setParticipants(p);
      setEntries(e);
    } catch {
      setDataError(true);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Submit ──────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    // Validate
    if (!text.trim()) return setFormError(t.hurt.validationText);
    if (!writerId)    return setFormError(t.hurt.validationWriter);
    if (!targetId)    return setFormError(t.hurt.validationTarget);
    if (writerId === targetId) return setFormError(t.hurt.samePersonError);

    setSubmitting(true);
    try {
      const res = await fetch('/api/hurt-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, writerId, targetId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'unknown');
      }
      const newEntry = await res.json();
      setEntries((prev) => [newEntry, ...prev]);
      setText('');
      setWriterId('');
      setTargetId('');
      setReframeText('');
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 3000);
    } catch {
      setFormError(t.hurt.errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Derived counts ──────────────────────────────────────────
  const countFor = (p: Participant) =>
    entries.filter((e) => e.target.id === p.id).length;

  // ── Format date ─────────────────────────────────────────────
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  // ── Render ──────────────────────────────────────────────────
  return (
    <div
      className="max-w-3xl mx-auto px-4 py-8 space-y-10"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-calm-800">{t.hurt.pageTitle}</h1>
        <p className="text-calm-500 text-sm mt-1">{t.hurt.pageSubtitle}</p>
      </div>

      {/* Weekly calendar */}
      <WeekCalendar />

      {loadingData && (
        <p className="text-calm-400 animate-pulse text-sm">{t.loading}</p>
      )}

      {dataError && (
        <p className="text-red-400 text-sm">{t.error}</p>
      )}

      {!loadingData && !dataError && (
        <>
          {/* ── Dot Counters ─────────────────────────────────── */}
          <section className="grid grid-cols-2 gap-4">
            {participants.map((p) => {
              const count = countFor(p);
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-soft p-6 flex flex-col items-center gap-3"
                >
                  <p className="font-semibold text-calm-700 text-lg">{p.name}</p>
                  <div className="flex flex-wrap justify-center gap-1.5 min-h-[28px]">
                    {count === 0 ? (
                      <span className="text-calm-300 text-sm">—</span>
                    ) : (
                      Array.from({ length: count }).map((_, i) => (
                        <span
                          key={i}
                          className="w-5 h-5 rounded-full bg-red-400 shadow-sm inline-block"
                          title={`${i + 1}`}
                        />
                      ))
                    )}
                  </div>
                  <p className="text-calm-400 text-xs">
                    {count} {t.hurt.dotCount}
                  </p>
                </div>
              );
            })}
          </section>

          {/* ── Entry Form ───────────────────────────────────── */}
          <section className="bg-white rounded-2xl shadow-soft p-6 space-y-5">
            <h2 className="font-semibold text-calm-700 text-lg">{t.hurt.entryFormTitle}</h2>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Writer / Target selects */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-calm-500 font-medium">{t.hurt.writerLabel}</label>
                  <select
                    value={writerId}
                    onChange={(e) => setWriterId(e.target.value)}
                    className="rounded-xl border border-calm-200 px-3 py-2 text-sm text-calm-800 focus:outline-none focus:ring-2 focus:ring-calm-400 bg-warm-50"
                  >
                    <option value="">{t.hurt.selectPerson}</option>
                    {participants.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-calm-500 font-medium">{t.hurt.targetLabel}</label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="rounded-xl border border-calm-200 px-3 py-2 text-sm text-calm-800 focus:outline-none focus:ring-2 focus:ring-calm-400 bg-warm-50"
                  >
                    <option value="">{t.hurt.selectPerson}</option>
                    {participants.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Two-column layout: text field + reframe suggestion */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* Text area */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-calm-500 font-medium">
                    {language === 'he' ? 'נפגעתי כשאמרת...' : 'I was hurt when you said...'}
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={language === 'he' ? 'נפגעתי כשאמרת...' : 'I was hurt when you said...'}
                    maxLength={APP_CONFIG.maxHurtEntryChars}
                    rows={4}
                    className="rounded-xl border border-calm-200 px-3 py-2 text-sm text-calm-800 resize-none focus:outline-none focus:ring-2 focus:ring-calm-400 bg-warm-50 placeholder:text-calm-300"
                  />
                  <p className="text-xs text-calm-300 text-end">
                    {text.length}/{APP_CONFIG.maxHurtEntryChars} {t.hurt.charCount}
                  </p>
                </div>

                {/* Reframe suggestion — editable textarea */}
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-primary-600">
                    {language === 'he' ? 'אפשר להגיד את זה ככה...' : 'You could say it like this...'}
                  </p>
                  <textarea
                    value={reframeText}
                    onChange={(e) => setReframeText(e.target.value)}
                    placeholder={
                      language === 'he'
                        ? 'הקלד כמה מילים ונציע ניסוח עדין יותר...'
                        : "Start typing and we'll suggest a gentler way..."
                    }
                    rows={4}
                    className="text-xs text-primary-700 leading-relaxed bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary-300 rounded-lg px-1 placeholder:text-primary-300 w-full"
                  />
                </div>
              </div>

              {/* Validation / success feedback */}
              {formError && (
                <p className="text-red-500 text-sm">{formError}</p>
              )}
              {formSuccess && (
                <p className="text-green-600 text-sm">{t.hurt.successMessage}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="
                  w-full py-2.5 rounded-xl font-semibold text-sm
                  bg-calm-700 text-white
                  hover:bg-calm-600 active:bg-calm-800
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-150
                "
              >
                {submitting ? t.hurt.submitting : t.hurt.submitButton}
              </button>
            </form>
          </section>

          {/* ── Entries List ──────────────────────────────────── */}
          <section className="space-y-3">
            <h2 className="font-semibold text-calm-700 text-lg">{t.hurt.entriesTitle}</h2>

            {entries.length === 0 ? (
              <p className="text-calm-400 text-sm">{t.hurt.noEntries}</p>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start"
                  >
                    {/* Entry card */}
                    <div className="bg-white rounded-xl shadow-soft px-5 py-4 border border-transparent hover:border-calm-100 hover:shadow-card transition-shadow duration-150">
                      <div className="flex items-start gap-3">
                        <span className="w-3 h-3 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        <button
                          onClick={() => setSelectedEntry(entry)}
                          className="flex-1 min-w-0 text-start"
                        >
                          <p className="text-calm-800 text-sm leading-snug line-clamp-2 hover:text-calm-900">
                            {entry.text}
                          </p>
                          <p className="text-calm-400 text-xs mt-1">
                            {entry.writer.name} → {entry.target.name} · {formatDate(entry.createdAt)}
                          </p>
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={async () => {
                            if (!confirm(language === 'he' ? 'למחוק את הרשומה?' : 'Delete this entry?')) return;
                            await fetch(`/api/hurt-entries/${entry.id}`, { method: 'DELETE' });
                            setEntries((prev) => prev.filter((e) => e.id !== entry.id));
                          }}
                          className="shrink-0 text-calm-300 hover:text-red-400 transition-colors duration-150 p-1"
                          title={language === 'he' ? 'מחק' : 'Delete'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Reframe suggestion */}
                    <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
                      <p className="text-xs font-semibold text-primary-600 mb-1">
                        {language === 'he' ? 'אפשר להגיד את זה ככה...' : 'You could say it like this...'}
                      </p>
                      <p className="text-xs text-primary-700 leading-relaxed">
                        {getReframeSuggestion(entry.text, language)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* ── Entry Detail Modal ──────────────────────────────── */}
      <Modal
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {selectedEntry && (
          <div className="p-6 space-y-4">
            {/* Red dot header */}
            <div className="flex items-center gap-3 border-b border-calm-100 pb-4">
              <span className="w-5 h-5 rounded-full bg-red-400 shrink-0" />
              <h3 className="font-bold text-calm-800 text-lg">{t.hurt.pageTitle}</h3>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <Row label={t.hurt.modalWrittenBy} value={selectedEntry.writer.name} />
              <Row label={t.hurt.modalAbout}     value={selectedEntry.target.name} />
              <Row label={t.hurt.modalDate}      value={formatDate(selectedEntry.createdAt)} />
            </div>

            {/* Entry text */}
            <div className="bg-warm-50 rounded-xl p-4">
              <p className="text-calm-800 leading-relaxed">{selectedEntry.text}</p>
            </div>

            {/* Reframe suggestion in modal */}
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-primary-600 mb-1">
                {language === 'he' ? 'אפשר להגיד את זה ככה...' : 'You could say it like this...'}
              </p>
              <p className="text-xs text-primary-700 leading-relaxed">
                {getReframeSuggestion(selectedEntry.text, language)}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedEntry(null)}
              className="
                w-full py-2.5 rounded-xl font-semibold text-sm
                bg-calm-100 text-calm-700
                hover:bg-calm-200 transition-colors duration-150
              "
            >
              {t.hurt.modalClose}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Small helper for modal detail rows
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-calm-700">
      <span className="text-calm-400 shrink-0">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
