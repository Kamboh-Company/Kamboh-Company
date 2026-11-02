import React, { useState, useEffect } from 'react';
import {
  Gift,
  Copy,
  Check,
  Share2,
  DollarSign,
  TrendingUp,
  Users,
  MousePointerClick,
  Wallet,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Send,
  Clock,
  HelpCircle,
  FileText,
  Percent,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { referralStorage } from '../../lib/supabase';
import { ReferralStats, ReferralUser, PayoutRequest, PayoutMethod } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { useToast } from '../../components/ui/Toast';
import { formatPrice, formatTimeAgo } from '../../lib/utils';

export const ReferralsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState('referrals');

  // Calculator state
  const [simulatedReferrals, setSimulatedReferrals] = useState<number>(15);

  // Payout Modal
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<string>('20.00');
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('USDT_TRC20');
  const [payoutAddress, setPayoutAddress] = useState<string>('');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  const loadData = () => {
    if (!user) return;
    const currentStats = referralStorage.getStats(user.id);
    const userReferrals = referralStorage.getReferredUsers(user.id);
    const userPayouts = referralStorage.getPayouts(user.id);

    setStats(currentStats);
    setReferrals(userReferrals);
    setPayouts(userPayouts);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCopyLink = async () => {
    if (!stats) return;
    try {
      await navigator.clipboard.writeText(stats.referral_link);
      setCopiedLink(true);
      success('Link Copied!', 'Your Kamboh Plus referral link is ready to share.');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyCode = async () => {
    if (!stats) return;
    try {
      await navigator.clipboard.writeText(stats.referral_code);
      setCopiedCode(true);
      success('Code Copied!', `Referral code ${stats.referral_code} copied.`);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleShareWhatsApp = () => {
    if (!stats) return;
    const text = encodeURIComponent(
      `🚀 Join Kamboh Plus with my link for high-accuracy algorithmic crypto trading signals (74%+ win rate, 1R-3R profit targets)! Sign up here: ${stats.referral_link}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    if (!stats) return;
    const text = encodeURIComponent(
      `Join Kamboh Plus for real-time crypto signals & risk management: ${stats.referral_link}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(stats.referral_link)}&text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    if (!stats) return;
    const text = encodeURIComponent(
      `Trading crypto with @KambohPlus automated signals engine. 1R-3R profit ladders & multi-exchange confluence. Get started free: ${stats.referral_link}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !stats) return;

    const amountNum = parseFloat(payoutAmount);
    if (isNaN(amountNum) || amountNum < 20) {
      toastError('Invalid Amount', 'Minimum withdrawal amount is $20.00 USD.');
      return;
    }
    if (amountNum > stats.available_balance) {
      toastError('Insufficient Balance', `You only have $${stats.available_balance.toFixed(2)} available.`);
      return;
    }
    if (!payoutAddress.trim()) {
      toastError('Missing Details', 'Please provide a valid wallet address or account ID.');
      return;
    }

    setIsSubmittingPayout(true);
    setTimeout(() => {
      const res = referralStorage.requestPayout(user.id, amountNum, payoutMethod, payoutAddress);
      setIsSubmittingPayout(false);
      if (res.success) {
        success('Payout Requested', `Withdrawal of $${amountNum.toFixed(2)} submitted for review.`);
        setIsPayoutModalOpen(false);
        setPayoutAddress('');
        loadData();
      } else {
        toastError('Payout Error', res.error || 'Failed to submit payout.');
      }
    }, 600);
  };

  if (!stats) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p>Loading referral earnings...</p>
      </div>
    );
  }

  // Monthly passive income simulation
  const simulatedMonthlyEarnings = Number((simulatedReferrals * 9 * stats.commission_rate).toFixed(2));
  const simulatedYearlyEarnings = Number((simulatedMonthlyEarnings * 12).toFixed(2));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/40 via-[#141923] to-purple-900/30 border border-white/[0.08] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <Badge variant="emerald" size="sm" dot>
                30% RECURRING LIFETIME COMMISSION
              </Badge>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
                {stats.current_tier}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Refer & Earn Passive Crypto Income
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Apne referral link ko dosto, trading groups, aur social media par share karein. Har Pro subscriber par <span className="text-emerald-400 font-semibold">30% recurring commission</span> pay karein directly apne wallet me.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsPayoutModalOpen(true)}
              disabled={stats.available_balance < 20}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 font-bold"
              leftIcon={<Wallet className="w-4 h-4" />}
            >
              Request Payout (${stats.available_balance.toFixed(2)})
            </Button>
            <div className="text-[11px] text-slate-400 text-center">
              Minimum withdrawal: <span className="text-slate-200 font-medium">$20.00 USDT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link & Social Sharing Bar */}
      <Card className="p-6 border-white/10 bg-[#121722]">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          {/* Link Box */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-blue-400" />
                Your Unique Referral Link
              </span>
              <span className="text-emerald-400 text-[11px] font-normal">
                Gives invited users 10% discount on Pro upgrade
              </span>
            </label>
            <div className="flex items-center gap-2 bg-[#0A0D13] p-1.5 rounded-2xl border border-white/10">
              <input
                type="text"
                readOnly
                value={stats.referral_link}
                className="bg-transparent text-xs sm:text-sm text-slate-200 px-3 py-2 flex-1 outline-none font-mono selection:bg-blue-500/30"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleCopyLink}
                className="whitespace-nowrap px-4 rounded-xl text-xs font-semibold"
                leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          </div>

          {/* Code Box & Share Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center gap-2 bg-[#0A0D13] px-3.5 py-2.5 rounded-2xl border border-white/10">
              <span className="text-xs text-slate-400 font-medium">Code:</span>
              <span className="text-xs font-mono font-bold text-white tracking-wider">
                {stats.referral_code}
              </span>
              <button
                onClick={handleCopyCode}
                title="Copy Code"
                className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                title="Share on WhatsApp"
                className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 hover:scale-105 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={handleShareTelegram}
                title="Share on Telegram"
                className="flex items-center justify-center w-10 h-10 rounded-2xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-400 hover:scale-105 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
              <button
                onClick={handleShareTwitter}
                title="Share on X / Twitter"
                className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 hover:scale-105 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Earned */}
        <Card className="p-5 border-white/[0.08] bg-[#141923] relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Earned</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            ${stats.total_earned.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">${stats.total_paid.toFixed(2)}</span> paid out
          </div>
        </Card>

        {/* Available Balance */}
        <Card className="p-5 border-emerald-500/20 bg-gradient-to-b from-[#141923] to-emerald-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-emerald-300 font-medium">Available Balance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            ${stats.available_balance.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.pending_payout > 0 ? (
              <span className="text-amber-400 font-medium">${stats.pending_payout.toFixed(2)} in review</span>
            ) : (
              <span>Ready for withdrawal</span>
            )}
          </div>
        </Card>

        {/* Active Pro Referrals */}
        <Card className="p-5 border-white/[0.08] bg-[#141923] relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Active Subscribers</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stats.active_subscribers}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Out of <span className="text-white font-medium">{stats.total_signups}</span> total signups
          </div>
        </Card>

        {/* Clicks & Rate */}
        <Card className="p-5 border-white/[0.08] bg-[#141923] relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Conversion Rate</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stats.total_clicks > 0
              ? `${((stats.total_signups / stats.total_clicks) * 100).toFixed(1)}%`
              : '0%'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span className="text-slate-300 font-medium">{stats.total_clicks}</span> total link visits
          </div>
        </Card>
      </div>

      {/* Tier Roadmap & Interactive Passive Income Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tier Roadmap */}
        <Card className="lg:col-span-5 p-6 border-white/[0.08] bg-[#141923] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-400" />
                Affiliate Commission Tiers
              </h3>
              <Badge variant="blue" size="sm">
                Up to 40%
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Jaise jaise aapke traders barhte hain, aapka commission percentage automatically boost ho jata hai:
            </p>

            <div className="space-y-3.5">
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  stats.total_signups < 6
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-[#0E131C] border-white/5 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">Tier 1: Starter Affiliate</span>
                  <span className="text-blue-400">20% Recurring</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">1 - 5 active referrals</p>
              </div>

              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  stats.total_signups >= 6 && stats.total_signups < 21
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-[#0E131C] border-white/5 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200 flex items-center gap-1.5">
                    Tier 2: Ambassador Partner
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[10px] text-emerald-400">
                      Current
                    </span>
                  </span>
                  <span className="text-emerald-400 font-bold">30% Recurring</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">6 - 20 active referrals + Priority Payouts</p>
              </div>

              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  stats.total_signups >= 21
                    ? 'bg-purple-500/10 border-purple-500/30'
                    : 'bg-[#0E131C] border-white/5 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">Tier 3: Whale VIP Partner</span>
                  <span className="text-purple-400 font-bold">40% Lifetime</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">21+ referrals + Direct Quant Signals API feed</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Next Tier: Whale VIP</span>
            <span className="font-semibold text-white">
              {Math.max(0, 21 - stats.total_signups)} more referrals needed
            </span>
          </div>
        </Card>

        {/* Interactive Calculator */}
        <Card className="lg:col-span-7 p-6 border-white/[0.08] bg-[#141923] relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Live Passive Income Calculator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculate how much you earn every month as an affiliate partner.
              </p>
            </div>
          </div>

          {/* Slider */}
          <div className="bg-[#0A0D13] p-5 rounded-2xl border border-white/10 my-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Referred Paying Subscribers:</span>
              <span className="text-lg font-extrabold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20">
                {simulatedReferrals} Traders
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={simulatedReferrals}
              onChange={(e) => setSimulatedReferrals(parseInt(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>1 Trader</span>
              <span>25 Traders</span>
              <span>50 Traders</span>
              <span>100 Traders</span>
            </div>
          </div>

          {/* Projected Output Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs text-emerald-300 font-medium">Estimated Monthly Passive Income</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                ${simulatedMonthlyEarnings}
                <span className="text-xs font-normal text-slate-400"> / month</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Paid every 30 days automatically</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-center">
              <span className="text-xs text-purple-300 font-medium">Estimated Yearly Earnings</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 mt-1">
                ${simulatedYearlyEarnings}
                <span className="text-xs font-normal text-slate-400"> / year</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Based on 30% recurring share</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Section: Referred Users, Payout History, Marketing Kit */}
      <div className="space-y-4">
        <Tabs
          tabs={[
            { id: 'referrals', label: `Referred Traders (${referrals.length})` },
            { id: 'payouts', label: `Payout History (${payouts.length})` },
            { id: 'kit', label: 'Marketing Kit & Promo Captions' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab 1: Referred Users List */}
        {activeTab === 'referrals' && (
          <Card className="border-white/[0.08] bg-[#141923] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0E131C] text-slate-400 text-xs uppercase tracking-wider border-b border-white/[0.08]">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Referred Trader</th>
                    <th className="px-5 py-3.5 font-semibold">Join Date</th>
                    <th className="px-5 py-3.5 font-semibold">Subscription Plan</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Commission Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-slate-200 text-xs">
                  {referrals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                        No referrals yet. Share your referral link above to start earning!
                      </td>
                    </tr>
                  ) : (
                    referrals.map((ref) => (
                      <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4 font-mono font-medium text-slate-100 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                            {ref.referred_name?.[0] || 'T'}
                          </div>
                          <div>
                            <div>{ref.referred_email_masked}</div>
                            {ref.referred_name && (
                              <div className="text-[11px] text-slate-400 font-sans">{ref.referred_name}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-400">
                          {formatTimeAgo(ref.created_at)}
                        </td>
                        <td className="px-5 py-4">
                          {ref.status === 'active_pro_yearly' ? (
                            <Badge variant="purple" size="sm">
                              Pro Yearly ($79)
                            </Badge>
                          ) : ref.status === 'active_pro_monthly' ? (
                            <Badge variant="blue" size="sm">
                              Pro Monthly ($9)
                            </Badge>
                          ) : (
                            <Badge variant="neutral" size="sm">
                              Free Tier
                            </Badge>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {ref.status.startsWith('active') ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Active (Paying)
                            </span>
                          ) : (
                            <span className="text-slate-400">Free Member</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right font-semibold text-emerald-400">
                          +${ref.total_commission_generated.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Tab 2: Payout History */}
        {activeTab === 'payouts' && (
          <Card className="border-white/[0.08] bg-[#141923] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0E131C] text-slate-400 text-xs uppercase tracking-wider border-b border-white/[0.08]">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Date</th>
                    <th className="px-5 py-3.5 font-semibold">Amount</th>
                    <th className="px-5 py-3.5 font-semibold">Method</th>
                    <th className="px-5 py-3.5 font-semibold">Destination Details</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Transaction Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-slate-200 text-xs">
                  {payouts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                        No payout requests yet. Minimum withdrawal is $20.00 USD.
                      </td>
                    </tr>
                  ) : (
                    payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4 text-slate-400">
                          {formatTimeAgo(p.created_at)}
                        </td>
                        <td className="px-5 py-4 font-bold text-white text-sm">
                          ${p.amount.toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                            {p.method.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-[11px] text-slate-300 max-w-[200px] truncate">
                          {p.payout_details}
                        </td>
                        <td className="px-5 py-4">
                          {p.status === 'paid' ? (
                            <Badge variant="emerald" size="sm">
                              Paid (Completed)
                            </Badge>
                          ) : p.status === 'processing' ? (
                            <Badge variant="blue" size="sm">
                              Processing
                            </Badge>
                          ) : p.status === 'pending' ? (
                            <Badge variant="amber" size="sm">
                              Pending Review
                            </Badge>
                          ) : (
                            <Badge variant="red" size="sm">
                              Rejected
                            </Badge>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right font-mono text-[11px] text-blue-400">
                          {p.tx_hash_or_ref ? (
                            <span className="truncate max-w-[140px] inline-block" title={p.tx_hash_or_ref}>
                              {p.tx_hash_or_ref.slice(0, 10)}...
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Tab 3: Marketing Kit */}
        {activeTab === 'kit' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-white/[0.08] bg-[#141923] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  Urdu / Hindi WhatsApp Promo Text
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const txt = `🔥 Kamboh Plus - Best Crypto Trading Signals!\nDaily high accuracy algorithmic signals (BTC, ETH, SOL, BNB) with 1R to 3R take-profit targets.\n\nMere link se sign up karein aur 10% discount payein:\n${stats.referral_link}`;
                    navigator.clipboard.writeText(txt);
                    success('Copied!', 'Promo text copied to clipboard.');
                  }}
                  leftIcon={<Copy className="w-3.5 h-3.5" />}
                >
                  Copy Text
                </Button>
              </div>
              <div className="bg-[#0A0D13] p-4 rounded-2xl border border-white/10 text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                {`🔥 Kamboh Plus - Best Crypto Trading Signals!
Daily high accuracy algorithmic signals (BTC, ETH, SOL, BNB) with 1R to 3R take-profit targets. Stop loss aur leverage guidelines shamil hain.

Mere link se sign up karein aur 10% discount payein:
${stats.referral_link}`}
              </div>
            </Card>

            <Card className="p-6 border-white/[0.08] bg-[#141923] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-400" />
                  English Telegram / Twitter Promo Text
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const txt = `🚀 Level up your crypto trading with Kamboh Plus algorithmic signals!\n\n✅ 74%+ audited win rate\n✅ Confluence technical analysis (RSI, MACD, EMA)\n✅ Multi-exchange failover & 3-stage profit ladders\n\nGet started free today:\n${stats.referral_link}`;
                    navigator.clipboard.writeText(txt);
                    success('Copied!', 'Promo text copied to clipboard.');
                  }}
                  leftIcon={<Copy className="w-3.5 h-3.5" />}
                >
                  Copy Text
                </Button>
              </div>
              <div className="bg-[#0A0D13] p-4 rounded-2xl border border-white/10 text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                {`🚀 Level up your crypto trading with Kamboh Plus algorithmic signals!

✅ 74%+ audited win rate
✅ Confluence technical analysis (RSI, MACD, EMA)
✅ Multi-exchange failover & 3-stage profit ladders

Get started free today:
${stats.referral_link}`}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Request Payout Modal */}
      <Modal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Request Affiliate Commission Payout"
      >
        <form onSubmit={handleRequestPayout} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <span className="text-xs text-emerald-300">Available Balance:</span>
            <span className="text-lg font-extrabold text-emerald-400">
              ${stats.available_balance.toFixed(2)} USD
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Withdrawal Amount ($)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="20"
                max={stats.available_balance}
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                required
                className="w-full bg-[#0E131C] text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm border border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setPayoutAmount(stats.available_balance.toFixed(2))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded bg-emerald-500/10"
              >
                MAX
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Minimum payout: $20.00 USD</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Payout Method
            </label>
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value as PayoutMethod)}
              className="w-full bg-[#0E131C] text-slate-100 rounded-xl px-3.5 py-2.5 text-sm border border-white/10 focus:border-emerald-500 outline-none"
            >
              <option value="USDT_TRC20">USDT (TRC-20 Network) - Zero/Lowest Fees</option>
              <option value="USDT_BEP20">USDT (BEP-20 / Binance Smart Chain)</option>
              <option value="BINANCE_PAY">Binance Pay ID (Instant)</option>
              <option value="BANK_TRANSFER">Bank Wire / Wise (USD/EUR)</option>
              <option value="JAZZCASH_EASYPAISA">JazzCash / EasyPaisa (PKR Live Conversion)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Wallet Address / Account Details
            </label>
            <textarea
              rows={2}
              placeholder={
                payoutMethod.includes('USDT')
                  ? 'Enter your USDT wallet address (e.g. T...)'
                  : payoutMethod === 'BINANCE_PAY'
                  ? 'Enter your Binance Pay ID / Email'
                  : 'Enter Account Title, Bank Name, and IBAN / Mobile number'
              }
              value={payoutAddress}
              onChange={(e) => setPayoutAddress(e.target.value)}
              required
              className="w-full bg-[#0E131C] text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border border-white/10 focus:border-emerald-500 outline-none font-mono"
            />
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Automated Payout Security
            </div>
            <p>
              Withdrawals are processed within 24 hours directly to your specified address. No network deduction on Binance Pay or TRC20.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsPayoutModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmittingPayout}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
            >
              Submit Withdrawal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
