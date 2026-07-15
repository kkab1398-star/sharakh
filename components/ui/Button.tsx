import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode | string;
  rightIcon?: React.ReactNode | string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-yellow-400 text-black hover:bg-yellow-500 disabled:hover:bg-yellow-400',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600 disabled:hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-600',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? '⏳ جاري...' : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
