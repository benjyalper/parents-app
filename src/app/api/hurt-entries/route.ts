/**
 * GET  /api/hurt-entries  — list all entries (newest first)
 * POST /api/hurt-entries  — create a new entry
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { APP_CONFIG } from '@/config/app.config';

export async function GET() {
  try {
    const entries = await prisma.hurtEntry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        writer: true,
        target: true,
      },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error('[GET /api/hurt-entries] Error:', error);
    return NextResponse.json({ error: 'Failed to load entries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, writerId, targetId, reframe } = body;

    // Validate
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    if (!writerId || !targetId) {
      return NextResponse.json({ error: 'writerId and targetId are required' }, { status: 400 });
    }
    if (writerId === targetId) {
      return NextResponse.json({ error: 'Writer and target cannot be the same person' }, { status: 400 });
    }
    if (text.trim().length > APP_CONFIG.maxHurtEntryChars) {
      return NextResponse.json({ error: `Text must be ≤ ${APP_CONFIG.maxHurtEntryChars} characters` }, { status: 400 });
    }

    const entry = await prisma.hurtEntry.create({
      data: {
        text: text.trim(),
        reframe: reframe?.trim() || null,
        writerId,
        targetId,
      },
      include: {
        writer: true,
        target: true,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('[POST /api/hurt-entries] Error:', error);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
