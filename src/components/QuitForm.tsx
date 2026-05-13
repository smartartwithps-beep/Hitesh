import React from "react";
import { Timer, Calendar, ChevronRight, Hash, User } from "lucide-react";

interface QuitFormProps {
  onSetData: (name: string, date: Date, cigs: number) => void;
}

export default function QuitForm({ onSetData }: QuitFormProps) {
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("00:00");
  const [cigsPerDay, setCigsPerDay] = React.useState("20");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && name) {
      const quitDateTime = new Date(`${date}T${time}`);
      onSetData(name, quitDateTime, parseInt(cigsPerDay, 10));
    }
  };

  return (
    <div className="bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl max-w-sm w-full mx-auto">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] p-4 rounded-2xl text-white mb-6">
          <Timer className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black font-display text-white tracking-tight">New Beginning</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Personal freedom starts here</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Your Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white font-medium"
              placeholder="e.g. John Doe"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white font-medium"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Time of Last Smoke</label>
          <div className="relative group">
            <Timer className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white font-medium"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cigarettes per Day</label>
          <div className="relative group">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="number"
              required
              min="1"
              value={cigsPerDay}
              onChange={(e) => setCigsPerDay(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white font-medium"
              placeholder="e.g. 20"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-5 rounded-[1.5rem] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4 uppercase tracking-[0.15em] text-sm"
        >
          Activate Counter
          <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
