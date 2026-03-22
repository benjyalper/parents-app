'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      aria-label="Toggle language"
      className="
        px-3 py-1.5 rounded-full text-sm font-medium
        border border-white/30 text-white
        hover:bg-white/20 active:bg-white/30
        transition-colors duration-150
        select-none
      "
    >
      {language === 'he' ? t.switchToEnglish : t.switchToHebrew}
    </button>
  );
}
