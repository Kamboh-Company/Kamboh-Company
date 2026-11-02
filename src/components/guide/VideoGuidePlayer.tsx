import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipForward,
  SkipBack,
  Radio,
  TrendingUp,
  Calculator,
  Copy,
  Gift,
  CheckCircle2,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  Sparkles,
  Languages,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface GuideChapter {
  id: number;
  title: string;
  urduTitle: string;
  timestamp: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  summary: string;
  urduSummary: string;
  screenType: 'overview' | 'signal_detail' | 'calculator' | 'chart' | 'copy_trade' | 'referrals';
  spokenTextUrdu: string;
  spokenTextEn: string;
}

export const GUIDE_CHAPTERS: GuideChapter[] = [
  {
    id: 1,
    title: 'Platform Overview & Live Engine Scan',
    urduTitle: 'Kamboh Plus Ka Taaruf & Live Market Scanning',
    timestamp: '00:00',
    startTime: 0,
    duration: 35,
    summary: 'How Kamboh Plus autonomously scans BTC, ETH, SOL across Binance & Bybit for high-probability setups.',
    urduSummary: 'Kamboh Plus ka autonomous engine Binance aur Bybit se live data scan karke 74%+ win-rate signals dhoondta hai.',
    screenType: 'overview',
    spokenTextUrdu: 'Welcome to Kamboh Plus! Yeh ek automated crypto trading platform hai jo multi-exchange market scan karta hai.',
    spokenTextEn: 'Welcome to Kamboh Plus! This platform automatically scans crypto markets for high-probability trading signals.',
  },
  {
    id: 2,
    title: 'Reading Signals: Entry, TP1/2/3 & Stop Loss',
    urduTitle: 'Signal Ko Samajhna: Entry, 3 Profit Targets & Stop Loss',
    timestamp: '00:35',
    startTime: 35,
    duration: 40,
    summary: 'Understanding LONG/SHORT directions, entry zones, 1R to 3R take-profit ladders, and strict capital protection.',
    urduSummary: 'LONG aur SHORT signals ka farq, entry price, TP1, TP2, TP3 targets aur capital bachane ke liye Stop Loss lagana.',
    screenType: 'signal_detail',
    spokenTextUrdu: 'Har signal me exact entry price, teen take-profit targets aur risk control karne ke liye stop loss diya jata hai.',
    spokenTextEn: 'Every signal provides an exact entry price, three tiered take-profit targets, and disciplined stop loss protection.',
  },
  {
    id: 3,
    title: 'Risk Calculator & Position Sizing',
    urduTitle: 'Risk Calculator: Kitna Balance Aur Leverage Use Karein',
    timestamp: '01:15',
    startTime: 75,
    duration: 40,
    summary: 'Never blow your account. Input your capital and calculate exact position size and safe leverage (2x-5x).',
    urduSummary: 'Apne account size ka sirf 1% se 2% risk karein. Calculator aapko exact coin quantity aur safe leverage batata hai.',
    screenType: 'calculator',
    spokenTextUrdu: 'Kamboh Plus Risk Calculator me apna balance enter karein aur safe leverage aur position size calculate karein.',
    spokenTextEn: 'Use the Risk Calculator to manage your portfolio by risking only one to two percent per trade.',
  },
  {
    id: 4,
    title: 'TradingView Charts & Indicator Confluence',
    urduTitle: 'Live TradingView Charts & Technical Indicators (RSI, MACD)',
    timestamp: '01:55',
    startTime: 115,
    duration: 40,
    summary: 'Live candlestick analysis, EMA 20/50/200 trend direction, RSI oversold/overbought, and volume surges.',
    urduSummary: 'Har coin ka live TradingView chart dekhein jahan RSI, MACD aur EMA confluence se entry confirm hoti hai.',
    screenType: 'chart',
    spokenTextUrdu: 'Chart par RSI, MACD aur moving averages ki confluence se trend ki direction verify ki jati hai.',
    spokenTextEn: 'Inspect real-time technical confluence with RSI, MACD crossovers, and dynamic EMA trend lines.',
  },
  {
    id: 5,
    title: '1-Click Copy Trade To Binance / Bybit',
    urduTitle: 'Trade Details Copy Karke Binance / Bybit Par Lagana',
    timestamp: '02:35',
    startTime: 155,
    duration: 35,
    summary: 'Click "Copy Trade Details" to copy formatted alerts ready to paste into Telegram or execute on your exchange app.',
    urduSummary: '"Copy Trade Details" button dabayein aur Binance ya Bybit par limit order aur stop loss set karein.',
    screenType: 'copy_trade',
    spokenTextUrdu: 'Copy trade button se saari trade details ek click me copy karke kisi bhi exchange par execute karein.',
    spokenTextEn: 'Copy complete trade parameters in one click and paste directly into your exchange order form.',
  },
  {
    id: 6,
    title: 'Refer & Earn 30% Lifetime Commissions',
    urduTitle: 'Referral Link Se Har Mahine 30% USDT Kamana',
    timestamp: '03:10',
    startTime: 190,
    duration: 40,
    summary: 'Share your personal referral link to earn 30% to 40% recurring passive income with USDT & Binance Pay withdrawals.',
    urduSummary: 'Apna referral link dosto ke sath share karein aur har Pro upgrade par 30% recurring monthly USDT commission kamayein.',
    screenType: 'referrals',
    spokenTextUrdu: 'Apne dosto ko invite karein aur har mahine 30 percent recurring passive income USDT me withdraw karein.',
    spokenTextEn: 'Invite friends and earn 30% to 40% recurring monthly affiliate commissions paid in USDT.',
  },
];

const TOTAL_DURATION_SECONDS = 230; // 3 min 50 sec

export const VideoGuidePlayer: React.FC<{ initialChapterId?: number; onClose?: () => void }> = ({
  initialChapterId = 1,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [language, setLanguage] = useState<'urdu' | 'en'>('urdu');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Synchronize active chapter based on currentTime
  useEffect(() => {
    const idx = GUIDE_CHAPTERS.findIndex(
      (c, i) =>
        currentTime >= c.startTime &&
        (i === GUIDE_CHAPTERS.length - 1 || currentTime < GUIDE_CHAPTERS[i + 1].startTime)
    );
    if (idx !== -1 && idx !== activeChapterIndex) {
      setActiveChapterIndex(idx);
    }
  }, [currentTime]);

  // Voice narration using Web Speech API
  const speakNarration = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackRate * 0.95;
      utterance.pitch = 1.0;
      utterance.lang = language === 'urdu' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION_SECONDS) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });

        // Simulate subtle cursor guidance
        setCursorPos({
          x: 35 + Math.sin(Date.now() / 1000) * 20,
          y: 40 + Math.cos(Date.now() / 1200) * 15,
        });
      }, 1000 / playbackRate);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackRate]);

  // When chapter changes during playback, speak current text
  useEffect(() => {
    if (isPlaying) {
      const ch = GUIDE_CHAPTERS[activeChapterIndex];
      const textToSpeak = language === 'urdu' ? ch.spokenTextUrdu : ch.spokenTextEn;
      speakNarration(textToSpeak);
    }
  }, [activeChapterIndex, language, isPlaying]);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      const ch = GUIDE_CHAPTERS[activeChapterIndex];
      speakNarration(language === 'urdu' ? ch.spokenTextUrdu : ch.spokenTextEn);
    } else {
      setIsPlaying(false);
    }
  };

  const handleSelectChapter = (ch: GuideChapter, idx: number) => {
    setCurrentTime(ch.startTime);
    setActiveChapterIndex(idx);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentChapter = GUIDE_CHAPTERS[activeChapterIndex] || GUIDE_CHAPTERS[0];

  return (
    <div
      ref={containerRef}
      className={`rounded-3xl bg-[#0D111A] border border-white/10 overflow-hidden shadow-2xl flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
    >
      {/* Top Video Header Bar */}
      <div className="px-5 py-3.5 bg-[#141923] border-b border-white/[0.08] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              Kamboh Plus A-Z Official Video Guide
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                HD 1080p
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Chapter {currentChapter.id} of {GUIDE_CHAPTERS.length}:{' '}
              <span className="text-blue-300 font-medium">
                {language === 'urdu' ? currentChapter.urduTitle : currentChapter.title}
              </span>
            </div>
          </div>
        </div>

        {/* Language & Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'urdu' ? 'en' : 'urdu')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all"
            title="Switch Subtitles & Audio Language"
          >
            <Languages className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'urdu' ? 'Urdu / اردو' : 'English'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-2.5 py-1 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/20 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Video Viewport (Interactive Screen Simulation) */}
      <div className="relative aspect-video w-full bg-[#080B10] flex items-center justify-center overflow-hidden select-none">
        {/* Dynamic Chapter Screen Content */}
        {currentChapter.screenType === 'overview' && (
          <div className="w-full h-full p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-[#0e1626] to-[#080B10] relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base tracking-tight">
                    Kamboh<span className="text-blue-400">Plus</span> Live Quant Engine
                  </h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#16C784] animate-pulse" />
                    Multi-Exchange Scanner: Binance & Bybit
                  </div>
                </div>
              </div>
              <Badge variant="emerald" size="sm">
                99.98% Uptime
              </Badge>
            </div>

            {/* Simulated Live Feeds */}
            <div className="grid grid-cols-3 gap-3 my-auto">
              <div className="p-4 rounded-2xl bg-[#141923] border border-blue-500/30 shadow-lg relative overflow-hidden">
                <div className="text-[10px] text-slate-400 uppercase font-mono">BTC/USDT 4H</div>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-1">$68,420.00</div>
                <div className="text-[11px] text-slate-300 mt-2 flex items-center justify-between">
                  <span className="text-emerald-400 font-semibold">LONG Signal</span>
                  <span className="text-slate-400">Conf: 88%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141923] border border-white/10 shadow-lg">
                <div className="text-[10px] text-slate-400 uppercase font-mono">ETH/USDT 1H</div>
                <div className="text-xl font-bold text-white font-mono mt-1">$3,542.80</div>
                <div className="text-[11px] text-slate-300 mt-2 flex items-center justify-between">
                  <span className="text-emerald-400 font-semibold">TP1 Hit (+1.04R)</span>
                  <span className="text-slate-400">Target Reached</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141923] border border-white/10 shadow-lg">
                <div className="text-[10px] text-slate-400 uppercase font-mono">SOL/USDT 1H</div>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-1">$178.60</div>
                <div className="text-[11px] text-slate-300 mt-2 flex items-center justify-between">
                  <span className="text-emerald-400 font-semibold">LONG Active</span>
                  <span className="text-slate-400">Conf: 91%</span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400">
              Automated high-frequency scanning of 10+ major crypto pairs every 15 minutes.
            </div>
          </div>
        )}

        {currentChapter.screenType === 'signal_detail' && (
          <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#121927] to-[#0A0E17]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="emerald" size="md">
                  LONG 3x - 5x LEVERAGE
                </Badge>
                <span className="text-base font-bold text-white font-mono">BTC/USDT • 4H Setup</span>
              </div>
              <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                Confidence: 88%
              </div>
            </div>

            {/* Simulated Signal Targets Ladder */}
            <div className="bg-[#141923] p-4 rounded-2xl border border-white/10 space-y-3 max-w-xl mx-auto w-full">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs text-slate-400">Entry Price Zone:</span>
                <span className="text-sm font-bold text-white font-mono">$67,200.00</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">TP 1 (1.0R)</div>
                  <div className="text-xs font-bold text-white font-mono mt-0.5">$68,650</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">TP 2 (2.0R)</div>
                  <div className="text-xs font-bold text-white font-mono mt-0.5">$70,100</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">TP 3 (3.0R)</div>
                  <div className="text-xs font-bold text-white font-mono mt-0.5">$71,550</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs text-red-400 font-medium">Stop Loss Protection:</span>
                <span className="text-xs font-bold text-red-400 font-mono">$65,750.00 (-1.0R max risk)</span>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400">
              Disciplined risk-reward ratio: Always close 50% at TP1 and move stop loss to breakeven!
            </div>
          </div>
        )}

        {currentChapter.screenType === 'calculator' && (
          <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#121c2c] to-[#0A0E17]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Calculator className="w-4 h-4 text-blue-400" />
                Kamboh Plus Risk & Position Size Calculator
              </div>
              <Badge variant="blue" size="sm">
                1% - 2% Risk Rule
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto w-full my-auto">
              <div className="p-4 rounded-2xl bg-[#141923] border border-white/10 space-y-2">
                <span className="text-[11px] text-slate-400">Account Balance</span>
                <div className="text-lg font-bold text-white font-mono">$5,000.00 USD</div>
                <div className="text-[10px] text-emerald-400">Risking 1% ($50.00 Max)</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#141923] border border-white/10 space-y-2">
                <span className="text-[11px] text-slate-400">Recommended Position</span>
                <div className="text-lg font-bold text-emerald-400 font-mono">0.0345 BTC</div>
                <div className="text-[10px] text-slate-400">Suggested Leverage: 3x</div>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400">
              Never risk more than 2% of total trading balance on any single algorithmic signal.
            </div>
          </div>
        )}

        {currentChapter.screenType === 'chart' && (
          <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#0c1626] to-[#080B10]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">BTC/USDT 4H Lightweight Chart</span>
                <span className="text-xs text-emerald-400 font-mono">+4.2% Bullish Momentum</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">EMA20: 67,100</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">EMA50: 66,200</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">RSI: 54.2</span>
              </div>
            </div>

            {/* Simulated Mini Candlestick Graphic */}
            <div className="h-32 w-full flex items-end justify-between px-6 py-2 bg-[#0E131C] rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-emerald-500/30" />
              <div className="w-2 h-16 bg-red-500/70 rounded-sm mb-2" />
              <div className="w-2 h-10 bg-red-500/70 rounded-sm mb-4" />
              <div className="w-2 h-20 bg-emerald-500 rounded-sm mb-6" />
              <div className="w-2 h-24 bg-emerald-500 rounded-sm mb-10" />
              <div className="w-2 h-18 bg-emerald-500 rounded-sm mb-14" />
              <div className="w-2 h-28 bg-emerald-400 rounded-sm mb-16 shadow-lg shadow-emerald-500/50" />
            </div>

            <div className="text-center text-xs text-slate-400">
              Dynamic Stop Loss & Take Profit lines are automatically calculated and plotted on chart.
            </div>
          </div>
        )}

        {currentChapter.screenType === 'copy_trade' && (
          <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#121c2a] to-[#0A0E17]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Copy className="w-4 h-4 text-emerald-400" />
                1-Click Trade Clipboard Dispatch
              </div>
              <Badge variant="emerald" size="sm">
                Ready for Binance / Bybit
              </Badge>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0D13] border border-white/10 max-w-md mx-auto w-full font-mono text-xs text-slate-300 space-y-1.5 shadow-xl">
              <div className="text-emerald-400 font-bold">🚀 Kamboh Plus Trade Alert</div>
              <div>Pair: BTC/USDT (LONG)</div>
              <div>Entry: $67,200.00</div>
              <div>TP1: $68,650.00 • TP2: $70,100.00 • TP3: $71,550.00</div>
              <div className="text-red-400">Stop Loss: $65,750.00</div>
              <div className="text-slate-400 text-[10px]">Suggested Leverage: 3x - 5x</div>
            </div>

            <div className="text-center text-xs text-slate-400">
              Paste directly into exchange trading app or share with your VIP group members.
            </div>
          </div>
        )}

        {currentChapter.screenType === 'referrals' && (
          <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#1a1228] to-[#0A0E17]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Gift className="w-4 h-4 text-purple-400" />
                Kamboh Plus 30% Lifetime Affiliate Program
              </div>
              <Badge variant="purple" size="sm">
                Instant USDT Withdrawals
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto w-full my-auto">
              <div className="p-4 rounded-2xl bg-[#141923] border border-emerald-500/30 text-center">
                <span className="text-[11px] text-slate-400">30% Monthly Share</span>
                <div className="text-xl font-black text-emerald-400 font-mono mt-1">$2.70 / mo</div>
                <p className="text-[10px] text-slate-400 mt-0.5">Recurring per subscriber</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#141923] border border-purple-500/30 text-center">
                <span className="text-[11px] text-slate-400">Yearly Pro Referral</span>
                <div className="text-xl font-black text-purple-300 font-mono mt-1">$23.70</div>
                <p className="text-[10px] text-slate-400 mt-0.5">Direct USDT payout</p>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400">
              Withdraw commissions anytime via USDT (TRC-20, BEP-20), Binance Pay, or JazzCash!
            </div>
          </div>
        )}

        {/* Dynamic Simulated Cursor Indicator */}
        <div
          className="absolute w-5 h-5 pointer-events-none transition-all duration-700 ease-out z-20"
          style={{
            left: `${cursorPos.x}%`,
            top: `${cursorPos.y}%`,
          }}
        >
          <div className="w-4 h-4 rounded-full bg-blue-500/30 border-2 border-blue-400 animate-ping absolute" />
          <div className="w-3 h-3 rounded-full bg-blue-500 border border-white shadow-lg" />
        </div>

        {/* Big Center Play Button Overlay (when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-30 transition-all">
            <button
              onClick={handleTogglePlay}
              className="w-18 h-18 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 hover:scale-110 active:scale-95 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 transition-all"
            >
              <Play className="w-8 h-8 fill-white ml-1" />
            </button>
            <div className="text-center">
              <span className="text-sm font-bold text-white block">
                Click to Start Video Walkthrough
              </span>
              <span className="text-xs text-slate-400">
                {language === 'urdu'
                  ? 'Urdu & English Voiceover + Subtitles'
                  : 'Complete A to Z Tutorial (3 mins)'}
              </span>
            </div>
          </div>
        )}

        {/* Bottom Subtitles Banner */}
        <div className="absolute bottom-3 inset-x-4 p-2.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 text-center z-20">
          <p className="text-xs sm:text-sm font-semibold text-white tracking-wide">
            {language === 'urdu' ? currentChapter.spokenTextUrdu : currentChapter.spokenTextEn}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
            {language === 'urdu' ? currentChapter.urduSummary : currentChapter.summary}
          </p>
        </div>
      </div>

      {/* Video Progress Bar & Scrubber */}
      <div className="px-5 pt-3 pb-2 bg-[#0E131C] border-t border-white/[0.08]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400">
            {formatSeconds(currentTime)}
          </span>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="0"
              max={TOTAL_DURATION_SECONDS}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {formatSeconds(TOTAL_DURATION_SECONDS)}
          </span>
        </div>

        {/* Video Player Controls Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={handleTogglePlay}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            {/* Skip -10s */}
            <button
              onClick={() => setCurrentTime((t) => Math.max(0, t - 10))}
              title="Rewind 10 seconds"
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Skip +10s */}
            <button
              onClick={() => setCurrentTime((t) => Math.min(TOTAL_DURATION_SECONDS, t + 10))}
              title="Forward 10 seconds"
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setCurrentTime(0);
                setActiveChapterIndex(0);
              }}
              title="Restart from beginning"
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Volume */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 text-slate-400 hover:text-white ml-2 flex items-center gap-1"
              title={isMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
              <span className="text-[10px] text-slate-400">{isMuted ? 'Muted' : 'Audio On'}</span>
            </button>
          </div>

          {/* Right Controls: Speed & Chapter tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
                setPlaybackRate(nextRate);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300"
            >
              {playbackRate}x Speed
            </button>

            <span className="hidden sm:inline text-xs text-slate-400">
              Chapter {currentChapter.id}: {currentChapter.timestamp}
            </span>
          </div>
        </div>
      </div>

      {/* Chapter Selection Playlist Grid */}
      <div className="p-4 bg-[#141923] border-t border-white/[0.08]">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>Video Chapters (Jump to any step)</span>
          <span className="text-blue-400 text-[11px] font-normal">Click any topic to play</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {GUIDE_CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => handleSelectChapter(ch, idx)}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                activeChapterIndex === idx
                  ? 'bg-blue-500/15 border-blue-500/40 text-white shadow-md'
                  : 'bg-[#0E131C] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5">
                  Step {ch.id}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{ch.timestamp}</span>
              </div>
              <div className="text-xs font-semibold line-clamp-2 leading-tight">
                {language === 'urdu' ? ch.urduTitle : ch.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
