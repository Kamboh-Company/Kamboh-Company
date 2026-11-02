import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, Cpu, Terminal, Users, Database } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="blue" size="sm" className="mb-3">ABOUT KAMBOH PLUS</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Built by Quants. Governed by Math.
          </h1>
          <p className="text-slate-400 text-base mt-4 leading-relaxed">
            Kamboh Plus was founded with one singular objective: to replace emotion and social media noise in crypto trading with verifiable, automated quantitative models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Core Philosophy</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Markets run in cycles of expansion and compression. Rather than predicting price tops or bottoms, our algorithms track trend alignment (EMA20/50/200), measure momentum exhaustion via Wilder’s RSI, evaluate MACD momentum divergence, and calculate volatility regimes through Average True Range.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-[#16C784] flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Zero Artificial Fluff</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We never fabricate win-rates or display artificial hype. If market conditions become choppy (low ADX &lt; 20), our engine actively suppresses trade signals. Quality of setups will always supersede quantity of alerts.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#0E131C] border border-white/5 space-y-4">
          <h3 className="text-lg font-bold text-white">System Architecture Overview</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kamboh Plus operates via serverless Supabase Edge Functions orchestrated through pg_cron. Market data feeds continuously stream from Binance, Bybit, and OKX REST endpoints. Subscriptions are securely provisioned through Lemon Squeezy with webhook-based entitlement validation, while email alerts are handled through Resend.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
