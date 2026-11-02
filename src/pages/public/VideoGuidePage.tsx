import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  CheckCircle2,
  Shield,
  HelpCircle,
  TrendingUp,
  Download,
  ArrowRight,
  Sparkles,
  Zap,
  BookOpen,
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { VideoGuidePlayer } from '../../components/guide/VideoGuidePlayer';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

export const VideoGuidePage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Signal ko Binance ya Bybit par kaise execute karein?',
      qEn: 'How to execute a signal on Binance or Bybit?',
      a: 'Kamboh Plus me signal card ke andar "Copy Trade Details" par click karein. Phir apni exchange (Binance/Bybit) me Futures ya Spot open karein, Limit Order me entry price dalein, aur sath hi TP1 aur Stop Loss set kar dein.',
      aEn: 'Click "Copy Trade Details" inside any signal card. Open Binance or Bybit Futures/Spot, set a Limit order at the entry price, and configure your TP1 and Stop Loss levels.',
    },
    {
      q: 'Stop loss lagana kyun zaroori hai?',
      qEn: 'Why is setting a Stop Loss mandatory?',
      a: 'Cryptocurrency market volatile hoti hai. Stop Loss aapke capital ko 100% loss ya liquidation se bachata hai. Kamboh Plus ka rule hai ke kisi bhi trade me 1% se 2% se zyada risk na lein.',
      aEn: 'Crypto markets can experience rapid volatility. A Stop Loss protects your capital from catastrophic drawdowns or liquidation.',
    },
    {
      q: '3 Take-Profit (TP1, TP2, TP3) levels ko kaise manage karein?',
      qEn: 'How to manage the 3 Take-Profit levels?',
      a: 'Best strategy yeh hai ke jab price TP1 par pohnche, apni 50% position close karke profit book karein, aur baqi 50% ka Stop Loss move karke entry price par le ayein (Breakeven). Is tarah trade risk-free ho jati hai!',
      aEn: 'Best practice: Close 50% of your position at TP1 to bank profit, then move your Stop Loss to entry price (Breakeven) for a completely risk-free ride to TP2 and TP3.',
    },
    {
      q: 'Referral link se kamaya hua commission kab aur kaise milega?',
      qEn: 'When and how do I receive referral earnings?',
      a: 'Aapka referral commission real-time me aapke dashboard me add hota hai. Jab aapka balance $20 ho jaye, aap "Request Payout" dabakar USDT (TRC-20, BEP-20), Binance Pay, ya JazzCash me 24 ghante ke andar withdraw kar sakte hain.',
      aEn: 'Referral commissions credit instantly to your dashboard. Once your balance reaches $20.00 USD, submit a withdrawal request for USDT, Binance Pay, or local transfer.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col selection:bg-blue-500/30">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-4">
          <Badge variant="blue" size="md" dot>
            OFFICIAL VIDEO TUTORIAL & MASTERCLASS
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How to Use <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Kamboh Plus</span> from A to Z
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Yeh 3-minute video guide dekhein aur seekhein ke signals kaise read karne hain, Binance par trade kaise execute karni hai, aur referral link se passive income kaise banani hai.
          </p>
        </section>

        {/* Video Player Container */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
          <VideoGuidePlayer />
        </section>

        {/* 5 Golden Rules Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <Badge variant="purple" size="sm">
              TRADING DISCIPLINE
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              5 Golden Rules for Profitable Crypto Trading
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Follow these quantitative rules to grow your portfolio sustainably.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card className="p-5 border-white/[0.08] bg-[#141923] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-white">1% - 2% Risk Rule</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kabhi bhi ek trade me apne portfolio ka 2% se zyada risk na lagayein. Risk Calculator use karein.
              </p>
            </Card>

            <Card className="p-5 border-white/[0.08] bg-[#141923] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-white">Always Use Stop Loss</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kamboh Plus har signal me precise Stop Loss deta hai. Stop Loss ke baghair trade kabhi na lein.
              </p>
            </Card>

            <Card className="p-5 border-white/[0.08] bg-[#141923] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-white">Take Profit at TP1</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Jab price TP1 hit kare, 50% position close karke profit lock karein aur SL breakeven par move karein.
              </p>
            </Card>

            <Card className="p-5 border-white/[0.08] bg-[#141923] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="text-sm font-bold text-white">Safe Leverage (2x-5x)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High leverage (20x-50x) se door rahein. Algorithmic signals 2x se 5x leverage par optimal kaam karte hain.
              </p>
            </Card>

            <Card className="p-5 border-white/[0.08] bg-[#141923] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h3 className="text-sm font-bold text-white">No Emotional Trading</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                FOMO ya gusse me trade na karein. System signals ki technical confluence par disciplined amal karein.
              </p>
            </Card>
          </div>
        </section>

        {/* Video FAQ Accordion */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <Badge variant="blue" size="sm">
              FREQUENTLY ASKED QUESTIONS
            </Badge>
            <h2 className="text-2xl font-bold text-white mt-1">
              Customer Usage & Trade Execution FAQs
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="rounded-2xl bg-[#141923] border border-white/[0.08] overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:bg-white/[0.02]"
                >
                  <div>
                    <div>{faq.q}</div>
                    <div className="text-[11px] text-slate-400 font-normal mt-0.5">{faq.qEn}</div>
                  </div>
                  <span className="text-blue-400 font-mono text-lg flex-shrink-0">
                    {activeFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-white/[0.05] bg-[#0E131C] space-y-1.5">
                    <p className="text-slate-200">{faq.a}</p>
                    <p className="text-[11px] text-slate-400 italic">{faq.aEn}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/30 via-[#141923] to-purple-900/30 border border-white/10 space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Ready to trade with Kamboh Plus signals?
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Open the live signals feed or calculate your next position with our built-in quantitative tools.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/dashboard/signals">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Open Signals Feed
                </Button>
              </Link>
              <Link to="/dashboard/calculator">
                <Button variant="ghost" size="lg">
                  Open Risk Calculator
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
