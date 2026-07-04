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

export default function AdminSidebar() {
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
      width: 208, minHeight: '100vh',
      background: '#111111',
      borderLeft: '3px solid #FFCD11',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Cairo','Barlow Condensed',sans-serif",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 16px', borderBottom: '1px solid rgba(255,205,17,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, background: '#FFCD11', borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, flexShrink: 0,
          }}>⚙️</div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#FFCD11', fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '-0.3px', lineHeight: 1 }}>SHARAKH</span>
            <p style={{ fontSize: 9, color: '#666', margin: '2px 0 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Super Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {links.map(({ href, label, icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '9px 12px', borderRadius: 3,
              fontSize: 12.5, fontWeight: 700,
              textDecoration: 'none',
              background: active ? '#FFCD11' : 'transparent',
              color: active ? '#1A1A1A' : '#aaa',
              borderRight: active ? 'none' : '2px solid transparent',
            }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = '#FFCD11'; (e.currentTarget as HTMLElement).style.borderRightColor = '#FFCD11'; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = '#aaa'; (e.currentTarget as HTMLElement).style.borderRightColor = 'transparent'; } }}
            >
              <span style={{ fontSize: 14 }}>{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '10px', borderTop: '1px solid rgba(255,205,17,0.15)' }}>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '9px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700,
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
