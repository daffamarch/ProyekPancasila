'use client';

import React from 'react';
import { 
  Bell, 
  AlertCircle, 
  Clock, 
  CheckCircle,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function Notifications() {
  const alerts = [
    { 
      id: 1, 
      type: 'stagnation', 
      title: 'Peringatan Stagnasi', 
      desc: 'Ahmad Al-Fatih tidak ada pembaruan hafalan selama 3 hari.', 
      time: 'Tadi', 
      childId: '1',
      urgent: true 
    },
    { 
      id: 2, 
      type: 'achievement', 
      title: 'Capaian Baru', 
      desc: 'Aisya Ramadhani menyelesaikan Juz 30!', 
      time: '2 jam yang lalu', 
      childId: '2',
      urgent: false 
    },
    { 
      id: 3, 
      type: 'reminder', 
      title: 'Jadwal Setoran', 
      desc: 'Waktunya setoran hafalan untuk kelompok Madani.', 
      time: 'Pagi ini', 
      urgent: false 
    },
  ];

  return (
    <div className="notifications-container">
      <header className="page-header">
        <h2 className="title-navy">Notifikasi & Peringatan</h2>
        <p>Pantau update penting dan deteksi dini perkembangan santri.</p>
      </header>

      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item glass rounded shadow-soft ${alert.urgent ? 'urgent' : ''}`}>
            <div className={`alert-icon ${alert.type}`}>
              {alert.type === 'stagnation' && <AlertCircle size={24} />}
              {alert.type === 'achievement' && <CheckCircle size={24} />}
              {alert.type === 'reminder' && <Clock size={24} />}
            </div>
            <div className="alert-content">
              <div className="alert-header">
                <h4>{alert.title}</h4>
                <span className="alert-time">{alert.time}</span>
              </div>
              <p>{alert.desc}</p>
              {alert.childId && (
                <Link href={`/profil/${alert.childId}`} className="alert-link">
                  Lihat Profil <ArrowRight size={14} />
                </Link>
              )}
            </div>
            {!alert.urgent && <button className="btn-mark">Tandai Dibaca</button>}
          </div>
        ))}
      </div>

    </div>
  );
}
