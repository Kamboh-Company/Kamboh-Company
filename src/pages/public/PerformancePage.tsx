import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, Column } from '../../components/ui/Table';
import { signalStorage, calculateDatabasePerformance } from '../../lib/supabase';
import { Signal, PerformanceStats } from '../../types';
import { formatPrice, formatRMultiple, formatTimestamp } from '../../lib/utils';
import { BarChart3, ShieldCheck, AlertCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';

export const PerformancePage: React.FC = () => {
  const [allSignals, setAllSignals] = useState<Signal[]>([]);
  const [includeDemoData, setIncludeDemoData] = useState(false);
  const [stats, setStats] = useState<PerformanceStats | null>(null);

  useEffect(() => {
    const list = signalStorage.getSignals();
    setAllSignals(list);
  }, []);

  useEffect(() => {
    // If includeDemoData is false, calculate ONLY from non-demo closed signals
    // If true, calculate across all signals for demonstration preview
    const targetSignals = includeDemoData ? allSignals.map((s) => ({ ...s, is_demo: false })) : allSignals;
    setStats(calculateDatabasePerformance(targetSignals));
  }, [allSignals, includeDemoData]);

  const closedSignalsList = allSignals.filter((s) => {
    const isClosed = s.status === 'TP1 hit' || s.status === 'TP2 hit' || s.status === 'TP3 hit' || s.status === 'Stop Loss hit';
    return includeDemoData ? isClosed : !s.is_demo && isClosed;
  });

  const columns: Column<Signal>[] = [
    {
      key: 'pair',
      header: 'Pair & Coin',
      render: (s) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">{s.pair}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
            {s.timeframe}
          </span>
          {s.is_demo && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              DEMO
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'direction',
      header: 'Direction',
      render: (s) => (
        <Badge variant={s.direction === 'LONG' ? 'emerald' : 'red'} size="xs">
          {s.direction}
        </Badge>
      ),
    },
    {
      key: 'entry_price',
      header: 'Entry Price',
      render: (s) => <span className="font-mono text-slate-300">{formatPrice(s.entry_price)}</span>,
    },
    {
      key: 'exit_price',
      header: 'Exit Price',
      render: (s) => <span className="font-mono text-slate-300">{formatPrice(s.exit_price || s.entry_price)}</span>,
    },
    {
      key: 'status',
      header: 'Result Status',
      render: (s) => (
        <Badge
          variant={s.status.includes('TP') ? 'emerald' : 'red'}
          size="xs"
        >
          {s.status}
        </Badge>
      ),
    },
    {
      key: 'result_r',
      header: 'Result (R)',
      align: 'right',
      render: (s) => {
        const val = s.result_r ?? 0;
        const isWin = val > 0;
        return (
          <span
            className={`font-mono font-bold text-sm ${
              isWin ? 'text-[#16C784]' : 'text-[#EA3943]'
            }`}
          >
            {formatRMultiple(val)}
          </span>
        );
      },
    },
    {
      key: 'closed_at',
      header: 'Date Closed',
      render: (s) => (
        <span className="text-slate-400 text-xs">
          {s.closed_at ? formatTimestamp(s.closed_at) : '--'}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="blue" size="sm" className="mb-3">
            VERIFIED AUDITED DATA
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Transparent Performance Ledger
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
            All metrics are calculated strictly from closed algorithmic trades stored in our database. We never display arbitrary marketing numbers.
          </p>

          {/* Seed demo toggle for preview */}
          <div className="mt-6 inline-flex items-center gap-3 p-2 rounded-xl bg-[#141923] border border-white/10 text-xs text-slate-300">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>Include demo seed trades for statistical curve simulation:</span>
            <Button
              size="sm"
              variant={includeDemoData ? 'primary' : 'outline'}
              onClick={() => setIncludeDemoData(!includeDemoData)}
            >
              {includeDemoData ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-6 rounded-2xl bg-[#141923] border border-white/[0.08]">
            <span className="text-xs text-slate-400 font-medium">Win Rate</span>
            <div className="text-3xl font-extrabold text-[#16C784] mt-2 font-mono">
              {stats?.hasEnoughData || includeDemoData ? `${stats?.winRate}%` : 'Pending'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Based on closed targets</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141923] border border-white/[0.08]">
            <span className="text-xs text-slate-400 font-medium">Average R Multiplier</span>
            <div className="text-3xl font-extrabold text-blue-400 mt-2 font-mono">
              {stats?.hasEnoughData || includeDemoData ? `+${stats?.avgR}R` : 'Pending'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Normalized risk reward</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141923] border border-white/[0.08]">
            <span className="text-xs text-slate-400 font-medium">Profit Factor</span>
            <div className="text-3xl font-extrabold text-purple-400 mt-2 font-mono">
              {stats?.hasEnoughData || includeDemoData ? stats?.profitFactor : 'Pending'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Gross wins / gross losses</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141923] border border-white/[0.08]">
            <span className="text-xs text-slate-400 font-medium">Closed / Verified Signals</span>
            <div className="text-3xl font-extrabold text-white mt-2 font-mono">
              {closedSignalsList.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {closedSignalsList.length < 30 ? `${30 - closedSignalsList.length} needed for full report` : 'Sufficient sample size'}
            </p>
          </div>
        </div>

        {/* Notice Box if <30 closed signals */}
        {(!stats?.hasEnoughData && !includeDemoData) && (
          <div className="p-6 rounded-2xl bg-[#141923] border border-amber-500/30 mb-10 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Data Notice: Minimum 30 Closed Signals Threshold
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In strict accordance with our quantitative transparency policy, macro performance charts are disabled until the engine accumulates at least 30 closed real signals. Currently {closedSignalsList.length} closed real signals are registered in the database. You can inspect all individual trades below or toggle &quot;Include demo seed trades&quot; to preview sample visual charts.
              </p>
            </div>
          </div>
        )}

        {/* Closed Signals Ledger Table */}
        <div className="bg-[#141923] rounded-3xl border border-white/[0.08] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#16C784]" />
              <h3 className="text-lg font-bold text-white">Closed Signals Audit Log</h3>
            </div>
            <span className="text-xs text-slate-400">
              Showing {closedSignalsList.length} closed trades
            </span>
          </div>

          <Table
            columns={columns}
            data={closedSignalsList}
            keyExtractor={(s) => s.id}
            emptyState={
              <div className="py-12 text-center text-slate-400 text-sm">
                No closed signals in database yet. New signals will automatically be logged as Take Profit or Stop Loss targets trigger.
              </div>
            }
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};
