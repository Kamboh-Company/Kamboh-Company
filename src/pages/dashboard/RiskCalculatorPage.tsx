import React, { useState } from 'react';
import { Calculator, ShieldCheck, Copy, Check, DollarSign, Percent } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export const RiskCalculatorPage: React.FC = () => {
  const { success } = useToast();
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [entryPrice, setEntryPrice] = useState<number>(68000);
  const [stopLossPrice, setStopLossPrice] = useState<number>(66800);
  const [copied, setCopied] = useState(false);

  // Calculations
  const dollarRisk = (accountSize * riskPercent) / 100;
  const priceDiff = Math.abs(entryPrice - stopLossPrice);
  const isLong = entryPrice >= stopLossPrice;

  const positionSizeUnits = priceDiff > 0 ? dollarRisk / priceDiff : 0;
  const totalPositionValue = positionSizeUnits * entryPrice;
  const impliedLeverage = accountSize > 0 ? (totalPositionValue / accountSize) : 1;

  // R Multiples targets
  const tp1 = isLong ? entryPrice + priceDiff * 1 : entryPrice - priceDiff * 1;
  const tp2 = isLong ? entryPrice + priceDiff * 2 : entryPrice - priceDiff * 2;
  const tp3 = isLong ? entryPrice + priceDiff * 3 : entryPrice - priceDiff * 3;

  const handleCopy = () => {
    const summary = `Position Size: ${positionSizeUnits.toFixed(4)} Units ($${totalPositionValue.toFixed(2)})
Risk Amount: $${dollarRisk.toFixed(2)} (${riskPercent}%)
Stop Loss: $${stopLossPrice}
TP1: $${tp1.toFixed(2)} | TP2: $${tp2.toFixed(2)} | TP3: $${tp3.toFixed(2)}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    success('Copied Calculation', 'Position sizing parameters copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Calculator className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Capital Protection Protocol
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Position Size & Risk Calculator</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Eliminate portfolio blowups. Calculate exact order contracts based on account equity and ATR stop-loss distance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Parameters */}
        <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Trade Input Parameters</h3>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              Account Equity ($ USD)
            </label>
            <Input
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(parseFloat(e.target.value) || 0)}
              leftIcon={<DollarSign className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              Portfolio Risk Percentage (%)
            </label>
            <Input
              type="number"
              step="0.1"
              value={riskPercent}
              onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
              leftIcon={<Percent className="w-4 h-4" />}
              helperText="Recommended: 1.0% to 2.0% per setup"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Entry Price ($)
              </label>
              <Input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Stop Loss ($)
              </label>
              <Input
                type="number"
                step="any"
                value={stopLossPrice}
                onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAccountSize(10000);
                setRiskPercent(1.5);
                setEntryPrice(68000);
                setStopLossPrice(66800);
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>

        {/* Output Metrics */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#182132] to-[#141923] border border-blue-500/30 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Recommended Position Size</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#16C784]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0E131C] border border-white/10">
                <span className="text-xs text-slate-400 block mb-1">Position Size (Units)</span>
                <div className="text-3xl font-extrabold text-[#16C784] font-mono">
                  {positionSizeUnits.toFixed(4)}
                </div>
                <span className="text-xs text-slate-400 mt-1 block">
                  Notional Value: ${totalPositionValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0E131C] border border-white/5">
                  <span className="text-slate-400 block text-[11px]">Maximum Dollar Risk</span>
                  <span className="text-base font-bold text-[#EA3943] font-mono">
                    ${dollarRisk.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0E131C] border border-white/5">
                  <span className="text-slate-400 block text-[11px]">Effective Leverage</span>
                  <span className="text-base font-bold text-white font-mono">
                    {impliedLeverage.toFixed(2)}x
                  </span>
                </div>
              </div>

              {/* R Multiples */}
              <div className="p-3 rounded-xl bg-[#0E131C] border border-white/5 text-xs space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Expected Profit Targets (R-Multiples)
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Take Profit 1 (1.0R):</span>
                  <span className="font-mono font-bold text-[#16C784]">${tp1.toFixed(2)} (+${dollarRisk.toFixed(2)})</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Take Profit 2 (2.0R):</span>
                  <span className="font-mono font-bold text-[#16C784]">${tp2.toFixed(2)} (+${(dollarRisk * 2).toFixed(2)})</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Take Profit 3 (3.0R):</span>
                  <span className="font-mono font-bold text-[#16C784]">${tp3.toFixed(2)} (+${(dollarRisk * 3).toFixed(2)})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 text-center">
            Calculated via fixed-fractional ATR mathematical risk modeling.
          </div>
        </div>
      </div>
    </div>
  );
};
