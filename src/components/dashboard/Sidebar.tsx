import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  History,
  Star,
  Calculator,
  Bell,
  CreditCard,
  Settings,
  Shield,
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Gift,
  PlayCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { plan, role, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Signals Feed', to: '/dashboard/signals', icon: Radio, badge: 'Live' },
    { label: 'Signal History', to: '/dashboard/history', icon: History },
    { label: 'Watchlist', to: '/dashboard/watchlist', icon: Star },
    { label: 'Risk Calculator', to: '/dashboard/calculator', icon: Calculator },
    { label: 'Refer & Earn', to: '/dashboard/referrals', icon: Gift, badge: '30%' },
    { label: 'A-Z Video Guide', to: '/dashboard/guide', icon: PlayCircle, badge: 'Watch' },
    { label: 'Notifications', to: '/dashboard/notifications', icon: Bell },
    { label: 'Billing & Plans', to: '/dashboard/billing', icon: CreditCard },
    { label: 'Settings', to: '/dashboard/settings', icon: Settings },
  ];

  const content = (
    <div className="flex flex-col h-full justify-between bg-[#0E131C] border-r border-white/[0.08] p-3 text-slate-300">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-3 mb-4">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-white tracking-tight">
                  Kamboh<span className="text-blue-400">Plus</span>
                </span>
                <span className="text-[9px] text-slate-400 -mt-0.5 tracking-wider font-semibold">
                  QUANT DASHBOARD
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Plan Badge */}
        {!collapsed && (
          <div className="mx-2 mb-5 p-3 rounded-xl bg-[#141923] border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-medium">CURRENT PLAN</div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mt-0.5">
                {plan === 'pro' ? 'PRO MEMBER' : 'FREE TIER'}
              </div>
            </div>
            {plan === 'pro' ? (
              <Badge variant="pro" size="xs">Active</Badge>
            ) : (
              <button
                onClick={() => navigate('/pricing')}
                className="text-[11px] font-bold text-blue-400 hover:text-blue-300 underline"
              >
                Upgrade
              </button>
            )}
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/dashboard'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'hover:bg-white/5 text-slate-400 hover:text-slate-100'
                  } ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? link.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="flex-1">{link.label}</span>}
                {!collapsed && link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-[#16C784]">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Admin Route (Role Protected) */}
          {isAdmin && (
            <div className="pt-2">
              <NavLink
                to="/admin"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 font-semibold'
                      : 'text-purple-400 hover:bg-purple-500/10 hover:text-purple-200'
                  } ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? 'Admin Panel' : undefined}
              >
                <Shield className="w-4 h-4 flex-shrink-0 text-purple-400" />
                {!collapsed && (
                  <>
                    <span className="flex-1 font-semibold">Admin Panel</span>
                    <Badge variant="purple" size="xs">Staff</Badge>
                  </>
                )}
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="pt-4 border-t border-white/[0.06] space-y-2">
        <button
          onClick={() => {
            onCloseMobile();
            logout();
            navigate('/');
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${
            collapsed ? 'justify-center px-2' : ''
          }`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block h-screen sticky top-0 transition-all duration-300 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 h-full bg-[#0E131C] z-10 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
