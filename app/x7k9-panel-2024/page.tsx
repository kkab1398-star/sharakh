'use client';

import { UberCard, UberButton, UberTable } from '@/components/ui';
import { colors, spacing, typography } from '@/lib/design-system';

export default function SuperAdminDashboard() {
  const statCards = [
    { label: 'Total Tenants', value: 42, icon: '🏢', color: colors.uberBlue },
    { label: 'Active Users', value: 127, icon: '✅', color: colors.success },
    { label: 'Trial Users', value: 18, icon: '⏳', color: colors.warning },
    { label: 'Revenue (SAR)', value: '1.2M', icon: '💰', color: colors.info },
  ];

  const tableColumns = [
    { id: 'name', label: 'Tenant Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'drivers', label: 'Drivers', sortable: false },
  ];

  const tableData = [
    { name: 'Tech Logistics', email: 'admin@techlog.com', status: 'Active', drivers: 12 },
    { name: 'Fast Delivery', email: 'info@fastdel.com', status: 'Trial', drivers: 5 },
    { name: 'Prime Transport', email: 'contact@prime.com', status: 'Active', drivers: 28 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: typography.sizes['3xl'], fontWeight: typography.weights.black, color: colors.text.primary, margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
          Welcome back! Here's your admin overview.
        </p>
      </div>

      {/* STATS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: spacing.lg,
      }}>
        {statCards.map((card) => (
          <UberCard key={card.label} variant="elevated">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: spacing.md,
            }}>
              <div>
                <p style={{
                  fontSize: typography.sizes.xs,
                  color: colors.text.secondary,
                  fontWeight: typography.weights.semibold,
                  textTransform: 'uppercase',
                  margin: 0,
                }}>
                  {card.label}
                </p>
              </div>
              <span style={{ fontSize: '24px' }}>{card.icon}</span>
            </div>
            <p style={{
              fontSize: typography.sizes['2xl'],
              fontWeight: typography.weights.black,
              color: card.color,
              margin: 0,
            }}>
              {card.value}
            </p>
          </UberCard>
        ))}
      </div>

      {/* ACTIONS */}
      <div style={{ display: 'flex', gap: spacing.md }}>
        <UberButton variant="primary">+ Add Tenant</UberButton>
        <UberButton variant="secondary">Export Report</UberButton>
      </div>

      {/* TENANTS TABLE */}
      <UberCard variant="elevated">
        <div style={{ marginBottom: spacing.lg }}>
          <h2 style={{
            fontSize: typography.sizes.lg,
            fontWeight: typography.weights.bold,
            color: colors.text.primary,
            margin: 0,
          }}>
            Recent Tenants
          </h2>
        </div>
        <UberTable
          columns={tableColumns}
          data={tableData}
          emptyMessage="No tenants found"
        />
      </UberCard>
    </div>
  );
}
