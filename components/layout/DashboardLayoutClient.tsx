'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';

function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', zIndex: 999,
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '80%', maxWidth: 280,
        background: 'var(--bg)', zIndex: 1000, overflowY: 'auto',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.3)',
      }}>
        <Sidebar />
      </div>
    </>
  );
}

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .dashboard-sidebar { display: none !important; }
          .dashboard-hamburger { display: flex !important; }
          .dashboard-main { width: 100% !important; margin-right: 0 !important; }
        }
        @media (min-width: 769px) {
          .dashboard-hamburger { display: none !important; }
          .dashboard-sidebar { display: flex !important; }
          .dashboard-main { flex: 1; }
        }
      `}</style>

      <div
        style={{
          display: 'flex', minHeight: '100vh',
          background: 'var(--bg)',
          fontFamily: "'Cairo','Barlow Condensed',sans-serif",
          ['--tenant-primary' as string]:  '#FFCD11',
          ['--tenant-bg' as string]:       '#111111',
          ['--tenant-surface' as string]:  '#2A2A2A',
          ['--tenant-text' as string]:     '#FFFFFF',
          ['--tenant-muted' as string]:    '#A0A0A0',
        } as React.CSSProperties}
        dir="rtl"
      >
        {/* Sidebar (Desktop only) */}
        <div className="dashboard-sidebar">
          <Sidebar />
        </div>

        {/* Mobile Drawer */}
        <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

        {/* Main Content */}
        <main className="dashboard-main" style={{
          overflowY: 'auto', minHeight: '100vh', background: 'var(--bg)',
        }}>
          {/* Mobile Header with Hamburger */}
          <div className="dashboard-hamburger" style={{
            alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderBottom: '1px solid var(--cat-mid)',
            background: 'var(--cat-black)',
          }}>
            <button onClick={() => setDrawerOpen(true)} style={{
              background: 'none', border: 'none', fontSize: 24, cursor: 'pointer',
              color: 'var(--cat-yellow)', padding: 8,
            }}>
              ☰
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--cat-white)' }}>القائمة</span>
          </div>

          {children}
        </main>
      </div>
    </>
  );
}
