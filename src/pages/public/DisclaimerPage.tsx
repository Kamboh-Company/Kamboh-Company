import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Badge } from '../../components/ui/Badge';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-10">
          <Badge variant="amber" size="sm" className="mb-3">LEGAL COMPLIANCE</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            High Risk & Regulatory Disclaimer
          </h1>
          <p className="text-slate-400 text-xs mt-2">Last updated: October 2026</p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed bg-[#141923] p-8 rounded-3xl border border-white/[0.08]">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">IMPORTANT NOTICE: </span>
              Trading cryptocurrencies, spot digital assets, futures, options, and margin derivatives carries substantial risk of loss and is not suitable for all investors.
            </div>
          </div>

          <h3 className="text-base font-bold text-white pt-2">1. Algorithmic Nature of Signals</h3>
          <p>
            Kamboh Plus is a technological software provider that distributes algorithmic signals derived from computerized technical indicator formulas (including Exponential Moving Averages, Relative Strength Index, Moving Average Convergence Divergence, Average True Range, and Bollinger Bands). All signals, indicators, price levels, and risk calculations are produced solely through computer programs without manual financial advisory intervention.
          </p>

          <h3 className="text-base font-bold text-white pt-2">2. No Financial or Investment Advice</h3>
          <p>
            The content, signals, alerts, metrics, and tools available through Kamboh Plus do not constitute, and should not be construed as, financial advice, investment advice, trading advice, tax advice, or a recommendation to buy, sell, hold, or execute any order on any digital asset or financial instrument.
          </p>

          <h3 className="text-base font-bold text-white pt-2">3. No Guarantee of Performance</h3>
          <p>
            Past performance, backtested results, or theoretical R-multiples are neither indicative nor guarantees of future performance. Kamboh Plus makes no warranties, express or implied, regarding profitability, signal accuracy, or market uptime. You are solely responsible for your own financial decisions and capital allocation.
          </p>

          <h3 className="text-base font-bold text-white pt-2">4. Leverage & Liquidation Hazards</h3>
          <p>
            Trading with leverage significantly compounds both prospective gains and potential losses. A minor adverse price movement can lead to the total liquidation of deposited margin funds. Always utilize strict stop-loss rules and never trade with funds you cannot afford to lose completely.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
