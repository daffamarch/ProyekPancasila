import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dailyTargets } from '@/lib/schema';

export async function GET() {
  try {
    const targets = await db.select().from(dailyTargets);
    return NextResponse.json(targets);
  } catch (error) {
    console.error('Error fetching targets:', error);
    return NextResponse.json({ error: 'Failed to fetch targets' }, { status: 500 });
  }
}
