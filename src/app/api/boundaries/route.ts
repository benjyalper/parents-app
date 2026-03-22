/**
 * GET  /api/boundaries  — list all boundary messages (newest first)
 * POST /api/boundaries  — create a new boundary message
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { APP_CONFIG } from '@/config/app.config';

export async function GET() {
  try {
    const messages = await prisma.boundaryMessage.findMany({
      orderBy: { createdAt: 'desc' },
      include: { writer: true },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('[GET /api/boundaries] Error:', error);
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, writerId } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    if (!writerId) {
      return NextResponse.json({ error: 'writerId is required' }, { status: 400 });
    }
    if (text.trim().length > APP_CONFIG.maxBoundaryMessageChars) {
      return NextResponse.json({ error: `Text must be ≤ ${APP_CONFIG.maxBoundaryMessageChars} characters` }, { status: 400 });
    }

    const message = await prisma.boundaryMessage.create({
      data: {
        text: text.trim(),
        writerId,
      },
      include: { writer: true },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('[POST /api/boundaries] Error:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
