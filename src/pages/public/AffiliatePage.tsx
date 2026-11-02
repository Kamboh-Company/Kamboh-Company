import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Gift,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  Wallet,
  Clock,
  Sparkles,
  Percent,
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

export const AffiliatePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCta = () => {
    if (user) {
      navigate('/dashboard/referrals');
    } else {
      navigate('/signup');
    }
  };

  const benefits = [
    {
      icon: Percent,
      title: '30% – 40% Recurring Share',
      desc: 'Earn lifetime recurring commission on every monthly or yearly Pro plan renewal. Passive income that stacks month after month.',
    },
    {
      icon: Wallet,
      title: 'Flexible Crypto Payouts',
      desc: 'Receive your earnings in USDT (TRC-20, BEP-20), Binance Pay ID, Wise bank wire, or JazzCash / EasyPaisa with zero hassle.',
    },
    {
      icon: Clock,
      title: '90-Day Cookie Window',
      desc: 'When someone clicks your referral link, you get credit if they sign up anytime within 90 days across web and mobile.',
    },
    {
      icon: Zap,
      title: 'High-Converting Algorithmic Product',
      desc: '74%+ audited win-rate, real-time alerts, and TradingView charts ensure traders actually convert and stay subscribed.',
    },
    {
      icon: ShieldCheck,
      title: 'Transparent Real-Time Dashboard',
      desc: 'Track every single link visit, signup, conversion, and commission payout live in your Kamboh Plus dashboard.',
    },
    {
      icon: Users,
      title: 'Priority Partner Support',
      desc: 'Direct access to marketing materials, social promo copy, and dedicated affiliate assistance to boost your earnings.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col selection:bg-blue-500/30">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-purple-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <Badge variant="purple" size="md" dot>
              KAMBOH PLUS AFFILIATE & PARTNER PROGRAM
            </Badge>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Earn Up To <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">40% Recurring</span> Passive Crypto Income
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Apne friends, crypto groups, aur audience ko Kamboh Plus invite karein. Har subscriber par har mahine recurring commission kamayein, direct USDT payout ke sath!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleCta}
                className="w-full sm:w-auto font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-500/20 text-base px-8 py-3.5"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {user ? 'Open My Referral Dashboard' : 'Get Your Referral Link Free'}
              </Button>
              <Link to="/pricing">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  View Signal Pricing
                </Button>
              </Link>
            </div>

            {/* Quick stats highlight */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-[#141923] border border-white/[0.08]">
                <div className="text-2xl font-black text-emerald-400">30% - 40%</div>
                <div className="text-xs text-slate-400 mt-0.5">Recurring Share</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#141923] border border-white/[0.08]">
                <div className="text-2xl font-black text-blue-400">$20.00</div>
                <div className="text-xs text-slate-400 mt-0.5">Min Payout Threshold</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#141923] border border-white/[0.08]">
                <div className="text-2xl font-black text-purple-400">90 Days</div>
                <div className="text-xs text-slate-400 mt-0.5">Cookie Duration</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#141923] border border-white/[0.08]">
                <div className="text-2xl font-black text-teal-400">24 Hours</div>
                <div className="text-xs text-slate-400 mt-0.5">Crypto Payout Speed</div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works in 3 steps */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/[0.06] bg-[#0E131C]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="blue" size="sm">
                HOW YOU EARN
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                3 Simple Steps to Start Earning Today
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] relative">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-lg mb-4">
                  01
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Get Your Link</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sign up for a free Kamboh Plus account. Your unique referral link and promo code are generated instantly in your dashboard.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] relative">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black text-lg mb-4">
                  02
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Share With Traders</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Share your link on WhatsApp groups, Telegram channels, YouTube, Twitter/X, or with friends. We provide ready-to-copy marketing templates.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] relative">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-lg mb-4">
                  03
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Receive Monthly Payouts</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Earn $2.70/month or $23.70/year per subscriber. Request payouts anytime directly to your USDT wallet, Binance Pay, or local bank!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="purple" size="sm">
                PROGRAM ADVANTAGES
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Built For Serious Crypto Creators & Affiliates
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <Card key={b.title} className="p-6 border-white/[0.08] bg-[#141923] space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <b.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{b.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/40 via-[#141923] to-purple-900/30 border-t border-white/[0.08]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to start earning passive income?
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              No approval waiting time. Instant link generation with live conversion tracking and crypto withdrawals.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleCta}
                className="font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl shadow-emerald-500/20 px-8"
              >
                {user ? 'Open My Referral Dashboard' : 'Join Partner Program Free'}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
