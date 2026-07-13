import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FFCD11] text-[#1A1A1A] hover:bg-opacity-90 active:bg-opacity-95 font-bold',
  secondary:
    'bg-[#2A3A4A] text-white hover:bg-[#3A4A5A] active:bg-[#2A3A4A] border border-[#3A4A5A]',
  danger:
    'bg-[#EF4444] text-white hover:bg-opacity-90 active:bg-opacity-95 font-bold',
  ghost:
    'bg-transparent text-white hover:bg-[#2A3A4A] active:bg-[#1E2A3A] border border-[#2A3A4A]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm h-10 rounded-md',
  md: 'px-4 py-2.5 text-base h-12 rounded-lg',
  lg: 'px-6 py-3 text-lg h-14 rounded-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-250 cursor-pointer',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFCD11]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95 hover:scale-102',

          // Variant styles
          variantStyles[variant],

          // Size styles
          sizeStyles[size],

          // Full width
          fullWidth && 'w-full',

          // Custom classes
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
