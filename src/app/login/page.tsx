'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, ArrowRight, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        alert(data.error || 'Login failed');
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
          <h1>Masuk Raih Asa</h1>
          <p>Selamat datang kembali, Ustadz!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
            {isLoading ? 'Memproses...' : 'Masuk'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Belum punya akun? <Link href="/register">Daftar Akun Baru</Link></p>
        </div>
      </div>
    </div>
  );
}
