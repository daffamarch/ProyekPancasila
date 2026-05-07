import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications, hafalanLogs, students } from '@/lib/schema';
import { desc, eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // 1. Check for students with no setoran for more than 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const allStudents = await db.select().from(students);
    
    for (const student of allStudents) {
      const lastLog = await db.select()
        .from(hafalanLogs)
        .where(eq(hafalanLogs.studentId, student.id))
        .orderBy(desc(hafalanLogs.createdAt))
        .limit(1);

      if (!lastLog[0] || new Date(lastLog[0].createdAt || 0) < threeDaysAgo) {
        // Check if notification already exists for today to avoid spam
        const existingNotif = await db.select()
          .from(notifications)
          .where(sql`${notifications.message} LIKE ${'%' + student.name + '%'} AND ${notifications.createdAt} > CURRENT_DATE`)
          .limit(1);

        if (existingNotif.length === 0) {
          await db.insert(notifications).values({
            type: 'inactive_student',
            message: `Santri ${student.name} sudah 3 hari belum menambah hafalan baru.`,
            isRead: 0,
          });
        }
      }
    }

    // 2. Fetch all notifications
    const notifs = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(20);
    return NextResponse.json(notifs);
  } catch (error) {
    console.error('Error in notifications API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await db.delete(notifications);
    return NextResponse.json({ message: 'All notifications cleared' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear notifications' }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    await db.update(notifications).set({ isRead: 1 });
    return NextResponse.json({ message: 'All notifications marked as read' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
