/**
 * DELETE /api/boundaries/[id] — delete a single boundary message by id
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.boundaryMessage.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/boundaries] Error:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
