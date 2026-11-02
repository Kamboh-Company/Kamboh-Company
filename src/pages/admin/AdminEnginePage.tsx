import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Cpu,
  Play,
  Pause,
  RefreshCw,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { engineSettingsStorage, signalStorage } from '../../lib/supabase';
import { EngineSettings, EngineLog } from '../../types';
import { fetchOHLCVCandles, SUPPORTED_COINS } from '../../lib/marketData';
import { evaluateSignalRules } from '../../lib/indicators';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Toggle } from '../../components/ui/Toggle';
import { Badge } from '../../components/ui/Badge';
import { formatTimestamp } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export const AdminEnginePage: React.FC = () => {
  const { success, info } = useToast();
  const [settings, setSettings] = useState<EngineSettings>(engineSettingsStorage.getSettings());
  const [logs, setLogs] = useState<EngineLog[]>(engineSettingsStorage.getLogs());
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [scanOutput, setScanOutput] = useState<string | null>(null);

  const handleToggleActive = () => {
    const updated = { ...settings, is_active: !settings.is_active };
    setSettings(updated);
    engineSettingsStorage.saveSettings(updated);
    success(
      updated.is_active ? 'Engine Resumed' : 'Engine Paused',
      `Automatic 15-minute cron scanning is now ${updated.is_active ? 'ACTIVE' : 'SUSPENDED'}.`
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    engineSettingsStorage.saveSettings(settings);
    success('Settings Saved', 'Algorithmic scan thresholds updated.');
  };

  const handleRunSimulatorScan = async () => {
    setIsScanning(true);
    setScanOutput('Initializing multi-exchange REST scanner (Binance -> Bybit -> OKX fallback)...\n');

    const testCoins = ['BTC', 'ETH', 'SOL'];
    const outputLines: string[] = ['[SIGNAL ENGINE] Starting automated scan cycle:'];

    for (const coin of testCoins) {
      try {
        const { candles, exchange } = await fetchOHLCVCandles(coin, '1h', 200);
        const evalResult = evaluateSignalRules(coin, candles, '1h');

        if (evalResult.shouldSignal && evalResult.signalData) {
          outputLines.push(
            `✔ [${exchange}] ${coin}/USDT: CONFLUENCE MET! Direction: ${evalResult.signalData.direction}, Confidence: ${evalResult.signalData.confidence_score}% (RSI: ${evalResult.signalData.indicators_snapshot.rsi})`
          );

          // Add to log
          engineSettingsStorage.addLog({
            id: 'log-' + Date.now(),
            timestamp: new Date().toISOString(),
            exchange: exchange as any,
            coin,
            timeframe: '1h',
            status: 'success',
            message: `Generated ${evalResult.signalData.direction} signal with confidence ${evalResult.signalData.confidence_score}%.`,
          });
        } else {
          outputLines.push(
            `• [${exchange}] ${coin}/USDT: Skipped. Reason: ${evalResult.reason}`
          );

          engineSettingsStorage.addLog({
            id: 'log-' + Date.now(),
            timestamp: new Date().toISOString(),
            exchange: exchange as any,
            coin,
            timeframe: '1h',
            status: 'skipped',
            message: evalResult.reason || 'Confluence criteria not satisfied.',
          });
        }
      } catch (err: any) {
        outputLines.push(`✖ ${coin}/USDT: Error fetching exchange candles: ${err.message}`);
      }
    }

    setScanOutput(outputLines.join('\n'));
    setLogs(engineSettingsStorage.getLogs());
    setIsScanning(false);
    success('Scan Complete', 'Simulation run finished and logged to engine_logs.');
  };

  const filteredLogs = logs.filter((l) => (logFilter === 'ALL' ? true : l.status === logFilter));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Signal Engine Control & Telemetry</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure algorithmic trigger rules, threshold scoring, and inspect live cron execution logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={settings.is_active ? 'danger' : 'success'}
            size="sm"
            onClick={handleToggleActive}
            leftIcon={settings.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          >
            {settings.is_active ? 'Pause Autonomous Engine' : 'Resume Engine'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunSimulatorScan}
            isLoading={isScanning}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Run Scan Now
          </Button>
        </div>
      </div>

      {/* Simulator Terminal Output (if ran) */}
      {scanOutput && (
        <div className="p-4 rounded-2xl bg-[#080B0F] border border-blue-500/30 font-mono text-xs text-blue-300 shadow-xl">
          <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-2">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              Scan Simulator Output Log
            </span>
            <button
              onClick={() => setScanOutput(null)}
              className="text-slate-500 hover:text-white"
            >
              Clear
            </button>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed">{scanOutput}</pre>
        </div>
      )}

      {/* Engine Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            Quant Threshold Settings
          </h3>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              Minimum Signal Confidence (0–100)
            </label>
            <Input
              type="number"
              min="50"
              max="95"
              value={settings.min_confidence}
              onChange={(e) => setSettings({ ...settings, min_confidence: parseInt(e.target.value) || 65 })}
              helperText="Setups below this score are automatically rejected"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Max New Signals / Day
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                value={settings.max_signals_per_day}
                onChange={(e) => setSettings({ ...settings, max_signals_per_day: parseInt(e.target.value) || 5 })}
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Pair Cooldown (Hours)
              </label>
              <Input
                type="number"
                min="1"
                max="24"
                value={settings.cooldown_hours}
                onChange={(e) => setSettings({ ...settings, cooldown_hours: parseInt(e.target.value) || 6 })}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md">
              Save Engine Parameters
            </Button>
          </div>
        </form>

        {/* Engine Specs */}
        <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            Supabase Edge Function Topology
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-2xl bg-[#0E131C] border border-white/5 flex justify-between items-center">
              <div>
                <span className="font-mono text-white font-bold">signal-engine</span>
                <span className="text-slate-500 block text-[11px]">pg_cron schedule: */15 * * * *</span>
              </div>
              <Badge variant="emerald" size="xs">Every 15m</Badge>
            </div>

            <div className="p-3 rounded-2xl bg-[#0E131C] border border-white/5 flex justify-between items-center">
              <div>
                <span className="font-mono text-white font-bold">signal-tracker</span>
                <span className="text-slate-500 block text-[11px]">pg_cron schedule: */5 * * * *</span>
              </div>
              <Badge variant="emerald" size="xs">Every 5m</Badge>
            </div>

            <div className="p-3 rounded-2xl bg-[#0E131C] border border-white/5 flex justify-between items-center">
              <div>
                <span className="font-mono text-white font-bold">lemonsqueezy-webhook</span>
                <span className="text-slate-500 block text-[11px]">HMAC SHA-256 Verified HTTP POST</span>
              </div>
              <Badge variant="blue" size="xs">On Event</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Engine Logs Table */}
      <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            Engine Execution Logs (Last 100 Scans)
          </h3>

          <select
            value={logFilter}
            onChange={(e) => setLogFilter(e.target.value)}
            className="bg-[#0E131C] text-xs text-white rounded-xl px-3 py-1.5 border border-white/10 outline-none"
          >
            <option value="ALL">All Outcomes</option>
            <option value="success">Success / Signal Fired</option>
            <option value="skipped">Skipped / Choppy</option>
            <option value="error">Errors</option>
          </select>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-[#0E131C] border border-white/5 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-slate-500 text-[11px] whitespace-nowrap">
                  {formatTimestamp(log.timestamp)}
                </span>
                <Badge
                  variant={
                    log.status === 'success'
                      ? 'emerald'
                      : log.status === 'skipped'
                      ? 'neutral'
                      : 'red'
                  }
                  size="xs"
                >
                  {log.exchange}
                </Badge>
                <span className="font-bold text-white">{log.coin}</span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
