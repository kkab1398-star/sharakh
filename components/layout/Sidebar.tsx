"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/theme-context';

const links = [
  { href: '/dashboard',                  label: 'الرئيسية',           icon: '⬛', exact: true  },
  { href: '/dashboard/drivers',          label: 'السائقون',           icon: '👤', exact: false },
  { href: '/dashboard/daily-operations', label: 'العمليات اليومية',   icon: '⚡', exact: false },
  { href: '/dashboard/customers',        label: 'العملاء',            icon: '👥', exact: false },
  { href: '/dashboard/equipment',        label: 'المعدات',            icon: '🚜', exact: false },
  { href: '/dashboard/cycles',           label: 'الدورات المالية',    icon: '💰', exact: false },
  { href: '/dashboard/services',         label: 'الخدمات والمصاريف', icon: '🔧', exact: false },
  { href: '/dashboard/settings',         label: 'الإعدادات',          icon: '⚙️', exact: false },
];

/* Sidebar always stays dark regardless of theme */
const SB_BG   = '#111111';
const SB_CARD = '#1A1A1A';
const SB_BORDER = 'rgba(255,205,17,0.15)';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'التبديل للوضع الفاتح' : 'التبديل للوضع الداكن'}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 14px', background: SB_CARD,
        border: `1px solid ${SB_BORDER}`,
        cursor: 'pointer', marginBottom: 8,
      }}
    >
      {/* track */}
      <div style={{
        width: 44, height: 22, flexShrink: 0, position: 'relative',
        background: isDark ? '#FFCD11' : '#3D3D3D',
        transition: 'background 0.25s',
      }}>
        {/* thumb */}
        <div style={{
          position: 'absolute', top: 3,
          width: 16, height: 16, background: isDark ? '#1A1A1A' : '#FFCD11',
          left: isDark ? 25 : 3,
          transition: 'left 0.25s, background 0.25s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9,
        }}>
          {isDark ? '🌙' : '☀️'}
        </div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#A0A0A0' }}>
        {isDark ? 'وضع داكن' : 'وضع فاتح'}
      </span>
    </button>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside style={{
      width: 240, minHeight: '100vh',
      background: SB_BG,
      borderLeft: '3px solid #FFCD11',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Cairo','Barlow Condensed',sans-serif",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${SB_BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: '#FFCD11', borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>🚜</div>
          <div>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#FFCD11', fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '-0.3px', lineHeight: 1 }}>SHARAKH</span>
            <p style={{ fontSize: 10, color: '#666', margin: '2px 0 0', fontWeight: 400 }}>إدارة المعدات</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map(({ href, label, icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 4,
              fontSize: 13, fontWeight: 700,
              textDecoration: 'none', transition: 'color 0.15s, border-color 0.15s',
              background: active ? '#FFCD11' : 'transparent',
              color: active ? '#1A1A1A' : '#aaa',
              borderRight: active ? 'none' : '2px solid transparent',
            }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = '#FFCD11'; (e.currentTarget as HTMLElement).style.borderRightColor = '#FFCD11'; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = '#aaa'; (e.currentTarget as HTMLElement).style.borderRightColor = 'transparent'; } }}
            >
              <span style={{ fontSize: 15 }}>{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: `1px solid ${SB_BORDER}` }}>
        <ThemeToggle />
        <Link href="/dashboard/drivers/new" style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px',
          borderRadius: 4, fontSize: 12, fontWeight: 700, color: '#FFCD11',
          border: '2px solid #FFCD11', textDecoration: 'none',
          marginBottom: 8, justifyContent: 'center',
        }}>
          + إضافة سائق
        </Link>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '9px 14px', borderRadius: 4, fontSize: 12, fontWeight: 700,
          color: '#666', background: 'transparent', border: 'none', cursor: 'pointer',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={e => (e.currentTarget.style.color = '#666')}
        >
          🚪 تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
