import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Radio,
  Flame,
  ShieldCheck,
  Compass,
  ArrowRight,
  RefreshCw,
  Gift,
  PlayCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { signalStorage, calculateDatabasePerformance } from '../../lib/supabase';
import {
  fetchLivePrices,
  fetchFearAndGreed,
  fetchTrendingCoins,
  fetchOHLCVCandles,
  SUPPORTED_COINS,
} from '../../lib/marketData';
import { Signal, CoinPriceData, FearGreedData, PerformanceStats } from '../../types';
import { Candle } from '../../lib/indicators';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SignalCard } from '../../components/signals/SignalCard';
import { TradingViewChart } from '../../components/charts/TradingViewChart';
import { formatPrice } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

export const OverviewPage: React.FC = () => {
  const { plan } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [signals, setSignals] = useState<Signal[]>([]);
  const [performance, setPerformance] = useState<PerformanceStats | null>(null);
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [trendingCoins, setTrendingCoins] = useState<any[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '4h'>('1h');
  const [chartCandles, setChartCandles] = useState<Candle[]>([]);
  const [chartExchange, setChartExchange] = useState<string>('Binance');
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  useEffect(() => {
    const list = signalStorage.getSignals();
    setSignals(list);
    setPerformance(calculateDatabasePerformance(list));

    async function loadAux() {
      const fg = await fetchFearAndGreed();
      setFearGreed(fg);
      const trending = await fetchTrendingCoins();
      setTrendingCoins(trending);
    }
    loadAux();
  }, []);

  // Fetch candles when selected coin or timeframe changes
  useEffect(() => {
    let active = true;
    async function loadCandles() {
      setIsLoadingChart(true);
      const { candles, exchange } = await fetchOHLCVCandles(selectedCoin, selectedTimeframe, 150);
      if (active) {
        setChartCandles(candles);
        setChartExchange(exchange);
        setIsLoadingChart(false);
      }
    }
    loadCandles();
    return () => {
      active = false;
    };
  }, [selectedCoin, selectedTimeframe]);

  // Find if there is an active signal for this coin to overlay price lines
  const activeSignalForCoin = signals.find(
    (s) => s.coin === selectedCoin && s.status === 'Active'
  );

  const priceLines = activeSignalForCoin && plan === 'pro'
    ? [
        { price: activeSignalForCoin.entry_price, color: '#3B82F6', title: 'ENTRY' },
        { price: activeSignalForCoin.tp1_price, color: '#16C784', title: 'TP 1' },
        { price: activeSignalForCoin.tp2_price, color: '#16C784', title: 'TP 2' },
        { price: activeSignalForCoin.stop_loss_price, color: '#EA3943', title: 'STOP LOSS' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#141923] via-[#161D2B] to-[#141923] border border-white/[0.08] shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Live Quant Feed
            </span>
            <span className="w-2 h-2 rounded-full bg-[#16C784] animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Market Overview & Intel</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time algorithmic scanner scanning {SUPPORTED_COINS.length} crypto pairs across Binance, Bybit, and OKX
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/guide')}
            className="text-blue-300 hover:text-white hover:bg-blue-500/10 text-xs"
            leftIcon={<PlayCircle className="w-4 h-4 text-blue-400" />}
          >
            Video Guide
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/dashboard/referrals')}
            className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 text-xs"
            leftIcon={<Gift className="w-3.5 h-3.5 text-emerald-400" />}
          >
            Refer & Earn (30%)
          </Button>

          {plan === 'free' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/pricing')}
            >
              Upgrade to Pro ($9/mo)
            </Button>
          ) : (
            <Badge variant="pro" size="md">
              PRO TRADER ACTIVE
            </Badge>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Signals */}
        <Card padding="sm" className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Active Signals</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-white font-mono">
              {signals.filter((s) => s.status === 'Active').length}
            </div>
            <span className="text-[11px] text-[#16C784] flex items-center gap-1 mt-0.5">
              Live algorithmic execution
            </span>
          </div>
        </Card>

        {/* Win Rate */}
        <Card padding="sm" className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Win Rate (Audited)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-[#16C784]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-[#16C784] font-mono">
              {performance?.hasEnoughData ? `${performance.winRate}%` : 'Pending'}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {performance?.hasEnoughData ? 'Based on target hits' : 'Min 30 closed required'}
            </span>
          </div>
        </Card>

        {/* Average R */}
        <Card padding="sm" className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Average R-Multiple</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-purple-300 font-mono">
              {performance?.hasEnoughData ? `+${performance.avgR}R` : 'Pending'}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              ATR risk-adjusted return
            </span>
          </div>
        </Card>

        {/* Fear & Greed */}
        <Card padding="sm" className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Fear & Greed Index</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-amber-400 font-mono">
              {fearGreed ? fearGreed.value : 68}
            </div>
            <span className="text-[11px] text-slate-300 capitalize mt-0.5 block font-semibold">
              {fearGreed ? fearGreed.value_classification : 'Greed'}
            </span>
          </div>
        </Card>
      </div>

      {/* Main Chart + Market Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive TradingView Lightweight Chart */}
        <div className="lg:col-span-2 bg-[#141923] rounded-3xl border border-white/[0.08] p-5 shadow-xl flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            {/* Coin selector */}
            <div className="flex items-center gap-2">
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="bg-[#0E131C] text-white font-bold text-sm rounded-xl px-3 py-1.5 border border-white/10 outline-none cursor-pointer"
              >
                {SUPPORTED_COINS.map((c) => (
                  <option key={c} value={c} className="bg-[#141923] text-white">
                    {c}/USDT
                  </option>
                ))}
              </select>

              {/* Timeframe toggle */}
              <div className="flex bg-[#0E131C] rounded-xl p-1 border border-white/10 text-xs">
                <button
                  onClick={() => setSelectedTimeframe('1h')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    selectedTimeframe === '1h' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1H
                </button>
                <button
                  onClick={() => setSelectedTimeframe('4h')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    selectedTimeframe === '4h' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  4H
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10">
                Feed: {chartExchange}
              </span>
              {activeSignalForCoin && (
                <Badge
                  variant={activeSignalForCoin.direction === 'LONG' ? 'emerald' : 'red'}
                  size="xs"
                >
                  Active {activeSignalForCoin.direction} Signal
                </Badge>
              )}
            </div>
          </div>

          {/* Chart Wrapper */}
          <div className="w-full relative min-h-[350px]">
            {isLoadingChart ? (
              <div className="h-[350px] flex items-center justify-center text-slate-500 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                Loading OHLCV candles...
              </div>
            ) : (
              <TradingViewChart
                candles={chartCandles}
                priceLines={priceLines}
                height={350}
                theme={theme}
              />
            )}
          </div>
        </div>

        {/* Trending Coins & Market Intel */}
        <div className="bg-[#141923] rounded-3xl border border-white/[0.08] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Trending Cryptos</h3>
              </div>
              <span className="text-[11px] text-slate-400">CoinGecko Intel</span>
            </div>

            <div className="space-y-3">
              {trendingCoins.map((coin, idx) => (
                <div
                  key={coin.symbol}
                  onClick={() => {
                    if (SUPPORTED_COINS.includes(coin.symbol)) {
                      setSelectedCoin(coin.symbol);
                    }
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0E131C] border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-slate-500 w-4">#{idx + 1}</span>
                    <div>
                      <span className="text-xs font-bold text-white">{coin.symbol}</span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[100px]">
                        {coin.name}
                      </span>
                    </div>
                  </div>
                  <Badge variant="blue" size="xs">
                    Rank #{coin.rank || 'Top'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 block mb-1">Algorithmic Rule:</span>
            Signals only fire when trend direction conforms with 50-EMA & 200-EMA macro structure.
          </div>
        </div>
      </div>

      {/* Latest Signals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Latest Algorithmic Signals</h2>
            <p className="text-xs text-slate-400">Real-time signals generated by the 15-minute engine scanner</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/signals')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View Feed
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {signals.slice(0, 3).map((sig) => (
            <SignalCard
              key={sig.id}
              signal={sig}
              userPlan={plan}
              onUpgradeClick={() => navigate('/pricing')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
