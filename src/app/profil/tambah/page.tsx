'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Target, Save, ChevronLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function TambahSantri() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetJuz: '30'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Mohon isi nama santri');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/students/tambah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Santri berhasil ditambahkan!');
        router.push('/profil');
      } else {
        const error = await res.json();
        alert('Gagal menambah santri: ' + (error.error || 'Terjadi kesalahan'));
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghubungkan ke server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="input-page">
      <Link href="/profil" className="back-btn glass shadow-soft" style={{ display: 'inline-flex', marginBottom: '1.5rem', padding: '0.5rem 1rem', borderRadius: '12px', textDecoration: 'none', color: 'inherit', gap: '0.5rem', alignItems: 'center' }}>
        <ChevronLeft size={20} />
        <span>Kembali ke Daftar</span>
      </Link>

      <header className="input-header">
        <div className="header-titles">
          <h1>Tambah Santri Baru</h1>
          <span className="divider">|</span>
          <span className="subtitle">Quran Monitoring</span>
        </div>
      </header>

      <div className="main-form-section" style={{ maxWidth: '600px' }}>
        <div className="section-intro">
          <h3>Profil Santri</h3>
          <p>Daftarkan santri baru ke dalam sistem pemantauan.</p>
          <User className="bg-icon" size={48} strokeWidth={1} />
        </div>

        <form className="quran-form glass rounded-lg shadow-soft" onSubmit={handleSubmit}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="input-group">
              <label>Nama Lengkap Santri</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Contoh: Muhammad Asep" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Target Juz Saat Ini</label>
              <div className="input-wrapper">
                <Target size={18} className="input-icon" />
                <input 
                  type="number" 
                  min="1" 
                  max="30"
                  value={formData.targetJuz}
                  onChange={(e) => setFormData({...formData, targetJuz: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <button type="button" className="btn-cancel" onClick={() => router.back()}>Batal</button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              <Save size={18} />
              <span>{isSubmitting ? 'Menyimpan...' : 'Tambah Santri'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
