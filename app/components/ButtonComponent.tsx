'use client';

import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variantClasses = {
  primary: 'bg-[#FFCD11] text-[#1A1A1A] hover:shadow-lg hover:scale-105 active:scale-95',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm h-10',
  md: 'px-6 py-3 text-base h-12',
  lg: 'px-8 py-4 text-lg h-14',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled = false,
  children,
  className,
  asChild,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 min-h-12 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCD11]';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    isDisabled && 'opacity-50 cursor-not-allowed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (asChild) {
    return (
      <div
        className={classes}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>}
            {children}
            {rightIcon && <span>{rightIcon}</span>}
          </>
        )}
      </div>
    );
  }

  return (
    <button
      className={classes}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          {children}
        </>
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
