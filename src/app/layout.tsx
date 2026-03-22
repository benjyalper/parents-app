import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { APP_CONFIG } from '@/config/app.config';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  // Change the app name in src/config/app.config.ts — it updates here automatically.
  title: APP_CONFIG.appName,
  description: APP_CONFIG.appNameEn,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // lang and dir are set dynamically by the LanguageProvider (client-side).
    // We default to Hebrew here for SSR / search engines.
    <html lang="he" dir="rtl">
      <body>
        <LanguageProvider>
          <Navbar />
          {/* pt-16 offsets the fixed navbar height */}
          <main className="pt-16">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
