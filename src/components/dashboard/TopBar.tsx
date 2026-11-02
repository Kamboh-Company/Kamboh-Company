import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Check,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationStorage } from '../../lib/supabase';
import { Badge } from '../ui/Badge';
import { formatTimeAgo } from '../../lib/utils';

export interface TopBarProps {
  onOpenMobileSidebar: () => void;
  onSearch?: (query: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileSidebar, onSearch }) => {
  const { user, profile, plan, role, isPro, upgradeToPro, downgradeToFree, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchVal, setSearchVal] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);

  const notifications = user ? notificationStorage.getNotifications(user.id) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleMarkAllRead = () => {
    if (user) {
      notificationStorage.markAsRead(user.id);
    }
  };

  return (
    <header className="h-16 w-full bg-[#0B0E14]/80 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search coin (BTC, ETH, SOL) or direction..."
            value={searchVal}
            onChange={handleSearchChange}
            className="w-full bg-[#141923] text-sm text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 border border-white/5 focus:border-blue-500/50 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Interactive Mode Switcher */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setSwitchOpen(!switchOpen)}
            className="text-xs px-3 py-1.5 rounded-xl bg-[#141923] border border-white/10 hover:border-white/20 text-slate-300 flex items-center gap-2"
          >
            <span className={`w-2 h-2 rounded-full ${isPro ? 'bg-purple-400' : 'bg-slate-400'}`} />
            <span>Mode: {plan.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {switchOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#141923] border border-white/10 rounded-xl shadow-2xl p-2 z-50 text-xs">
              <button
                onClick={() => {
                  downgradeToFree();
                  switchRole('user');
                  setSwitchOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  plan === 'free' ? 'bg-blue-600/20 text-blue-300 font-bold' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <span>Free Tier (1h delay)</span>
                {plan === 'free' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  upgradeToPro();
                  switchRole('user');
                  setSwitchOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  plan === 'pro' && role === 'user'
                    ? 'bg-blue-600/20 text-blue-300 font-bold'
                    : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <span>Pro Tier (Live)</span>
                {plan === 'pro' && role === 'user' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  upgradeToPro();
                  switchRole('admin');
                  setSwitchOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  role === 'admin' ? 'bg-purple-600/20 text-purple-300 font-bold' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <span>Admin Staff (/admin)</span>
                {role === 'admin' && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#16C784] ring-2 ring-[#0B0E14] animate-pulse" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#141923] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <Badge variant="blue" size="xs">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2.5">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.signal_id) navigate(`/dashboard/signals/${n.signal_id}`);
                      setNotifOpen(false);
                    }}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      n.read
                        ? 'bg-[#0E131C] border-white/5 text-slate-400'
                        : 'bg-blue-500/5 border-blue-500/20 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{formatTimeAgo(n.created_at)}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 text-center">
                <button
                  onClick={() => {
                    navigate('/dashboard/notifications');
                    setNotifOpen(false);
                  }}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                >
                  View all notification preferences <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Mini Profile */}
        <div
          onClick={() => navigate('/dashboard/settings')}
          className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-white/5 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
            {profile?.full_name?.charAt(0) || user?.email.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
