import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { TopBar } from '../../components/dashboard/TopBar';
import { ShieldAlert } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Persistent bottom legal disclaimer */}
        <footer className="px-6 py-4 border-t border-white/[0.05] bg-[#080B0F] text-slate-500 text-[11px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>
              Algorithmic signals for educational purposes only. Cryptocurrency trading involves substantial risk of loss.
            </span>
          </div>
          <span className="hidden sm:inline">Kamboh Plus Quant Engine v2.4</span>
        </footer>
      </div>
    </div>
  );
};
