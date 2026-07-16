'use client';

import React from 'react';
import { colors, spacing, borderRadius, shadows, transitions, sizing, typography } from '@/lib/design-system';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface UberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Show loading state */
  isLoading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Button children/text */
  children: React.ReactNode;
}

/**
 * UberButton - Unified button component following Uber design style
 *
 * @example
 * <UberButton variant="primary" size="md">Click me</UberButton>
 * <UberButton variant="danger" isLoading>Processing...</UberButton>
 */
export const UberButton = React.forwardRef<HTMLButtonElement, UberButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled = false,
      children,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    // Get size dimensions
    const sizeMap = {
      sm: sizing.button.sm,
      md: sizing.button.md,
      lg: sizing.button.lg,
      xl: sizing.button.xl,
    };

    // Get variant colors
    const variantStyles = {
      primary: {
        bg: colors.uberBlack,
        text: colors.text.white,
        hover: colors.gray[900],
        border: 'transparent',
      },
      secondary: {
        bg: colors.uberBlue,
        text: colors.text.white,
        hover: '#1560B8',
        border: 'transparent',
      },
      danger: {
        bg: colors.danger,
        text: colors.text.white,
        hover: '#B90218',
        border: 'transparent',
      },
      success: {
        bg: colors.success,
        text: colors.text.white,
        hover: '#0D9645',
        border: 'transparent',
      },
      ghost: {
        bg: 'transparent',
        text: colors.text.primary,
        hover: colors.gray[50],
        border: colors.gray[200],
      },
    };

    const current = variantStyles[variant];
    const isDisabledOrLoading = disabled || isLoading;

    const buttonStyle: React.CSSProperties = {
      // Size
      height: sizeMap[size],
      width: fullWidth ? '100%' : 'auto',
      minWidth: fullWidth ? 'auto' : '120px',

      // Colors
      backgroundColor: isDisabledOrLoading
        ? colors.gray[300]
        : current.bg,
      color: current.text,
      border: `2px solid ${current.border}`,

      // Typography
      fontFamily: typography.families.primary,
      fontSize: size === 'sm' ? typography.sizes.sm : typography.sizes.base,
      fontWeight: typography.weights.bold,
      lineHeight: 1.5,

      // Spacing
      paddingLeft: spacing.lg,
      paddingRight: spacing.lg,

      // Style
      borderRadius: borderRadius['2xl'],
      cursor: isDisabledOrLoading ? 'not-allowed' : 'pointer',
      opacity: isDisabledOrLoading ? 0.6 : 1,
      boxShadow: shadows.md,

      // Transitions
      transition: transitions.base,

      // Remove default button styles
      border: `2px solid ${current.border}`,
      outline: 'none',
    };

    const hoverStyle: React.CSSProperties = !isDisabledOrLoading
      ? {
          backgroundColor: current.hover,
          boxShadow: shadows.lg,
        }
      : {};

    return (
      <button
        ref={ref}
        disabled={isDisabledOrLoading}
        style={{
          ...buttonStyle,
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!isDisabledOrLoading) {
            Object.assign(e.currentTarget.style, hoverStyle);
          }
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, {
            backgroundColor: current.bg,
            boxShadow: shadows.md,
          });
        }}
        onMouseDown={(e) => {
          if (!isDisabledOrLoading) {
            e.currentTarget.style.transform = 'scale(0.95)';
          }
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        className={className}
        {...props}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}>
          {isLoading && (
            <svg
              style={{
                width: '1em',
                height: '1em',
                animation: `spin 1s linear infinite`,
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" strokeLinecap="round" />
            </svg>
          )}
          <span>{children}</span>
        </div>
      </button>
    );
  }
);

UberButton.displayName = 'UberButton';

export default UberButton;
