'use client';

import React from 'react';
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

export default function Dashboard() {
  const stats = [
    { title: 'Selesai Hari Ini', value: '12 Surah', change: '+15%', label: 'Dari kemarin', icon: BookOpen, color: '#52A435' },
    { title: 'Total Ayat', value: '142 Ayat', target: '180', icon: Book, color: '#1A2B4B' },
    { title: 'Santri Aktif', value: '24 Anak', avatars: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3'], count: 21, icon: Users, color: '#FF9F43' },
  ];

  const recentUpdates = [
    { name: 'Aisya Ramadhani', time: '10 menit yang lalu', surah: 'An-Naba: 1–10', status: 'Lancar', grade: 'A+', avatar: 'https://i.pravatar.cc/150?u=aisya' },
    { name: 'Fahri Al-Ghifari', time: '25 menit yang lalu', surah: 'Ad-Duha', status: 'Perlu Diulang', grade: 'B', avatar: 'https://i.pravatar.cc/150?u=fahri' },
  ];

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="search-box glass">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Cari santri atau hafalan..." />
        </div>
        <div className="header-right">
          <button className="notif-btn"><Bell size={24} /></button>
          <div className="user-profile glass">
            <div className="u-info">
              <span className="u-name">Ustadz Ahmad</span>
              <span className="u-role">Pembimbing Tahfidz</span>
            </div>
            <div className="u-avatar">
              <Image src="https://i.pravatar.cc/150?u=ahmad" alt="Ahmad" width={40} height={40} />
            </div>
          </div>
        </div>
      </header>

      <section className="welcome-card glass rounded-lg shadow-soft">
        <div className="w-content">
          <h1>Semangat Pagi, Ustadz! 👋</h1>
          <p>Mari kita bantu anak-anak meraih asanya melalui hafalan Al-Qur'an yang berkah hari ini.</p>
        </div>
        <div className="w-decor">
          <SunIcon />
          <CloudIcon />
          <StarIcon />
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
              {stat.target && (
                <div className="stat-progress">
                  <div className="mini-bar"><div className="mini-fill" style={{ width: '70%', background: stat.color }}></div></div>
                  <span className="target-label">Target harian: {stat.target} Ayat</span>
                </div>
              )}
              {stat.avatars && (
                <div className="stat-avatars">
                  {stat.avatars.map((av, idx) => (
                    <div key={idx} className="av-mini"><Image src={av} alt="av" width={24} height={24} /></div>
                  ))}
                  <div className="av-count">+{stat.count}</div>
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
              {[45, 65, 50, 85, 60, 30, 25].map((h, i) => (
                <div key={i} className="chart-bar-group">
                  <div className="chart-bar" style={{ height: `${h}%`, background: i === 3 ? 'var(--primary-green)' : '#F0F4F0' }}></div>
                  <span>{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="recent-card glass rounded-lg shadow-soft">
            <div className="section-header">
              <h3>Update Hafalan Terakhir</h3>
              <button className="view-all">Lihat Semua <ChevronRight size={16} /></button>
            </div>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Nama Santri</th>
                  <th>Materi</th>
                  <th>Status</th>
                  <th>Nilai</th>
                </tr>
              </thead>
              <tbody>
                {recentUpdates.map((u, i) => (
                  <tr key={i}>
                    <td>
                      <div className="t-user">
                        <Image src={u.avatar} alt={u.name} width={36} height={36} className="t-avatar" />
                        <div className="t-user-info">
                          <span className="t-name">{u.name}</span>
                          <span className="t-time">{u.time}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="t-materi">
                        <strong>{u.surah.split(':')[0]}</strong>
                        <span>{u.surah.includes(':') ? u.surah.split(':')[1] : 'Ziyadah Baru'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`t-badge ${u.status === 'Lancar' ? 'lancar' : 'ulang'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="t-grade">{u.grade}</td>
                  </tr>
                ))}
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
              {[
                { label: 'Tahsin Al-Fatihah', percent: 90, color: 'var(--primary-green)' },
                { label: 'Hafalan Juz 30', percent: 65, color: 'var(--primary-navy)' },
                { label: 'Murojaah Pagi', percent: 40, color: '#7E5733' },
              ].map((t, i) => (
                <div key={i} className="target-prog-item">
                  <div className="t-prog-labels">
                    <span>{t.label}</span>
                    <span>{t.percent}%</span>
                  </div>
                  <div className="t-prog-bar"><div className="t-prog-fill" style={{ width: `${t.percent}%`, background: t.color }}></div></div>
                </div>
              ))}
            </div>
            <button className="btn-add-float"><Plus size={24} /></button>
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
