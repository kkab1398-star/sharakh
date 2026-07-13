'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    icon: '📊',
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: '👥',
    label: 'Drivers',
    href: '/dashboard/drivers',
  },
  {
    icon: '🚜',
    label: 'Equipment',
    href: '/dashboard/equipment',
  },
  {
    icon: '📋',
    label: 'Transactions',
    href: '/dashboard/transactions',
  },
  {
    icon: '⚙️',
    label: 'Settings',
    href: '/dashboard/settings',
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay - Show only on mobile when open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 pt-16"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // Base styles
          'fixed md:static top-16 md:top-0 left-0 bottom-0 w-64 md:w-80 lg:w-72',
          'bg-[#0F172A] border-r border-[#2A3A4A]',
          'overflow-y-auto transition-transform duration-300 z-40',
          'md:translate-x-0 md:pt-20',

          // Mobile responsive
          isOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        )}
      >
        <nav className="px-4 py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  // Base styles
                  'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-250',
                  'hover:bg-[#1E2A3A]',

                  // Active state
                  isActive
                    ? 'bg-[#FFCD11] text-[#1A1A1A]'
                    : 'text-[#B8BEC3] hover:text-white'
                )}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-[#EF4444] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A3A4A] bg-[#0F172A]">
          <button
            className="w-full px-4 py-3 rounded-lg bg-[#1E2A3A] text-white font-medium hover:bg-[#2A3A4A] transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
