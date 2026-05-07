'use client';

import React, { useState, useEffect } from 'react';
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
  BookOpen,
  Search as SearchIcon,
  X,
  Clock,
  History
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';

export default function InputHarian() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [surahs, setSurahs] = useState<any[]>([]);
  const [isSurahsLoading, setIsSurahsLoading] = useState(false);
  const [surahsError, setSurahsError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchSurah, setSearchSurah] = useState('');
  const [showSurahDropdown, setShowSurahDropdown] = useState(false);
  const [selectedSurahData, setSelectedSurahData] = useState<any>(null);
  const [ayatError, setAyatError] = useState('');

  const [formData, setFormData] = useState({
    studentId: '',
    juz: '',
    surahName: '',
    startAyat: '1',
    endAyat: '10',
    quality: 'good',
    notes: '',
    halaqah: '',
    pembimbing: '',
    tanggal: new Date().toISOString().split('T')[0],
    nilaiTajwid: 0,
    nilaiMakhraj: 0,
    nilaiKelancaran: 0,
    predikat: '',
    statusLanjut: ''
  });

  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  // Auto-calculate predikat and status
  useEffect(() => {
    const avg = (Number(formData.nilaiTajwid) + Number(formData.nilaiMakhraj) + Number(formData.nilaiKelancaran)) / 3;
    let pred = '';
    let status = '';

    if (avg >= 9) pred = 'Mumtaz';
    else if (avg >= 8) pred = 'Jayyid Jiddan';
    else if (avg >= 7) pred = 'Jayyid';
    else if (avg >= 6) pred = 'Maqbul';
    else if (avg > 0) pred = 'Mardud';

    status = avg >= 6 ? 'Lanjut' : 'Mengulang';

    setFormData(prev => ({
      ...prev,
      predikat: pred,
      statusLanjut: status
    }));
  }, [formData.nilaiTajwid, formData.nilaiMakhraj, formData.nilaiKelancaran]);

  useEffect(() => {
    // Fetch students
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching students:', err));

    // Fetch surahs from Internal Proxy
    setIsSurahsLoading(true);
    fetch('/api/quran/surahs')
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil data surah');
        return res.json();
      })
      .then(data => {
        setSurahs(Array.isArray(data) ? data : []);
        setIsSurahsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching surahs:', err);
        setSurahsError('Gagal memuat daftar surah. Server tidak dapat menjangkau API Al-Quran.');
        setIsSurahsLoading(false);
      });

    // Fetch recent logs for sidebar
    fetch('/api/hafalan')
      .then(res => res.json())
      .then(data => setRecentLogs(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(err => console.error('Error fetching logs:', err));
  }, []);

  // Validation for ayahs
  useEffect(() => {
    if (selectedSurahData) {
      const end = parseInt(formData.endAyat);
      if (end > selectedSurahData.numberOfAyahs) {
        setAyatError(`Maksimal ${selectedSurahData.numberOfAyahs} ayat untuk surah ${selectedSurahData.name}`);
      } else {
        setAyatError('');
      }
    }
  }, [formData.endAyat, selectedSurahData]);

  const filteredSurahs = surahs.filter(s => 
    s.name.transliteration.id.toLowerCase().includes(searchSurah.toLowerCase()) ||
    s.name.translation.id.toLowerCase().includes(searchSurah.toLowerCase())
  );

  const qualityOptions = [
    { label: 'Sangat Baik', value: 'excellent', icon: Smile, color: '#52A435' },
    { label: 'Baik', value: 'good', icon: Meh, color: '#FF9F43' },
    { label: 'Butuh Perbaikan', value: 'needs_improvement', icon: Frown, color: '#FF6B9D' },
  ];

  // Helper for relative time
  const getTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);

    if (diffInMins < 1) return 'Baru saja';
    if (diffInMins < 60) return `${diffInMins}M LALU`;
    if (diffInHours < 24) return `${diffInHours}J LALU`;
    return past.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Ensure scores are integers and handle empty strings
    const submissionData = {
      ...formData,
      nilaiTajwid: Math.round(Number(formData.nilaiTajwid) || 0),
      nilaiMakhraj: Math.round(Number(formData.nilaiMakhraj) || 0),
      nilaiKelancaran: Math.round(Number(formData.nilaiKelancaran) || 0)
    };

    try {
      const res = await fetch('/api/hafalan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!res.ok) throw new Error('Gagal menyimpan data');
      
      const newLog = await res.json();
      setRecentLogs(prev => [newLog, ...prev.slice(0, 4)]);

      // Full reset
      setFormData({
        studentId: '',
        juz: '',
        surahName: '',
        startAyat: '1',
        endAyat: '10',
        quality: 'good',
        notes: '',
        halaqah: '',
        pembimbing: '',
        tanggal: new Date().toISOString().split('T')[0],
        nilaiTajwid: 0,
        nilaiMakhraj: 0,
        nilaiKelancaran: 0,
        predikat: '',
        statusLanjut: ''
      });
      setSearchSurah('');
      setSelectedSurahData(null);
      alert('Data setoran berhasil disimpan!');
      
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <form className="quran-form glass rounded-lg shadow-soft" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Nama Anak</label>
                <div className="select-wrapper">
                  <select 
                    value={formData.studentId} 
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    required
                  >
                    <option value="">Pilih Nama Anak</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="select-icon" />
                </div>
              </div>

              <div className="input-group">
                <label>Juz <Star size={14} className="req-star" /></label>
                <div className="select-wrapper">
                  <select 
                    value={formData.juz} 
                    onChange={(e) => setFormData({...formData, juz: e.target.value})}
                    required
                  >
                    <option value="">Pilih Juz</option>
                    {[...Array(30)].map((_, i) => (
                      <option key={i+1} value={i+1}>Juz {i+1}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="select-icon" />
                </div>
              </div>

              <div className="input-group searchable-dropdown">
                <label>Nama Surah <Star size={14} className="req-star" /></label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Cari Surah..." 
                    value={searchSurah}
                    onChange={(e) => {
                      setSearchSurah(e.target.value);
                      setShowSurahDropdown(true);
                      if (selectedSurahData) {
                        setSelectedSurahData(null);
                        setFormData({...formData, surahName: ''});
                      }
                    }}
                    onFocus={() => setShowSurahDropdown(true)}
                    required
                  />
                  <SearchIcon size={18} className="input-icon" />
                </div>

                {showSurahDropdown && (isSurahsLoading || surahsError || filteredSurahs.length > 0) && (
                  <div className="dropdown-list glass shadow-soft rounded-lg">
                    {isSurahsLoading && <div className="dropdown-msg">Memuat daftar surah...</div>}
                    {surahsError && <div className="dropdown-msg error">{surahsError}</div>}
                    {!isSurahsLoading && !surahsError && filteredSurahs.length === 0 && <div className="dropdown-msg">Surah tidak ditemukan.</div>}
                    {!isSurahsLoading && !surahsError && filteredSurahs.map((s) => (
                      <div 
                        key={s.number} 
                        className="dropdown-item"
                        onClick={() => {
                          const name = s.name.transliteration.id;
                          setSearchSurah(name);
                          setSelectedSurahData({
                            ...s,
                            name: name,
                            numberOfAyahs: s.numberOfVerses
                          });
                          setFormData({...formData, surahName: name});
                          setShowSurahDropdown(false);
                        }}
                      >
                        <div className="s-info">
                          <span className="s-name">{s.name.transliteration.id}</span>
                          <span className="s-meaning">{s.name.translation.id}</span>
                        </div>
                        <span className="s-ayahs">{s.numberOfVerses} Ayat</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label>Dari Ayat</label>
                <input 
                  type="number" 
                  value={formData.startAyat}
                  onChange={(e) => setFormData({...formData, startAyat: e.target.value})}
                />
              </div>

              <div className="input-group">
                <label>Sampai Ayat</label>
                <input 
                  type="number" 
                  className={ayatError ? 'input-error' : ''}
                  value={formData.endAyat}
                  onChange={(e) => setFormData({...formData, endAyat: e.target.value})}
                />
                {ayatError && <span className="error-msg">{ayatError}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Halaqah</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Abu Bakar"
                  value={formData.halaqah}
                  onChange={(e) => setFormData({...formData, halaqah: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Pembimbing</label>
                <input 
                  type="text" 
                  placeholder="Nama Ustadz"
                  value={formData.pembimbing}
                  onChange={(e) => setFormData({...formData, pembimbing: e.target.value})}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Tanggal Setoran</label>
                <input 
                  type="date" 
                  value={formData.tanggal}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Kualitas Hafalan</label>
                <select 
                  value={formData.quality}
                  onChange={(e) => setFormData({...formData, quality: e.target.value})}
                >
                  {qualityOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="scoring-section">
              <h4>Penilaian (1-10)</h4>
              <div className="scoring-grid">
                <div className="score-item">
                  <label>Tajwid</label>
                  <input 
                    type="number" 
                    min="0" max="10" step="1"
                    placeholder="1-10"
                    value={formData.nilaiTajwid || ''}
                    onChange={(e) => {
                      const val = Math.min(10, Math.max(0, Math.floor(Number(e.target.value))));
                      setFormData({...formData, nilaiTajwid: val});
                    }}
                  />
                </div>
                <div className="score-item">
                  <label>Makhraj</label>
                  <input 
                    type="number" 
                    min="0" max="10" step="1"
                    placeholder="1-10"
                    value={formData.nilaiMakhraj || ''}
                    onChange={(e) => {
                      const val = Math.min(10, Math.max(0, Math.floor(Number(e.target.value))));
                      setFormData({...formData, nilaiMakhraj: val});
                    }}
                  />
                </div>
                <div className="score-item">
                  <label>Kelancaran</label>
                  <input 
                    type="number" 
                    min="0" max="10" step="1"
                    placeholder="1-10"
                    value={formData.nilaiKelancaran || ''}
                    onChange={(e) => {
                      const val = Math.min(10, Math.max(0, Math.floor(Number(e.target.value))));
                      setFormData({...formData, nilaiKelancaran: val});
                    }}
                  />
                </div>
              </div>
              <div className="auto-grade-display">
                <div className="grade-box">
                  <span>Predikat</span>
                  <strong className={formData.predikat === 'Mardud' ? 'text-red' : 'text-green'}>
                    {formData.predikat || '-'}
                  </strong>
                </div>
                <div className="grade-box">
                  <span>Status</span>
                  <strong className={formData.statusLanjut === 'Mengulang' ? 'text-red' : 'text-green'}>
                    {formData.statusLanjut || '-'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Catatan Tambahan (Opsional)</label>
              <textarea 
                placeholder="Contoh: Perbaiki panjang pendek di ayat 5..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              ></textarea>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className={`btn-submit ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Setoran'}
              </button>
            </div>
          </form>

          <div className="recent-inputs-section glass rounded-lg shadow-soft" style={{ marginTop: '2rem', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} /> Input Terakhir
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '0.75rem' }}>Nama</th>
                    <th style={{ padding: '0.75rem' }}>Juz</th>
                    <th style={{ padding: '0.75rem' }}>Surah</th>
                    <th style={{ padding: '0.75rem' }}>Ayat</th>
                    <th style={{ padding: '0.75rem' }}>Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '0.75rem' }}>{log.studentName}</td>
                      <td style={{ padding: '0.75rem' }}>{log.juz}</td>
                      <td style={{ padding: '0.75rem' }}>{log.surahName}</td>
                      <td style={{ padding: '0.75rem' }}>{log.startAyat}-{log.endAyat}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.75rem', color: '#888' }}>
                        {getTimeAgo(log.createdAt)}
                      </td>
                    </tr>
                  ))}
                  {recentLogs.length === 0 && (
                    <tr><td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>Belum ada input hari ini.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="input-sidebar">
          <div className="side-card history-card glass rounded-lg shadow-soft">
            <div className="side-header">
              <h4><ClockIcon /> Riwayat Baru</h4>
            </div>
            <div className="history-list">
              {recentLogs.map((log, i) => (
                <div key={i} className="history-item">
                  <div className="h-avatar">
                    <div className="avatar-initials" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>{getInitials(log.studentName)}</div>
                  </div>
                  <div className="h-info">
                    <strong>{log.studentName}</strong>
                    <span>{log.surahName}: {log.startAyat}–{log.endAyat}</span>
                  </div>
                  <span className="h-time">{getTimeAgo(log.createdAt)}</span>
                </div>
              ))}
              {recentLogs.length === 0 && <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Belum ada riwayat.</p>}
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

      <style jsx>{`
        .searchable-dropdown {
          position: relative;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          right: auto;
          color: #999;
          pointer-events: none;
          display: flex;
          align-items: center;
          z-index: 5;
        }
        .input-wrapper input {
          padding-left: 2.8rem !important;
          padding-right: 1rem !important;
          width: 100%;
        }
        .btn-submit {
          width: 100%;
          padding: 1rem;
          background: var(--primary-green);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(82, 164, 53, 0.2);
        }
        .btn-submit:hover {
          background: #458d2d;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(82, 164, 53, 0.3);
        }
        .btn-submit:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .btn-submit.loading {
          opacity: 0.8;
          pointer-events: none;
        }
        .dropdown-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 100;
          max-height: 250px;
          overflow-y: auto;
          margin-top: 0.5rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }
        .dropdown-item {
          padding: 0.8rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .dropdown-item:hover {
          background: var(--primary-green-light);
        }
        .dropdown-msg {
          padding: 1rem;
          text-align: center;
          font-size: 0.85rem;
          color: #666;
        }
        .dropdown-msg.error {
          color: #FF6B9D;
          font-weight: 600;
        }
        .scoring-section {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f8faf8;
          border-radius: 16px;
          border: 1px dashed #52A43540;
        }
        .scoring-section h4 {
          margin-bottom: 1rem;
          color: var(--primary-navy);
          font-size: 1rem;
        }
        .scoring-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .recent-inputs-section {
          margin-top: 3rem;
          padding: 2rem;
          background: white;
        }
        .recent-inputs-section h3 {
          margin-bottom: 1.5rem;
          color: var(--primary-navy);
          font-weight: 700;
        }
        .recent-table {
          width: 100%;
          border-collapse: collapse;
        }
        .recent-table th {
          text-align: left;
          padding: 1rem;
          background: #f8faf8;
          font-size: 0.85rem;
          color: #666;
        }
        .recent-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          font-size: 0.9rem;
          color: var(--primary-navy);
        }
        .badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .badge.mumtaz { background: #EEF5EB; color: var(--primary-green); }
        .badge.jayyid { background: #E9F2FE; color: #3498db; }
        .badge.mardud { background: #FEF2F2; color: #e74c3c; }
        .score-item label {
          display: block;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
          color: #666;
        }
        .score-item input {
          width: 100%;
          padding: 0.8rem;
          border-radius: 10px;
          border: 1px solid #ddd;
          text-align: center;
          font-weight: bold;
          font-size: 1.1rem;
        }
        .auto-grade-display {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .grade-box {
          background: white;
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .grade-box span {
          display: block;
          font-size: 0.75rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.3rem;
        }
        .grade-box strong {
          font-size: 1.1rem;
        }
        .text-red { color: #e74c3c; }
        .text-green { color: var(--primary-green); }
        .s-info {
          display: flex;
          flex-direction: column;
        }
        .s-name {
          font-weight: 600;
          color: var(--primary-navy);
        }
        .s-meaning {
          font-size: 0.75rem;
          color: #666;
        }
        .s-ayahs {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary-green);
          background: var(--primary-green-light);
          padding: 0.2rem 0.5rem;
          border-radius: 20px;
        }
        .input-error {
          border-color: #FF6B9D !important;
          background-color: rgba(255, 107, 157, 0.05) !important;
        }
        .error-msg {
          color: #FF6B9D;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          display: block;
        }
      `}</style>
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
