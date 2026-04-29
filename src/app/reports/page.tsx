'use client';

import React from 'react';
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

export default function Reports() {
  const reports = [
    { title: 'Pekan ke-3, Oktober 2023', children: 124, progress: 48, avatars: 3 },
    { title: 'Pekan ke-2, Oktober 2023', children: 122, progress: 42, avatars: 2 },
  ];

  return (
    <div className="reports-page">
      <header className="reports-header glass shadow-soft">
        <div className="h-left">
          <span className="h-title">Laporan Berkala</span>
        </div>
        <div className="h-right">
          <button className="notif-btn"><Bell size={20} /></button>
          <div className="u-box glass">
            <div className="u-avatar">
              <Image src="https://i.pravatar.cc/150?u=ahmad" alt="Ahmad" width={32} height={32} />
            </div>
            <span className="u-name">Ustadz Ahmad</span>
            <ChevronDownIcon />
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
              <h4>Statistik Hafalan Pekan Ini</h4>
              <span>Update terakhir: 24 Oktober 2023</span>
            </div>
            <div className="ct-right">
              <div className="toggle-group">
                <button className="active">Mingguan</button>
                <button>Bulanan</button>
              </div>
            </div>
          </div>

          <div className="stats-circles">
            <div className="s-item">
              <div className="s-box">428</div>
              <span>HALAMAN BARU</span>
            </div>
            <div className="s-item">
              <div className="s-box blue">92%</div>
              <span>TARGET TERCAPAI</span>
            </div>
            <div className="s-item">
              <div className="s-box orange">15</div>
              <span>SANTRI BERPRESTASI</span>
            </div>
          </div>

          <div className="progress-footer">
            <div className="p-bar"><div className="p-fill" style={{ width: '78%' }}></div></div>
            <p>Progres target kurikulum semester ganjil: <strong>78% Terlampaui</strong></p>
          </div>
          
          <SunIcon className="decor-sun" />
        </section>

        <section className="featured-report rounded-lg shadow-soft">
          <div className="feat-content">
            <span className="feat-badge">TERBARU</span>
            <h3>Laporan Bulanan September 2023</h3>
            <p>Rangkuman komprehensif seluruh santri mencakup hafalan & karakter.</p>
            <button className="btn-feat"><Download size={18} /> Unduh PDF Sekarang</button>
          </div>
          <div className="feat-bg">
            <FileText size={120} strokeWidth={1} />
          </div>
        </section>
      </div>

      <section className="list-section">
        <div className="list-header">
          <h3>Daftar Laporan Tersedia</h3>
          <div className="search-box glass">
            <Search size={18} />
            <input type="text" placeholder="Cari periode..." />
          </div>
        </div>

        <div className="report-items">
          {reports.map((r, i) => (
            <div key={i} className="report-row glass rounded-lg shadow-soft">
              <div className="row-icon"><Calendar size={24} /></div>
              <div className="row-info">
                <h4>{r.title}</h4>
                <p>Berisi {r.children} santri • Hafalan: {r.progress} Juz Kolektif</p>
              </div>
              <div className="row-avatars">
                {[...Array(r.avatars)].map((_, idx) => (
                  <div key={idx} className="av-mini"><Image src={`https://i.pravatar.cc/150?u=${i}${idx}`} alt="av" width={24} height={24} /></div>
                ))}
              </div>
              <div className="row-btns">
                <button className="btn-view"><Eye size={18} /> Lihat</button>
                <button className="btn-pdf"><Download size={18} /> PDF</button>
              </div>
            </div>
          ))}

          <div className="report-row major rounded-lg">
            <div className="row-icon"><Star size={24} /></div>
            <div className="row-info">
              <h4>Laporan Bulanan September 2023</h4>
              <p>Arsip Laporan Utama Bulanan</p>
            </div>
            <button className="btn-major"><Download size={18} /> Unduh PDF Bulanan</button>
          </div>
        </div>
      </section>

      <section className="transparency-section rounded-lg">
        <div className="trans-visual">
          <Image src="/logo.png" alt="Visual" width={280} height={280} className="visual-img" />
        </div>
        <div className="trans-content">
          <span className="trans-label">Membangun Transparansi Pendidikan</span>
          <p>Laporan ini dirancang untuk menjembatani komunikasi antara pengajar dan orang tua santri. Fokus kami adalah pada <strong>Kualitas Hafalan</strong> dan <strong>Adab Keseharian</strong>.</p>
          <div className="benefits-grid">
            <div className="ben-item"><CheckCircle size={16} /> Statistik Hafalan Akurat</div>
            <div className="ben-item"><CheckCircle size={16} /> Penilaian Adab Harian</div>
            <div className="ben-item"><CheckCircle size={16} /> Pencapaian Target Individu</div>
            <div className="ben-item"><CheckCircle size={16} /> Saran Perkembangan Santri</div>
          </div>
        </div>
      </section>

    </div>
  );
}

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);

const SunIcon = ({ className }: { className?: string }) => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
