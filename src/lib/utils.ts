/**
 * Utility functions for formatting, clipboard, and file downloads
 */

export function formatPrice(price: number): string {
  if (price === 0) return '---';
  if (price < 1) {
    return '$' + price.toFixed(4);
  }
  if (price < 100) {
    return '$' + price.toFixed(2);
  }
  return '$' + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatPercentage(val: number, withSign = true): string {
  const sign = withSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}%`;
}

export function formatRMultiple(r: number | null | undefined): string {
  if (r === null || r === undefined) return '--';
  const sign = r > 0 ? '+' : '';
  return `${sign}${r.toFixed(2)}R`;
}

export function formatTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatTimeAgo(isoString: string): string {
  try {
    const ms = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(ms / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return isoString;
  }
}

export async function copyTradeDetails(signal: {
  pair: string;
  direction: string;
  entry_price: number;
  tp1_price: number;
  tp2_price: number;
  tp3_price: number;
  stop_loss_price: number;
  leverage_suggestion: string;
}): Promise<boolean> {
  const text = `🚀 Kamboh Plus Trade Alert
Pair: ${signal.pair}
Direction: ${signal.direction}
Entry: ${formatPrice(signal.entry_price)}
Take Profit 1: ${formatPrice(signal.tp1_price)}
Take Profit 2: ${formatPrice(signal.tp2_price)}
Take Profit 3: ${formatPrice(signal.tp3_price)}
Stop Loss: ${formatPrice(signal.stop_loss_price)}
Suggested Leverage: ${signal.leverage_suggestion}
Source: Algorithmic Signal Engine`;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback
  }
  return false;
}

export function exportSignalsToCSV(signals: any[], filename = 'signalpulse_signals.csv') {
  const headers = [
    'ID',
    'Coin',
    'Pair',
    'Direction',
    'Timeframe',
    'Entry Price',
    'TP1',
    'TP2',
    'TP3',
    'Stop Loss',
    'Leverage',
    'Confidence Score',
    'Risk Level',
    'Status',
    'Result (R)',
    'Exit Price',
    'Date Created',
    'Date Closed',
  ];

  const rows = signals.map((s) => [
    s.id,
    s.coin,
    s.pair,
    s.direction,
    s.timeframe,
    s.entry_price,
    s.tp1_price,
    s.tp2_price,
    s.tp3_price,
    s.stop_loss_price,
    `"${s.leverage_suggestion}"`,
    s.confidence_score,
    s.risk_level,
    s.status,
    s.result_r ?? '',
    s.exit_price ?? '',
    s.created_at,
    s.closed_at ?? '',
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
