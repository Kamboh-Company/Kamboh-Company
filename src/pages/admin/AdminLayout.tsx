import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Radio,
  Sliders,
  Users,
  Megaphone,
  Inbox,
  ArrowLeft,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AdminLayout: React.FC = () => {
  const { role, profile, user } = useAuth();
  const navigate = useNavigate();

  // Protect admin route
  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied (Staff Only)</h1>
        <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
          The /admin control area is restricted to administrative role accounts. Use the preview role switcher in the navbar or log in as an administrator.
        </p>
        <div className="flex gap-3">
          <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
          <Button variant="outline" size="md" onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { label: 'Overview', to: '/admin', end: true, icon: LayoutDashboard },
    { label: 'Signals Management', to: '/admin/signals', icon: Radio },
    { label: 'Engine Control', to: '/admin/engine', icon: Sliders },
    { label: 'Users & Subscriptions', to: '/admin/users', icon: Users },
    { label: 'Announcements', to: '/admin/announcements', icon: Megaphone },
    { label: 'Contact Inbox', to: '/admin/inbox', icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="h-16 w-full bg-[#121622] border-b border-purple-500/20 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Return to Trader Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base tracking-tight">
              Kamboh Plus <span className="text-purple-400 font-mono">QUANT ADMIN</span>
            </span>
            <Badge variant="purple" size="xs">Root Access</Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Admin: <span className="text-white font-semibold">{user?.email}</span>
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Exit to App
          </Button>
        </div>
      </header>

      {/* Admin Subnav */}
      <div className="bg-[#0E131C] border-b border-white/[0.06] px-4 sm:px-8 overflow-x-auto">
        <nav className="flex space-x-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
