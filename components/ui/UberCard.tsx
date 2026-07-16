'use client';

import React from 'react';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-system';

type CardVariant = 'default' | 'elevated' | 'outlined';

interface UberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card visual variant */
  variant?: CardVariant;
  /** Custom padding */
  padding?: string;
  /** Card children */
  children: React.ReactNode;
}

interface UberCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface UberCardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface UberCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * UberCard - Unified card component following Uber design style
 *
 * @example
 * <UberCard variant="elevated">
 *   <UberCard.Header>Title</UberCard.Header>
 *   <UberCard.Body>Content here</UberCard.Body>
 *   <UberCard.Footer>Footer action</UberCard.Footer>
 * </UberCard>
 */
export const UberCard = React.forwardRef<HTMLDivElement, UberCardProps>(
  (
    {
      variant = 'default',
      padding = spacing.lg,
      children,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    // Variant styles
    const variantStyles = {
      default: {
        backgroundColor: colors.bg.white,
        border: `1px solid ${colors.gray[100]}`,
        boxShadow: shadows.sm,
      },
      elevated: {
        backgroundColor: colors.bg.white,
        border: 'none',
        boxShadow: shadows.lg,
      },
      outlined: {
        backgroundColor: colors.bg.light,
        border: `2px solid ${colors.gray[200]}`,
        boxShadow: 'none',
      },
    };

    const current = variantStyles[variant];

    const cardStyle: React.CSSProperties = {
      // Layout
      display: 'flex',
      flexDirection: 'column',

      // Style
      backgroundColor: current.backgroundColor,
      border: current.border,
      boxShadow: current.boxShadow,
      borderRadius: borderRadius.xl,
      padding,

      // Typography
      fontFamily: typography.families.primary,
      color: colors.text.primary,

      // Behavior
      transition: 'all 200ms ease-out',

      // Responsive
      '@media (max-width: 768px)': {
        padding: spacing.md,
      },
    };

    return (
      <div
        ref={ref}
        style={{
          ...cardStyle,
          ...style,
        }}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

UberCard.displayName = 'UberCard';

/**
 * UberCard.Header - Card header section
 */
export const UberCardHeader = React.forwardRef<HTMLDivElement, UberCardHeaderProps>(
  ({ children, className = '', style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: spacing.md,
        borderBottom: `1px solid ${colors.gray[100]}`,
        marginBottom: spacing.md,
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
);

UberCardHeader.displayName = 'UberCard.Header';

/**
 * UberCard.Body - Card body content section
 */
export const UberCardBody = React.forwardRef<HTMLDivElement, UberCardBodyProps>(
  ({ children, className = '', style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        flex: 1,
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
);

UberCardBody.displayName = 'UberCard.Body';

/**
 * UberCard.Footer - Card footer section
 */
export const UberCardFooter = React.forwardRef<HTMLDivElement, UberCardFooterProps>(
  ({ children, className = '', style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: spacing.md,
        paddingTop: spacing.md,
        borderTop: `1px solid ${colors.gray[100]}`,
        marginTop: spacing.md,
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
);

UberCardFooter.displayName = 'UberCard.Footer';

// Attach subcomponents
UberCard.Header = UberCardHeader;
UberCard.Body = UberCardBody;
UberCard.Footer = UberCardFooter;

export default UberCard;
