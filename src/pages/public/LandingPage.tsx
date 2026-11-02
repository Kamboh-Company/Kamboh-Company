import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  BarChart3,
  Lock,
  Layers,
  Cpu,
  Radio,
  Clock,
  Compass,
  Play,
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { PriceTicker } from '../../components/common/PriceTicker';
import { Footer } from '../../components/common/Footer';
import { CookieConsent } from '../../components/common/CookieConsent';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SignalCard } from '../../components/signals/SignalCard';
import { signalStorage, calculateDatabasePerformance } from '../../lib/supabase';
import { Signal, PerformanceStats } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { plan } = useAuth();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [performance, setPerformance] = useState<PerformanceStats | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const list = signalStorage.getSignals();
    setSignals(list);
    setPerformance(calculateDatabasePerformance(list));
  }, []);

  const faqs = [
    {
      q: 'How does the automated signal engine work?',
      a: 'Our autonomous quantitative engine scans top liquid crypto pairs (BTC, ETH, SOL, etc.) across Binance, Bybit, and OKX every 15 minutes. It evaluates multi-timeframe EMA trend alignment (EMA20/50/200), RSI momentum, MACD histogram crossovers, Bollinger Band squeezes, and volume surge ratios before generating high-probability trade setups.',
    },
    {
      q: 'What is the difference between Free and Pro tiers?',
      a: 'Free members receive 2-3 algorithmic setups per week with a 1-hour execution delay and 7-day history. Pro members receive instant real-time signals across all supported coins, entry, TP1/TP2/TP3 ladders, stop-loss targets, leverage guidance, full historical data, and instant notifications.',
    },
    {
      q: 'How are Take Profit (TP) and Stop Loss (SL) calculated?',
      a: 'Every signal applies mathematical risk management based on the 14-period Average True Range (ATR). Stop losses are placed at entry ± 1.5× ATR to avoid market noise. Take profit targets are structured as disciplined R-multiples: TP1 at 1.0R, TP2 at 2.0R, and TP3 at 3.0R.',
    },
    {
      q: 'Are performance statistics audited and real?',
      a: 'Yes. All statistics displayed on Kamboh Plus are calculated exclusively from stored closed signals in our database. We never display synthetic or hardcoded win-rate figures. When fewer than 30 closed signals exist, our platform transparently flags that the statistical sample size is still maturing.',
    },
    {
      q: 'Can I cancel my Pro subscription at any time?',
      a: 'Yes, absolutely. You can cancel with 1-click at any time via your Lemon Squeezy billing portal. You will retain Pro access until the end of your billing cycle without any penalty.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col selection:bg-blue-600/30">
      <Navbar />
      <PriceTicker />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Next-Gen Quantitative Signal Engine v2.4 Active</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Automated Crypto Trading Signals Powered by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Quantitative Confluence
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            No guesswork. No emotional bias. Kamboh Plus scans 1h and 4h crypto timeframes across multi-exchange feeds to pinpoint institutional setups with entry, 3 take-profits, and disciplined ATR stop-losses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/signup')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/guide')}
              leftIcon={<Play className="w-4 h-4 fill-blue-400 text-blue-400" />}
              className="w-full sm:w-auto border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
            >
              Watch Video Guide
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto"
            >
              View Pricing ($9/mo)
            </Button>
          </div>

          {/* Social Proof / Security pill */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16C784]" />
              Multi-Exchange Data (Binance, Bybit, OKX)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16C784]" />
              Strict ATR & R-Multiple Risk Targets
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16C784]" />
              Zero Financial Advice Disclaimer
            </span>
          </div>
        </div>
      </section>

      {/* How It Works in 3 Steps */}
      <section id="how-it-works" className="py-20 bg-[#0E131C] border-y border-white/[0.06] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Execution Pipeline</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              How Algorithmic Kamboh Plus Works in 3 Steps
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-3">
              Built by quants, engineered for discipline. From multi-exchange data feeds to verified trade setups in under 15 milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-8 rounded-2xl bg-[#141923] border border-white/[0.08] shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-xl mb-6">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-Exchange Data Scan</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every 15 minutes, our edge engine fetches high-resolution OHLCV candles across Binance, Bybit, and OKX with automatic geo-fallback and rate-limit redundancy.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-2xl bg-[#141923] border border-white/[0.08] shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-black text-xl mb-6">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Technical Confluence Scoring</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Calculates EMA20/50/200 trends, RSI momentum, MACD zero-line crosses, Bollinger squeezes, and volume spike ratios. Low ADX chop is automatically discarded.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-2xl bg-[#141923] border border-white/[0.08] shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#16C784] flex items-center justify-center font-black text-xl mb-6">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Target & Risk Dispatch</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                High-confidence setups (75+) are routed in real-time to Pro members with entry, 1R/2R/3R take profits, and stop-loss levels, plus instant email and in-app alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Sample Signals Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
              Live Feed Preview
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Recent Algorithmic Signals
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Real signals generated by our automated engine. Premium signals require Pro access.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" size="md" onClick={() => navigate('/dashboard/signals')}>
              Explore All Signals
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.slice(0, 3).map((sig) => (
            <SignalCard
              key={sig.id}
              signal={sig}
              userPlan={plan}
              onUpgradeClick={() => navigate('/pricing')}
            />
          ))}
        </div>
      </section>

      {/* Transparent Database Performance Preview */}
      <section className="py-20 bg-[#0E131C] border-y border-white/[0.06] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="blue" size="sm" className="mb-3">
              AUDITED FROM DATABASE
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Platform Performance Metrics
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2">
              Computed strictly from closed signals in our database. We do not manufacture numbers.
            </p>
          </div>

          {performance && !performance.hasEnoughData ? (
            <div className="p-8 rounded-2xl bg-[#141923] border border-amber-500/30 text-center max-w-2xl mx-auto shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Not Enough Closed Data Yet (Minimum 30 Required)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                To guarantee statistical integrity, Kamboh Plus only presents aggregate win rates and profit factor curves after reaching a minimum threshold of 30 closed, verified signals.
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 block">Total Signals Logged</span>
                  <span className="font-bold text-white text-base">{performance.totalSignals}</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <span className="text-slate-500 block">Closed Positions</span>
                  <span className="font-bold text-white text-base">{performance.closedSignals} / 30</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <span className="text-slate-500 block">Active Trades</span>
                  <span className="font-bold text-blue-400 text-base">{performance.activeSignals}</span>
                </div>
              </div>
              <div className="mt-6">
                <Link to="/performance" className="text-xs font-semibold text-blue-400 hover:underline">
                  View Detailed Performance Ledger →
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-[#141923] border border-white/5">
                <span className="text-xs text-slate-400 font-medium">Win Rate</span>
                <div className="text-3xl font-extrabold text-[#16C784] mt-1 font-mono">
                  {performance?.winRate}%
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-[#141923] border border-white/5">
                <span className="text-xs text-slate-400 font-medium">Average R</span>
                <div className="text-3xl font-extrabold text-blue-400 mt-1 font-mono">
                  +{performance?.avgR}R
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-[#141923] border border-white/5">
                <span className="text-xs text-slate-400 font-medium">Profit Factor</span>
                <div className="text-3xl font-extrabold text-purple-400 mt-1 font-mono">
                  {performance?.profitFactor}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-[#141923] border border-white/5">
                <span className="text-xs text-slate-400 font-medium">Total Closed</span>
                <div className="text-3xl font-extrabold text-white mt-1 font-mono">
                  {performance?.closedSignals}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Algorithmic Edge</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Engineered for Modern Crypto Markets
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#141923] border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Technical Confluence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes 8 indicators simultaneously: EMA20/50/200, RSI, MACD, Bollinger Bands, ATR, ADX, and volume spikes before issuing an alert.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141923] border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#16C784] flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Strict R-Multiple Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every signal arrives with dynamic ATR stop-losses and 3 scaled take-profit levels (1R, 2R, 3R) to protect capital during volatile regime shifts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141923] border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-Exchange Redundancy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant failover between Binance, Bybit, and OKX REST endpoints guarantees non-stop continuous candle scanning even during regional outages.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-[#0E131C] border-t border-white/[0.06] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-400 mt-2">Everything you need to know about Kamboh Plus</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#141923] border border-white/[0.06] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-white text-sm hover:bg-white/[0.02]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center w-full">
        <div className="p-12 rounded-3xl bg-gradient-to-b from-[#182133] to-[#121622] border border-blue-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Stop Guessing. Trade with Algorithmic Certainty.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of traders monitoring high-confluence crypto setups in real time. Start free with zero commitments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="primary" onClick={() => navigate('/signup')}>
              Create Free Account
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/pricing')}>
              View Pro Plans ($9/mo)
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <CookieConsent />
    </div>
  );
};
