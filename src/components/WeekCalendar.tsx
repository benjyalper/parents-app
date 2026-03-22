'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getHoliday } from '@/lib/hebrew-calendar';

export default function WeekCalendar() {
  const { t, isRTL } = useLanguage();

  const { days, todayIndex } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find Sunday of the current week
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);

      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;

      return {
        dateStr,
        dayOfWeek: d.getDay(), // 0 = Sunday
        dateNum: d.getDate(),
        isToday: d.getTime() === today.getTime(),
        holiday: getHoliday(dateStr),
      };
    });

    // In Hebrew (RTL), days go right-to-left: Sat on the left, Sun on the right visually
    // The array stays Sun=0…Sat=6; CSS flex-direction handles RTL rendering.
    const todayIndex = days.findIndex((d) => d.isToday);

    return { days, todayIndex };
  }, []);

  return (
    <div
      className="bg-white rounded-2xl shadow-soft px-4 py-3"
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-label={t.calendar.title}
    >
      <p className="text-xs text-calm-500 uppercase tracking-widest mb-2 text-center">
        {t.calendar.title}
      </p>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div
            key={day.dateStr}
            className={`
              flex flex-col items-center rounded-xl py-2 px-1
              transition-colors duration-150
              ${day.isToday
                ? 'bg-calm-700 text-white shadow-soft'
                : 'text-calm-700 hover:bg-calm-50'
              }
            `}
          >
            {/* Day letter/name */}
            <span className={`text-xs font-semibold ${day.isToday ? 'text-white/80' : 'text-calm-500'}`}>
              {t.calendar.days[day.dayOfWeek]}
            </span>

            {/* Date number */}
            <span className={`text-base font-bold leading-tight ${day.isToday ? 'text-white' : ''}`}>
              {day.dateNum}
            </span>

            {/* Holiday badge */}
            {day.holiday && (
              <span
                className={`
                  text-[9px] leading-tight mt-0.5 text-center font-medium
                  ${day.isToday ? 'text-yellow-200' : 'text-primary-500'}
                `}
              >
                {isRTL ? day.holiday.nameHe : day.holiday.nameEn}
              </span>
            )}

            {/* Today dot */}
            {day.isToday && (
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
