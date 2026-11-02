import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, CheckCircle, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { signalStorage } from '../../lib/supabase';
import { Signal, SignalDirection, SignalRisk, SignalStatus } from '../../types';
import { Table, Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { formatPrice, formatTimestamp } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';
import { SUPPORTED_COINS } from '../../lib/marketData';

export const AdminSignalsPage: React.FC = () => {
  const { success } = useToast();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSignal, setEditingSignal] = useState<Signal | null>(null);

  // Form State
  const [coin, setCoin] = useState('BTC');
  const [direction, setDirection] = useState<SignalDirection>('LONG');
  const [timeframe, setTimeframe] = useState<'1h' | '4h'>('1h');
  const [entryPrice, setEntryPrice] = useState('68000');
  const [tp1Price, setTp1Price] = useState('69500');
  const [tp2Price, setTp2Price] = useState('71000');
  const [tp3Price, setTp3Price] = useState('72500');
  const [slPrice, setSlPrice] = useState('66500');
  const [riskLevel, setRiskLevel] = useState<SignalRisk>('Medium');
  const [confidenceScore, setConfidenceScore] = useState(85);
  const [isPremium, setIsPremium] = useState(true);
  const [reasoning, setReasoning] = useState('Manual institutional signal injected by Lead Quant.');

  useEffect(() => {
    setSignals(signalStorage.getSignals());
  }, []);

  const openCreateModal = () => {
    setEditingSignal(null);
    setCoin('BTC');
    setDirection('LONG');
    setEntryPrice('68000');
    setTp1Price('69500');
    setTp2Price('71000');
    setTp3Price('72500');
    setSlPrice('66500');
    setRiskLevel('Medium');
    setConfidenceScore(85);
    setIsPremium(true);
    setReasoning('Manual institutional signal injected by Lead Quant.');
    setModalOpen(true);
  };

  const handleSaveSignal = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = parseFloat(entryPrice) || 0;
    const tp1 = parseFloat(tp1Price) || 0;
    const tp2 = parseFloat(tp2Price) || 0;
    const tp3 = parseFloat(tp3Price) || 0;
    const sl = parseFloat(slPrice) || 0;

    if (editingSignal) {
      signalStorage.updateSignal(editingSignal.id, {
        coin,
        pair: `${coin}/USDT`,
        direction,
        timeframe,
        entry_price: entry,
        tp1_price: tp1,
        tp2_price: tp2,
        tp3_price: tp3,
        stop_loss_price: sl,
        risk_level: riskLevel,
        confidence_score: confidenceScore,
        is_premium: isPremium,
        reasoning,
      });
      success('Signal Updated', `${coin}/USDT parameters modified.`);
    } else {
      const newSig: Signal = {
        id: 'sig-man-' + Date.now().toString(36),
        coin,
        pair: `${coin}/USDT`,
        direction,
        timeframe,
        entry_price: entry,
        tp1_price: tp1,
        tp2_price: tp2,
        tp3_price: tp3,
        stop_loss_price: sl,
        current_price: entry,
        leverage_suggestion: '3x - 5x',
        risk_level: riskLevel,
        confidence_score: confidenceScore,
        reasoning,
        indicators_snapshot: {
          rsi: 54,
          macd: { macdLine: 12, signalLine: 8, histogram: 4 },
          ema: { ema20: entry * 0.99, ema50: entry * 0.97, ema200: entry * 0.94 },
          atr: entry * 0.02,
          adx: 28,
          bb: { upper: entry * 1.03, middle: entry, lower: entry * 0.97 },
          volumeVsAvg: 1.5,
        },
        status: 'Active',
        is_premium: isPremium,
        created_at: new Date().toISOString(),
        source: 'manual',
      };
      signalStorage.addSignal(newSig);
      success('Signal Published', `Manual signal for ${coin}/USDT active in feed.`);
    }

    setSignals(signalStorage.getSignals());
    setModalOpen(false);
  };

  const handleUpdateStatus = (id: string, status: SignalStatus, resultR: number | null = null) => {
    signalStorage.updateSignal(id, {
      status,
      closed_at: status !== 'Active' ? new Date().toISOString() : null,
      result_r: resultR,
    });
    setSignals(signalStorage.getSignals());
    success('Status Updated', `Signal status changed to ${status}.`);
  };

  const handleDelete = (id: string) => {
    signalStorage.deleteSignal(id);
    setSignals(signalStorage.getSignals());
    success('Deleted', 'Signal removed from database.');
  };

  const columns: Column<Signal>[] = [
    {
      key: 'pair',
      header: 'Pair',
      render: (s) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">{s.pair}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
            {s.timeframe}
          </span>
          {s.source === 'manual' && (
            <Badge variant="purple" size="xs">Manual</Badge>
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
      header: 'Entry',
      render: (s) => <span className="font-mono text-slate-200">{formatPrice(s.entry_price)}</span>,
    },
    {
      key: 'confidence_score',
      header: 'Conf.',
      align: 'center',
      render: (s) => <span className="font-bold text-white text-xs">{s.confidence_score}%</span>,
    },
    {
      key: 'is_premium',
      header: 'Tier',
      render: (s) => (
        <Badge variant={s.is_premium ? 'pro' : 'neutral'} size="xs">
          {s.is_premium ? 'Pro (Realtime)' : 'Free (1h Delay)'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status & Result Override',
      render: (s) => (
        <div className="flex items-center gap-1.5">
          <select
            value={s.status}
            onChange={(e) => {
              const val = e.target.value as SignalStatus;
              let r: number | null = null;
              if (val === 'TP1 hit') r = 1.0;
              if (val === 'TP2 hit') r = 2.0;
              if (val === 'TP3 hit') r = 3.0;
              if (val === 'Stop Loss hit') r = -1.0;
              handleUpdateStatus(s.id, val, r);
            }}
            className="bg-[#0E131C] text-xs text-slate-200 rounded-lg px-2 py-1 border border-white/10 outline-none"
          >
            <option value="Active">Active</option>
            <option value="TP1 hit">TP1 hit (+1.0R)</option>
            <option value="TP2 hit">TP2 hit (+2.0R)</option>
            <option value="TP3 hit">TP3 hit (+3.0R)</option>
            <option value="Stop Loss hit">Stop Loss hit (-1.0R)</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleDelete(s.id)}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/5"
            title="Delete Signal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Signals Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create manual algorithmic signals, override status results, and control tier gating
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={openCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Manual Signal
        </Button>
      </div>

      <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
        <Table
          columns={columns}
          data={signals}
          keyExtractor={(s) => s.id}
          emptyState={
            <div className="py-12 text-center text-slate-400 text-sm">
              No signals found in database.
            </div>
          }
        />
      </div>

      {/* Create / Edit Signal Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSignal ? 'Edit Signal' : 'Create New Manual Signal'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveSignal} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-1">Coin</label>
              <select
                value={coin}
                onChange={(e) => setCoin(e.target.value)}
                className="w-full bg-[#0E131C] text-xs text-white rounded-xl px-3 py-2 border border-white/10 outline-none"
              >
                {SUPPORTED_COINS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-1">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="w-full bg-[#0E131C] text-xs text-white rounded-xl px-3 py-2 border border-white/10 outline-none"
              >
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-1">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="w-full bg-[#0E131C] text-xs text-white rounded-xl px-3 py-2 border border-white/10 outline-none"
              >
                <option value="1h">1 Hour (1h)</option>
                <option value="4h">4 Hours (4h)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              label="Entry Price"
              type="number"
              step="any"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              required
            />
            <Input
              label="TP 1 (1.0R)"
              type="number"
              step="any"
              value={tp1Price}
              onChange={(e) => setTp1Price(e.target.value)}
              required
            />
            <Input
              label="TP 2 (2.0R)"
              type="number"
              step="any"
              value={tp2Price}
              onChange={(e) => setTp2Price(e.target.value)}
              required
            />
            <Input
              label="Stop Loss"
              type="number"
              step="any"
              value={slPrice}
              onChange={(e) => setSlPrice(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-1">Risk Level</label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as any)}
                className="w-full bg-[#0E131C] text-xs text-white rounded-xl px-3 py-2 border border-white/10 outline-none"
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
            <div>
              <Input
                label="Confidence (0-100)"
                type="number"
                min="50"
                max="99"
                value={confidenceScore}
                onChange={(e) => setConfidenceScore(parseInt(e.target.value) || 75)}
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-1">Access Tier</label>
              <select
                value={isPremium ? 'pro' : 'free'}
                onChange={(e) => setIsPremium(e.target.value === 'pro')}
                className="w-full bg-[#0E131C] text-xs text-white rounded-xl px-3 py-2 border border-white/10 outline-none"
              >
                <option value="pro">Pro (Instant Unlock)</option>
                <option value="free">Free (1h Delay)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-semibold block mb-1">
              Technical Reasoning
            </label>
            <textarea
              rows={2}
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              className="w-full bg-[#0E131C] text-xs text-white rounded-xl p-3 border border-white/10 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Signal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
