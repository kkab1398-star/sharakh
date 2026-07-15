'use client';

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';

function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15,23,42,0.4)', zIndex: 999,
      }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '80%', maxWidth: 280,
        background: '#FFFFFF', zIndex: 1000, overflowY: 'auto',
        boxShadow: '-8px 0 30px rgba(0,0,0,0.1)',
        borderTopLeftRadius: 24, borderBottomLeftRadius: 24,
      }}>
        <AdminSidebar onNavigate={onClose} />
      </div>
    </>
  );
}

export default function AdminLayoutClient({ email, children }: { email: string; children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex', minHeight: '100vh',
        background: '#F8FAFC',
        fontFamily: "'Cairo','Barlow Condensed',sans-serif",
      }}
      dir="rtl"
    >
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .admin-hamburger { display: none !important; }
          .admin-sidebar { display: flex !important; }
        }
      `}</style>

      <div className="admin-sidebar">
        <AdminSidebar />
      </div>

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main style={{ flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header — blue curved */}
        <header style={{
          background: '#2563EB',
          padding: '16px 20px',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="admin-hamburger"
              onClick={() => setDrawerOpen(true)}
              style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#FFFFFF', display: 'none', padding: 4 }}
            >
              ☰
            </button>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SUPER ADMIN CONSOLE
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 700 }} dir="ltr">
              {email}
            </span>
            <span style={{ fontSize: 16 }}>⚙️</span>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
