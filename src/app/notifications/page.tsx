'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  Edit, 
  Search,
  Filter,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';

export default function HistoryInput() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/hafalan');
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      const res = await fetch(`/api/hafalan?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLogs(logs.filter(l => l.id !== id));
      } else {
        alert('Gagal menghapus data');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan');
    }
  };

  const filteredLogs = logs.filter(log => 
    log.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.surahName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="history-container">
      <header className="page-header">
        <div className="header-info">
          <h2 className="title-navy">History Input Setoran</h2>
          <p>Kelola dan koreksi riwayat setoran hafalan santri.</p>
        </div>
        <div className="header-actions">
          <div className="search-bar glass">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Cari santri atau surah..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="history-list glass rounded-lg shadow-soft">
        {isLoading ? (
          <p style={{ textAlign: 'center', padding: '3rem' }}>Memuat riwayat...</p>
        ) : filteredLogs.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem' }}>Data tidak ditemukan.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Santri</th>
                <th>Juz</th>
                <th>Hafalan</th>
                <th>Nilai</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.createdAt).toLocaleDateString('id-ID')}</td>
                  <td>
                    <div className="std-cell">
                      <div className="avatar-initials" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>{getInitials(log.studentName)}</div>
                      <span>{log.studentName}</span>
                    </div>
                  </td>
                  <td>Juz {log.juz}</td>
                  <td>
                    <div className="h-cell">
                      <strong>{log.surahName}</strong>
                      <span>Ayat {log.startAyat}-{log.endAyat}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${log.predikat?.toLowerCase().replace(' ', '-')}`}>{log.predikat}</span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-edit" title="Edit"><Edit size={16} /></button>
                      <button className="btn-delete" title="Hapus" onClick={() => handleDelete(log.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .history-container { padding: 2rem; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .search-bar { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 12px; width: 300px; }
        .search-bar input { border: none; background: transparent; outline: none; width: 100%; }
        .history-table { width: 100%; border-collapse: collapse; }
        .history-table th { text-align: left; padding: 1rem; background: #f8faf8; color: #666; font-size: 0.85rem; }
        .history-table td { padding: 1rem; border-bottom: 1px solid #eee; font-size: 0.9rem; }
        .std-cell, .h-cell { display: flex; align-items: center; gap: 0.75rem; }
        .h-cell { flex-direction: column; align-items: flex-start; gap: 0.1rem; }
        .h-cell span { font-size: 0.8rem; color: #888; }
        .badge { padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
        .badge.mumtaz { background: #EEF5EB; color: #52A435; }
        .badge.jayyid-jiddan { background: #E9F2FE; color: #3498db; }
        .actions-cell { display: flex; gap: 0.5rem; }
        .btn-edit, .btn-delete { padding: 6px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
        .btn-edit { background: #E9F2FE; color: #3498db; }
        .btn-delete { background: #FEF2F2; color: #e74c3c; }
        .btn-edit:hover { background: #3498db; color: white; }
        .btn-delete:hover { background: #e74c3c; color: white; }
      `}</style>
    </div>
  );
}
