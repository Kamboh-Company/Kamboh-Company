import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Menu,
  X,
  Sun,
  Moon,
  Shield,
  Zap,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Navbar: React.FC = () => {
  const { user, profile, plan, role, isPro, isAdmin, logout, upgradeToPro, downgradeToFree, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Signals', href: '/dashboard/signals' },
    { label: 'Performance', href: '/performance' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Video Guide', href: '/guide' },
    { label: 'Affiliate (Earn 30%)', href: '/affiliate' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0E14]/85 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                Kamboh<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Plus</span>
              </span>
              <span className="text-[10px] text-slate-400 -mt-1 font-medium tracking-wider">
                QUANT CRYPTO SIGNALS
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'text-blue-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Interactive Role/Plan Switcher (Convenient for previewing both free/pro/admin) */}
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                title="Preview Mode Switcher"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>
                  {plan.toUpperCase()} • {role.toUpperCase()}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#141923] border border-white/10 rounded-xl shadow-2xl p-2.5 z-50 animate-fade-in text-xs">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Preview Experience
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => {
                        downgradeToFree();
                        switchRole('user');
                        setSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        plan === 'free' && role === 'user'
                          ? 'bg-blue-600/20 text-blue-300 font-semibold'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span>Free User (Locked)</span>
                      <Badge variant="neutral" size="xs">Free</Badge>
                    </button>
                    <button
                      onClick={() => {
                        upgradeToPro();
                        switchRole('user');
                        setSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        plan === 'pro' && role === 'user'
                          ? 'bg-blue-600/20 text-blue-300 font-semibold'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span>Pro Trader (Full)</span>
                      <Badge variant="pro" size="xs">Pro</Badge>
                    </button>
                    <button
                      onClick={() => {
                        upgradeToPro();
                        switchRole('admin');
                        setSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        role === 'admin'
                          ? 'bg-blue-600/20 text-blue-300 font-semibold'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span>Quant Admin (/admin)</span>
                      <Badge variant="purple" size="xs">Admin</Badge>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#141923] hover:bg-[#1A2130] border border-white/10 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {profile?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-white max-w-[100px] truncate">
                      {profile?.full_name || user.email.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {isPro ? 'Pro Member' : 'Free Tier'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#141923] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 text-sm">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/5 transition-colors"
                    >
                      <Zap className="w-4 h-4 text-blue-400" />
                      Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-purple-300 hover:bg-purple-500/10 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-purple-400" />
                        Admin Panel
                      </Link>
                    )}

                    <Link
                      to="/dashboard/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Account Settings
                    </Link>

                    <div className="border-t border-white/5 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Get Started Free
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141923] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm"
                >
                  Open Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-200 font-semibold text-sm"
                  >
                    Admin Control Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-red-400 text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Log In
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
                  Sign Up Free
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
