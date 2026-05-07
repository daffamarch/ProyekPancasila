'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, ArrowRight, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registration successful! Please login.');
        router.push('/login');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass shadow-soft rounded-lg">
        <div className="auth-header">
          <div className="logo-box">
            <ShieldCheck size={40} color="var(--primary-green)" />
          </div>
          <h1>Daftar Akun</h1>
          <p>Mulai memantau perkembangan santri Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Nama Lengkap</label>
            <div className="input-wrapper">
              <User size={18} />
              <input 
                type="text" 
                placeholder="Ustadz Ahmad" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input 
                type="email" 
                placeholder="ustadz@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Sudah punya akun? <Link href="/login">Masuk Sekarang</Link></p>
        </div>
      </div>
      
      <p className="telkom-footer">Dibuat dengan hati ❤️ oleh Mahasiswa Telkom University</p>
    </div>
  );
}
