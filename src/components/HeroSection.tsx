'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

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

  const sayingText = daily?.saying
    ? language === 'he'
      ? daily.saying.textHe
      : daily.saying.textEn
    : null;

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
      {/* Background image */}
      {daily?.image ? (
        <Image
          src={daily.image.imageUrl}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        // Fallback gradient when no image
        <div className="absolute inset-0 bg-gradient-to-br from-calm-800 via-calm-700 to-warm-600" />
      )}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* App name */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
          {t.appName}
        </h1>
        <p className="text-white/70 text-lg mb-12 drop-shadow">
          {t.tagline}
        </p>

        {loading && (
          <p className="text-white/60 text-sm animate-pulse">{t.loading}</p>
        )}

        {error && (
          <p className="text-white/60 text-sm">{t.error}</p>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {/* Picture of the day label */}
            {daily?.image && (
              <p className="text-white/60 text-xs uppercase tracking-widest">
                {t.home.pictureOfTheDay}
              </p>
            )}

            {/* Saying card */}
            {sayingText && (
              <div className="
                bg-white/15 backdrop-blur-sm
                rounded-2xl px-8 py-6
                border border-white/20
                shadow-modal
              ">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
                  {t.home.sayingOfTheDay}
                </p>
                <blockquote className="text-white text-xl md:text-2xl font-medium leading-relaxed">
                  &ldquo;{sayingText}&rdquo;
                </blockquote>
                {daily?.saying?.author && (
                  <p className="text-white/60 text-sm mt-3">
                    — {t.home.by} {daily.saying.author}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
