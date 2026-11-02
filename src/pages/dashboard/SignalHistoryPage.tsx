import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Search,
  Lock,
  ArrowUpDown,
  History,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { signalStorage } from '../../lib/supabase';
import { Signal } from '../../types';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { formatPrice, formatTimestamp, formatRMultiple, exportSignalsToCSV } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export const SignalHistoryPage: React.FC = () => {
  const { plan } = useAuth();
  const navigate = useNavigate();
  const { error: toastError, success } = useToast();

  const [signals, setSignals] = useState<Signal[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const list = signalStorage.getSignals();
    setSignals(list);
  }, []);

  const handleExportCSV = () => {
    if (plan !== 'pro') {
      toastError('Pro Feature', 'CSV Export is reserved for Pro subscribers. Upgrade to download raw data.');
      navigate('/pricing');
      return;
    }
    exportSignalsToCSV(filteredSignals, `signalpulse_history_${Date.now()}.csv`);
    success('Exported!', 'CSV file downloaded successfully.');
  };

  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          s.coin.toLowerCase().includes(q) ||
          s.pair.toLowerCase().includes(q) ||
          s.direction.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;

      // Free user: only show last 7 days of signals as specified in requirements
      if (plan === 'free') {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (new Date(s.created_at).getTime() < sevenDaysAgo) return false;
      }

      return true;
    });
  }, [signals, search, statusFilter, plan]);

  const totalPages = Math.ceil(filteredSignals.length / pageSize) || 1;
  const paginatedData = filteredSignals.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<Signal>[] = [
    {
      key: 'pair',
      header: 'Pair & Timeframe',
      render: (s) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">{s.pair}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
            {s.timeframe}
          </span>
        </div>
      ),
    },
    {
      key: 'direction',
      header: 'Direction',
      render: (s) => (
        <Badge variant={s.direction === 'LONG' ? 'emerald' : 'red'} size="xs">
          {s.direction === 'LONG' ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
          {s.direction}
        </Badge>
      ),
    },
    {
      key: 'entry_price',
      header: 'Entry Price',
      render: (s) => (
        <span className="font-mono text-slate-200">
          {plan === 'free' && s.is_premium ? 'Locked (Pro)' : formatPrice(s.entry_price)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => (
        <Badge
          variant={
            s.status.includes('TP')
              ? 'emerald'
              : s.status.includes('Stop')
              ? 'red'
              : s.status === 'Active'
              ? 'blue'
              : 'neutral'
          }
          size="xs"
        >
          {s.status}
        </Badge>
      ),
    },
    {
      key: 'confidence_score',
      header: 'Confidence',
      align: 'center',
      render: (s) => (
        <span className="font-bold text-xs text-white">
          {s.confidence_score}%
        </span>
      ),
    },
    {
      key: 'result_r',
      header: 'Result',
      align: 'right',
      render: (s) => {
        if (s.status === 'Active') return <span className="text-slate-500 text-xs">In Progress</span>;
        const val = s.result_r ?? 0;
        const isWin = val > 0;
        return (
          <span className={`font-mono font-bold text-xs ${isWin ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
            {formatRMultiple(val)}
          </span>
        );
      },
    },
    {
      key: 'created_at',
      header: 'Triggered Date',
      render: (s) => (
        <span className="text-slate-400 text-xs">{formatTimestamp(s.created_at)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Audit & Execution Archives
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Signal History</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {plan === 'free'
              ? 'Free Tier: Showing historical signals for the last 7 days.'
              : 'Pro Tier: Full historical database and performance archives.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={plan === 'pro' ? 'primary' : 'outline'}
            size="sm"
            onClick={handleExportCSV}
            leftIcon={plan === 'pro' ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4 text-purple-400" />}
          >
            Export to CSV {plan === 'free' && '(Pro Only)'}
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141923] border border-white/[0.08] shadow-lg flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pair or coin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0E131C] text-xs text-white rounded-xl pl-9 pr-3 py-2 border border-white/10 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0E131C] text-xs text-white rounded-xl px-3 py-2 border border-white/10 outline-none"
          >
            <option value="ALL">All Outcomes</option>
            <option value="Active">Active Positions</option>
            <option value="TP1 hit">TP1 Hit</option>
            <option value="Stop Loss hit">Stop Loss Hit</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#141923] rounded-3xl border border-white/[0.08] p-6 shadow-xl">
        <Table
          columns={columns}
          data={paginatedData}
          keyExtractor={(s) => s.id}
          onRowClick={(s) => navigate(`/dashboard/signals/${s.id}`)}
          emptyState={
            <div className="py-12 text-center text-slate-400 text-sm">
              No historical signals match the filter criteria.
            </div>
          }
        />

        {/* Pagination */}
        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-400">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredSignals.length)} of {filteredSignals.length} entries
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>
    </div>
  );
};
