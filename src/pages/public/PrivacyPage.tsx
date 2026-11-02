import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Badge } from '../../components/ui/Badge';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-10">
          <Badge variant="blue" size="sm" className="mb-3">USER PRIVACY</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Privacy Policy</h1>
          <p className="text-slate-400 text-xs mt-2">Effective date: October 2026</p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed bg-[#141923] p-8 rounded-3xl border border-white/[0.08]">
          <h3 className="text-base font-bold text-white">1. Information We Collect</h3>
          <p>
            We collect account email addresses, profile preferences, and subscription status to deliver real-time alerts and manage platform access. We do not store sensitive payment card numbers; all credit card processing is handled by Lemon Squeezy (PCI-DSS compliant).
          </p>

          <h3 className="text-base font-bold text-white pt-2">2. How Data is Used</h3>
          <p>
            Your information is used solely to authenticate your session, deliver signal notifications (via Resend or in-app websockets), and maintain customer support correspondence. We never sell user data to advertising brokers.
          </p>

          <h3 className="text-base font-bold text-white pt-2">3. Data Security</h3>
          <p>
            We utilize encrypted TLS/HTTPS protocols and Row Level Security (RLS) within our PostgreSQL database to prevent unauthorized access.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
