import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-2 text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`
          px-4 py-2 rounded border border-gray-600 bg-gray-700 text-white
          placeholder-gray-400 focus:outline-none focus:border-yellow-400
          transition-colors ${error ? 'border-red-500' : ''} ${className}
        `}
        {...props}
      />
      {error && (
        <span className="mt-1 text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}
