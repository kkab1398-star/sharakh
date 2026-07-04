import { requireSuperAdminPage } from '@/lib/super-admin';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireSuperAdminPage();

  return (
    <div
      style={{
        display: 'flex', minHeight: '100vh',
        background: '#1A1A1A',
        fontFamily: "'Cairo','Barlow Condensed',sans-serif",
      }}
      dir="rtl"
    >
      <AdminSidebar />
      <main style={{ flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', background: '#111111', borderBottom: '1px solid rgba(255,205,17,0.15)',
        }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#FFCD11', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            SUPER ADMIN CONSOLE
          </span>
          <span style={{ fontSize: 12, color: '#A0A0A0', fontWeight: 700 }} dir="ltr">
            {email}
          </span>
        </header>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
