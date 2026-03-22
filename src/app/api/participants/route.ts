/**
 * GET /api/participants
 * Returns all participants.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { label: 'asc' },
    });
    return NextResponse.json(participants);
  } catch (error) {
    console.error('[/api/participants] Error:', error);
    return NextResponse.json({ error: 'Failed to load participants' }, { status: 500 });
  }
}
