'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ProfessionalIconName, ProfessionalIconsMap } from '@/lib/professional-icons';

interface ProIconProps {
  name?: ProfessionalIconName;
  icon?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  color?: 'primary' | 'dark' | 'light' | 'success' | 'danger' | 'warning' | 'info' | 'gray' | 'white';
  variant?: 'solid' | 'outline' | 'ghost';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  animate?: 'none' | 'spin' | 'bounce' | 'pulse';
  title?: string;
}

// ═══════════════════════════════════════════════════════════════
// 📏 Size Map (احترافي)
// ═══════════════════════════════════════════════════════════════
const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12',
  '3xl': 'w-16 h-16',
} as const;

// ═══════════════════════════════════════════════════════════════
// 🎨 Color Map (CAT Theme - احترافي)
// ═══════════════════════════════════════════════════════════════
const colorMap = {
  primary: 'text-[#FFCD11]',
  dark: 'text-[#1A1A1A]',
  light: 'text-[#A0A0A0]',
  success: 'text-green-500',
  danger: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
  gray: 'text-gray-600',
  white: 'text-white',
} as const;

// ═══════════════════════════════════════════════════════════════
// 🎭 Variant Map (احترافي)
// ═══════════════════════════════════════════════════════════════
const variantMap = {
  solid: 'bg-opacity-100',
  outline: 'border-2',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
} as const;

// ═══════════════════════════════════════════════════════════════
// ✨ Animation Map (احترافي)
// ═══════════════════════════════════════════════════════════════
const animationMap = {
  none: '',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
} as const;

export const ProIcon = React.forwardRef<HTMLDivElement, ProIconProps>(
  (
    {
      name,
      icon,
      size = 'md',
      color = 'dark',
      variant = 'ghost',
      className = '',
      onClick,
      disabled = false,
      loading = false,
      animate = 'none',
      title,
    },
    ref
  ) => {
    // الحصول على الأيقونة
    let IconComponent: React.ComponentType<any> | undefined;

    if (name) {
      IconComponent = ProfessionalIconsMap[name] as React.ComponentType<any>;
    }

    const renderIcon = () => {
      if (icon) {
        return icon;
      }

      if (IconComponent) {
        return <IconComponent className={cn(sizeMap[size])} />;
      }

      return null;
    };

    const isInteractive = onClick || (onClick && !disabled);

    return (
      <div
        ref={ref}
        className={cn(
          // الحجم والألوان الأساسية
          sizeMap[size],
          colorMap[color],
          // التفاعلية
          isInteractive && !disabled && 'cursor-pointer hover:opacity-75 transition-opacity',
          disabled && 'opacity-50 cursor-not-allowed',
          // التحريك
          animate !== 'none' && animationMap[animate],
          // Classes إضافية
          'flex items-center justify-center',
          className
        )}
        onClick={() => !disabled && !loading && onClick?.()}
        role={isInteractive ? 'button' : 'img'}
        tabIndex={isInteractive && !disabled ? 0 : undefined}
        onKeyDown={(e) => {
          if (isInteractive && !disabled && (e.key === 'Enter' || e.key === ' ')) {
            onClick?.();
          }
        }}
        title={title}
        aria-label={title}
        aria-disabled={disabled}
        aria-busy={loading}
      >
        {loading ? (
          <div className={cn(sizeMap[size], 'animate-spin')}>
            <svg
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : (
          renderIcon()
        )}
      </div>
    );
  }
);

ProIcon.displayName = 'ProIcon';

// ═══════════════════════════════════════════════════════════════
// 🎯 IconButton Component (احترافي)
// ═══════════════════════════════════════════════════════════════
interface ProIconButtonProps extends ProIconProps {
  label?: string;
  badge?: string | number;
}

export const ProIconButton = React.forwardRef<HTMLButtonElement, ProIconButtonProps>(
  ({ label, badge, size = 'md', color = 'dark', onClick, disabled, loading, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled || loading}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2',
          'hover:scale-110 transition-transform',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-[#FFCD11]',
          'rounded-lg p-2'
        )}
        title={label}
      >
        <div className="relative">
          <ProIcon size={size} color={color} disabled={disabled} loading={loading} {...props} />
          {badge && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {label && <span className="text-xs font-600 text-[#1A1A1A]">{label}</span>}
      </button>
    );
  }
);

ProIconButton.displayName = 'ProIconButton';

// ═══════════════════════════════════════════════════════════════
// 🎨 IconGroup Component (للمجموعات)
// ═══════════════════════════════════════════════════════════════
interface ProIconGroupProps {
  icons: Array<{
    name?: ProfessionalIconName;
    icon?: React.ReactNode;
    label?: string;
    onClick?: () => void;
    color?: ProIconProps['color'];
  }>;
  size?: ProIconProps['size'];
  direction?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
}

export function ProIconGroup({
  icons,
  size = 'md',
  direction = 'horizontal',
  spacing = 'normal',
}: ProIconGroupProps) {
  const spacingMap = {
    tight: 'gap-1',
    normal: 'gap-3',
    loose: 'gap-6',
  };

  return (
    <div
      className={cn(
        'flex',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        spacingMap[spacing]
      )}
    >
      {icons.map((iconProps, index) => (
        <ProIconButton
          key={index}
          size={size}
          {...iconProps}
        />
      ))}
    </div>
  );
}
