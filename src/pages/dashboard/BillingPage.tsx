import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Sparkles,
  ExternalLink,
  Shield,
  CheckCircle2,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { openCustomerPortal } from '../../lib/lemonsqueezy';
import { useToast } from '../../components/ui/Toast';

export const BillingPage: React.FC = () => {
  const { plan, isPro, upgradeToPro, downgradeToFree } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();

  const handlePortalClick = () => {
    openCustomerPortal();
  };

  const sampleInvoices = [
    { id: 'INV-88912', date: 'Oct 01, 2026', amount: '$9.00', status: 'Paid', item: 'Pro Monthly Plan' },
    { id: 'INV-82194', date: 'Sep 01, 2026', amount: '$9.00', status: 'Paid', item: 'Pro Monthly Plan' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Lemon Squeezy Subscriptions
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Billing & Membership</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your subscription tier, billing portal, payment receipts, and invoices
        </p>
      </div>

      {/* Plan Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#141923] via-[#171F2E] to-[#141923] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold text-white">Current Active Tier</h2>
            {isPro ? (
              <Badge variant="pro" size="sm">PRO MEMBER</Badge>
            ) : (
              <Badge variant="neutral" size="sm">FREE TIER</Badge>
            )}
          </div>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            {isPro
              ? 'You have unrestricted, real-time access to all algorithmic signals, multi-exchange data, and instant notifications.'
              : 'You are on the Free tier (2-3 delayed signals per week). Upgrade anytime to receive instant real-time alerts.'}
          </p>
          {isPro && (
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 font-mono">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Next renewal date: November 01, 2026 via Lemon Squeezy</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          {isPro ? (
            <>
              <Button
                variant="outline"
                size="md"
                onClick={handlePortalClick}
                rightIcon={<ExternalLink className="w-4 h-4" />}
              >
                Manage Subscription
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  downgradeToFree();
                  success('Downgraded', 'Account switched to Free tier.');
                }}
                className="text-xs text-slate-400 hover:text-red-400"
              >
                Switch to Free
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/pricing')}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Upgrade to Pro ($9/mo)
            </Button>
          )}
        </div>
      </div>

      {/* Payment Security & Lemon Squeezy info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
          <div className="flex items-center gap-2.5 mb-3">
            <Shield className="w-5 h-5 text-[#16C784]" />
            <h3 className="text-sm font-bold text-white">Lemon Squeezy Merchant of Record</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Payment transactions, tax remittances, and recurring billings are securely fulfilled by Lemon Squeezy. Your credit card details never touch Kamboh Plus servers.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-[#16C784]" />
            <span>Encrypted PCI-DSS Level 1 Gateway</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
          <div className="flex items-center gap-2.5 mb-3">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Cancellation Policy</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            You can cancel your subscription at any moment without penalty or phone calls. Once cancelled, your Pro entitlements remain valid until the conclusion of your current paid billing period.
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
          <FileText className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Billing History & Invoices</h3>
        </div>

        {isPro ? (
          <div className="divide-y divide-white/5 text-xs">
            {sampleInvoices.map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-white">{inv.id}</span>
                  <span className="text-slate-400 ml-2">{inv.item}</span>
                  <span className="text-slate-500 text-[11px] block">{inv.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-white">{inv.amount}</span>
                  <Badge variant="emerald" size="xs">{inv.status}</Badge>
                  <button
                    onClick={handlePortalClick}
                    className="text-blue-400 hover:text-blue-300 p-1"
                    title="View Receipt"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs">
            No paid invoices on record. Upgrade to Pro to view receipts.
          </div>
        )}
      </div>
    </div>
  );
};
