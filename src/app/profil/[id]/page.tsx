'use client';

import React, { useState, useEffect, use } from 'react';
import { 
  Award, 
  ChevronLeft, 
  ShieldCheck, 
  Star, 
  Clock, 
  Calendar,
  BookOpen,
  FileText,
  Trash2,
  Edit2,
  Share2,
  Download,
  Heart,
  Zap,
  Target,
  Eye
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';

export default function ProfilDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [student, setStudent] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [surahs, setSurahs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [editFormData, setEditFormData] = useState({
    disiplinStatus: '',
    murojaahStatus: '',
    keaktifanStatus: ''
  });
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!user) {
      router.replace('/login');
      return;
    }
    setIsAuthorized(true);

    const fetchData = async () => {
      try {
        const [studentRes, logsRes, surahsRes] = await Promise.all([
          fetch(`/api/students/${id}`),
          fetch(`/api/hafalan?studentId=${id}`),
          fetch('/api/quran/surahs')
        ]);
        const studentData = await studentRes.json();
        const logsData = await logsRes.json();
        const surahsData = await surahsRes.json();
        
        setStudent(studentData);
        setLogs(Array.isArray(logsData) ? logsData : []);
        setSurahs(Array.isArray(surahsData) ? surahsData : []);
        setEditFormData({
          disiplinStatus: studentData.disiplinStatus || 'Sangat Baik',
          murojaahStatus: studentData.murojaahStatus || 'Rajin',
          keaktifanStatus: studentData.keaktifanStatus || 'Aktif'
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const [isSavingStats, setIsSavingStats] = useState(false);

  const handleUpdateStats = async () => {
    setIsSavingStats(true);
    console.log('Starting update for student:', id, editFormData);
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      console.log('Update response:', data);
      if (res.ok) {
        setStudent({ ...student, ...editFormData });
        setIsEditingStats(false);
        alert('Statistik berhasil diperbarui!');
      } else {
        alert('Gagal: ' + (data.error || 'Terjadi kesalahan'));
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Gagal memperbarui statistik');
    } finally {
      setIsSavingStats(false);
    }
  };

  const calculateMonthlyPredikat = () => {
    if (logs.length === 0) return 'Belum Ada';
    const totalScore = logs.reduce((acc, log) => {
      const tajwid = Number(log.nilaiTajwid) || 0;
      const makhraj = Number(log.nilaiMakhraj) || 0;
      const kelancaran = Number(log.nilaiKelancaran) || 0;
      return acc + (tajwid + makhraj + kelancaran) / 3;
    }, 0);
    const avg = totalScore / logs.length;
    if (avg >= 9) return 'Mumtaz';
    if (avg >= 8) return 'Jayyid Jiddan';
    if (avg >= 7) return 'Jayyid';
    if (avg >= 6) return 'Maqbul';
    return 'Mardud';
  };

  const currentPredikat = calculateMonthlyPredikat();

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader-mini" style={{ width: '40px', height: '40px', color: 'var(--primary-green)' }}></div>
      </div>
    );
  }

  if (isLoading) return <div className="profile-page"><p>Memuat profil...</p></div>;
  if (!student) return <div className="profile-page"><p>Santri tidak ditemukan.</p></div>;

  return (
    <div className="profile-page">
      <Link href="/profil" className="back-btn glass shadow-soft">
        <ChevronLeft size={20} />
        <span>Kembali ke Daftar</span>
      </Link>

      <section className="profile-header glass shadow-soft rounded-lg">
        <div className="h-left">
          <div className="p-avatar-box">
            <div className="avatar-initials" style={{ width: '120px', height: '120px', fontSize: '3rem' }}>{getInitials(student.name)}</div>
            <div className="p-badge"><ShieldCheck size={20} /></div>
          </div>
          <div className="p-info">
            <h1>{student.name}</h1>
            <p>ID: RA-2024-00{student.id} • Santri Tahfidz</p>
            <div className="p-tags">
              <span className="tag">Santri Aktif</span>
              <span className="tag orange">Target Juz {student.targetJuz}</span>
            </div>
          </div>
        </div>
        <div className="h-right">
          <div className="p-rank">
            <Star fill="#FF9F43" color="#FF9F43" size={24} />
            <div className="rank-text">
              <strong>{currentPredikat}</strong>
              <span>Predikat Rata-rata</span>
            </div>
          </div>
        </div>
      </section>

      <div className="profile-grid">
        <section className="juz-tracker glass rounded-lg shadow-soft">
          <div className="section-header">
            <h3><BookOpen size={20} /> Hafalan Terakhir</h3>
          </div>
          
          <div className="last-memorization-card">
            {logs.length > 0 ? (
              <div className="lm-content">
                <div className="lm-main">
                  <div className="lm-icon">
                    <Zap size={32} color="#FF9F43" />
                  </div>
                  <div className="lm-info">
                    <span className="lm-label">Surah</span>
                    <h2 className="lm-surah">{logs[0].surahName}</h2>
                    <p className="lm-ayah">Juz {logs[0].juz} • Ayat {logs[0].startAyat}–{logs[0].endAyat}</p>
                  </div>
                </div>
                <div className="lm-footer">
                  <div className="lm-stat">
                    <span>Predikat</span>
                    <strong>{logs[0].predikat || 'Maqbul'}</strong>
                  </div>
                  <div className="lm-stat">
                    <span>Tanggal</span>
                    <strong>{new Date(logs[0].createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lm-empty">
                <p>Belum ada riwayat hafalan.</p>
              </div>
            )}
          </div>
        </section>

        <div className="right-col">
          <section className="discipline-card glass rounded-lg shadow-soft">
            <div className="section-header">
              <h3><Award size={20} /> Statistik Cepat</h3>
              {!isEditingStats && (
                <button 
                  className="edit-stats-btn" 
                  onClick={() => setIsEditingStats(true)}
                  title="Edit Statistik"
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>

            {isEditingStats && (
              <div className="edit-actions-bar">
                <button 
                  type="button"
                  className="save-btn-new" 
                  disabled={isSavingStats}
                  onClick={() => {
                    console.log('Save clicked');
                    handleUpdateStats();
                  }}
                >
                  {isSavingStats ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button 
                  type="button"
                  className="cancel-btn-new" 
                  onClick={() => setIsEditingStats(false)}
                >
                  Batal
                </button>
              </div>
            )}
            <div className="ring-viz">
              <div className="ring-outer">
                <div className="ring-fill" style={{ '--percent': 100 } as any}></div>
                <div className="ring-inner">
                  <span className="ring-val">{logs.length}</span>
                  <span className="ring-label">Hafalan</span>
                </div>
              </div>
              <div className="ring-legend">
                {isEditingStats ? (
                  <div className="edit-stats-form">
                    <div className="edit-field">
                      <Heart size={14} color="#FF6B9D" />
                      <select 
                        value={editFormData.disiplinStatus}
                        onChange={(e) => setEditFormData({ ...editFormData, disiplinStatus: e.target.value })}
                      >
                        <option value="Sangat Baik">Sangat Baik</option>
                        <option value="Baik">Baik</option>
                        <option value="Cukup">Cukup</option>
                        <option value="Perlu Bimbingan">Perlu Bimbingan</option>
                      </select>
                    </div>
                    <div className="edit-field">
                      <Clock size={14} color="#1A2B4B" />
                      <select 
                        value={editFormData.murojaahStatus}
                        onChange={(e) => setEditFormData({ ...editFormData, murojaahStatus: e.target.value })}
                      >
                        <option value="Rajin">Rajin</option>
                        <option value="Sering">Sering</option>
                        <option value="Jarang">Jarang</option>
                      </select>
                    </div>
                    <div className="edit-field">
                      <Zap size={14} color="#FF9F43" />
                      <select 
                        value={editFormData.keaktifanStatus}
                        onChange={(e) => setEditFormData({ ...editFormData, keaktifanStatus: e.target.value })}
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Sangat Aktif">Sangat Aktif</option>
                        <option value="Cukup Aktif">Cukup Aktif</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="leg-item"><Heart size={14} color="#FF6B9D" /> Disiplin {student.disiplinStatus || 'Sangat Baik'}</div>
                    <div className="leg-item"><Clock size={14} color="#1A2B4B" /> Murojaah {student.murojaahStatus || 'Rajin'}</div>
                    <div className="leg-item"><Zap size={14} color="#FF9F43" /> {student.keaktifanStatus || 'Aktif'} di Kelas</div>
                  </>
                )}
              </div>
            </div>
          </section>

          <section className="character-card glass rounded-lg shadow-soft">
            <div className="section-header">
              <h3><Target size={20} /> Riwayat Hafalan</h3>
              <Calendar size={18} color="#BDBDBD" />
            </div>
            <div className="timeline">
              {logs.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="t-date">{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                  <div className="t-content">
                    <strong>{item.surahName}</strong>
                    <div className="activity-actions">
                      <button className="act-btn view"><Eye size={16} /></button>
                    </div>
                    <p>Ayat {item.startAyat}–{item.endAyat}</p>
                    <span className={`t-status ${item.predikat === 'Mardud' ? 'ulang' : 'lancar'}`}>
                      {item.predikat || (item.quality === 'excellent' ? 'Lancar' : 'Cukup')}
                    </span>
                  </div>
                </div>
              ))}
              {logs.length === 0 && <p>Belum ada riwayat hafalan.</p>}
            </div>
          </section>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn-action primary" onClick={() => window.print()}>
          <Download size={20} />
          <span>Unduh PDF Profil Lengkap</span>
        </button>
      </div>

      <style jsx>{`
        .last-memorization-card {
          padding: 1.5rem;
          background: #F4F9F1;
          border-radius: 20px;
          border: 1px solid #E8F1E5;
        }
        .lm-main {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px dashed #D1D9D0;
        }
        .lm-icon {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0,0,0,0.03);
        }
        .lm-info {
          flex: 1;
        }
        .lm-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary-green);
          text-transform: uppercase;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 0.25rem;
        }
        .lm-surah {
          font-size: 1.5rem;
          color: var(--primary-navy);
          font-weight: 800;
          margin: 0;
        }
        .lm-ayah {
          font-size: 0.9rem;
          color: #666;
          margin: 0.25rem 0 0 0;
        }
        .lm-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .lm-stat {
          display: flex;
          flex-direction: column;
        }
        .lm-stat span {
          font-size: 0.7rem;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 0.2rem;
        }
        .lm-stat strong {
          font-size: 0.9rem;
          color: var(--primary-navy);
        }
        .lm-empty {
          text-align: center;
          padding: 2rem;
          color: #999;
        }
        .edit-stats-btn {
          background: #F4F9F1;
          color: var(--primary-green);
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .edit-stats-btn:hover {
          background: var(--primary-green);
          color: white;
          transform: rotate(15deg);
        }
        .edit-actions-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          padding: 10px;
          background: rgba(82, 164, 53, 0.05);
          border-radius: 12px;
          border: 1px dashed var(--primary-green);
        }
        .save-btn-new {
          flex: 2;
          background: var(--primary-green);
          color: white;
          border: none;
          padding: 10px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(82, 164, 53, 0.2);
        }
        .cancel-btn-new {
          flex: 1;
          background: white;
          color: #666;
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
        }
        .edit-stats-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }
        .edit-field {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8faf7;
          padding: 6px 12px;
          border-radius: 10px;
          border: 1px solid #eef2ed;
        }
        .edit-field select {
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 600;
          color: var(--primary-navy);
          width: 100%;
          outline: none;
          cursor: pointer;
        }
        .btn-murottal {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          border: 1.5px solid var(--primary-green);
          background: white;
          color: var(--primary-green);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-right: 1rem;
        }
        .btn-murottal:hover {
          background: var(--primary-green-light);
        }
        .btn-murottal.playing {
          background: var(--primary-green);
          color: white;
        }
        .loader-mini {
          width: 18px;
          height: 18px;
          border: 2px solid currentColor;
          border-bottom-color: transparent;
          border-radius: 50%;
          display: inline-block;
          animation: rotation 1s linear infinite;
        }
        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
