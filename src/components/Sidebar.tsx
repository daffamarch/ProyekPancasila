'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileEdit, 
  Bell, 
  UserCircle, 
  FileText,
  Plus,
  Heart
} from 'lucide-react';
import Image from 'next/image';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Input Data', icon: FileEdit, href: '/input' },
    { name: 'Notifikasi', icon: Bell, href: '/notifications' },
    { name: 'Profil Anak', icon: UserCircle, href: '/profil' },
    { name: 'Laporan', icon: FileText, href: '/reports' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-container glass shadow-soft">
        <div className="logo-section">
          <div className="logo-wrapper">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
          </div>
          <div className="logo-text">
            <h2>Raih Asa</h2>
            <p>Membangun Karakter</p>
          </div>
        </div>

        <nav className="nav-menu">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-add">
            <Plus size={20} />
            <span>Tambah Data Baru</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
