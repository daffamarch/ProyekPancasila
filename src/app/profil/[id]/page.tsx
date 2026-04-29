'use client';

import React from 'react';
import { 
  Award, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Download, 
  Share2, 
  ShieldCheck, 
  Star,
  ChevronLeft,
  Calendar,
  Heart,
  Zap,
  Target
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilDetail({ params }: { params: { id: string } }) {
  // Use id for fetching, but here we'll use a static placeholder
  const student = {
    name: 'Ahmad Al-Fatih',
    id: params.id,
    avatar: 'https://i.pravatar.cc/150?u=aisya',
    class: 'Kelas 4 Madani',
    juz: 4,
    surah: 'An-Nisa',
    discipline: 92,
    character: 88,
    achievements: ['Khatam Juz 30', 'Santri Teladan Sep 2023'],
    timeline: [
      { date: '24 Okt', type: 'Tahfidz', content: 'Lancar hafalan An-Nisa: 1-10', status: 'Sangat Baik' },
      { date: '22 Okt', type: 'Adab', content: 'Sangat rajin membantu kebersihan panti', status: 'Pujian' },
    ]
  };

  return (
    <div className="profile-page">
      <Link href="/profil" className="back-btn glass shadow-soft">
        <ChevronLeft size={20} />
        <span>Kembali ke Daftar</span>
      </Link>

      <section className="profile-header glass shadow-soft rounded-lg">
        <div className="h-left">
          <div className="p-avatar-box">
            <Image src={student.avatar} alt={student.name} width={120} height={120} />
            <div className="p-badge"><ShieldCheck size={20} /></div>
          </div>
          <div className="p-info">
            <h1>{student.name}</h1>
            <p>ID: {student.id.toUpperCase()} • {student.class}</p>
            <div className="p-tags">
              <span className="tag">Santri Aktif</span>
              <span className="tag orange">Tahfidz Intensif</span>
            </div>
          </div>
        </div>
        <div className="h-right">
          <div className="p-rank">
            <Star fill="#FF9F43" color="#FF9F43" size={24} />
            <div className="rank-text">
              <strong>Sangat Baik</strong>
              <span>Predikat Bulan Ini</span>
            </div>
          </div>
        </div>
      </section>

      <div className="profile-grid">
        <section className="juz-tracker glass rounded-lg shadow-soft">
          <div className="section-header">
            <h3><BookOpen size={20} /> Progres Tahfidz</h3>
            <span>Target: Juz 30-26</span>
          </div>
          
          <div className="juz-path">
            {[30, 29, 28, 27, 26].map((j, i) => (
              <div key={j} className={`juz-node ${i < 3 ? 'completed' : i === 3 ? 'active' : ''}`}>
                <div className="node-circle">
                  {i < 3 ? <CheckIcon /> : j}
                </div>
                <div className="node-info">
                  <span className="n-label">Juz {j}</span>
                  <span className="n-status">{i < 3 ? 'SELESAI' : i === 3 ? 'SEDANG JALAN' : 'BELUM'}</span>
                </div>
                {i < 4 && <div className="node-line"></div>}
              </div>
            ))}
          </div>

          <div className="current-materi rounded-lg">
            <div className="cm-left">
              <span>Hafalan Terakhir</span>
              <strong>Surah {student.surah}</strong>
            </div>
            <div className="cm-right">
              <Zap size={24} color="#FF9F43" />
            </div>
          </div>
        </section>

        <div className="right-col">
          <section className="discipline-card glass rounded-lg shadow-soft">
            <div className="section-header">
              <h3><Award size={20} /> Skor Disiplin</h3>
            </div>
            <div className="ring-viz">
              <div className="ring-outer">
                <div className="ring-fill" style={{ '--percent': 92 } as any}></div>
                <div className="ring-inner">
                  <span className="ring-val">92%</span>
                  <span className="ring-label">Disiplin</span>
                </div>
              </div>
              <div className="ring-legend">
                <div className="leg-item"><Heart size={14} color="#FF6B9D" /> Shalat 5 Waktu</div>
                <div className="leg-item"><Clock size={14} color="#1A2B4B" /> Tepat Waktu</div>
                <div className="leg-item"><Zap size={14} color="#FF9F43" /> Kebersihan</div>
              </div>
            </div>
          </section>

          <section className="character-card glass rounded-lg shadow-soft">
            <div className="section-header">
              <h3><Target size={20} /> Catatan Akhlak</h3>
              <Calendar size={18} color="#BDBDBD" />
            </div>
            <div className="timeline">
              {student.timeline.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="t-date">{item.date}</div>
                  <div className="t-content">
                    <strong>{item.type}</strong>
                    <p>{item.content}</p>
                    <span className="t-status">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn-action primary">
          <Download size={20} />
          <span>Unduh PDF Profil Lengkap</span>
        </button>
        <button className="btn-action secondary">
          <Share2 size={20} />
          <span>Bagikan ke Wali Murid</span>
        </button>
      </div>

    </div>
  );
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
