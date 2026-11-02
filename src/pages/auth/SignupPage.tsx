import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Activity, Mail, Lock, User, Eye, EyeOff, ArrowRight, Gift, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { referralStorage } from '../../lib/supabase';

export const SignupPage: React.FC = () => {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success, error: toastError } = useToast();

  const refParam = searchParams.get('ref') || '';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(refParam);
  const [showReferralInput, setShowReferralInput] = useState(Boolean(refParam));
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Track click on referral link
  useEffect(() => {
    if (refParam) {
      referralStorage.incrementClicks(refParam);
    }
  }, [refParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!agreed) {
      setErrorMessage('You must accept the Terms and Risk Disclaimer.');
      return;
    }

    setLoading(true);
    const res = await signup(email, password, fullName);
    setLoading(false);

    if (res?.error) {
      setErrorMessage(res.error);
      toastError('Signup Failed', res.error);
    } else {
      if (referralCode.trim()) {
        referralStorage.registerReferral(referralCode.trim(), {
          id: 'user-' + Date.now(),
          email,
          name: fullName,
        });
      }
      success('Account Created', 'Welcome to Kamboh Plus! Initialized on Free Tier.');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight">
              Kamboh<span className="text-blue-400">Plus</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create your account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Free forever tier. No credit card required.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-2xl">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {errorMessage}
            </div>
          )}

          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#0E131C] hover:bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 transition-all mb-6"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.54 0 2.94.55 4.04 1.45l3.03-3.03C17.24 1.7 14.81 1 12 1 7.42 1 3.51 3.61 1.63 7.39l3.66 2.84C6.16 7.15 8.84 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.28c0-.82-.07-1.6-.2-2.28H12v4.51h6.47c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.86c2.16-1.99 3.71-4.92 3.71-8.67z"
              />
              <path
                fill="#FBBC05"
                d="M5.29 14.77c-.23-.68-.36-1.41-.36-2.17s.13-1.49.36-2.17L1.63 7.59C.59 9.67 0 12 0 14.4s.59 4.73 1.63 6.81l3.66-2.84z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.69-2.86c-1.08.72-2.45 1.16-4.24 1.16-3.16 0-5.84-2.15-6.8-5.04L1.63 16.19C3.51 20.39 7.42 23 12 23z"
              />
            </svg>
            Sign up with Google
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#141923] px-3 text-[11px] text-slate-500 uppercase tracking-wider absolute">
              or credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Satoshi Nakamoto"
              leftIcon={<User className="w-4 h-4" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="trader@domain.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0E131C] text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-10 py-2.5 text-sm border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Referral / Partner Invitation Banner */}
            {refParam ? (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                <Gift className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    Partner Invitation Applied
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] text-emerald-300 font-mono">
                      {refParam}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    You qualify for VIP onboarding and 10% discount on first Pro upgrade.
                  </p>
                </div>
              </div>
            ) : showReferralInput ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-blue-400" />
                  Referral / Partner Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. KAMBOH-VIP"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#0E131C] text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none font-mono tracking-wider"
                />
              </div>
            ) : (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowReferralInput(true)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Have an invite or referral code?
                </button>
              </div>
            )}

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-[#0E131C] text-blue-600 focus:ring-0"
              />
              <label htmlFor="terms" className="text-xs text-slate-400 leading-snug">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-400 underline">Terms of Service</Link>,{' '}
                <Link to="/privacy" className="text-blue-400 underline">Privacy Policy</Link>, and acknowledge the{' '}
                <Link to="/disclaimer" className="text-amber-400 underline">Risk Disclaimer</Link>.
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
