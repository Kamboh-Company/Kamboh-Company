import React from 'react';
import { IndicatorSnapshot } from '../../types';

export interface IndicatorGaugeProps {
  indicators: IndicatorSnapshot;
  compact?: boolean;
}

export const IndicatorGauge: React.FC<IndicatorGaugeProps> = ({ indicators, compact = false }) => {
  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return 'text-[#EA3943] bg-red-500/10 border-red-500/30';
    if (rsi < 30) return 'text-[#16C784] bg-emerald-500/10 border-emerald-500/30';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  };

  const getMacdColor = (hist: number) => {
    return hist >= 0
      ? 'text-[#16C784] bg-emerald-500/10 border-emerald-500/30'
      : 'text-[#EA3943] bg-red-500/10 border-red-500/30';
  };

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-[#0E131C] p-2 rounded-xl border border-white/5 flex flex-col">
          <span className="text-slate-400 text-[10px]">RSI (14)</span>
          <span className="font-semibold text-slate-100">{indicators.rsi}</span>
        </div>
        <div className="bg-[#0E131C] p-2 rounded-xl border border-white/5 flex flex-col">
          <span className="text-slate-400 text-[10px]">MACD Hist</span>
          <span className={`font-semibold ${indicators.macd.histogram >= 0 ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
            {indicators.macd.histogram >= 0 ? '+' : ''}{indicators.macd.histogram}
          </span>
        </div>
        <div className="bg-[#0E131C] p-2 rounded-xl border border-white/5 flex flex-col">
          <span className="text-slate-400 text-[10px]">Vol Surge</span>
          <span className="font-semibold text-blue-400">{indicators.volumeVsAvg}x</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
      {/* RSI */}
      <div className="bg-[#0E131C] p-3 rounded-xl border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-1">
          <span className="text-slate-400 text-[11px] font-medium">RSI (14)</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getRSIColor(indicators.rsi)}`}>
            {indicators.rsi > 70 ? 'Overbought' : indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
          </span>
        </div>
        <span className="text-base font-bold text-white font-mono">{indicators.rsi}</span>
      </div>

      {/* MACD */}
      <div className="bg-[#0E131C] p-3 rounded-xl border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-1">
          <span className="text-slate-400 text-[11px] font-medium">MACD (12,26,9)</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getMacdColor(indicators.macd.histogram)}`}>
            {indicators.macd.histogram >= 0 ? 'Bullish' : 'Bearish'}
          </span>
        </div>
        <span className="text-base font-bold text-white font-mono">
          {indicators.macd.histogram >= 0 ? '+' : ''}
          {indicators.macd.histogram}
        </span>
      </div>

      {/* ADX Trend Strength */}
      <div className="bg-[#0E131C] p-3 rounded-xl border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-1">
          <span className="text-slate-400 text-[11px] font-medium">ADX (14)</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            {indicators.adx >= 25 ? 'Strong Trend' : 'Weak / Consolidation'}
          </span>
        </div>
        <span className="text-base font-bold text-white font-mono">{indicators.adx}</span>
      </div>

      {/* Volume Surge */}
      <div className="bg-[#0E131C] p-3 rounded-xl border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-1">
          <span className="text-slate-400 text-[11px] font-medium">Volume Surge</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            20-SMA Ratio
          </span>
        </div>
        <span className="text-base font-bold text-blue-400 font-mono">{indicators.volumeVsAvg}x</span>
      </div>
    </div>
  );
};
