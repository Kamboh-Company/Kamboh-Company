/**
 * Technical Indicators Implementation in Pure TypeScript
 * EMA 20/50/200, RSI(14), MACD(12,26,9), Bollinger Bands(20,2), ATR(14), ADX(14),
 * Volume Spike Detection, Swing Highs/Lows, and Algorithmic Signal Generator
 */

export interface Candle {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Exponential Moving Average (EMA)
 */
export function calculateEMA(prices: number[], period: number): number[] {
  if (prices.length < period) return [];
  const k = 2 / (period + 1);
  const emaArray: number[] = new Array(prices.length).fill(0);

  // Initialize with Simple Moving Average for the first period
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  emaArray[period - 1] = sum / period;

  // Compute EMA for remaining values
  for (let i = period; i < prices.length; i++) {
    emaArray[i] = prices[i] * k + emaArray[i - 1] * (1 - k);
  }

  return emaArray;
}

/**
 * Relative Strength Index (RSI) - Wilder's Smoothing
 */
export function calculateRSI(closes: number[], period = 14): number[] {
  if (closes.length <= period) return [];
  const rsi: number[] = new Array(closes.length).fill(50);

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  if (avgLoss === 0) {
    rsi[period] = 100;
  } else {
    const rs = avgGain / avgLoss;
    rsi[period] = 100 - (100 / (1 + rs));
  }

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    if (avgLoss === 0) {
      rsi[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      rsi[i] = 100 - (100 / (1 + rs));
    }
  }

  return rsi;
}

/**
 * Moving Average Convergence Divergence (MACD)
 */
export function calculateMACD(
  closes: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
) {
  const emaFast = calculateEMA(closes, fastPeriod);
  const emaSlow = calculateEMA(closes, slowPeriod);

  const macdLine: number[] = new Array(closes.length).fill(0);
  const validMacd: number[] = [];

  for (let i = 0; i < closes.length; i++) {
    if (i >= slowPeriod - 1) {
      macdLine[i] = emaFast[i] - emaSlow[i];
      validMacd.push(macdLine[i]);
    }
  }

  const signalLineValid = calculateEMA(validMacd, signalPeriod);
  const signalLine: number[] = new Array(closes.length).fill(0);
  const histogram: number[] = new Array(closes.length).fill(0);

  const offset = (slowPeriod - 1) + (signalPeriod - 1);
  let vIdx = signalPeriod - 1;

  for (let i = offset; i < closes.length; i++) {
    signalLine[i] = signalLineValid[vIdx] || 0;
    histogram[i] = macdLine[i] - signalLine[i];
    vIdx++;
  }

  return {
    macdLine,
    signalLine,
    histogram,
  };
}

/**
 * Bollinger Bands
 */
export function calculateBollingerBands(
  closes: number[],
  period = 20,
  stdDevMultiplier = 2
) {
  const upper: number[] = new Array(closes.length).fill(0);
  const middle: number[] = new Array(closes.length).fill(0);
  const lower: number[] = new Array(closes.length).fill(0);

  for (let i = period - 1; i < closes.length; i++) {
    const slice = closes.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
    const sd = Math.sqrt(variance);

    middle[i] = mean;
    upper[i] = mean + sd * stdDevMultiplier;
    lower[i] = mean - sd * stdDevMultiplier;
  }

  return { upper, middle, lower };
}

/**
 * Average True Range (ATR)
 */
export function calculateATR(candles: Candle[], period = 14): number[] {
  if (candles.length < 2) return [];
  const tr: number[] = [candles[0].high - candles[0].low];

  for (let i = 1; i < candles.length; i++) {
    const c = candles[i];
    const prevClose = candles[i - 1].close;
    const currentTR = Math.max(
      c.high - c.low,
      Math.abs(c.high - prevClose),
      Math.abs(c.low - prevClose)
    );
    tr.push(currentTR);
  }

  const atr: number[] = new Array(candles.length).fill(0);
  if (candles.length < period) return atr;

  let trSum = 0;
  for (let i = 0; i < period; i++) {
    trSum += tr[i];
  }
  atr[period - 1] = trSum / period;

  for (let i = period; i < candles.length; i++) {
    atr[i] = (atr[i - 1] * (period - 1) + tr[i]) / period;
  }

  return atr;
}

/**
 * Average Directional Index (ADX) - Trend Strength
 */
export function calculateADX(candles: Candle[], period = 14): number[] {
  if (candles.length < period * 2) return new Array(candles.length).fill(25);

  const plusDM: number[] = [0];
  const minusDM: number[] = [0];
  const tr: number[] = [candles[0].high - candles[0].low];

  for (let i = 1; i < candles.length; i++) {
    const upMove = candles[i].high - candles[i - 1].high;
    const downMove = candles[i - 1].low - candles[i].low;

    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);

    const prevClose = candles[i - 1].close;
    tr.push(
      Math.max(
        candles[i].high - candles[i].low,
        Math.abs(candles[i].high - prevClose),
        Math.abs(candles[i].low - prevClose)
      )
    );
  }

  // Smooth TR, +DM, -DM with Wilder's method
  const smoothTR = calculateEMA(tr, period);
  const smoothPlusDM = calculateEMA(plusDM, period);
  const smoothMinusDM = calculateEMA(minusDM, period);

  const dx: number[] = new Array(candles.length).fill(0);
  for (let i = 0; i < candles.length; i++) {
    if (smoothTR[i] > 0) {
      const plusDI = (smoothPlusDM[i] / smoothTR[i]) * 100;
      const minusDI = (smoothMinusDM[i] / smoothTR[i]) * 100;
      const diSum = plusDI + minusDI;
      dx[i] = diSum === 0 ? 0 : (Math.abs(plusDI - minusDI) / diSum) * 100;
    }
  }

  return calculateEMA(dx, period);
}

/**
 * Detect Swing Highs and Swing Lows (Support and Resistance)
 */
export function findSwingLevels(candles: Candle[], lookback = 30) {
  const recent = candles.slice(-lookback);
  let swingHigh = -Infinity;
  let swingLow = Infinity;

  for (const c of recent) {
    if (c.high > swingHigh) swingHigh = c.high;
    if (c.low < swingLow) swingLow = c.low;
  }

  return {
    resistance: swingHigh,
    support: swingLow,
  };
}

/**
 * Evaluates Candle Data and executes the Signal Engine Scoring
 */
export function evaluateSignalRules(
  coin: string,
  candles: Candle[],
  timeframe: '1h' | '4h' = '1h'
) {
  if (candles.length < 200) {
    return { shouldSignal: false, reason: 'Insufficient candle data (need >= 200 candles)' };
  }

  const closes = candles.map((c) => c.close);
  const volumes = candles.map((c) => c.volume);
  const n = candles.length - 1;
  const currentPrice = closes[n];

  // Calculate Indicators
  const ema20 = calculateEMA(closes, 20);
  const ema50 = calculateEMA(closes, 50);
  const ema200 = calculateEMA(closes, 200);
  const rsi = calculateRSI(closes, 14);
  const macd = calculateMACD(closes, 12, 26, 9);
  const bb = calculateBollingerBands(closes, 20, 2);
  const atr = calculateATR(candles, 14);
  const adx = calculateADX(candles, 14);

  const currentEMA20 = ema20[n];
  const currentEMA50 = ema50[n];
  const currentEMA200 = ema200[n];
  const currentRSI = rsi[n];
  const currentMACDLine = macd.macdLine[n];
  const currentSignalLine = macd.signalLine[n];
  const currentHist = macd.histogram[n];
  const prevHist = macd.histogram[n - 1] || 0;
  const currentATR = atr[n] || currentPrice * 0.02;
  const currentADX = adx[n] || 25;
  const currentBBUpper = bb.upper[n];
  const currentBBMiddle = bb.middle[n];
  const currentBBLower = bb.lower[n];

  // 20-candle average volume
  const avgVol20 =
    volumes.slice(-21, -1).reduce((sum, v) => sum + v, 0) / 20;
  const currentVol = volumes[n];
  const volumeMultiplier = avgVol20 > 0 ? currentVol / avgVol20 : 1.0;

  const { resistance, support } = findSwingLevels(candles, 40);

  // Filter 1: Avoid Choppy / Sideways Market (Low ADX < 20)
  if (currentADX < 19) {
    return {
      shouldSignal: false,
      reason: `Market is in choppy/sideways consolidation (ADX ${currentADX.toFixed(1)} < 20)`,
    };
  }

  // Scoring system
  let longScore = 0;
  let shortScore = 0;
  const reasonsLong: string[] = [];
  const reasonsShort: string[] = [];

  // EMA Structure Filter:
  // LONG requirement: price must be ABOVE EMA50 and EMA200
  // SHORT requirement: price must be BELOW EMA50 and EMA200
  const isBullishTrend = currentPrice > currentEMA50 && currentPrice > currentEMA200;
  const isBearishTrend = currentPrice < currentEMA50 && currentPrice < currentEMA200;

  if (isBullishTrend) {
    longScore += 25;
    reasonsLong.push('Price trading above EMA50 and EMA200 (bullish macro structure)');
    if (currentEMA20 > currentEMA50) {
      longScore += 10;
      reasonsLong.push('EMA20 > EMA50 trend alignment');
    }
  }

  if (isBearishTrend) {
    shortScore += 25;
    reasonsShort.push('Price trading below EMA50 and EMA200 (bearish macro structure)');
    if (currentEMA20 < currentEMA50) {
      shortScore += 10;
      reasonsShort.push('EMA20 < EMA50 trend alignment');
    }
  }

  // RSI Analysis
  if (currentRSI >= 40 && currentRSI <= 62) {
    // Healthy momentum zone for continuation
    longScore += 15;
    reasonsLong.push(`RSI ${currentRSI.toFixed(1)} holding bullish momentum zone`);
  } else if (currentRSI < 35 && rsi[n] > rsi[n - 1]) {
    // Bullish bounce from oversold
    longScore += 20;
    reasonsLong.push(`RSI recovered upward from oversold (${currentRSI.toFixed(1)})`);
  }

  if (currentRSI >= 38 && currentRSI <= 60) {
    shortScore += 15;
    reasonsShort.push(`RSI ${currentRSI.toFixed(1)} bearish expansion zone`);
  } else if (currentRSI > 65 && rsi[n] < rsi[n - 1]) {
    shortScore += 20;
    reasonsShort.push(`RSI rejected downward from overbought (${currentRSI.toFixed(1)})`);
  }

  // MACD Crossover / Expansion
  if (currentMACDLine > currentSignalLine) {
    longScore += 15;
    if (prevHist <= 0 && currentHist > 0) {
      longScore += 15;
      reasonsLong.push('Fresh MACD bullish crossover');
    } else {
      reasonsLong.push('MACD histogram expanding positive');
    }
  } else if (currentMACDLine < currentSignalLine) {
    shortScore += 15;
    if (prevHist >= 0 && currentHist < 0) {
      shortScore += 15;
      reasonsShort.push('Fresh MACD bearish crossover');
    } else {
      reasonsShort.push('MACD histogram expanding negative');
    }
  }

  // Volume Confirmation
  if (volumeMultiplier >= 1.4) {
    const volText = `Volume surge of ${volumeMultiplier.toFixed(1)}x over 20-period average`;
    if (currentPrice > candles[n].open) {
      longScore += 15;
      reasonsLong.push(volText);
    } else {
      shortScore += 15;
      reasonsShort.push(volText);
    }
  }

  // Bollinger Band squeeze & breakout
  const bbWidth = (currentBBUpper - currentBBLower) / currentBBMiddle;
  if (currentPrice > currentBBMiddle && currentPrice < currentBBUpper) {
    longScore += 10;
  }
  if (currentPrice < currentBBMiddle && currentPrice > currentBBLower) {
    shortScore += 10;
  }

  // Support / Resistance proximity
  const distToSupport = ((currentPrice - support) / currentPrice) * 100;
  const distToResistance = ((resistance - currentPrice) / currentPrice) * 100;

  if (distToSupport < 2.5 && distToSupport > 0) {
    longScore += 10;
    reasonsLong.push(`Price bouncing off swing support at $${support.toLocaleString()}`);
  }
  if (distToResistance < 2.5 && distToResistance > 0) {
    shortScore += 10;
    reasonsShort.push(`Price rejecting swing resistance at $${resistance.toLocaleString()}`);
  }

  // Determine Direction and Validity
  const threshold = 65;
  let direction: 'LONG' | 'SHORT' | null = null;
  let finalScore = 0;
  let selectedReasons: string[] = [];

  if (isBullishTrend && longScore >= threshold && longScore > shortScore) {
    direction = 'LONG';
    finalScore = Math.min(96, Math.max(68, longScore));
    selectedReasons = reasonsLong;
  } else if (isBearishTrend && shortScore >= threshold && shortScore > longScore) {
    direction = 'SHORT';
    finalScore = Math.min(96, Math.max(68, shortScore));
    selectedReasons = reasonsShort;
  }

  if (!direction) {
    return {
      shouldSignal: false,
      reason: `Scores below trigger threshold (Long: ${longScore}, Short: ${shortScore}, Trend: ${
        isBullishTrend ? 'Bullish' : isBearishTrend ? 'Bearish' : 'Neutral'
      })`,
    };
  }

  // Price calculations
  const atrRisk = currentATR * 1.5;
  const entryPrice = currentPrice;
  let stopLossPrice: number;
  let tp1Price: number;
  let tp2Price: number;
  let tp3Price: number;

  const atrPercent = (currentATR / entryPrice) * 100;
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
  let leverageSuggestion = '3x - 5x';

  if (atrPercent < 1.5) {
    riskLevel = 'Low';
    leverageSuggestion = '5x - 8x';
  } else if (atrPercent > 3.5) {
    riskLevel = 'High';
    leverageSuggestion = '2x - 3x';
  }

  if (direction === 'LONG') {
    stopLossPrice = entryPrice - atrRisk;
    const rAmount = entryPrice - stopLossPrice;
    tp1Price = entryPrice + rAmount * 1.0; // 1R
    tp2Price = entryPrice + rAmount * 2.0; // 2R
    tp3Price = entryPrice + rAmount * 3.0; // 3R
  } else {
    stopLossPrice = entryPrice + atrRisk;
    const rAmount = stopLossPrice - entryPrice;
    tp1Price = entryPrice - rAmount * 1.0; // 1R
    tp2Price = entryPrice - rAmount * 2.0; // 2R
    tp3Price = entryPrice - rAmount * 3.0; // 3R
  }

  const isPremium = finalScore >= 75;

  const reasoningText = selectedReasons.slice(0, 4).join(', ') + '.';

  return {
    shouldSignal: true,
    signalData: {
      coin,
      pair: `${coin}/USDT`,
      direction,
      timeframe,
      entry_price: Number(entryPrice.toFixed(4)),
      tp1_price: Number(tp1Price.toFixed(4)),
      tp2_price: Number(tp2Price.toFixed(4)),
      tp3_price: Number(tp3Price.toFixed(4)),
      stop_loss_price: Number(stopLossPrice.toFixed(4)),
      current_price: Number(currentPrice.toFixed(4)),
      leverage_suggestion: leverageSuggestion,
      risk_level: riskLevel,
      confidence_score: Math.round(finalScore),
      reasoning: reasoningText,
      indicators_snapshot: {
        rsi: Number(currentRSI.toFixed(1)),
        macd: {
          macdLine: Number(currentMACDLine.toFixed(2)),
          signalLine: Number(currentSignalLine.toFixed(2)),
          histogram: Number(currentHist.toFixed(2)),
        },
        ema: {
          ema20: Number(currentEMA20.toFixed(2)),
          ema50: Number(currentEMA50.toFixed(2)),
          ema200: Number(currentEMA200.toFixed(2)),
        },
        atr: Number(currentATR.toFixed(2)),
        adx: Number(currentADX.toFixed(1)),
        bb: {
          upper: Number(currentBBUpper.toFixed(2)),
          middle: Number(currentBBMiddle.toFixed(2)),
          lower: Number(currentBBLower.toFixed(2)),
        },
        volumeVsAvg: Number(volumeMultiplier.toFixed(2)),
        supportLevel: Number(support.toFixed(2)),
        resistanceLevel: Number(resistance.toFixed(2)),
      },
      status: 'Active' as const,
      is_premium: isPremium,
      source: 'algorithmic' as const,
    },
  };
}
