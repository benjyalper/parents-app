'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import WeekCalendar from './WeekCalendar';

interface DailyContent {
  saying: {
    textHe: string;
    textEn: string;
    author?: string | null;
  } | null;
  image: {
    imageUrl: string;
    altTextHe?: string | null;
    altTextEn?: string | null;
  } | null;
  date: string;
}

export default function HeroSection() {
  const { t, language, isRTL } = useLanguage();
  const [daily, setDaily] = useState<DailyContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/daily')
      .then((r) => r.json())
      .then((data) => {
        setDaily(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Fallback saying shown before DB loads or if DB is unavailable
  const fallbackSaying = language === 'he'
    ? 'ילד זוכר איך גרמו לו להרגיש'
    : 'A child remembers how you made them feel';

  const sayingText = daily?.saying
    ? language === 'he'
      ? daily.saying.textHe
      : daily.saying.textEn
    : fallbackSaying;

  const imageAlt = daily?.image
    ? language === 'he'
      ? daily.image.altTextHe ?? ''
      : daily.image.altTextEn ?? ''
    : '';

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background image
          Priority order:
          1. Daily image from DB (if set)
          2. Local family-bg.jpg from /public (default background)
          3. Gradient fallback (if image fails to load)
          To change the background: replace /public/family-bg.jpg
      */}
      <Image
        src={daily?.image?.imageUrl ?? '/family-bg.jpg'}
        alt={imageAlt || 'רקע'}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay for readability — 30% opacity */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* App name */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
          {t.appName}
        </h1>
        <p className="text-white/70 text-lg mb-12 drop-shadow">
          {t.tagline}
        </p>

        {/* Saying card — always visible, shows fallback until DB loads */}
        <div className="
          bg-white/15 backdrop-blur-sm
          rounded-2xl px-8 py-6
          border border-white/20
          shadow-modal
        ">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
            {t.home.sayingOfTheDay}
          </p>
          <h3 className="text-white text-xl md:text-2xl font-medium leading-relaxed">
            &ldquo;{sayingText}&rdquo;
          </h3>
          {daily?.saying?.author && (
            <p className="text-white/60 text-sm mt-3">
              — {t.home.by} {daily.saying.author}
            </p>
          )}
        </div>

        {/* Weekly calendar — always visible */}
        <div className="mt-6">
          <WeekCalendar dark />
        </div>
      </div>
    </section>
  );
}
