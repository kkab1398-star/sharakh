'use client';

import React from 'react';
import { colors, spacing, typography, transitions } from '@/lib/design-system';

export interface TableColumn {
  id: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface UberTableProps {
  /** Table columns */
  columns: TableColumn[];
  /** Table data rows */
  data: any[];
  /** On column sort */
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Custom styling */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

interface TableSortState {
  column: string;
  direction: 'asc' | 'desc';
}

/**
 * UberTable - Data table following Uber design style
 *
 * @example
 * <UberTable
 *   columns={[
 *     { id: 'name', label: 'Name', sortable: true },
 *     { id: 'email', label: 'Email' },
 *   ]}
 *   data={users}
 *   onSort={handleSort}
 * />
 */
export const UberTable = React.forwardRef<HTMLDivElement, UberTableProps>(
  (
    {
      columns,
      data,
      onSort,
      loading = false,
      emptyMessage = 'No data available',
      className = '',
      style,
    },
    ref
  ) => {
    const [sortState, setSortState] = React.useState<TableSortState | null>(null);

    const handleColumnSort = (columnId: string) => {
      if (!onSort) return;

      const newDirection =
        sortState?.column === columnId && sortState.direction === 'asc'
          ? 'desc'
          : 'asc';

      setSortState({ column: columnId, direction: newDirection });
      onSort(columnId, newDirection);
    };

    const containerStyle: React.CSSProperties = {
      width: '100%',
      overflowX: 'auto',
      ...style,
    };

    const tableStyle: React.CSSProperties = {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: typography.families.primary,
      fontSize: typography.sizes.sm,
    };

    const thStyle: React.CSSProperties = {
      // Layout
      padding: spacing.md,
      textAlign: 'left',

      // Style
      backgroundColor: colors.gray[50],
      borderBottom: `2px solid ${colors.gray[200]}`,
      color: colors.text.primary,

      // Typography
      fontWeight: typography.weights.bold,
      fontSize: typography.sizes.sm,

      // Responsive
      whiteSpace: 'nowrap',
    };

    const tdStyle: React.CSSProperties = {
      // Layout
      padding: spacing.md,

      // Style
      borderBottom: `1px solid ${colors.gray[100]}`,
      color: colors.text.primary,

      // Typography
      fontSize: typography.sizes.sm,
    };

    const rowHoverStyle: React.CSSProperties = {
      backgroundColor: colors.gray[50],
      transition: transitions.base,
    };

    return (
      <div
        ref={ref}
        style={containerStyle}
        className={className}
      >
        {loading ? (
          <div
            style={{
              padding: spacing.xl,
              textAlign: 'center',
              color: colors.text.tertiary,
            }}
          >
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div
            style={{
              padding: spacing.xl,
              textAlign: 'center',
              color: colors.text.tertiary,
              fontSize: typography.sizes.sm,
            }}
          >
            {emptyMessage}
          </div>
        ) : (
          <table style={tableStyle}>
            {/* Table Header */}
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    style={{
                      ...thStyle,
                      width: col.width,
                      textAlign: col.align || 'left',
                      cursor: col.sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                    onClick={() => col.sortable && handleColumnSort(col.id)}
                    role="columnheader"
                    aria-sort={
                      sortState?.column === col.id
                        ? sortState.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.sm,
                      }}
                    >
                      <span>{col.label}</span>

                      {/* Sort indicator */}
                      {col.sortable && (
                        <span
                          style={{
                            fontSize: '12px',
                            opacity:
                              sortState?.column === col.id ? 1 : 0.3,
                            transition: transitions.base,
                          }}
                        >
                          {sortState?.column === col.id
                            ? sortState.direction === 'asc'
                              ? '↑'
                              : '↓'
                            : '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    transition: transitions.base,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = rowHoverStyle.backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={`${rowIndex}-${col.id}`}
                      style={{
                        ...tdStyle,
                        textAlign: col.align || 'left',
                        width: col.width,
                      }}
                    >
                      {col.render
                        ? col.render(row[col.id], row)
                        : row[col.id] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
);

UberTable.displayName = 'UberTable';

export default UberTable;
