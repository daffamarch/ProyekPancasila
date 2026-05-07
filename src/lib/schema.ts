import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  targetJuz: integer('target_juz').default(30),
  disiplinStatus: text('disiplin_status').default('Sangat Baik'),
  murojaahStatus: text('murojaah_status').default('Rajin'),
  keaktifanStatus: text('keaktifan_status').default('Aktif'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const hafalanLogs = pgTable('hafalan_logs', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  juz: integer('juz'),
  surahName: text('surah_name').notNull(),
  startAyat: integer('start_ayat').notNull(),
  endAyat: integer('end_ayat').notNull(),
  quality: text('quality').notNull(), // 'excellent', 'good', 'needs_improvement'
  notes: text('notes'),
  halaqah: text('halaqah'),
  pembimbing: text('pembimbing'),
  tanggal: timestamp('tanggal').defaultNow(),
  nilaiTajwid: integer('nilai_tajwid').default(0),
  nilaiMakhraj: integer('nilai_makhraj').default(0),
  nilaiKelancaran: integer('nilai_kelancaran').default(0),
  predikat: text('predikat'),
  statusLanjut: text('status_lanjut'), // 'Lanjut', 'Mengulang'
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  type: text('type').notNull(), // 'new_setoran', 'inactive_student'
  message: text('message').notNull(),
  isRead: integer('is_read').default(0), // 0: unread, 1: read
  createdAt: timestamp('created_at').defaultNow(),
});

export const dailyTargets = pgTable('daily_targets', {
  id: serial('id').primaryKey(),
  label: text('label').notNull(),
  percentage: integer('percentage').notNull(),
  color: text('color').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  role: text('role').default('ustadz'),
  createdAt: timestamp('created_at').defaultNow(),
});
