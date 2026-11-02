import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, Copy, Check, TrendingUp, TrendingDown, Clock, ShieldAlert } from 'lucide-react';
import { Signal, UserPlan } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ConfidenceMeter } from './ConfidenceMeter';
import { formatPrice, formatTimeAgo, copyTradeDetails } from '../../lib/utils';
import { useState } from 'react';

export interface SignalCardProps {
  signal: Signal;
  userPlan: UserPlan;
  onUpgradeClick?: () => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  userPlan,
  onUpgradeClick,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Check locking conditions:
  // 1. Premium signal viewed by Free plan user
  // 2. Free signal created < 1 hr ago (delayed release for free tier)
  const isLockedForFree = userPlan === 'free' && signal.is_premium;
  const isSignalYoungerThanHour =
    Date.now() - new Date(signal.created_at).getTime() < 60 * 60 * 1000;
  const isDelayedFreeSignal = userPlan === 'free' && !signal.is_premium && isSignalYoungerThanHour;

  const isLocked = isLockedForFree || isDelayedFreeSignal;

  const isLong = signal.direction === 'LONG';

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) return;
    const ok = await copyTradeDetails(signal);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status: Signal['status']) => {
    switch (status) {
      case 'Active':
        return <Badge variant="blue" dot>Active</Badge>;
      case 'TP1 hit':
      case 'TP2 hit':
      case 'TP3 hit':
        return <Badge variant="emerald" dot>{status}</Badge>;
      case 'Stop Loss hit':
        return <Badge variant="red" dot>Stop Hit</Badge>;
      case 'Expired':
        return <Badge variant="neutral">Expired</Badge>;
      case 'Cancelled':
        return <Badge variant="neutral">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: Signal['risk_level']) => {
    switch (risk) {
      case 'Low':
        return <Badge variant="emerald" size="xs">Low Risk</Badge>;
      case 'Medium':
        return <Badge variant="amber" size="xs">Med Risk</Badge>;
      case 'High':
        return <Badge variant="red" size="xs">High Risk</Badge>;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => {
        if (!isLocked) {
          navigate(`/dashboard/signals/${signal.id}`);
        }
      }}
      className={`relative group bg-[#141923] rounded-2xl border transition-all duration-200 overflow-hidden ${
        isLocked
          ? 'border-white/[0.08] cursor-default'
          : 'border-white/[0.08] hover:border-white/20 hover:bg-[#181E2B] cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5'
      }`}
    >
      {/* Top Banner Info */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            Algorithmic signal
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(signal.created_at)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {signal.is_premium && (
            <Badge variant="pro" size="xs">
              PRO SIGNAL
            </Badge>
          )}
          {getStatusBadge(signal.status)}
        </div>
      </div>

      {/* Main Signal Card Content */}
      <div className="p-5">
        {/* Header: Coin, Direction, Timeframe, Confidence */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1B2232] border border-white/10 flex items-center justify-center font-black text-lg text-white shadow-inner">
              {signal.coin}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">{signal.pair}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
                  {signal.timeframe}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={isLong ? 'emerald' : 'red'}
                  size="sm"
                  className="font-bold tracking-wider"
                >
                  {isLong ? <TrendingUp className="w-3.5 h-3.5 inline mr-1" /> : <TrendingDown className="w-3.5 h-3.5 inline mr-1" />}
                  {signal.direction}
                </Badge>
                {getRiskBadge(signal.risk_level)}
                <span className="text-xs text-slate-400">Lev: {signal.leverage_suggestion}</span>
              </div>
            </div>
          </div>

          <ConfidenceMeter score={signal.confidence_score} size={54} strokeWidth={5} />
        </div>

        {/* Pricing Matrix / Targets */}
        <div className="relative">
          <div
            className={`grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 rounded-xl bg-[#0B0E14]/80 border border-white/5 text-xs transition-all ${
              isLocked ? 'filter blur-sm select-none opacity-40' : ''
            }`}
          >
            <div>
              <div className="text-slate-400 text-[11px] mb-0.5">Entry Price</div>
              <div className="font-mono font-bold text-white">
                {isLocked ? '$XX,XXX.XX' : formatPrice(signal.entry_price)}
              </div>
            </div>
            <div>
              <div className="text-emerald-400/80 text-[11px] mb-0.5">TP 1 (1R)</div>
              <div className="font-mono font-bold text-emerald-400">
                {isLocked ? '$XX,XXX.XX' : formatPrice(signal.tp1_price)}
              </div>
            </div>
            <div>
              <div className="text-emerald-400/80 text-[11px] mb-0.5">TP 2 (2R)</div>
              <div className="font-mono font-bold text-emerald-400">
                {isLocked ? '$XX,XXX.XX' : formatPrice(signal.tp2_price)}
              </div>
            </div>
            <div>
              <div className="text-emerald-400/80 text-[11px] mb-0.5">TP 3 (3R)</div>
              <div className="font-mono font-bold text-emerald-400">
                {isLocked ? '$XX,XXX.XX' : formatPrice(signal.tp3_price)}
              </div>
            </div>
            <div>
              <div className="text-red-400/80 text-[11px] mb-0.5">Stop Loss</div>
              <div className="font-mono font-bold text-[#EA3943]">
                {isLocked ? '$XX,XXX.XX' : formatPrice(signal.stop_loss_price)}
              </div>
            </div>
          </div>

          {/* Reasoning summary text */}
          <p
            className={`mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed ${
              isLocked ? 'filter blur-sm select-none opacity-30' : ''
            }`}
          >
            {signal.reasoning}
          </p>

          {/* Locked Overlay for Free Users */}
          {isLocked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-[#141923] via-[#141923]/90 to-transparent rounded-xl text-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-2">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {isDelayedFreeSignal ? 'Delayed 1-Hour for Free Tier' : 'Unlock Real-Time Pro Signal'}
              </h4>
              <p className="text-[11px] text-slate-400 max-w-xs mb-3">
                {isDelayedFreeSignal
                  ? 'Free signals unlock 60 minutes after execution. Upgrade to Pro for instant execution.'
                  : 'Get instant access to entry, take-profit ladders, stop loss, and real-time alerts.'}
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onUpgradeClick) onUpgradeClick();
                  else navigate('/pricing');
                }}
              >
                Upgrade to Pro ($9/mo)
              </Button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!isLocked && (
          <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              Indicators: RSI {signal.indicators_snapshot.rsi} • Vol {signal.indicators_snapshot.volumeVsAvg}x • ATR {signal.indicators_snapshot.atr}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#16C784]" />
                  <span className="text-[#16C784]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Trade</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
