import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  bordered?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      hoverable = true,
      bordered = true,
      padding = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-lg bg-[#1E2A3A] transition-all duration-250',

          // Padding
          paddingStyles[padding],

          // Border
          bordered && 'border border-[#2A3A4A]',

          // Hoverable
          hoverable && 'cursor-pointer hover:border-[#FFCD11] hover:shadow-lg hover:-translate-y-1',

          // Custom classes
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// StatCard Component - for dashboard stats
interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
}

export function StatCard({ icon, label, value, change, trend }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden group">
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFCD11] opacity-5 rounded-full group-hover:opacity-10 transition-opacity" />

      <div className="relative z-10">
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-[#FFCD11] bg-opacity-10 flex items-center justify-center text-[#FFCD11] mb-3">
            {icon}
          </div>
        )}

        <p className="text-sm font-semibold text-[#B8BEC3] uppercase tracking-wide mb-2">
          {label}
        </p>

        <p className="text-3xl font-bold text-white mb-3">{value}</p>

        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-semibold',
              trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'
            )}
          >
            <span>{trend === 'up' ? '↑' : '↓'}</span>
            <span>{Math.abs(change)}%</span>
            <span className="text-[#8B92A1] ml-2">vs last month</span>
          </div>
        )}
      </div>
    </Card>
  );
}

// Header Card Component - for section headers
interface HeaderCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function HeaderCard({ title, description, action }: HeaderCardProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        {description && <p className="text-sm text-[#B8BEC3]">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
