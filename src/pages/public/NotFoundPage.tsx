import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/ui/Button';
import { Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-black text-white tracking-tight font-mono mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-200 mb-3">Signal Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm mb-8 leading-relaxed">
          The requested route does not exist or has expired from our algorithmic tracking directory.
        </p>
        <div className="flex gap-3">
          <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
          <Button variant="outline" size="md" onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
