'use client';

import { useState } from 'react';
import { MobileHeader, DesktopHeader } from './MobileHeader';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Headers */}
      <MobileHeader
        onMenuToggle={setSidebarOpen}
        title="SHARAKH"
      />
      <DesktopHeader />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 md:ml-0">
          {/* Add padding to account for fixed headers */}
          <div className="pt-16 md:pt-20 pb-24 md:pb-8 px-4 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation (Mobile only) */}
      <BottomNavigation />
    </div>
  );
}
