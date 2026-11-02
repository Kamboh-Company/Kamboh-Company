import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Plus, Trash2, TrendingUp, TrendingDown, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { watchlistStorage, signalStorage } from '../../lib/supabase';
import { fetchLivePrices, SUPPORTED_COINS } from '../../lib/marketData';
import { WatchlistItem, CoinPriceData, Signal } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatPrice } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export const WatchlistPage: React.FC = () => {
  const { user, plan } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [prices, setPrices] = useState<CoinPriceData[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selectedCoinToAdd, setSelectedCoinToAdd] = useState('SOL');

  useEffect(() => {
    if (!user) return;
    setWatchlist(watchlistStorage.getWatchlist(user.id));
    setSignals(signalStorage.getSignals());

    async function load() {
      const p = await fetchLivePrices();
      setPrices(p);
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleAdd = () => {
    if (!user) return;
    const added = watchlistStorage.toggleWatchlist(user.id, selectedCoinToAdd);
    setWatchlist(watchlistStorage.getWatchlist(user.id));
    if (added) {
      success('Added to Watchlist', `${selectedCoinToAdd}/USDT added.`);
    } else {
      toastError('Already in Watchlist', `${selectedCoinToAdd} is already monitored.`);
    }
  };

  const handleRemove = (coin: string) => {
    if (!user) return;
    watchlistStorage.toggleWatchlist(user.id, coin);
    setWatchlist(watchlistStorage.getWatchlist(user.id));
    success('Removed', `${coin} removed from watchlist.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Personal Portfolio Radar
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Market Watchlist</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor selected coins for live price action and automated algorithmic trigger alerts
          </p>
        </div>

        {/* Add coin dropdown & button */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCoinToAdd}
            onChange={(e) => setSelectedCoinToAdd(e.target.value)}
            className="bg-[#141923] text-xs text-white rounded-xl px-3 py-2 border border-white/10 outline-none"
          >
            {SUPPORTED_COINS.map((c) => (
              <option key={c} value={c}>{c}/USDT</option>
            ))}
          </select>
          <Button
            size="sm"
            variant="primary"
            onClick={handleAdd}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Coin
          </Button>
        </div>
      </div>

      {/* Watchlist Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {watchlist.map((item) => {
          const priceObj = prices.find((p) => p.symbol === item.coin);
          const price = priceObj?.price || 0;
          const change = priceObj?.change24h || 0;
          const isUp = change >= 0;

          // Check if there is an active signal
          const activeSignal = signals.find(
            (s) => s.coin === item.coin && s.status === 'Active'
          );

          return (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-[#141923] border border-white/[0.08] hover:border-white/20 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B2232] border border-white/10 flex items-center justify-center font-bold text-white text-sm">
                      {item.coin}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{item.pair}</h3>
                      <span className="text-[11px] text-slate-400">
                        {priceObj?.name || item.coin}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.coin)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline justify-between p-3 rounded-2xl bg-[#0E131C] border border-white/5 mb-4">
                  <div className="text-lg font-extrabold text-white font-mono">
                    {formatPrice(price)}
                  </div>
                  <div
                    className={`flex items-center text-xs font-bold font-mono ${
                      isUp ? 'text-[#16C784]' : 'text-[#EA3943]'
                    }`}
                  >
                    {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                    {isUp ? '+' : ''}{change.toFixed(2)}%
                  </div>
                </div>

                {/* Signal indicator */}
                {activeSignal ? (
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
                      <span className="text-xs font-semibold text-white">
                        Active {activeSignal.direction} Signal
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate(`/dashboard/signals/${activeSignal.id}`)}
                    >
                      Inspect
                    </Button>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 text-center py-2">
                    Engine scanning for setup confluence...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
