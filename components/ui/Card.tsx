import React from 'react';
export { StatCard } from '@/app/components/StatCard';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ className = '', children, hoverable = true, padding = 'md', ...props }: CardProps) {
  const paddingClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };

  const hoverClass = hoverable ? 'hover:shadow-lg hover:scale-105 transition-all' : '';

  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-lg ${paddingClasses[padding]} shadow-md ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface HeaderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export function HeaderCard({ title, description, action, className = '', children, ...props }: HeaderCardProps) {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md ${className}`}
      {...props}
    >
      {(title || description || action) && (
        <div className="bg-gray-700 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
          <div>
            {title && <h3 className="font-semibold text-white">{title}</h3>}
            {description && <p className="text-sm text-gray-300">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children && <div className="p-4">{children}</div>}
    </div>
  );
}
