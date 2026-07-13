'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  CreditCard,
  History,
  User,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/driver', icon: Home, label: 'Home', key: 'home' },
  { href: '/driver/drivers', icon: Users, label: 'Drivers', key: 'drivers' },
  { href: '/driver/transactions', icon: CreditCard, label: 'Transactions', key: 'transactions' },
  { href: '/driver/history', icon: History, label: 'History', key: 'history' },
  { href: '/driver/profile', icon: User, label: 'Profile', key: 'profile' },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center h-full px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label, key }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');

          return (
            <Link
              key={key}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#FFCD11] text-[#1A1A1A]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
