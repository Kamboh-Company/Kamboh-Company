import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { Button } from '../ui/Button';

export const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('signalpulse_cookie_consent');
    if (!accepted) {
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('signalpulse_cookie_consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('signalpulse_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 p-4 bg-[#141923] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs">
          <h4 className="font-semibold text-white mb-1">Cookie & Privacy Preferences</h4>
          <p className="text-slate-300 leading-relaxed mb-3">
            We use essential cookies to maintain secure sessions and performance analytics. By continuing, you agree to our{' '}
            <Link to="/privacy" className="text-blue-400 underline">Privacy Policy</Link>.
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="primary" onClick={handleAccept}>
              Accept All
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDecline}>
              Essential Only
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
