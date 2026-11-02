import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Badge } from '../../components/ui/Badge';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-10">
          <Badge variant="blue" size="sm" className="mb-3">LEGAL AGREEMENT</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Terms of Service</h1>
          <p className="text-slate-400 text-xs mt-2">Effective date: October 2026</p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed bg-[#141923] p-8 rounded-3xl border border-white/[0.08]">
          <h3 className="text-base font-bold text-white">1. Acceptance of Terms</h3>
          <p>
            By accessing, browsing, or utilizing Kamboh Plus (the &quot;Service&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, you must immediately terminate use of the platform.
          </p>

          <h3 className="text-base font-bold text-white pt-2">2. Subscriptions & Billing</h3>
          <p>
            Pro subscriptions are billed on a recurring monthly or annual basis via our merchant of record, Lemon Squeezy. Subscriptions renew automatically unless cancelled prior to the renewal date via the customer billing portal. Refunds are subject to our 7-day initial satisfaction policy.
          </p>

          <h3 className="text-base font-bold text-white pt-2">3. Intellectual Property</h3>
          <p>
            All algorithmic logic, indicators, proprietary scoring formulas, and interface layouts remain the sole intellectual property of Kamboh Plus Technologies Inc. You may not scrape, redistribute, or resell signals to third parties without express written authorization.
          </p>

          <h3 className="text-base font-bold text-white pt-2">4. Limitation of Liability</h3>
          <p>
            Under no circumstances shall Kamboh Plus or its affiliates be liable for direct, indirect, incidental, punitive, or consequential damages resulting from trading actions, exchange downtime, network latency, or algorithmic execution delays.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
