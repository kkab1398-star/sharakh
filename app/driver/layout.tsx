"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DriverLangProvider, useDriverLang } from '@/contexts/DriverLangContext';
import { useTheme } from '@/lib/theme-context';

function BottomNav() {
  const path = usePathname();
  const { m, dir, lang, setLang } = useDriverLang();

  const NAV = [
    { href: '/driver',              label: m.nav.home,         icon: '🏠', id: 'home' },
    { href: '/driver/transactions', label: m.nav.transactions, icon: '💰', id: 'tx' },
    { href: '/driver/invoices',     label: m.nav.invoices,     icon: '📄', id: 'inv' },
  ];

  const handleLangClick = () => {
    const langs = ['ar', 'en', 'ur', 'bn', 'ne', 'tl'];
    const idx = langs.indexOf(lang);
    const nextIdx = (idx + 1) % langs.length;
    setLang(langs[nextIdx] as any);
  };

  return (
    <nav dir={dir} style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#111111', borderTop: '3px solid var(--cat-yellow)',
      display: 'flex', zIndex: 1000, height: 72, alignItems: 'center', justifyContent: 'space-around',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {/* الأزرار الأولى */}
      {NAV.slice(0, 2).map(({ href, label, icon }) => {
        const active = path === href;
        return (
          <Link key={href} href={href} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, textDecoration: 'none',
            color: active ? 'var(--cat-yellow)' : 'var(--cat-muted)',
            fontSize: 9, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.05em',
            background: 'transparent',
            transition: 'color 0.15s', height: '100%',
            minHeight: 48,
          }}>
            <span style={{ fontSize: 24 }}>{icon}</span>
            <span>{label}</span>
          </Link>
        );
      })}

      {/* زر الإضافة المركزي المميز */}
      <Link href="/driver" style={{
        position: 'relative', bottom: 16,
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--cat-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(255,205,17,0.4)',
        cursor: 'pointer', transition: 'transform 0.15s',
        flex: 'none',
      }} onMouseEnter={e => (e.currentTarget as any).style.transform = 'scale(1.1)'}
         onMouseLeave={e => (e.currentTarget as any).style.transform = 'scale(1)'}
      >
        ➕
      </Link>

      {/* الأزرار الأخيرة */}
      {NAV.slice(2).map(({ href, label, icon }) => {
        const active = path === href;
        return (
          <Link key={href} href={href} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, textDecoration: 'none',
            color: active ? 'var(--cat-yellow)' : 'var(--cat-muted)',
            fontSize: 9, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.05em',
            background: 'transparent',
            transition: 'color 0.15s', height: '100%',
            minHeight: 48,
          }}>
            <span style={{ fontSize: 24 }}>{icon}</span>
            <span>{label}</span>
          </Link>
        );
      })}

      {/* زر اللغة */}
      <button onClick={handleLangClick} style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 4, textDecoration: 'none',
        color: 'var(--cat-muted)',
        fontSize: 9, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        background: 'transparent', border: 'none', cursor: 'pointer',
        transition: 'color 0.15s', height: '100%',
        minHeight: 48, padding: 0,
      }} onMouseEnter={e => (e.currentTarget as any).style.color = 'var(--cat-yellow)'}
         onMouseLeave={e => (e.currentTarget as any).style.color = 'var(--cat-muted)'}
      >
        <span style={{ fontSize: 24 }}>🌐</span>
        <span>{lang}</span>
      </button>
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
    <div className="driver-app" dir={dir} style={{ minHeight: '100svh', background: 'var(--bg)', paddingBottom: 100, overflowX: 'hidden' }}>
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
