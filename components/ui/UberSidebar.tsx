'use client';

import React from 'react';
import { colors, spacing, sizing, typography, transitions } from '@/lib/design-system';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface UberSidebarProps {
  /** Navigation items */
  items: NavItem[];
  /** Currently active item ID */
  activeItem?: string;
  /** On item click */
  onItemClick?: (item: NavItem) => void;
  /** Logo/Brand element */
  logo?: React.ReactNode;
  /** Custom styling */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * UberSidebar - Fixed left sidebar (Desktop only)
 * Hidden on mobile, shown on tablet/desktop
 *
 * @example
 * <UberSidebar
 *   items={navItems}
 *   activeItem="dashboard"
 *   onItemClick={handleNavClick}
 * />
 */
export const UberSidebar = React.forwardRef<HTMLDivElement, UberSidebarProps>(
  (
    {
      items,
      activeItem,
      onItemClick,
      logo,
      className = '',
      style,
    },
    ref
  ) => {
    const sidebarStyle: React.CSSProperties = {
      // Fixed positioning
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 90,

      // Dimensions
      width: sizing.sidebar.full,
      paddingTop: sizing.header,

      // Style
      backgroundColor: colors.uberBlack,
      borderRight: `1px solid ${colors.gray[900]}`,
      overflow: 'hidden',
      overflowY: 'auto',

      // Typography
      fontFamily: typography.families.primary,

      // Hidden on mobile
      '@media (max-width: 768px)': {
        display: 'none',
      },

      ...style,
    };

    return (
      <aside
        ref={ref}
        style={sidebarStyle}
        className={className}
      >
        {/* Logo Section */}
        {logo && (
          <div
            style={{
              padding: spacing.lg,
              borderBottom: `1px solid ${colors.gray[900]}`,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              color: colors.text.white,
            }}
          >
            {logo}
          </div>
        )}

        {/* Navigation Items */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: spacing.md,
            gap: spacing.sm,
          }}
        >
          {items.map((item) => {
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onItemClick?.(item);
                  item.onClick?.();
                }}
                style={{
                  // Reset button styles
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',

                  // Layout
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  width: '100%',
                  padding: `${spacing.md} ${spacing.lg}`,

                  // Style
                  color: isActive ? colors.uberBlue : colors.text.secondary,
                  backgroundColor: isActive ? colors.gray[900] : 'transparent',
                  borderRadius: '8px',

                  // Typography
                  fontSize: typography.sizes.sm,
                  fontWeight: isActive ? typography.weights.bold : typography.weights.medium,
                  fontFamily: typography.families.primary,

                  // Transitions
                  transition: transitions.base,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = colors.gray[900];
                    e.currentTarget.style.color = colors.text.white;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.text.secondary;
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Icon */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    fontSize: '18px',
                  }}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span
                  style={{
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div
                    style={{
                      width: '4px',
                      height: '20px',
                      backgroundColor: colors.uberBlue,
                      borderRadius: '2px',
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    );
  }
);

UberSidebar.displayName = 'UberSidebar';

export default UberSidebar;
