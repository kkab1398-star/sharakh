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
      background: '#F8FAFC',
      paddingBottom: '100px',
      overflowX: 'hidden',
      fontFamily: 'Cairo, sans-serif',
    }}>
      {children}
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
