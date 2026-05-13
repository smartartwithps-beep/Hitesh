import React from "react";
import { RefreshCw, Heart, TrendingDown, DollarSign, CheckCircle2, Lock, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Leaderboard from "./Leaderboard";
import History from "./History";
import { getRank } from "../lib/ranks";

interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

interface QuitCounterProps {
  quitDate: Date;
  cigarettesPerDay: number;
  onReset: () => void;
}

const COST_PER_CIGARETTE = 0.45;

const MILESTONES = [
  { id: 1, title: "20 Minutes", description: "Pulse rate begins to drop to normal.", seconds: 20 * 60 },
  { id: 2, title: "8 Hours", description: "Oxygen levels in blood return to normal.", seconds: 8 * 60 * 60 },
  { id: 3, title: "24 Hours", description: "Your risk of heart attack begins to decrease.", seconds: 24 * 60 * 60 },
  { id: 4, title: "48 Hours", description: "Nerve endings regrow, taste and smell improves.", seconds: 48 * 60 * 60 },
  { id: 5, title: "72 Hours", description: "Bronchial tubes relax, making breathing easier.", seconds: 72 * 60 * 60 },
  { id: 6, title: "1 Week", description: "Cravings frequency and intensity decrease.", seconds: 7 * 24 * 60 * 60 },
  { id: 7, title: "1 Month", description: "Lung function improves, coughing decreases.", seconds: 30 * 24 * 60 * 60 },
  { id: 8, title: "1 Year", description: "Coronary heart disease risk is half a smoker's.", seconds: 365 * 24 * 60 * 60 },
];

export default function QuitCounter({ quitDate, cigarettesPerDay, onReset }: QuitCounterProps) {
  const [elapsed, setElapsed] = React.useState<TimeElapsed>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
  const [cravingSeconds, setCravingSeconds] = React.useState<number | null>(null);

  const [activeTab, setActiveTab] = React.useState<"dashboard" | "history">("dashboard");

  React.useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - quitDate.getTime();

      if (diff <= 0) {
        setElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
        return;
      }

      setElapsed({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        totalSeconds: diff / 1000,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [quitDate]);

  // Craving Timer Effect
  React.useEffect(() => {
    if (cravingSeconds !== null && cravingSeconds > 0) {
      const timer = setInterval(() => {
        setCravingSeconds(prev => (prev !== null && prev > 0 ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    } else if (cravingSeconds === 0) {
      setCravingSeconds(null);
    }
  }, [cravingSeconds]);

  const cigarettesAvoided = (elapsed.totalSeconds / (24 * 60 * 60)) * cigarettesPerDay;
  const moneySaved = cigarettesAvoided * COST_PER_CIGARETTE;

  // Today's Stats
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const effectiveQuit = quitDate > startOfToday ? quitDate : startOfToday;
  const todaySeconds = Math.max(0, (now.getTime() - effectiveQuit.getTime()) / 1000);
  const todayAvoided = (todaySeconds / (24 * 60 * 60)) * cigarettesPerDay;
  const todaySaved = todayAvoided * COST_PER_CIGARETTE;

  const secondsInYear = 365 * 24 * 60 * 60;
  const daysToYear = Math.max(0, Math.ceil((secondsInYear - elapsed.totalSeconds) / (24 * 60 * 60)));
  const yearProgress = Math.min(100, (elapsed.totalSeconds / secondsInYear) * 100);

  // Milestone logic
  const nextMilestone = MILESTONES.find(m => m.seconds > elapsed.totalSeconds) || MILESTONES[MILESTONES.length - 1];
  const prevMilestone = MILESTONES[MILESTONES.indexOf(nextMilestone) - 1] || { seconds: 0 };
  
  const milestoneProgress = nextMilestone.seconds > elapsed.totalSeconds 
    ? ((elapsed.totalSeconds - prevMilestone.seconds) / (nextMilestone.seconds - prevMilestone.seconds)) * 100
    : 100;

  const startCravingTimer = () => {
    setCravingSeconds(300); // 5 minutes
  };

  const currentRank = getRank(elapsed.days);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Tab Navigation */}
      <div className="flex gap-8 mb-12 border-b border-white/5 w-full max-w-5xl justify-center scale-90 sm:scale-100">
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
            activeTab === "dashboard" ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Dashboard
          {activeTab === "dashboard" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
            activeTab === "history" ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          History
          {activeTab === "history" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "dashboard" ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col items-center"
          >
            {/* Craving Overlay */}
            {cravingSeconds !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-6">
          <div className="flex flex-col items-center text-center max-w-sm">
            <div className="w-32 h-32 rounded-full border-4 border-emerald-500/10 flex items-center justify-center mb-8 relative">
              <div 
                className="absolute inset-[-4px] rounded-full border-4 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
                style={{ 
                  clipPath: `inset(0 ${100 - (cravingSeconds / 300) * 100}% 0 0)`,
                  transform: 'rotate(-90deg)'
                }}
              />
              <span className="text-4xl font-black text-white font-display">
                {Math.floor(cravingSeconds / 60)}:{(cravingSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <h3 className="text-3xl font-black text-white mb-4">Slowly Inhale.</h3>
            <p className="text-slate-400 mb-8 font-medium leading-relaxed">
              Cravings usually peak and pass within 5 minutes. Feel the air filling your lungs. You are stronger than this impulse.
            </p>
            <button 
              onClick={() => setCravingSeconds(null)}
              className="px-6 py-2 rounded-full bg-slate-900 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              I am okay now
            </button>
          </div>
        </div>
      )}

      {/* Hero Counter Section */}
      <div className="text-center mb-16 relative">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase">
            Smoke-Free Journey
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <h1 className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] font-display">
            {elapsed.days}
          </h1>
          <p className="text-sm sm:text-xl font-black tracking-[0.5em] uppercase text-slate-500 -mt-2 sm:-mt-4 mb-8">
            Days of Freedom
          </p>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl ${currentRank.bg} border border-white/5 backdrop-blur-md`}
          >
            <span className="text-2xl">{currentRank.emoji}</span>
            <div className="text-left">
              <p className={`text-[10px] font-black uppercase tracking-widest ${currentRank.color}`}>Current Rank</p>
              <p className="text-sm font-black text-white uppercase tracking-wider">{currentRank.title}</p>
            </div>
          </motion.div>
        </div>

        {/* Live Sub-counters */}
        <div className="flex gap-4 sm:gap-12 mt-12 justify-center">
          <StatCard label="Hours" value={elapsed.hours} />
          <StatCard label="Minutes" value={elapsed.minutes} />
          <StatCard label="Seconds" value={elapsed.seconds} />
        </div>

        {/* Action Row */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={startCravingTimer}
            className="w-full sm:w-auto px-8 py-4 bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:bg-rose-400 text-slate-950 font-black rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            <Heart className="w-4 h-4 fill-slate-950" />
            Support for Craving
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
        {/* Card: Mastery Progress (1 Year) */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between backdrop-blur-md transition-all hover:bg-slate-900/60 md:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full tracking-widest uppercase">
              {daysToYear} Days to Mastery
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-black text-white font-display">1-Year Milestone</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Journey to complete recovery</p>
              </div>
              <p className="text-xl font-black text-blue-400">{Math.floor(yearProgress)}%</p>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" 
                style={{ width: `${yearProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card: Savings */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between backdrop-blur-md transition-all hover:bg-slate-900/60">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-widest">
              Today
            </span>
          </div>
          <div>
            <p className="text-4xl font-black text-white font-display">${todaySaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Today's Savings</p>
          </div>
        </div>

        {/* Card: Avoided */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between backdrop-blur-md transition-all hover:bg-slate-900/60">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full uppercase tracking-widest">
              Today
            </span>
          </div>
          <div>
            <p className="text-4xl font-black text-white font-display">{Math.floor(todayAvoided).toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Cigarettes Avoided</p>
          </div>
        </div>

        {/* Card: Leaderboard */}
        <div className="md:col-span-2 row-span-1">
          <Leaderboard />
        </div>
      </div>

      {/* Recovery Timeline */}
      <div className="w-full max-w-5xl mb-24">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-8 px-4">Recovery Timeline</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
          {MILESTONES.map((milestone) => {
            const isUnlocked = elapsed.totalSeconds >= milestone.seconds;
            return (
              <div 
                key={milestone.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isUnlocked 
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-50" 
                    : "bg-slate-900/20 border-white/5 text-slate-500"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-2 rounded-xl ${isUnlocked ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-slate-800 text-slate-600"}`}>
                    {isUnlocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  {isUnlocked && <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 opacity-60">Unlocked</span>}
                </div>
                <h4 className={`text-sm font-black mb-2 uppercase tracking-wide tracking-[0.1em] ${isUnlocked ? "text-white" : "text-slate-500"}`}>
                  {milestone.title}
                </h4>
                <p className="text-[11px] leading-relaxed opacity-60">{milestone.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced Actions */}
      <div className="w-full max-w-5xl border-t border-white/5 pt-12 flex justify-center pb-20">
        <button 
          onClick={onReset}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 transition-all text-[10px] font-black uppercase tracking-[0.3em] group"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
          Terminate Current Session
        </button>
      </div>
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            <History quitDate={quitDate} cigarettesPerDay={cigarettesPerDay} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-component
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <span className="text-3xl sm:text-5xl font-black font-display text-slate-100 tracking-tighter">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">
        {label}
      </span>
    </div>
  );
}
