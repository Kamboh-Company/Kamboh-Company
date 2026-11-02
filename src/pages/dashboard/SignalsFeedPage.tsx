import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Filter,
  Search,
  Sparkles,
  Lock,
  ArrowUpDown,
  RefreshCw,
  Clock,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { signalStorage } from '../../lib/supabase';
import { Signal, SignalDirection, SignalRisk, SignalStatus } from '../../types';
import { SignalCard } from '../../components/signals/SignalCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SUPPORTED_COINS } from '../../lib/marketData';

export const SignalsFeedPage: React.FC = () => {
  const { plan } = useAuth();
  const navigate = useNavigate();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [search, setSearch] = useState('');
  const [coinFilter, setCoinFilter] = useState<string>('ALL');
  const [directionFilter, setDirectionFilter] = useState<'ALL' | SignalDirection>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'confidence'>('newest');

  useEffect(() => {
    const list = signalStorage.getSignals();
    setSignals(list);
  }, []);

  const filteredSignals = useMemo(() => {
    return signals
      .filter((s) => {
        // Search query
        if (search) {
          const q = search.toLowerCase();
          const match =
            s.coin.toLowerCase().includes(q) ||
            s.pair.toLowerCase().includes(q) ||
            s.direction.toLowerCase().includes(q) ||
            s.reasoning.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Coin filter
        if (coinFilter !== 'ALL' && s.coin !== coinFilter) return false;

        // Direction filter
        if (directionFilter !== 'ALL' && s.direction !== directionFilter) return false;

        // Status filter
        if (statusFilter !== 'ALL') {
          if (statusFilter === 'Active' && s.status !== 'Active') return false;
          if (statusFilter === 'TP' && !s.status.includes('TP')) return false;
          if (statusFilter === 'Stop' && !s.status.includes('Stop')) return false;
        }

        // Risk filter
        if (riskFilter !== 'ALL' && s.risk_level !== riskFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'confidence') {
          return b.confidence_score - a.confidence_score;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [signals, search, coinFilter, directionFilter, statusFilter, riskFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Quantitative Scanner Feed
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Signals Feed</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time algorithmic trading setups filtered by institutional technical indicators
          </p>
        </div>

        {plan === 'free' && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20">
            <div className="text-xs">
              <span className="font-bold text-white block">Free Tier Delay</span>
              <span className="text-[11px] text-slate-400">1-hour delay active • Premium locked</span>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/pricing')}
            >
              Unlock Real-Time
            </Button>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#141923] border border-white/[0.08] shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Coin Select */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">Coin</label>
            <select
              value={coinFilter}
              onChange={(e) => setCoinFilter(e.target.value)}
              className="w-full bg-[#0E131C] text-slate-100 rounded-xl px-3 py-2 border border-white/10 outline-none"
            >
              <option value="ALL">All Cryptos</option>
              {SUPPORTED_COINS.map((c) => (
                <option key={c} value={c}>{c}/USDT</option>
              ))}
            </select>
          </div>

          {/* Direction */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">Direction</label>
            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value as any)}
              className="w-full bg-[#0E131C] text-slate-100 rounded-xl px-3 py-2 border border-white/10 outline-none"
            >
              <option value="ALL">Long & Short</option>
              <option value="LONG">Long Only</option>
              <option value="SHORT">Short Only</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0E131C] text-slate-100 rounded-xl px-3 py-2 border border-white/10 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="TP">Take Profit Hit</option>
              <option value="Stop">Stop Loss Hit</option>
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">ATR Risk</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-[#0E131C] text-slate-100 rounded-xl px-3 py-2 border border-white/10 outline-none"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#0E131C] text-slate-100 rounded-xl px-3 py-2 border border-white/10 outline-none"
            >
              <option value="newest">Most Recent</option>
              <option value="confidence">Highest Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Signals Grid */}
      {filteredSignals.length === 0 ? (
        <div className="text-center py-20 bg-[#141923] rounded-3xl border border-white/5 p-8">
          <Filter className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Matching Signals Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, direction filter, or coin parameters.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-4"
            onClick={() => {
              setCoinFilter('ALL');
              setDirectionFilter('ALL');
              setStatusFilter('ALL');
              setRiskFilter('ALL');
              setSearch('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              userPlan={plan}
              onUpgradeClick={() => navigate('/pricing')}
            />
          ))}
        </div>
      )}
    </div>
  );
};
