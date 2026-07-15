"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const links = [
  { href: '/x7k9-panel-2024',            label: 'الرئيسية',        icon: '🏠', exact: true  },
  { href: '/x7k9-panel-2024/tenants',    label: 'المشتركون',       icon: '👥', exact: false },
  { href: '/x7k9-panel-2024/revenue',    label: 'الإيرادات',       icon: '💰', exact: false },
  { href: '/x7k9-panel-2024/support',    label: 'الدعم الفني',     icon: '🛠️', exact: false },
  { href: '/x7k9-panel-2024/new-tenant', label: 'إضافة مشترك',     icon: '➕', exact: false },
  { href: '/x7k9-panel-2024/settings',   label: 'الإعدادات',       icon: '⚙️', exact: false },
  { href: '/x7k9-panel-2024/audit-log',  label: 'سجل العمليات',    icon: '📋', exact: false },
];

const SB_BG     = '#FFFFFF';
const SB_BORDER = '#E2E8F0';
const SB_TEXT   = '#64748B';
const SB_ACTIVE = '#2563EB';

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
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
      width: 220, minHeight: '100vh',
      background: SB_BG,
      borderLeft: `1px solid ${SB_BORDER}`,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Cairo','Barlow Condensed',sans-serif",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 16px', borderBottom: `1px solid ${SB_BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, background: SB_ACTIVE, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, flexShrink: 0,
          }}>⚙️</div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '-0.3px', lineHeight: 1 }}>SHARAKH</span>
            <p style={{ fontSize: 9, color: SB_TEXT, margin: '2px 0 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Super Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {links.map(({ href, label, icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link key={href} href={href} onClick={onNavigate} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '9px 12px', borderRadius: 10,
              fontSize: 12.5, fontWeight: 700,
              textDecoration: 'none',
              background: active ? SB_ACTIVE : 'transparent',
              color: active ? '#FFFFFF' : SB_TEXT,
            }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
            >
              <span style={{ fontSize: 14 }}>{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '10px', borderTop: `1px solid ${SB_BORDER}` }}>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '9px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
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
