'use client';

import React from 'react';
import { colors, spacing, borderRadius, typography, transitions } from '@/lib/design-system';

interface UberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  /** Error message */
  errorMessage?: string;
  /** Helper text below input */
  helperText?: string;
  /** Show error state */
  error?: boolean;
  /** Full width input */
  fullWidth?: boolean;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * UberInput - Unified input component following Uber design style
 *
 * @example
 * <UberInput
 *   label="Email"
 *   type="email"
 *   placeholder="your@email.com"
 *   error={hasError}
 *   errorMessage="Invalid email"
 * />
 */
export const UberInput = React.forwardRef<HTMLInputElement, UberInputProps>(
  (
    {
      label,
      errorMessage,
      helperText,
      error = false,
      fullWidth = false,
      size = 'md',
      placeholder,
      disabled = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    // Size map
    const sizeMap = {
      sm: { height: '32px', padding: `${spacing.sm} ${spacing.md}`, fontSize: typography.sizes.sm },
      md: { height: '40px', padding: `${spacing.md} ${spacing.md}`, fontSize: typography.sizes.base },
      lg: { height: '48px', padding: `${spacing.md} ${spacing.lg}`, fontSize: typography.sizes.lg },
    };

    const currentSize = sizeMap[size];

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.xs,
      width: fullWidth ? '100%' : 'auto',
      ...style,
    };

    const labelStyle: React.CSSProperties = {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.semibold,
      color: colors.text.primary,
      fontFamily: typography.families.primary,
    };

    const inputStyle: React.CSSProperties = {
      // Size
      height: currentSize.height,
      width: fullWidth ? '100%' : 'auto',
      minWidth: '200px',

      // Spacing
      padding: currentSize.padding,

      // Style
      backgroundColor: disabled ? colors.gray[50] : colors.bg.white,
      border: `2px solid ${error ? colors.danger : colors.gray[200]}`,
      borderRadius: borderRadius.lg,
      color: colors.text.primary,
      cursor: disabled ? 'not-allowed' : 'text',

      // Typography
      fontFamily: typography.families.primary,
      fontSize: currentSize.fontSize,
      lineHeight: 1.5,

      // Transitions
      transition: transitions.base,

      // Placeholder
      outlineColor: 'transparent',
    };

    const helperStyle: React.CSSProperties = {
      fontSize: typography.sizes.xs,
      color: error ? colors.danger : colors.text.tertiary,
      fontFamily: typography.families.primary,
    };

    return (
      <div style={containerStyle} className={className}>
        {/* Label */}
        {label && (
          <label style={labelStyle}>
            {label}
            {props.required && <span style={{ color: colors.danger }}>*</span>}
          </label>
        )}

        {/* Input */}
        <input
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            ...inputStyle,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? colors.danger : colors.uberBlue;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? colors.danger : colors.uberBlue}20`;
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? colors.danger : colors.gray[200];
            e.currentTarget.style.boxShadow = 'none';
            props.onBlur?.(e);
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = error ? colors.danger : colors.uberBlue;
            }
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.currentTarget) {
              e.currentTarget.style.borderColor = error ? colors.danger : colors.gray[200];
            }
          }}
          {...props}
        />

        {/* Helper or Error Text */}
        {(errorMessage || helperText) && (
          <span style={helperStyle}>
            {error && errorMessage ? `⚠️ ${errorMessage}` : helperText}
          </span>
        )}
      </div>
    );
  }
);

UberInput.displayName = 'UberInput';

export default UberInput;
