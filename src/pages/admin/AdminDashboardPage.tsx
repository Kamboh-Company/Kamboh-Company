import React, { useState, useEffect } from 'react';
import {
  Users,
  CreditCard,
  Radio,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { userStorage, signalStorage, engineSettingsStorage } from '../../lib/supabase';
import { Profile, Signal, EngineSettings } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [engineSettings, setEngineSettings] = useState<EngineSettings | null>(null);

  useEffect(() => {
    setUsers(userStorage.getUsers());
    setSignals(signalStorage.getSignals());
    setEngineSettings(engineSettingsStorage.getSettings());
  }, []);

  const totalUsers = users.length;
  const paidUsers = users.filter((u) => u.plan === 'pro').length;
  const freeUsers = totalUsers - paidUsers;
  // Estimated MRR: $9/mo per paid user (mock demo estimate)
  const mrr = paidUsers * 9;
  const activeSignals = signals.filter((s) => s.status === 'Active').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">System & Business Intel</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Live subscriber statistics, algorithmic execution status, and revenue telemetry
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card padding="sm" className="bg-[#141923] border border-white/5">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Total Registered Users</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white font-mono">{totalUsers}</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {paidUsers} Paid Pro • {freeUsers} Free Tier
            </span>
          </div>
        </Card>

        {/* MRR */}
        <Card padding="sm" className="bg-[#141923] border border-white/5">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Monthly Recurring Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-[#16C784]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#16C784] font-mono">${mrr}</div>
            <span className="text-[11px] text-[#16C784] flex items-center gap-1 mt-0.5">
              Lemon Squeezy Webhooks Active
            </span>
          </div>
        </Card>

        {/* Active Signals */}
        <Card padding="sm" className="bg-[#141923] border border-white/5">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Active Algorithmic Signals</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-purple-300 font-mono">
              {activeSignals}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {signals.length} cumulative logged
            </span>
          </div>
        </Card>

        {/* Engine Status */}
        <Card padding="sm" className="bg-[#141923] border border-white/5">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Signal Engine Status</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16C784] animate-pulse" />
              {engineSettings?.is_active ? 'RUNNING' : 'PAUSED'}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Scans every {engineSettings?.scan_interval_minutes || 15}m via pg_cron
            </span>
          </div>
        </Card>
      </div>

      {/* Plan Breakdown & Engine Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4">Subscriber Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Pro Subscribers (${mrr}/mo)</span>
                <span className="font-bold text-purple-300 font-mono">
                  {paidUsers} ({Math.round((paidUsers / (totalUsers || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  style={{ width: `${(paidUsers / (totalUsers || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Free Tier Members (Delayed)</span>
                <span className="font-bold text-slate-400 font-mono">
                  {freeUsers} ({Math.round((freeUsers / (totalUsers || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-slate-600 rounded-full"
                  style={{ width: `${(freeUsers / (totalUsers || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4">Autonomous Execution Parameters</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#0E131C] border border-white/5">
              <span className="text-slate-400 block text-[11px]">Min Trigger Confidence</span>
              <span className="text-base font-bold text-white font-mono">
                {engineSettings?.min_confidence}%
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0E131C] border border-white/5">
              <span className="text-slate-400 block text-[11px]">Daily Signal Cap</span>
              <span className="text-base font-bold text-white font-mono">
                {engineSettings?.max_signals_per_day} per day
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0E131C] border border-white/5">
              <span className="text-slate-400 block text-[11px]">Cooldown Window</span>
              <span className="text-base font-bold text-white font-mono">
                {engineSettings?.cooldown_hours} Hours
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0E131C] border border-white/5">
              <span className="text-slate-400 block text-[11px]">Exchange Redundancy</span>
              <span className="text-base font-bold text-[#16C784]">3 Providers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
