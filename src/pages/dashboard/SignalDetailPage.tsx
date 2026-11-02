import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Lock,
  Clock,
  Shield,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { signalStorage } from '../../lib/supabase';
import { Signal } from '../../types';
import { fetchOHLCVCandles } from '../../lib/marketData';
import { Candle } from '../../lib/indicators';
import { TradingViewChart } from '../../components/charts/TradingViewChart';
import { ConfidenceMeter } from '../../components/signals/ConfidenceMeter';
import { IndicatorGauge } from '../../components/signals/IndicatorGauge';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { formatPrice, formatTimestamp, copyTradeDetails } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';
import { useTheme } from '../../context/ThemeContext';

export const SignalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plan } = useAuth();
  const { theme } = useTheme();
  const { success } = useToast();

  const [signal, setSignal] = useState<Signal | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const list = signalStorage.getSignals();
    const found = list.find((s) => s.id === id);
    if (found) {
      setSignal(found);
    }
  }, [id]);

  useEffect(() => {
    if (!signal) return;
    const currentCoin = signal.coin;
    const currentTimeframe = signal.timeframe;
    async function loadCandles() {
      const { candles } = await fetchOHLCVCandles(currentCoin, currentTimeframe, 160);
      setCandles(candles);
    }
    loadCandles();
  }, [signal]);

  if (!signal) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Signal Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">This signal ID may have expired or was removed.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/signals')}>
          Back to Feed
        </Button>
      </div>
    );
  }

  // Check locking conditions
  const isLockedForFree = plan === 'free' && signal.is_premium;
  const isYoungerThanHour = Date.now() - new Date(signal.created_at).getTime() < 60 * 60 * 1000;
  const isDelayed = plan === 'free' && !signal.is_premium && isYoungerThanHour;
  const isLocked = isLockedForFree || isDelayed;

  const isLong = signal.direction === 'LONG';

  const handleCopy = async () => {
    if (isLocked) return;
    const ok = await copyTradeDetails(signal);
    if (ok) {
      setCopied(true);
      success('Copied to Clipboard', 'Trade setup details ready to paste into your exchange terminal.');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const priceLines = !isLocked
    ? [
        { price: signal.entry_price, color: '#3B82F6', title: 'ENTRY' },
        { price: signal.tp1_price, color: '#16C784', title: 'TP 1 (1R)' },
        { price: signal.tp2_price, color: '#16C784', title: 'TP 2 (2R)' },
        { price: signal.tp3_price, color: '#16C784', title: 'TP 3 (3R)' },
        { price: signal.stop_loss_price, color: '#EA3943', title: 'STOP LOSS' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Back button & Title header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/signals')}
            className="p-2 rounded-xl bg-[#141923] border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-mono text-slate-400">ID: {signal.id}</span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-slate-400">{formatTimestamp(signal.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">{signal.pair}</h1>
              <Badge variant={isLong ? 'emerald' : 'red'} size="sm">
                {isLong ? <TrendingUp className="w-3.5 h-3.5 inline mr-1" /> : <TrendingDown className="w-3.5 h-3.5 inline mr-1" />}
                {signal.direction}
              </Badge>
              <Badge variant="blue" size="sm">{signal.timeframe}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isLocked ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-4 h-4 text-[#16C784]" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied Details' : 'Copy Trade Setup'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/pricing')}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              Upgrade to Unlock Full Setup
            </Button>
          )}
        </div>
      </div>

      {/* Target Progress Bar Tracker */}
      <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Trade Execution Ladder & Targets
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          {/* Entry */}
          <div className="p-3.5 rounded-2xl bg-[#0E131C] border border-blue-500/30">
            <span className="text-[10px] text-blue-400 font-bold block mb-1">ENTRY LEVEL</span>
            <div className="font-mono text-base font-bold text-white">
              {isLocked ? '$XX,XXX.XX' : formatPrice(signal.entry_price)}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Trigger Price</span>
          </div>

          {/* TP 1 */}
          <div className={`p-3.5 rounded-2xl bg-[#0E131C] border ${
            signal.status === 'TP1 hit' || signal.status === 'TP2 hit' || signal.status === 'TP3 hit'
              ? 'border-emerald-500/60 bg-emerald-500/5'
              : 'border-white/5'
          }`}>
            <span className="text-[10px] text-emerald-400 font-bold block mb-1">TP 1 (1.0R)</span>
            <div className="font-mono text-base font-bold text-emerald-400">
              {isLocked ? '$XX,XXX.XX' : formatPrice(signal.tp1_price)}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Risk-Free Mitigation</span>
          </div>

          {/* TP 2 */}
          <div className={`p-3.5 rounded-2xl bg-[#0E131C] border ${
            signal.status === 'TP2 hit' || signal.status === 'TP3 hit'
              ? 'border-emerald-500/60 bg-emerald-500/5'
              : 'border-white/5'
          }`}>
            <span className="text-[10px] text-emerald-400 font-bold block mb-1">TP 2 (2.0R)</span>
            <div className="font-mono text-base font-bold text-emerald-400">
              {isLocked ? '$XX,XXX.XX' : formatPrice(signal.tp2_price)}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Runner Position</span>
          </div>

          {/* TP 3 */}
          <div className={`p-3.5 rounded-2xl bg-[#0E131C] border ${
            signal.status === 'TP3 hit'
              ? 'border-emerald-500/60 bg-emerald-500/5'
              : 'border-white/5'
          }`}>
            <span className="text-[10px] text-emerald-400 font-bold block mb-1">TP 3 (3.0R)</span>
            <div className="font-mono text-base font-bold text-emerald-400">
              {isLocked ? '$XX,XXX.XX' : formatPrice(signal.tp3_price)}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Macro Target</span>
          </div>

          {/* Stop Loss */}
          <div className={`p-3.5 rounded-2xl bg-[#0E131C] border ${
            signal.status === 'Stop Loss hit'
              ? 'border-red-500/60 bg-red-500/5'
              : 'border-white/5'
          }`}>
            <span className="text-[10px] text-red-400 font-bold block mb-1">STOP LOSS</span>
            <div className="font-mono text-base font-bold text-[#EA3943]">
              {isLocked ? '$XX,XXX.XX' : formatPrice(signal.stop_loss_price)}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">1.5× ATR Invalidation</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[#141923] rounded-3xl border border-white/[0.08] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Multi-Timeframe Chart Analysis</h3>
            <Badge variant="blue" size="xs">Live Candles</Badge>
          </div>
          <span className="text-xs text-slate-400">
            Suggested Leverage: <span className="font-bold text-white">{signal.leverage_suggestion}</span>
          </span>
        </div>

        <div className="relative w-full min-h-[380px]">
          {isLocked ? (
            <div className="relative">
              <div className="filter blur-md select-none pointer-events-none opacity-40">
                <TradingViewChart
                  candles={candles}
                  priceLines={[]}
                  height={380}
                  theme={theme}
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Chart Target Overlay Locked</h4>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Upgrade to Pro to display real-time interactive candlestick charts with automated Take Profit and Stop Loss boundary lines.
                </p>
                <Button variant="primary" size="md" onClick={() => navigate('/pricing')}>
                  Upgrade to Pro ($9/mo)
                </Button>
              </div>
            </div>
          ) : (
            <TradingViewChart
              candles={candles}
              priceLines={priceLines}
              height={380}
              theme={theme}
            />
          )}
        </div>
      </div>

      {/* Reasoning & Quantitative Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reasoning Text */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Algorithmic Confluence Reasoning</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#0E131C] p-4 rounded-2xl border border-white/5">
              {isLocked
                ? 'Technical indicator breakdown and institutional swing confluence points are locked on the Free tier. Upgrade to view full algorithmic logic.'
                : signal.reasoning}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Indicator Snapshot At Execution
            </div>
            <IndicatorGauge indicators={signal.indicators_snapshot} />
          </div>
        </div>

        {/* Confidence & Risk Card */}
        <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <h3 className="text-sm font-bold text-white mb-1">Engine Confidence Score</h3>
            <p className="text-[11px] text-slate-400 mb-6">Weighted composite probability</p>

            <div className="flex justify-center mb-6">
              <ConfidenceMeter score={signal.confidence_score} size={110} strokeWidth={9} />
            </div>

            <div className="space-y-2.5 text-xs text-left w-full">
              <div className="flex justify-between p-2 rounded-xl bg-[#0E131C]">
                <span className="text-slate-400">ATR Volatility Risk</span>
                <span className="font-semibold text-white">{signal.risk_level}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-[#0E131C]">
                <span className="text-slate-400">Suggested Leverage</span>
                <span className="font-semibold text-blue-400">{signal.leverage_suggestion}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-[#0E131C]">
                <span className="text-slate-400">Max Hold Period</span>
                <span className="font-semibold text-white">72 Hours (Auto-Expire)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full pt-4 border-t border-white/5">
            <span className="text-[10px] text-slate-500">
              Disclaimer: Algorithmic setup for educational analysis.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
