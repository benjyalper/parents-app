'use client';

/**
 * BoundariesPage — the full "גבולות" page component.
 *
 * Sections:
 * 1. Weekly calendar strip
 * 2. "המלך אמר..." text entry form
 * 3. Messages list
 */

import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { APP_CONFIG } from '@/config/app.config';
import WeekCalendar from './WeekCalendar';

interface Participant {
  id: string;
  name: string;
  label: string;
}

interface BoundaryMessage {
  id: string;
  text: string;
  createdAt: string;
  writer: Participant;
}

export default function BoundariesPage() {
  const { t, language, isRTL } = useLanguage();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages]         = useState<BoundaryMessage[]>([]);
  const [loading, setLoading]           = useState(true);
  const [dataError, setDataError]       = useState(false);

  const [text, setText]         = useState('');
  const [writerId, setWriterId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [pRes, mRes] = await Promise.all([
        fetch('/api/participants'),
        fetch('/api/boundaries'),
      ]);
      if (!pRes.ok || !mRes.ok) throw new Error('fetch failed');
      const [p, m] = await Promise.all([pRes.json(), mRes.json()]);
      setParticipants(p);
      setMessages(m);
    } catch {
      setDataError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!text.trim()) return setFormError(t.boundaries.validationText);
    if (!writerId)    return setFormError(t.boundaries.validationWriter);

    setSubmitting(true);
    try {
      const res = await fetch('/api/boundaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, writerId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'unknown');
      }
      const newMsg = await res.json();
      setMessages((prev) => [newMsg, ...prev]);
      setText('');
      setWriterId('');
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 3000);
    } catch {
      setFormError(t.boundaries.errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-8 space-y-8"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-calm-800">{t.boundaries.pageTitle}</h1>
      </div>

      {/* ── Weekly Calendar Strip ────────────────────────────── */}
      <WeekCalendar />

      {loading && <p className="text-calm-400 animate-pulse text-sm">{t.loading}</p>}
      {dataError && <p className="text-red-400 text-sm">{t.error}</p>}

      {!loading && !dataError && (
        <>
          {/* ── Entry Form ────────────────────────────────────── */}
          <section className="bg-white rounded-2xl shadow-soft p-6 space-y-5">
            {/* "המלך אמר..." header */}
            <h2 className="font-bold text-calm-800 text-xl">{t.boundaries.kingTitle}</h2>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Writer select */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-calm-500 font-medium">{t.boundaries.writerLabel}</label>
                <select
                  value={writerId}
                  onChange={(e) => setWriterId(e.target.value)}
                  className="rounded-xl border border-calm-200 px-3 py-2 text-sm text-calm-800 focus:outline-none focus:ring-2 focus:ring-calm-400 bg-warm-50"
                >
                  <option value="">{t.boundaries.selectPerson}</option>
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Text area */}
              <div className="flex flex-col gap-1">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t.boundaries.textPlaceholder}
                  maxLength={APP_CONFIG.maxBoundaryMessageChars}
                  rows={3}
                  className="rounded-xl border border-calm-200 px-3 py-2 text-sm text-calm-800 resize-none focus:outline-none focus:ring-2 focus:ring-calm-400 bg-warm-50 placeholder:text-calm-300"
                />
                <p className="text-xs text-calm-300 text-end">
                  {text.length}/{APP_CONFIG.maxBoundaryMessageChars} {t.boundaries.charCount}
                </p>
              </div>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}
              {formSuccess && <p className="text-green-600 text-sm">{t.boundaries.successMessage}</p>}

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
                {submitting ? t.boundaries.submitting : t.boundaries.submitButton}
              </button>
            </form>
          </section>

          {/* ── Messages List ─────────────────────────────────── */}
          <section className="space-y-3">
            <h2 className="font-semibold text-calm-700 text-lg">{t.boundaries.messagesTitle}</h2>

            {messages.length === 0 ? (
              <p className="text-calm-400 text-sm">{t.boundaries.noMessages}</p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white rounded-xl shadow-soft px-5 py-4"
                  >
                    <p className="text-calm-800 text-sm leading-relaxed">{msg.text}</p>
                    <p className="text-calm-400 text-xs mt-2">
                      {msg.writer.name} · {formatDate(msg.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
