'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
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
    icon: '⚙️',
    label: 'Settings',
    href: '/dashboard/settings',
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0F172A] border-t border-[#2A3A4A] z-40">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                // Base styles
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg flex-1 transition-all duration-250',

                // Active state
                isActive
                  ? 'bg-[#FFCD11] text-[#1A1A1A]'
                  : 'text-[#B8BEC3] hover:text-white hover:bg-[#1E2A3A]'
              )}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-semibold text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
