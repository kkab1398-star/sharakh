"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DriverLangProvider, useDriverLang } from '@/contexts/DriverLangContext';
import { useTheme } from '@/lib/theme-context';

function ThemeToggleBtn() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      style={{
        flex: 0, width: 52, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 3,
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontSize: 10, fontWeight: 700, color: 'var(--cat-muted)',
      }}
    >
      <span style={{ fontSize: 18 }}>{isDark ? '☀️' : '🌙'}</span>
      <span style={{ letterSpacing: '0.03em' }}>{isDark ? 'فاتح' : 'داكن'}</span>
    </button>
  );
}

function BottomNav() {
  const path = usePathname();
  const { m, dir } = useDriverLang();

  const NAV = [
    { href: '/driver',              label: m.nav.home,         icon: '🏠' },
    { href: '/driver/transactions', label: m.nav.transactions, icon: '📋' },
    { href: '/driver/invoices',     label: m.nav.invoices,     icon: '🧾' },
  ];

  return (
    <nav dir={dir} style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#111111', borderTop: '3px solid var(--cat-yellow)',
      display: 'flex', zIndex: 50, height: 60,
    }}>
      {NAV.map(({ href, label, icon }) => {
        const active = path === href;
        return (
          <Link key={href} href={href} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 3, textDecoration: 'none',
            color: active ? 'var(--cat-yellow)' : 'var(--cat-muted)',
            fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.05em',
            background: active ? 'rgba(255,205,17,0.07)' : 'transparent',
            transition: 'color 0.15s',
          }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span>{label}</span>
          </Link>
        );
      })}
      <ThemeToggleBtn />
    </nav>
  );
}

function DriverShell({ children }: { children: React.ReactNode }) {
  const path    = usePathname();
  const isLogin = path === '/driver/login';
  const { dir } = useDriverLang();

  if (isLogin) {
    return <div className="driver-app" dir={dir}>{children}</div>;
  }

  return (
    <div className="driver-app" dir={dir} style={{ minHeight: '100svh', background: 'var(--bg)', paddingBottom: 60 }}>
      {children}
      <BottomNav />
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
