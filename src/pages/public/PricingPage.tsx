import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Sparkles, Shield, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import {
  buildLemonSqueezyCheckoutUrl,
  LEMON_MONTHLY_VARIANT_ID,
  LEMON_YEARLY_VARIANT_ID,
} from '../../lib/lemonsqueezy';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

export const PricingPage: React.FC = () => {
  const { user, isPro, upgradeToPro } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = (cycle: 'monthly' | 'yearly') => {
    setSelectedPlanType(cycle);
    if (!user) {
      navigate('/signup');
      return;
    }

    // Open Lemon Squeezy checkout
    const variantId = cycle === 'monthly' ? LEMON_MONTHLY_VARIANT_ID : LEMON_YEARLY_VARIANT_ID;
    
    // If user has set up real Lemon Squeezy store ID in env:
    const isMockVariant = variantId.includes('ls_variant_') || !import.meta.env.VITE_LEMONSQUEEZY_STORE_ID;

    if (!isMockVariant) {
      const checkoutUrl = buildLemonSqueezyCheckoutUrl({
        variantId,
        userId: user.id,
        userEmail: user.email,
        isYearly: cycle === 'yearly',
      });
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Show interactive checkout simulation modal with instant activation
      setShowCheckoutModal(true);
    }
  };

  const handleConfirmSimulatedCheckout = () => {
    upgradeToPro();
    setShowCheckoutModal(false);
    success('Welcome to Pro!', 'Your subscription has been activated successfully.');
    navigate('/dashboard/signals');
  };

  const comparisonFeatures = [
    { name: 'Algorithmic Signal Frequency', free: '2-3 per week', pro: 'Unlimited 24/7' },
    { name: 'Signal Speed & Timing', free: '1-Hour Delayed', pro: 'Instant Real-Time' },
    { name: 'Entry, TP1, TP2, TP3 & Stop-Loss', free: 'Locked / Hidden', pro: 'Full Access' },
    { name: 'Suggested Leverage & Risk Level', free: 'Basic only', pro: 'Full Confluence Breakdown' },
    { name: 'Technical Indicator Snapshot', free: 'Partial', pro: 'RSI, MACD, EMA, ATR, ADX, Vol' },
    { name: 'Push & Email Alerts (Resend)', free: false, pro: true },
    { name: 'Interactive TradingView Charts', free: 'Basic overview', pro: 'Multi-Timeframe with TP/SL lines' },
    { name: 'Historical Signals Ledger', free: 'Last 7 Days', pro: 'Full Database History' },
    { name: 'CSV Signal Export', free: false, pro: true },
    { name: 'Watchlist Live Alerts', free: false, pro: true },
    { name: 'Position Size & Risk Calculator', free: true, pro: true },
    { name: 'Customer Support', free: 'Community', pro: 'Priority Discord & Email' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="blue" size="sm" className="mb-3">
            TRANSPARENT SUBSCRIPTION PRICING
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Institutional Algorithmic Signals,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Retail Price
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
            Choose the plan that matches your trading strategy. Upgrade or cancel anytime with one click.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 bg-[#141923] border border-white/10 rounded-2xl gap-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#16C784]/20 text-[#16C784] border border-[#16C784]/30">
                Save 27%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 mb-20">
          {/* FREE PLAN */}
          <div className="p-8 rounded-3xl bg-[#141923] border border-white/[0.08] flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Free Tier</h3>
                <Badge variant="neutral">Starter</Badge>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Test the algorithmic signal pipeline and explore market momentum risk-free.
              </p>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-slate-400 text-sm">/ forever</span>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#16C784] flex-shrink-0" />
                  <span>2–3 algorithmic signals per week</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#16C784] flex-shrink-0" />
                  <span>Delayed by 1 hour</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#16C784] flex-shrink-0" />
                  <span>Basic market overview & Fear/Greed index</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#16C784] flex-shrink-0" />
                  <span>Signal history (last 7 days)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#16C784] flex-shrink-0" />
                  <span>Position size & risk calculator</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  <span className="line-through">Real-time instant signal alerts</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  <span className="line-through">Entry, TP1/TP2/TP3 & SL ladders</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/signup')}
                className="w-full"
              >
                {user ? 'Current Active Tier' : 'Get Started Free'}
              </Button>
            </div>
          </div>

          {/* PRO PLAN */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-b from-[#192233] to-[#141923] border-2 border-blue-500/40 flex flex-col justify-between shadow-2xl shadow-blue-500/10">
            {/* Pro Floating Tag */}
            <div className="absolute -top-3.5 right-8">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Recommended
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Pro Trader
                  <Badge variant="pro" size="xs">Unlimited</Badge>
                </h3>
              </div>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Full institutional algorithmic signal feed with instant execution and risk ladders.
              </p>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black text-white">
                  ${billingCycle === 'monthly' ? '9' : '79'}
                </span>
                <span className="text-slate-400 text-sm">
                  / {billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              <p className="text-[11px] text-[#16C784] font-semibold mb-8">
                {billingCycle === 'yearly' ? 'Billed $79/year (Save 27% vs monthly)' : 'Billed monthly. Cancel anytime.'}
              </p>

              <div className="space-y-3.5 text-xs text-slate-200">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#16C784] flex-shrink-0" />
                  <span className="font-semibold text-white">Real-time signals (Zero Delay)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#16C784] flex-shrink-0" />
                  <span>Unlimited algorithmic setups across all pairs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#16C784] flex-shrink-0" />
                  <span className="font-semibold text-white">Entry price, TP1, TP2, TP3 & ATR Stop-Loss</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#16C784] flex-shrink-0" />
                  <span>In-app notifications + instant Resend email alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#16C784] flex-shrink-0" />
                  <span>Full historical database & CSV trade export</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#16C784] flex-shrink-0" />
                  <span>Full performance stats & win-rate metrics</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#16C784] flex-shrink-0" />
                  <span>Custom coin watchlist live alerts</span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="flex items-center gap-3 text-purple-300 font-semibold">
                    <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Priority quantitative support channel</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleSelectPlan(billingCycle)}
                className="w-full text-base"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isPro ? 'You are currently on Pro' : `Upgrade to Pro (${billingCycle === 'monthly' ? '$9/mo' : '$79/yr'})`}
              </Button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Secured by Lemon Squeezy • Cancel anytime with 1 click
              </p>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-4xl mx-auto mb-20 bg-[#141923] rounded-3xl border border-white/[0.08] p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Detailed Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold uppercase text-slate-400">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4 text-center">Free Tier</th>
                  <th className="py-3 px-4 text-center text-blue-400">Pro Member</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {comparisonFeatures.map((f, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-medium text-slate-200">{f.name}</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">
                      {typeof f.free === 'boolean' ? (
                        f.free ? (
                          <Check className="w-4 h-4 text-[#16C784] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 mx-auto" />
                        )
                      ) : (
                        f.free
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-white">
                      {typeof f.pro === 'boolean' ? (
                        f.pro ? (
                          <Check className="w-4 h-4 text-[#16C784] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 mx-auto" />
                        )
                      ) : (
                        f.pro
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Simulated Checkout Modal */}
      <Modal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Lemon Squeezy Checkout"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
            <span className="font-semibold block mb-1">Payment Integration:</span>
            In production, this button launches the Lemon Squeezy hosted checkout with your configured store and variant ID. In this sandbox environment, click below to simulate instant activation of the Pro subscription.
          </div>

          <div className="p-4 rounded-xl bg-[#0E131C] border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Item</span>
              <span className="font-semibold text-white">Kamboh Plus Pro ({selectedPlanType})</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Amount</span>
              <span className="font-semibold text-[#16C784]">
                {selectedPlanType === 'monthly' ? '$9.00 / month' : '$79.00 / year'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Account</span>
              <span className="font-semibold text-white">{user?.email}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowCheckoutModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirmSimulatedCheckout}
              className="flex-1"
            >
              Confirm Subscription
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};
