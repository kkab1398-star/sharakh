'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileHeaderProps {
  onMenuToggle?: (open: boolean) => void;
  title?: string;
  logo?: React.ReactNode;
}

export function MobileHeader({
  onMenuToggle,
  title = 'SHARAKH',
  logo,
}: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile Header - Visible only on small screens */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0F172A] border-b border-[#2A3A4A] z-50 px-4 flex items-center justify-between">
        {/* Hamburger Menu */}
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="p-2 hover:bg-[#1E2A3A] rounded-lg transition-colors"
        >
          <svg
            className={`w-6 h-6 text-white transition-transform duration-300 ${
              isMenuOpen ? 'rotate-90' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        {/* Logo/Title */}
        <div className="flex-1 flex items-center justify-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            {logo || (
              <div className="w-8 h-8 bg-[#FFCD11] rounded-lg flex items-center justify-center text-[#1A1A1A] font-bold text-sm">
                🚜
              </div>
            )}
            <span className="text-lg font-bold text-[#FFCD11]">{title}</span>
          </Link>
        </div>

        {/* Profile/Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#1E2A3A] rounded-lg transition-colors">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 mt-16"
          onClick={() => {
            setIsMenuOpen(false);
            onMenuToggle?.(false);
          }}
        />
      )}
    </>
  );
}

// Desktop Header - Visible only on medium+ screens
export function DesktopHeader() {
  return (
    <header className="hidden md:block fixed top-0 left-0 right-0 h-16 bg-[#0F172A] border-b border-[#2A3A4A] z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FFCD11] rounded-lg flex items-center justify-center text-[#1A1A1A] font-bold">
            🚜
          </div>
          <span className="font-bold text-white hidden lg:inline">SHARAKH</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-[#1E2A3A] rounded-lg transition-colors">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
