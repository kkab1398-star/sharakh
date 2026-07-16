'use client';

import React from 'react';
import { colors, spacing, sizing, typography, shadows, transitions } from '@/lib/design-system';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: number;
}

interface UberBottomNavProps {
  /** Navigation items */
  items: NavItem[];
  /** Currently active item ID */
  activeItem?: string;
  /** On item click */
  onItemClick?: (item: NavItem) => void;
  /** Custom styling */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * UberBottomNav - Fixed bottom navigation (Mobile only)
 * Hidden on desktop, shown on mobile/tablet
 *
 * @example
 * <UberBottomNav
 *   items={navItems}
 *   activeItem="home"
 *   onItemClick={handleNavClick}
 * />
 */
export const UberBottomNav = React.forwardRef<HTMLDivElement, UberBottomNavProps>(
  (
    {
      items,
      activeItem,
      onItemClick,
      className = '',
      style,
    },
    ref
  ) => {
    const navStyle: React.CSSProperties = {
      // Fixed positioning
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 90,

      // Dimensions
      height: sizing.bottomNav,
      width: '100%',

      // Style
      backgroundColor: colors.uberBlack,
      borderTop: `1px solid ${colors.gray[900]}`,
      boxShadow: shadows.xl,

      // Content layout
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      paddingTop: spacing.sm,

      // Typography
      fontFamily: typography.families.primary,

      // Hidden on desktop
      '@media (min-width: 1024px)': {
        display: 'none',
      },

      ...style,
    };

    return (
      <nav
        ref={ref}
        style={navStyle}
        className={className}
        role="navigation"
        aria-label="Bottom navigation"
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

                // Layout
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.xs,
                flex: 1,
                padding: spacing.md,
                position: 'relative',

                // Typography
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.semibold,
                fontFamily: typography.families.primary,
                color: isActive ? colors.uberBlue : colors.text.secondary,

                // Transitions
                transition: transitions.base,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = colors.text.white;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = colors.text.secondary;
                }
              }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              {/* Icon */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  fontSize: '20px',
                  position: 'relative',
                }}
              >
                {item.icon}

                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      minWidth: '18px',
                      height: '18px',
                      backgroundColor: colors.danger,
                      color: colors.text.white,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: typography.weights.bold,
                    }}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '60px',
                }}
              >
                {item.label}
              </span>

              {/* Active indicator (top line) */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: spacing.md,
                    right: spacing.md,
                    height: '3px',
                    backgroundColor: colors.uberBlue,
                    borderBottomLeftRadius: '2px',
                    borderBottomRightRadius: '2px',
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
    );
  }
);

UberBottomNav.displayName = 'UberBottomNav';

export default UberBottomNav;
