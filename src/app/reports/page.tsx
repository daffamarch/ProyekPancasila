'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  ChevronRight,
  Filter,
  Users,
  CheckCircle,
  Eye,
  Search,
  Bell,
  User as UserIcon,
  Star
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';

export default function Reports() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [surahs, setSurahs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useLayoutEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userStr) {
      router.replace('/login');
      return;
    }
    setUserData(JSON.parse(userStr));
    setIsAuthorized(true);
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) return;

    const fetchData = async () => {
      try {
        const [logsRes, studentsRes, surahsRes, notifsRes] = await Promise.all([
          fetch('/api/hafalan'),
          fetch('/api/students'),
          fetch('/api/quran/surahs'),
          fetch('/api/notifications')
        ]);
        const logsData = await logsRes.json();
        const studentsData = await studentsRes.json();
        const surahsData = await surahsRes.json();
        const notifsData = await notifsRes.json();
        
        setLogs(Array.isArray(logsData) ? logsData : []);
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setSurahs(Array.isArray(surahsData) ? surahsData : []);
        setNotifs(Array.isArray(notifsData) ? notifsData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthorized]);

  const toggleNotifs = async () => {
    const newState = !showNotifs;
    setShowNotifs(newState);
    if (newState && notifs.some(n => !n.isRead)) {
      try {
        await fetch('/api/notifications', { method: 'PATCH' });
        setNotifs(notifs.map(n => ({ ...n, isRead: 1 })));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const clearAllNotifs = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus semua notifikasi?')) {
      try {
        await fetch('/api/notifications', { method: 'DELETE' });
        setNotifs([]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const totalAyat = logs.reduce((acc, curr) => acc + (curr.endAyat - curr.startAyat + 1), 0);
  const excellentCount = logs.filter(l => l.quality === 'excellent' || l.predikat === 'Lancar').length;

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader-mini" style={{ width: '40px', height: '40px', color: 'var(--primary-green)' }}></div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <header className="reports-header glass shadow-soft">
        <div className="h-left">
          <Link href="/" className="h-back" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
            <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
            <span className="h-title">Laporan Berkala</span>
          </Link>
        </div>
        <div className="h-right">
          <div className="notif-wrapper">
            <button className="notif-btn" onClick={toggleNotifs}>
              <Bell size={20} />
              {notifs.filter(n => !n.isRead).length > 0 && (
                <span className="notif-badge">{notifs.filter(n => !n.isRead).length}</span>
              )}
            </button>
            {showNotifs && (
              <div className="notif-dropdown glass shadow-soft show">
                <div className="notif-header">
                  <h4>Notifikasi</h4>
                  <button onClick={clearAllNotifs} className="clear-notif">Hapus Semua</button>
                </div>
                <div className="notif-list scroll-custom">
                  {notifs.length === 0 ? (
                    <p className="no-notif">Tidak ada notifikasi baru</p>
                  ) : (
                    notifs.map((n, idx) => (
                      <div key={idx} className={`notif-item ${n.isRead ? 'read' : 'unread'}`}>
                        <p>{n.message}</p>
                        <span>{new Date(n.createdAt).toLocaleString('id-ID')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="u-box glass">
            <div className="u-avatar">
              <div className="avatar-initials" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>{getInitials(userData?.name || 'Ustadz')}</div>
            </div>
            <span className="u-name">{userData?.name || 'Ustadz'}</span>
          </div>
        </div>
      </header>

      <section className="intro-section">
        <h3>Pusat Laporan & Akuntabilitas</h3>
        <p>Unduh laporan otomatis progres hafalan dan pembentukan karakter santri dalam format PDF siap cetak.</p>
      </section>

      <div className="top-grid">
        <section className="summary-card glass rounded-lg shadow-soft">
          <div className="card-top">
            <div className="ct-left">
              <h4>Statistik Hafalan Keseluruhan</h4>
              <span>Update terakhir: {new Date().toLocaleDateString('id-ID')}</span>
            </div>
          </div>

          <div className="stats-circles">
            <div className="s-item">
              <div className="s-box">{totalAyat}</div>
              <span>TOTAL AYAT</span>
            </div>
            <div className="s-item">
              <div className="s-box blue">{students.length}</div>
              <span>TOTAL SANTRI</span>
            </div>
            <div className="s-item">
              <div className="s-box orange">{excellentCount}</div>
              <span>HAFALAN LANCAR</span>
            </div>
          </div>

          <div className="progress-footer">
            <div className="p-bar"><div className="p-fill" style={{ width: '100%' }}></div></div>
            <p>Sistem Pemantauan Aktif: <strong>100% Terkoneksi ke Database</strong></p>
          </div>
          
          <SunIcon className="decor-sun" />
        </section>

        <section className="featured-report rounded-lg shadow-soft">
          <div className="feat-content">
            <span className="feat-badge">BARU</span>
            <h3>Data Hafalan Real-time</h3>
            <p>Database sekarang terhubung langsung ke dashboard monitoring santri.</p>
            <button className="btn-feat"><CheckCircle size={18} /> Sistem Aktif</button>
          </div>
          <div className="feat-bg">
            <FileText size={120} strokeWidth={1} />
          </div>
        </section>
      </div>

      <section className="list-section">
        <div className="list-header">
          <h3>Log Aktivitas Terakhir</h3>
        </div>

        <div className="report-items">
          {isLoading ? (
            <p>Memuat data...</p>
          ) : logs.length === 0 ? (
            <p>Belum ada data aktivitas.</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="report-row glass rounded-lg shadow-soft">
                <div className="row-icon"><Calendar size={24} /></div>
                <div className="row-info">
                  <h4>{log.studentName}</h4>
                  <p>{log.surahName}: {log.startAyat}–{log.endAyat} • {new Date(log.createdAt).toLocaleString('id-ID')}</p>
                </div>
                <div className="row-meta">
                  <span className={`t-status ${log.predikat === 'Mardud' || log.quality === 'needs_improvement' ? 'ulang' : 'lancar'}`}>
                    {log.predikat || (log.quality === 'excellent' ? 'Lancar' : 'Maqbul')}
                  </span>
                </div>
                <div className="row-btns">
                  <Link href={`/profil/${log.studentId}`} className="btn-view">
                    <Eye size={18} /> Detail
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="transparency-section rounded-lg glass shadow-soft">
        <div className="trans-content">
          <span className="trans-label">Membangun Transparansi Pendidikan</span>
          <p>Sistem Raih Asa membantu ustadz memverifikasi kemajuan hafalan santri secara akuntabel dan transparan.</p>
          <div className="trans-badges">
            <span className="t-badge-mini">#Tahfidz</span>
            <span className="t-badge-mini">#RaihAsa</span>
          </div>
        </div>
      </section>

      <style jsx>{`
        .btn-murottal {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          border: 1.5px solid var(--primary-green);
          background: transparent;
          color: var(--primary-green);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-murottal:hover {
          background: var(--primary-green-light);
          transform: translateY(-2px);
        }
        .btn-murottal.playing {
          background: var(--primary-green);
          color: white;
          box-shadow: 0 4px 12px rgba(82, 164, 53, 0.3);
        }
        
        .audio-player-card {
          width: 240px;
          padding: 1.5rem;
          background: white;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .player-disc {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--primary-green-light);
          color: var(--primary-green);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid white;
          outline: 2px solid var(--primary-green-light);
        }
        .spinning {
          animation: rotate 4s linear infinite;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .player-controls {
          width: 100%;
          text-align: center;
        }
        .player-info span {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #999;
          display: block;
        }
        .player-info strong {
          font-size: 1rem;
          color: var(--primary-navy);
          display: block;
          margin-top: 2px;
        }
        .player-progress {
          margin-top: 1rem;
        }
        .p-bar-mini {
          height: 4px;
          background: #eee;
          border-radius: 2px;
          overflow: hidden;
        }
        .p-fill-mini {
          height: 100%;
          background: var(--primary-green);
          transition: width 0.3s ease;
        }
        .trans-badges {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .t-badge-mini {
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
          background: var(--primary-green-light);
          color: var(--primary-green);
          border-radius: 8px;
          font-weight: 600;
        }
        .loader-mini {
          width: 16px;
          height: 16px;
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

const SunIcon = ({ className }: { className?: string }) => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
