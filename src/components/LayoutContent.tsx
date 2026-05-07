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

      <style jsx>{`
        .mobile-menu-toggle {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          background: var(--primary-green);
          color: white;
          padding: 10px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(82, 164, 53, 0.3);
        }

        @media (max-width: 1024px) {
          .mobile-menu-toggle {
            display: flex;
          }
          
          .sidebar-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          }

          .sidebar-wrapper.show {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
