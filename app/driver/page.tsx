'use client';

import { UberCard, UberButton, UberTable } from '@/components/ui';
import { colors, spacing, typography } from '@/lib/design-system';

export default function DriverDashboard() {
  const balanceCard = {
    balance: '₹12,450',
    currency: 'SAR',
    label: 'Your Balance',
  };

  const statCards = [
    { label: 'Today Income', value: '₹2,450', icon: '📈', color: colors.success },
    { label: 'Expenses', value: '₹850', icon: '📉', color: colors.danger },
    { label: 'Advances', value: '₹5,000', icon: '⏳', color: colors.warning },
    { label: 'Net Today', value: '₹(3,400)', icon: '💰', color: colors.info },
  ];

  const tableColumns = [
    { id: 'time', label: 'Time', sortable: false },
    { id: 'type', label: 'Type', sortable: false },
    { id: 'amount', label: 'Amount', sortable: true },
  ];

  const tableData = [
    { time: '02:45 PM', type: 'Trip to Al-Malaz', amount: '+₹850' },
    { time: '01:15 PM', type: 'Fuel', amount: '-₹120' },
    { time: '11:30 AM', type: 'Trip to Al-Ruwais', amount: '+₹1,200' },
    { time: 'Yesterday', type: 'Maintenance', amount: '-₹400' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, paddingBottom: spacing['2xl'] }}>
      {/* BALANCE CARD - PROMINENT */}
      <UberCard variant="elevated">
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: typography.sizes.sm,
            color: colors.text.secondary,
            fontWeight: typography.weights.semibold,
            textTransform: 'uppercase',
            margin: 0,
            marginBottom: spacing.md,
          }}>
            {balanceCard.label}
          </p>
          <p style={{
            fontSize: '48px',
            fontWeight: typography.weights.black,
            color: colors.uberBlack,
            margin: 0,
          }}>
            {balanceCard.balance}
          </p>
        </div>
      </UberCard>

      {/* STATS GRID (2x2) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: spacing.md,
      }}>
        {statCards.map((card) => (
          <UberCard key={card.label} variant="default">
            <p style={{
              fontSize: typography.sizes.xs,
              color: colors.text.secondary,
              fontWeight: typography.weights.semibold,
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: spacing.xs,
            }}>
              {card.label}
            </p>
            <p style={{
              fontSize: typography.sizes.xl,
              fontWeight: typography.weights.black,
              color: card.color,
              margin: 0,
            }}>
              {card.value}
            </p>
          </UberCard>
        ))}
      </div>

      {/* QUICK ACTION BUTTON */}
      <UberButton variant="primary" size="lg" fullWidth>
        + Add Transaction
      </UberButton>

      {/* RECENT TRANSACTIONS TABLE */}
      <UberCard variant="elevated">
        <div style={{ marginBottom: spacing.lg }}>
          <h2 style={{
            fontSize: typography.sizes.lg,
            fontWeight: typography.weights.bold,
            color: colors.text.primary,
            margin: 0,
          }}>
            Recent Activity
          </h2>
        </div>
        <UberTable
          columns={tableColumns}
          data={tableData}
          emptyMessage="No transactions yet"
        />
      </UberCard>

      {/* SPACING FOR BOTTOM NAV */}
      <div style={{ height: spacing.xl }} />
    </div>
  );
}
