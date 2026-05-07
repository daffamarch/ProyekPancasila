'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return (
      <main className="auth-container">
        {children}
      </main>
    );
  }

  return (
    <div className="layout-wrapper">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
