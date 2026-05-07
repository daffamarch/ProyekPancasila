import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: 'ustadz',
    }).returning();

    return NextResponse.json({ 
      message: 'User registered successfully', 
      user: { id: newUser[0].id, name: newUser[0].name, email: newUser[0].email } 
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}
