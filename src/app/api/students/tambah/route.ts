import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { students } from '@/lib/schema';

export async function POST(request: Request) {
  try {
    const { name, targetJuz } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newStudent = await db.insert(students).values({
      name,
      targetJuz: targetJuz ? parseInt(targetJuz) : 30,
    }).returning();

    return NextResponse.json({ 
      message: 'Student added successfully', 
      student: newStudent[0] 
    });
  } catch (error) {
    console.error('Error adding student:', error);
    return NextResponse.json({ error: 'Failed to add student' }, { status: 500 });
  }
}
