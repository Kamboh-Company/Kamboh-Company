import React, { useEffect, useRef } from 'react';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  ColorType,
  Time,
} from 'lightweight-charts';
import { Candle } from '../../lib/indicators';

export interface PriceLineConfig {
  price: number;
  color: string;
  title: string;
  lineStyle?: number; // 0: Solid, 1: Dotted, 2: Dashed, 3: LargeDashed
}

export interface TradingViewChartProps {
  candles: Candle[];
  priceLines?: PriceLineConfig[];
  height?: number;
  className?: string;
  theme?: 'dark' | 'light';
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  candles,
  priceLines = [],
  height = 380,
  className = '',
  theme = 'dark',
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<any> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Dispose existing chart if any
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const isDark = theme === 'dark';
    const backgroundColor = isDark ? '#141923' : '#FFFFFF';
    const textColor = isDark ? '#94A3B8' : '#334155';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.06)';

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      crosshair: {
        vertLine: {
          color: 'rgba(59, 130, 246, 0.4)',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: 'rgba(59, 130, 246, 0.4)',
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Candlestick series (lightweight-charts v5 addSeries)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#16C784',
      downColor: '#EA3943',
      borderUpColor: '#16C784',
      borderDownColor: '#EA3943',
      wickUpColor: '#16C784',
      wickDownColor: '#EA3943',
    });

    // Volume series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.82,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // Resize listener
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [height, theme]);

  // Update Data and Price Lines
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || candles.length === 0) return;

    // Format candle data for lightweight-charts
    const sortedCandles = [...candles].sort((a, b) => a.time - b.time);

    const formattedCandles = sortedCandles.map((c) => ({
      time: c.time as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const formattedVolume = sortedCandles.map((c) => ({
      time: c.time as Time,
      value: c.volume,
      color: c.close >= c.open ? 'rgba(22, 199, 132, 0.3)' : 'rgba(234, 57, 67, 0.3)',
    }));

    candleSeriesRef.current.setData(formattedCandles);
    volumeSeriesRef.current.setData(formattedVolume);

    // Apply Price Lines
    priceLines.forEach((pl) => {
      if (pl.price > 0 && candleSeriesRef.current) {
        candleSeriesRef.current.createPriceLine({
          price: pl.price,
          color: pl.color,
          lineWidth: 2,
          lineStyle: pl.lineStyle ?? 2,
          axisLabelVisible: true,
          title: pl.title,
        });
      }
    });

    chartRef.current?.timeScale().fitContent();
  }, [candles, priceLines]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden ${className}`}>
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};
