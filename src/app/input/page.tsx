'use client';

import React, { useState } from 'react';
import { 
  Smile, 
  Meh, 
  Frown, 
  Save, 
  Book,
  User,
  Hash,
  Star,
  Quote,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import Image from 'next/image';

export default function InputHarian() {
  const [formData, setFormData] = useState({
    name: '',
    surah: '',
    startAyat: '1',
    endAyat: '10',
    quality: 'good',
    notes: ''
  });

  const qualityOptions = [
    { label: 'Sangat Baik', value: 'excellent', icon: Smile, color: '#52A435' },
    { label: 'Baik', value: 'good', icon: Meh, color: '#FF9F43' },
    { label: 'Butuh Perbaikan', value: 'needs_improvement', icon: Frown, color: '#FF6B9D' },
  ];

  return (
    <div className="input-page">
      <header className="input-header">
        <div className="header-titles">
          <h1>Input Harian</h1>
          <span className="divider">|</span>
          <span className="subtitle">Quran Monitoring</span>
        </div>
      </header>

      <div className="content-grid">
        <div className="main-form-section">
          <div className="section-intro">
            <h3>Catatan Tilawah</h3>
            <p>Pantau kemajuan bacaan Al-Quran harian santri.</p>
            <BookOpen className="bg-icon" size={48} strokeWidth={1} />
          </div>

          <form className="quran-form glass rounded-lg shadow-soft">
            <div className="form-grid">
              <div className="input-group">
                <label>Nama Anak</label>
                <div className="select-wrapper">
                  <select>
                    <option>Pilih Nama Anak</option>
                    <option>Ahmad Zaki</option>
                    <option>Naura Syifa</option>
                  </select>
                  <ChevronDown size={18} className="select-icon" />
                </div>
              </div>

              <div className="input-group">
                <label>Nama Surah <Star size={14} className="req-star" /></label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Contoh: Al-Baqarah" />
                  <BookOpen size={18} className="input-icon" />
                </div>
              </div>

              <div className="input-group">
                <label>Dari Ayat</label>
                <input type="text" defaultValue="1" />
              </div>

              <div className="input-group">
                <label>Sampai Ayat</label>
                <input type="text" defaultValue="10" />
              </div>
            </div>

            <div className="quality-section">
              <label>Kualitas Bacaan</label>
              <div className="quality-grid">
                {qualityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`quality-card ${formData.quality === opt.value ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, quality: opt.value})}
                    style={{ '--brand-color': opt.color } as any}
                  >
                    <div className="icon-circle">
                      <opt.icon size={32} />
                    </div>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="notes-section">
              <label>Catatan Tajwid & Motivasi (Opsional)</label>
              <textarea placeholder="Tuliskan catatan khusus atau kata-kata penyemangat untuk anak..."></textarea>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel">Batal</button>
              <button type="submit" className="btn-save">
                <Save size={18} />
                <span>Simpan Catatan</span>
              </button>
            </div>
          </form>
        </div>

        <aside className="input-sidebar">
          <div className="side-card target-card glass rounded-lg shadow-soft">
            <div className="side-header">
              <h4>Target Pekan Ini</h4>
              <TrendingUpIcon />
            </div>
            <div className="progress-info">
              <span>Khatam Juz 30</span>
              <span className="percent">85%</span>
            </div>
            <div className="bar-container">
              <div className="bar-fill" style={{ width: '85%' }}></div>
            </div>
            <p className="footer-text">Kurang 3 Surah lagi untuk mencapai target bulanan!</p>
            <CloudIcon className="decor-icon" />
          </div>

          <div className="side-card history-card glass rounded-lg shadow-soft">
            <div className="side-header">
              <h4><ClockIcon /> Input Terakhir</h4>
            </div>
            <div className="history-list">
              <div className="history-item">
                <div className="h-avatar">
                  <Image src="https://i.pravatar.cc/150?u=zaki" alt="Zaki" width={40} height={40} />
                </div>
                <div className="h-info">
                  <strong>Ahmad Zaki</strong>
                  <span>An-Naba: 1–15</span>
                </div>
                <span className="h-time">TADI</span>
              </div>
              <div className="history-item">
                <div className="h-avatar">
                  <Image src="https://i.pravatar.cc/150?u=naura" alt="Naura" width={40} height={40} />
                </div>
                <div className="h-info">
                  <strong>Naura Syifa</strong>
                  <span>Al-Mulk: 1–10</span>
                </div>
                <span className="h-time">1J LALU</span>
              </div>
            </div>
          </div>

          <div className="side-card quote-card rounded-lg shadow-soft">
            <Quote size={32} className="quote-icon" />
            <p className="quote-text">
              "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya."
            </p>
            <span className="quote-author">HR. BUKHARI</span>
            <div className="quote-decor">MOTIVATION WORK</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Inline helper icons to match reference exactly
const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-green)' }}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const CloudIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.5-2-4.5-4.5-4.5H17c-1-3.5-4-6-7.5-6-4.5 0-8 3.5-8 8 0 .5 0 1 .1 1.5-2 .5-3.6 2-3.6 4 0 2.5 2 4.5 4.5 4.5h12.5z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
