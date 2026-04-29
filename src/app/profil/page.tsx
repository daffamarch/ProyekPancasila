'use client';

import React from 'react';
import Link from 'next/link';
import { User, ChevronRight, BookOpen, Star } from 'lucide-react';

export default function ProfilList() {
  const children = [
    { id: '1', name: 'Aisya Ramadhani', age: 10, juz: 30, progress: 85, behavior: 'Sangat Baik' },
    { id: '2', name: 'Fahri Al-Ghifari', age: 11, juz: 2, progress: 40, behavior: 'Baik' },
    { id: '3', name: 'Naura Syifa', age: 9, juz: 30, progress: 92, behavior: 'Sangat Baik' },
  ];

  return (
    <div className="profil-list-container">
      <header className="page-header">
        <h2 className="title-navy">Daftar Anak</h2>
        <p>Pilih profil anak untuk melihat detail perkembangan.</p>
      </header>

      <div className="children-grid">
        {children.map((child) => (
          <Link key={child.id} href={`/profil/${child.id}`}>
            <div className="child-card glass rounded shadow-soft">
              <div className="child-info">
                <div className="avatar-placeholder">
                  <User size={30} color="var(--primary-green)" />
                </div>
                <div className="text-info">
                  <h3>{child.name}</h3>
                  <p>{child.age} Tahun • ID: RA-2024-00{child.id}</p>
                </div>
              </div>
              
              <div className="stats-row">
                <div className="mini-stat">
                  <BookOpen size={14} />
                  <span>Juz {child.juz}</span>
                </div>
                <div className="mini-stat">
                  <Star size={14} fill="#FFC048" color="#FFC048" />
                  <span>{child.behavior}</span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-info">
                  <span>Progres Hafalan</span>
                  <span>{child.progress}%</span>
                </div>
                <div className="progress-bar"><div className="progress" style={{ width: `${child.progress}%`, backgroundColor: 'var(--primary-green)' }}></div></div>
              </div>

              <div className="card-footer">
                <span>Lihat Detail</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
