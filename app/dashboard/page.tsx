'use client';

import { UberCard, UberButton, UberTable } from '@/components/ui';
import { colors, spacing, typography } from '@/lib/design-system';

export default function PartnerDashboard() {
  const statCards = [
    { label: 'Active Equipment', value: 24, icon: '🚜', color: colors.uberYellow },
    { label: 'Active Drivers', value: 18, icon: '👥', color: colors.success },
    { label: 'Daily Income', value: '₹45.2K', icon: '📊', color: colors.uberBlue },
    { label: 'Open Cycles', value: 3, icon: '⏱️', color: colors.warning },
  ];

  const tableColumns = [
    { id: 'driver', label: 'Driver Name', sortable: true },
    { id: 'equipment', label: 'Equipment', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'earnings', label: 'Today Earnings', sortable: true },
  ];

  const tableData = [
    { driver: 'Ahmed Al-Rashid', equipment: 'Excavator', status: 'Active', earnings: '₹2,450' },
    { driver: 'Mohammed Salem', equipment: 'Loader', status: 'Active', earnings: '₹1,890' },
    { driver: 'Hassan Ibrahim', equipment: 'Bulldozer', status: 'On Break', earnings: '₹1,200' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: typography.sizes['3xl'], fontWeight: typography.weights.black, color: colors.text.primary, margin: 0 }}>
          Partner Dashboard
        </h1>
        <p style={{ fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
          Manage your equipment and drivers
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

      {/* QUICK ACTIONS */}
      <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
        <UberButton variant="primary">+ Add Driver</UberButton>
        <UberButton variant="secondary">+ Add Equipment</UberButton>
        <UberButton variant="ghost">View Reports</UberButton>
      </div>

      {/* ACTIVE DRIVERS TABLE */}
      <UberCard variant="elevated">
        <div style={{ marginBottom: spacing.lg }}>
          <h2 style={{
            fontSize: typography.sizes.lg,
            fontWeight: typography.weights.bold,
            color: colors.text.primary,
            margin: 0,
          }}>
            Active Operations
          </h2>
        </div>
        <UberTable
          columns={tableColumns}
          data={tableData}
          emptyMessage="No active operations"
        />
      </UberCard>
    </div>
  );
}
