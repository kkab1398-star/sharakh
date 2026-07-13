"use client";

import { usePathname } from 'next/navigation';
import { DriverLangProvider, useDriverLang } from '@/contexts/DriverLangContext';

function DriverShell({ children }: { children: React.ReactNode }) {
  const path    = usePathname();
  const isLogin = path === '/driver/login';
  const { dir } = useDriverLang();

  if (isLogin) {
    return <div dir={dir} style={{ fontFamily: 'Cairo, sans-serif' }}>{children}</div>;
  }

  return (
    <div dir={dir} style={{
      minHeight: '100svh',
      background: '#F4F5F7',
      paddingBottom: '100px',
      overflowX: 'hidden',
      fontFamily: 'Cairo, sans-serif',
    }}>
      {children}

      {/* Bottom Navigation Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '72px',
        background: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 40,
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.04)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
      }}>
        {/* Nav items will be managed by the page component */}
      </nav>
    </div>
  );
}

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <DriverLangProvider>
      <DriverShell>{children}</DriverShell>
    </DriverLangProvider>
  );
}
