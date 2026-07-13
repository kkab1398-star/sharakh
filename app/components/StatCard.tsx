'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon?: LucideIcon | React.ReactNode;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
  color?: 'yellow' | 'green' | 'red' | 'blue';
  onClick?: () => void;
}

const colorClasses = {
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-l-4 border-[#FFCD11]',
    text: 'text-[#FFCD11]',
    icon: 'text-[#FFCD11]',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-l-4 border-[#10B981]',
    text: 'text-[#10B981]',
    icon: 'text-[#10B981]',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-l-4 border-[#EF4444]',
    text: 'text-[#EF4444]',
    icon: 'text-[#EF4444]',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-l-4 border-[#3B82F6]',
    text: 'text-[#3B82F6]',
    icon: 'text-[#3B82F6]',
  },
};

export function StatCard({
  icon,
  label,
  value,
  trend,
  change,
  color = 'yellow',
  onClick,
}: StatCardProps) {
  const classes = colorClasses[color];

  return (
    <div
      className={`${classes.bg} ${classes.border} rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
            {label}
          </p>
        </div>
        {icon && (
          <div className={`text-2xl ${classes.icon}`}>
            {typeof icon === 'string' ? icon : <icon className="w-6 h-6" />}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <p className={`text-2xl md:text-3xl font-bold ${classes.text}`}>
          {value}
        </p>
        {trend && change !== undefined && (
          <div
            className={`text-xs font-semibold flex items-center gap-1 ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-600'
            }`}
          >
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {change}%
          </div>
        )}
      </div>
    </div>
  );
}
