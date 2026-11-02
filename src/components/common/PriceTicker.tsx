import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchLivePrices } from '../../lib/marketData';
import { CoinPriceData } from '../../types';
import { formatPrice } from '../../lib/utils';

export const PriceTicker: React.FC = () => {
  const [prices, setPrices] = useState<CoinPriceData[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const data = await fetchLivePrices();
      if (mounted && data.length > 0) {
        setPrices(data);
      }
    }
    load();
    const interval = setInterval(load, 30000); // refresh every 30s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (prices.length === 0) return null;

  return (
    <div className="w-full bg-[#080B0F] border-b border-white/[0.06] overflow-hidden py-2 select-none">
      <div className="flex items-center space-x-8 animate-marquee whitespace-nowrap px-4 text-xs">
        {/* Double list for smooth endless ticker marquee */}
        {[...prices, ...prices].map((coin, idx) => {
          const isUp = coin.change24h >= 0;
          return (
            <div key={`${coin.symbol}-${idx}`} className="inline-flex items-center gap-2">
              <span className="font-bold text-slate-300">{coin.symbol}</span>
              <span className="font-mono text-white font-medium">{formatPrice(coin.price)}</span>
              <span
                className={`inline-flex items-center text-[11px] font-semibold ${
                  isUp ? 'text-[#16C784]' : 'text-[#EA3943]'
                }`}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                {isUp ? '+' : ''}
                {coin.change24h.toFixed(2)}%
              </span>
              <span className="text-white/10 ml-2">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
