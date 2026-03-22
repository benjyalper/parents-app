'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { APP_CONFIG } from '@/config/app.config';
import LanguageToggle from './LanguageToggle';

// Map tab keys to translation keys
const TAB_KEYS: Record<string, keyof typeof import('@/translations/he').he['nav']> = {
  home:       'home',
  hurt:       'hurt',
  boundaries: 'boundaries',
};

export default function Navbar() {
  const pathname = usePathname();
  const { t, isRTL } = useLanguage();

  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-50
        bg-gradient-to-r from-calm-800 to-calm-700
        shadow-soft
      "
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* App name */}
        <Link
          href="/"
          className="text-white font-bold text-lg tracking-wide hover:opacity-80 transition-opacity shrink-0"
        >
          {t.appName}
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1 justify-center">
          {APP_CONFIG.navTabs.map((tab) => {
            const label = t.nav[TAB_KEYS[tab.key]];
            const isActive = pathname === tab.hrefKey;
            return (
              <Link
                key={tab.key}
                href={tab.hrefKey}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-white text-calm-800 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/15'
                  }
                `}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Language toggle */}
        <div className="shrink-0">
          <LanguageToggle />
        </div>

      </div>
    </nav>
  );
}
