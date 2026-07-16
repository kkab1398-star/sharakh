'use client';

import React from 'react';
import { colors, spacing, shadows, sizing, typography } from '@/lib/design-system';

interface UberHeaderProps {
  /** Logo/Brand element (left side) */
  logo?: React.ReactNode;
  /** Title/Page name (center) */
  title?: string;
  /** Right side content (user menu, actions, etc) */
  rightContent?: React.ReactNode;
  /** On menu/hamburger click */
  onMenuClick?: () => void;
  /** Custom styling */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * UberHeader - Fixed top header following Uber design style
 *
 * @example
 * <UberHeader
 *   logo={<span>Logo</span>}
 *   title="Dashboard"
 *   rightContent={<UserMenu />}
 * />
 */
export const UberHeader = React.forwardRef<HTMLDivElement, UberHeaderProps>(
  (
    {
      logo,
      title,
      rightContent,
      onMenuClick,
      className = '',
      style,
    },
    ref
  ) => {
    const headerStyle: React.CSSProperties = {
      // Fixed positioning
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,

      // Dimensions
      height: sizing.header,
      width: '100%',

      // Style
      backgroundColor: colors.uberBlack,
      borderBottom: `1px solid ${colors.gray[900]}`,
      boxShadow: shadows.md,

      // Content layout
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: spacing.lg,
      paddingRight: spacing.lg,

      // Typography
      fontFamily: typography.families.primary,

      // Prevent interaction issues
      backdropFilter: 'blur(8px)',
      ...style,
    };

    return (
      <header
        ref={ref}
        style={headerStyle}
        className={className}
      >
        {/* LEFT SIDE - Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            flex: '0 0 auto',
          }}
        >
          {/* Hamburger menu (shown on mobile) */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              style={{
                background: 'none',
                border: 'none',
                color: colors.text.white,
                fontSize: '24px',
                cursor: 'pointer',
                padding: spacing.sm,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Menu"
              title="Menu"
            >
              ☰
            </button>
          )}

          {/* Logo */}
          {logo && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '20px',
                fontWeight: typography.weights.bold,
                color: colors.text.white,
              }}
            >
              {logo}
            </div>
          )}
        </div>

        {/* CENTER - Title */}
        {title && (
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: typography.sizes.lg,
              fontWeight: typography.weights.bold,
              color: colors.text.white,
            }}
          >
            {title}
          </div>
        )}

        {/* RIGHT SIDE - User menu / Actions */}
        {rightContent && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              flex: '0 0 auto',
            }}
          >
            {rightContent}
          </div>
        )}
      </header>
    );
  }
);

UberHeader.displayName = 'UberHeader';

export default UberHeader;
