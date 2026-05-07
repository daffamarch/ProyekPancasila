'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  CheckCircle, 
  Search,
  ChevronRight,
  Bell,
  Book,
  Plus
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';

export default function Dashboard() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [targets, setTargets] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useLayoutEffect(() => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!user) {
      router.replace('/login');
      return;
    }
    setIsAuthorized(true);
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) return;

    const fetchData = async () => {
      try {
        const [logsRes, targetsRes, notifsRes] = await Promise.all([
          fetch('/api/hafalan'),
          fetch('/api/targets'),
          fetch('/api/notifications')
        ]);
        const logsData = await logsRes.json();
        const targetsData = await targetsRes.json();
        const notifsData = await notifsRes.json();
        
        setLogs(Array.isArray(logsData) ? logsData : []);
        setTargets(Array.isArray(targetsData) ? targetsData : []);
        setNotifs(Array.isArray(notifsData) ? notifsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate trend data (last 7 days)
  const getTrendData = () => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const data = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    
    logs.forEach(log => {
      const logDate = new Date(log.createdAt);
      const diffTime = Math.abs(today.getTime() - logDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) {
        data[logDate.getDay()] += 1;
      }
    });

    // Normalize for height percentage
    const max = Math.max(...data, 1);
    return data.map((v, i) => ({
      label: days[i],
      height: (v / max) * 100,
      count: v
    }));
  };

  const trendData = getTrendData();

  // Helper to format quality to display status
  const formatStatus = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'Lancar';
      case 'good': return 'Cukup Lancar';
      case 'needs_improvement': return 'Perlu Diulang';
      default: return quality;
    }
  };

  const [showNotifs, setShowNotifs] = useState(false);

  const stats = [
    { title: 'Selesai Hari Ini', value: `${logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length} Hafalan`, change: '+15%', label: 'Dari kemarin', icon: BookOpen, color: '#52A435' },
    { title: 'Total Hafalan', value: `${logs.length} Data`, icon: Book, color: '#1A2B4B' },
    { title: 'Santri Aktif', value: `${new Set(logs.map(l => l.studentName)).size} Anak`, avatars: logs.slice(0, 3).map(l => l.studentName), count: Math.max(0, new Set(logs.map(l => l.studentName)).size - 3), icon: Users, color: '#FF9F43' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Semangat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

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

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader-mini" style={{ width: '40px', height: '40px', color: 'var(--primary-green)' }}></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="h-title-empty"></div>
        
        <div className="header-right">
          <div className="notif-wrapper">
            <button className="notif-btn" onClick={toggleNotifs}>
              <Bell size={24} />
              {notifs.filter(n => !n.isRead).length > 0 && (
                <span className="notif-badge">{notifs.filter(n => !n.isRead).length}</span>
              )}
            </button>
            {showNotifs && (
              <div className="notif-dropdown glass shadow-soft show">
                <div className="notif-header">
                  <h4>Notifikasi</h4>
                  <button onClick={clearAllNotifs} className="clear-notif">
                    Hapus Semua
                  </button>
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
          <div 
            className="user-profile glass" 
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (confirm('Keluar dari sistem?')) {
                localStorage.removeItem('user');
                window.location.href = '/login';
              }
            }}
          >
            <div className="u-info">
              <span className="u-name">Ustadz Ahmad</span>
              <span className="u-role">Keluar</span>
            </div>
            <div className="u-avatar">
              <div className="avatar-initials" style={{ width: '40px', height: '40px' }}>{getInitials('Ustadz Ahmad')}</div>
            </div>
          </div>
        </div>
      </header>

      <section className="welcome-card glass rounded-lg shadow-soft">
        <div className="w-content">
          <h1>{getGreeting()}, Ustadz! 👋</h1>
          <p>Mari kita bantu anak-anak meraih asanya melalui hafalan Al-Qur'an yang berkah hari ini.</p>
        </div>
        <div className="w-decor">
          <img src="https://cdn-icons-png.flaticon.com/512/869/869869.png" alt="sun" width={40} height={40} className="w-sun" />
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card glass rounded-lg shadow-soft">
            <div className="stat-header">
              <div className="stat-icon-box" style={{ background: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="stat-body">
              <span className="stat-label">{stat.title}</span>
              <h2 className="stat-value" style={{ color: stat.color }}>{stat.value}</h2>
              {stat.change && (
                <div className="stat-footer">
                  <span className="change-tag">{stat.change}</span>
                  <span className="footer-label">{stat.label}</span>
                </div>
              )}
              {stat.avatars && (
                <div className="stat-avatars">
                  {stat.avatars.filter(Boolean).map((name, idx) => (
                    <div key={idx} className="av-mini">
                      <div className="avatar-initials" style={{ fontSize: '0.6rem' }}>{getInitials(name)}</div>
                    </div>
                  ))}
                  {stat.count > 0 && <div className="av-count">+{stat.count}</div>}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      <div className="dash-content">
        <div className="left-content">
          <section className="chart-card glass rounded-lg shadow-soft">
            <div className="section-header">
              <h3>Tren Hafalan</h3>
              <select className="period-select"><option>Mingguan</option></select>
            </div>
            <div className="chart-viz">
              {trendData.map((d, i) => (
                <div key={i} className="chart-bar-group">
                  <div className="bar-val-hint">{d.count}</div>
                  <div className="bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ 
                        height: `${Math.max((d.count / (Math.max(...trendData.map(td => td.count)) || 1)) * 100, 5)}%`, 
                        background: d.label === ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][new Date().getDay()] ? 'var(--primary-green)' : '#E8F1E5' 
                      }}
                    >
                    </div>
                  </div>
                  <span>{d.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="recent-card glass rounded-lg shadow-soft">
            <div className="section-header">
              <h3>Update Hafalan Terakhir</h3>
              <Link href="/reports" className="view-all">Lihat Semua <ChevronRight size={16} /></Link>
            </div>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Nama Santri</th>
                  <th>Materi</th>
                  <th>Status</th>
                  <th>Waktu</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Memuat data...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data hafalan.</td></tr>
                ) : (
                  logs.slice(0, 8).map((u, i) => (
                    <tr key={i}>
                      <td>
                        <div className="t-user">
                          <div className="avatar-initials" style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>{getInitials(u.studentName)}</div>
                          <div className="t-user-info">
                            <span className="t-name">{u.studentName}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="t-materi">
                          <strong>{u.surahName}</strong>
                          <span>Ayat {u.startAyat}–{u.endAyat}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`t-status ${u.predikat === 'Mardud' ? 'ulang' : 'lancar'}`}>
                          {u.predikat || 'Maqbul'}
                        </span>
                      </td>
                      <td className="t-time">{new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>
                        <Link href={`/profil/${u.studentId}`} className="t-link">Detail</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>

        <aside className="right-content">
          <section className="targets-card glass rounded-lg shadow-soft">
            <div className="section-header">
              <h3>Target Hari Ini</h3>
            </div>
            <div className="target-progress-list">
              {isLoading ? (
                <p>Memuat target...</p>
              ) : targets.length === 0 ? (
                <p>Belum ada target.</p>
              ) : (
                targets.map((t, i) => (
                  <div key={i} className="target-prog-item">
                    <div className="t-prog-labels">
                      <span>{t.label}</span>
                      <span>{t.percentage}%</span>
                    </div>
                    <div className="t-prog-bar"><div className="t-prog-fill" style={{ width: `${t.percentage}%`, background: t.color }}></div></div>
                  </div>
                ))
              )}
            </div>
            <Link href="/input" className="btn-add-float"><Plus size={24} /></Link>
          </section>
        </aside>
      </div>
    </div>
  );
}

const SunIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
);

const CloudIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '20px' }}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
);

const StarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '40px' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
