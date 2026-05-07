'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { Menu, X as CloseIcon } from 'lucide-react';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  React.useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthorized(!!user);
    setShowMobileMenu(false); // Close menu on route change
  }, [pathname]);

  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage || isAuthorized === false) {
    return (
      <main className="auth-container">
        {children}
      </main>
    );
  }

  // Still checking auth
  if (isAuthorized === null && pathname !== '/login' && pathname !== '/register') {
    return <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }} />;
  }

  return (
    <div className="layout-wrapper">
      <button 
        className="mobile-menu-toggle"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <CloseIcon size={24} /> : <Menu size={24} />}
      </button>

      <div className={`sidebar-wrapper ${showMobileMenu ? 'show' : ''}`}>
        <Sidebar />
      </div>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
