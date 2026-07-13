import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  success?: boolean;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      icon,
      iconPosition = 'left',
      success,
      hint,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-semibold text-white capitalize"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 flex items-center text-[#B8BEC3] pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base styles
              'w-full px-4 py-3 rounded-lg font-base transition-all duration-250',
              'bg-[#1E2A3A] text-white placeholder-[#8B92A1]',
              'border-2 border-[#2A3A4A]',

              // Icon padding
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',

              // Focus state
              'focus:outline-none focus:border-[#FFCD11] focus:shadow-[0_0_0_3px_rgba(255,205,17,0.1)]',

              // Success state
              success && 'border-[#10B981] focus:border-[#10B981]',

              // Error state
              error && 'border-[#EF4444] focus:border-[#EF4444]',

              // Disabled state
              disabled && 'opacity-50 cursor-not-allowed bg-[#1A2A3A]',

              // Custom classes
              className
            )}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 flex items-center text-[#B8BEC3] pointer-events-none">
              {icon}
            </div>
          )}

          {success && (
            <div className="absolute right-3 flex items-center text-[#10B981]">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-[#EF4444] font-medium">{error}</p>}
        {success && (
          <p className="text-sm text-[#10B981] font-medium">
            {helperText || 'تم بنجاح'}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[#8B92A1]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
