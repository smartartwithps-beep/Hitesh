import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Calendar, TrendingUp, DollarSign, Award } from "lucide-react";

interface HistoryProps {
  quitDate: Date;
  cigarettesPerDay: number;
}

const COST_PER_CIGARETTE = 0.45;

export default function History({ quitDate, cigarettesPerDay }: HistoryProps) {
  const [tab, setTab] = React.useState<"weekly" | "monthly" | "yearly">("weekly");

  // Helper to get start of day
  const getStartOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Weekly Data (last 7 days)
  const getWeeklyData = () => {
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const startOfDay = getStartOfDay(date);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      let avoided = 0;
      if (quitDate < endOfDay) {
        const effectiveStart = quitDate > startOfDay ? quitDate : startOfDay;
        const durationMs = endOfDay.getTime() - effectiveStart.getTime();
        const durationDays = Math.max(0, Math.min(1, durationMs / (1000 * 60 * 60 * 24)));
        avoided = durationDays * cigarettesPerDay;
      }

      data.push({
        name: date.toLocaleDateString(undefined, { weekday: 'short' }),
        avoided: Math.floor(avoided),
        date: startOfDay,
      });
    }
    return data;
  };

  // Monthly Data (last 4 weeks)
  const getMonthlyData = () => {
    const data = [];
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(startOfWeek.getDate() - (i * 7 + now.getDay()));
      startOfWeek.setHours(0,0,0,0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      let avoided = 0;
      if (quitDate < endOfWeek) {
        const effectiveStart = quitDate > startOfWeek ? quitDate : startOfWeek;
        const durationMs = endOfWeek.getTime() - effectiveStart.getTime();
        const durationDays = Math.max(0, Math.min(7, durationMs / (1000 * 60 * 60 * 24)));
        avoided = durationDays * cigarettesPerDay;
      }

      data.push({
        name: `Week ${4-i}`,
        avoided: Math.floor(avoided),
        saved: avoided * COST_PER_CIGARETTE,
      });
    }
    return data;
  };

  // Yearly Data (last 12 months)
  const getYearlyData = () => {
    const data = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      let avoided = 0;
      if (quitDate < endOfMonth) {
        const effectiveStart = quitDate > date ? quitDate : date;
        const durationMs = endOfMonth.getTime() - effectiveStart.getTime();
        const durationDays = Math.max(0, durationMs / (1000 * 60 * 60 * 24));
        avoided = durationDays * cigarettesPerDay;
      }

      data.push({
        name: date.toLocaleDateString(undefined, { month: 'short' }),
        avoided: Math.floor(avoided),
        fullDate: date,
      });
    }
    return data;
  };

  const streakDays = Math.floor((new Date().getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 flex gap-2 backdrop-blur-xl">
            {(["weekly", "monthly", "yearly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  tab === t 
                    ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === "weekly" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white font-display">Daily Avoidance</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Cigarettes avoided per day</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getWeeklyData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#475569" 
                      fontSize={10} 
                      fontWeight={900} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '16px',
                        fontSize: '12px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="avoided" radius={[6, 6, 0, 0]}>
                      {getWeeklyData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 6 ? '#10b981' : '#334155'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === "monthly" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {getMonthlyData().map((week, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md flex flex-col justify-between hover:bg-slate-900/60 transition-all">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{week.name}</span>
                  <Calendar className="w-4 h-4 text-slate-700" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white font-display">{week.avoided}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black">Avoided</p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-bold">${week.saved.toFixed(2)} saved</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "yearly" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-emerald-500 border border-emerald-400 rounded-[2rem] p-10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                <div className="text-center md:text-left">
                  <h3 className="text-slate-950 text-4xl font-black font-display leading-none mb-2">Longest Streak</h3>
                  <p className="text-emerald-900 text-[10px] font-black uppercase tracking-widest">Your resilience is unmatched</p>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-center">
                      <p className="text-slate-950 text-6xl font-black font-display leading-none">{streakDays}</p>
                      <p className="text-emerald-900 text-[10px] font-black uppercase tracking-widest mt-1">Days</p>
                   </div>
                   <div className="w-px h-16 bg-emerald-900/20" />
                   <Award className="w-16 h-16 text-slate-950" />
                </div>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {getYearlyData().map((month, i) => (
                  <div key={i} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 text-center backdrop-blur-md">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">{month.name}</p>
                    <p className="text-xl font-black text-white font-display">{month.avoided}</p>
                    <p className="text-[8px] text-slate-600 font-black uppercase mt-1">Avoided</p>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
