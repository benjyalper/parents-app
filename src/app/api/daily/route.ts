/**
 * GET /api/daily
 * Returns the saying of the day and image of the day,
 * both deterministically selected based on today's date.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pickForDay, todayDateString } from '@/lib/daily-selector';

export async function GET() {
  try {
    const today = todayDateString();

    const [sayings, images] = await Promise.all([
      prisma.saying.findMany({ where: { active: true } }),
      prisma.dailyImage.findMany({ where: { active: true } }),
    ]);

    const saying = pickForDay(sayings, today);
    const image  = pickForDay(images,  today);

    return NextResponse.json({ saying, image, date: today });
  } catch (error) {
    console.error('[/api/daily] Error:', error);
    return NextResponse.json({ error: 'Failed to load daily content' }, { status: 500 });
  }
}
