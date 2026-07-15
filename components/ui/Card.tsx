import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface HeaderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export function HeaderCard({ title, className = '', children, ...props }: HeaderCardProps) {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md ${className}`}
      {...props}
    >
      {title && (
        <div className="bg-gray-700 px-4 py-3 border-b border-gray-700">
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
