import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hafalanLogs, students, notifications } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    let query = db.select({
      id: hafalanLogs.id,
      studentId: hafalanLogs.studentId,
      juz: hafalanLogs.juz,
      surahName: hafalanLogs.surahName,
      startAyat: hafalanLogs.startAyat,
      endAyat: hafalanLogs.endAyat,
      quality: hafalanLogs.quality,
      notes: hafalanLogs.notes,
      halaqah: hafalanLogs.halaqah,
      pembimbing: hafalanLogs.pembimbing,
      tanggal: hafalanLogs.tanggal,
      nilaiTajwid: hafalanLogs.nilaiTajwid,
      nilaiMakhraj: hafalanLogs.nilaiMakhraj,
      nilaiKelancaran: hafalanLogs.nilaiKelancaran,
      predikat: hafalanLogs.predikat,
      statusLanjut: hafalanLogs.statusLanjut,
      createdAt: hafalanLogs.createdAt,
      studentName: students.name,
      studentAvatar: students.avatarUrl,
    })
    .from(hafalanLogs)
    .leftJoin(students, eq(hafalanLogs.studentId, students.id));

    if (studentId) {
      query = query.where(eq(hafalanLogs.studentId, parseInt(studentId))) as any;
    }

    const logs = await query.orderBy(desc(hafalanLogs.createdAt)).limit(10);

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching hafalan logs:', error);
    return NextResponse.json({ error: 'Failed to fetch hafalan logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      studentId, juz, surahName, startAyat, endAyat, quality, notes,
      halaqah, pembimbing, tanggal, nilaiTajwid, nilaiMakhraj, nilaiKelancaran,
      predikat, statusLanjut
    } = body;

    if (!studentId || !surahName || !startAyat || !endAyat) {
      console.error('Validation failed:', { studentId, surahName, startAyat, endAyat });
      return NextResponse.json({ error: 'Mohon lengkapi semua data wajib' }, { status: 400 });
    }

    const newLog = await db.insert(hafalanLogs).values({
      studentId: parseInt(studentId) || 0,
      juz: parseInt(juz) || 0,
      surahName: surahName || 'Unknown',
      startAyat: parseInt(startAyat) || 1,
      endAyat: parseInt(endAyat) || 1,
      quality: quality || 'good',
      notes: notes || '',
      halaqah: halaqah || '',
      pembimbing: pembimbing || '',
      tanggal: tanggal ? new Date(tanggal) : new Date(),
      nilaiTajwid: parseInt(nilaiTajwid) || 0,
      nilaiMakhraj: parseInt(nilaiMakhraj) || 0,
      nilaiKelancaran: parseInt(nilaiKelancaran) || 0,
      predikat: predikat || '',
      statusLanjut: statusLanjut || '',
    }).returning();

    // Create notification
    try {
      const studentData = await db.select().from(students).where(eq(students.id, parseInt(studentId))).limit(1);
      const studentName = studentData[0]?.name || 'Santri';
      
      await db.insert(notifications).values({
        type: 'new_setoran',
        message: `Baru saja menambahkan hafalan surat ${surahName} untuk ${studentName}`,
        isRead: 0,
      });
    } catch (notifErr) {
      console.error('Failed to create notification:', notifErr);
    }

    return NextResponse.json(newLog[0]);
  } catch (error) {
    console.error('Error creating hafalan log:', error);
    return NextResponse.json({ error: 'Failed to create hafalan log' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await db.delete(hafalanLogs).where(eq(hafalanLogs.id, parseInt(id)));
    return NextResponse.json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    console.error('Delete Hafalan Error:', error);
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 });
  }
}
