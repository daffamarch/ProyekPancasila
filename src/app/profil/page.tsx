'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, ChevronRight, BookOpen, Star } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function ProfilList() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        setStudents(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="profil-list-container">
      <header className="page-header">
        <h2 className="title-navy">Daftar Anak</h2>
        <p>Pilih profil anak untuk melihat detail perkembangan.</p>
      </header>

      <div className="children-grid">
        {isLoading ? (
          <p>Memuat data santri...</p>
        ) : students.length === 0 ? (
          <p>Belum ada data santri.</p>
        ) : (
          students.map((child) => (
            <Link key={child.id} href={`/profil/${child.id}`}>
              <div className="child-card glass rounded shadow-soft">
                <div className="child-info">
                  <div className="avatar-placeholder">
                    <div className="avatar-initials">{getInitials(child.name)}</div>
                  </div>
                  <div className="text-info">
                    <h3>{child.name}</h3>
                    <p>ID: RA-2024-00{child.id}</p>
                  </div>
                </div>
                
                <div className="stats-row">
                  <div className="mini-stat">
                    <BookOpen size={14} />
                    <span>Target: Juz {child.targetJuz || 30}</span>
                  </div>
                  <div className="mini-stat">
                    <Star size={14} fill="#FFC048" color="#FFC048" />
                    <span>Santri Aktif</span>
                  </div>
                </div>

                <div className="card-footer">
                  <span>Lihat Detail</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
