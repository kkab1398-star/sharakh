"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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

const SB_BG     = '#FFFFFF';
const SB_BORDER = '#E2E8F0';
const SB_TEXT   = '#64748B';
const SB_ACTIVE = '#2563EB';

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
      borderLeft: `1px solid ${SB_BORDER}`,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Cairo','Barlow Condensed',sans-serif",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${SB_BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: SB_ACTIVE, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>🚜</div>
          <div>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '-0.3px', lineHeight: 1 }}>SHARAKH</span>
            <p style={{ fontSize: 10, color: SB_TEXT, margin: '2px 0 0', fontWeight: 400 }}>إدارة المعدات</p>
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
              padding: '10px 14px', borderRadius: 12,
              fontSize: 13, fontWeight: 700,
              textDecoration: 'none', transition: 'background-color 0.15s, color 0.15s',
              background: active ? SB_ACTIVE : 'transparent',
              color: active ? '#FFFFFF' : SB_TEXT,
            }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
            >
              <span style={{ fontSize: 15 }}>{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: `1px solid ${SB_BORDER}` }}>
        <Link href="/dashboard/drivers/new" style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px',
          borderRadius: 12, fontSize: 12, fontWeight: 700, color: SB_ACTIVE,
          border: `2px solid ${SB_ACTIVE}`, textDecoration: 'none',
          marginBottom: 8, justifyContent: 'center',
        }}>
          + إضافة سائق
        </Link>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '9px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700,
          color: SB_TEXT, background: 'transparent', border: 'none', cursor: 'pointer',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
          onMouseLeave={e => (e.currentTarget.style.color = SB_TEXT)}
        >
          🚪 تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
