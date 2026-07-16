'use client';

import React, { useState } from 'react';
import { UberHeader, UberSidebar } from '@/components/ui';
import { colors, spacing, sizing } from '@/lib/design-system';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/x7k9-panel-2024' },
  { id: 'tenants', label: 'Tenants', icon: '🏢', href: '/x7k9-panel-2024/tenants' },
  { id: 'analytics', label: 'Analytics', icon: '📈', href: '/x7k9-panel-2024/analytics' },
  { id: 'revenue', label: 'Revenue', icon: '💰', href: '/x7k9-panel-2024/revenue' },
  { id: 'settings', label: 'Settings', icon: '⚙️', href: '/x7k9-panel-2024/settings' },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavClick = (item: NavItem) => {
    setCurrentPage(item.id);
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: colors.bg.light,
      }}
    >
      {/* SIDEBAR */}
      <UberSidebar
        items={NAV_ITEMS}
        activeItem={currentPage}
        onItemClick={handleNavClick}
        logo={<span style={{ fontSize: '20px', fontWeight: 'bold', color: colors.text.white }}>ADMIN</span>}
      />

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: sizing.sidebar.full,
          '@media (max-width: 1024px)': {
            marginLeft: 0,
          },
        }}
      >
        {/* HEADER */}
        <UberHeader
          logo={<span>🚜</span>}
          title="PartnerOps Admin"
          rightContent={
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.text.white,
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: spacing.sm,
                }}
              >
                👤
              </button>
            </div>
          }
        />

        {/* PAGE CONTENT */}
        <main
          style={{
            flex: 1,
            padding: spacing.lg,
            marginTop: sizing.header,
            overflowY: 'auto',
            '@media (max-width: 768px)': {
              padding: spacing.md,
            },
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
