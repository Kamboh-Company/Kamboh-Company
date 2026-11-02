import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res?.error) {
      setErrorMessage(res.error);
      toastError('Login Failed', res.error);
    } else {
      success('Welcome Back!', 'Logged in to Kamboh Plus.');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight">
              Kamboh<span className="text-blue-400">Plus</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your algorithmic crypto signals dashboard
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-2xl">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {errorMessage}
            </div>
          )}

          {/* Google OAuth Button */}
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
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#141923] px-3 text-[11px] text-slate-500 uppercase tracking-wider absolute">
              or email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Quick preset logins for fast testing */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 text-center">
              Quick Test Sign-Ins
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@signalpulse.io');
                  setPassword('admin123');
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-center"
              >
                Fill Admin Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('trader@signalpulse.io');
                  setPassword('trader123');
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-center"
              >
                Fill Trader Account
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don&apos;t have an account yet?{' '}
          <Link to="/signup" className="text-blue-400 font-semibold hover:underline">
            Create Free Account
          </Link>
        </p>
      </div>
    </div>
  );
};
