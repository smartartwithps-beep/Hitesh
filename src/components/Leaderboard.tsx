import React from "react";
import { Award, TrendingUp, User as UserIcon, Shield } from "lucide-react";
import { db, auth, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { getRank } from "../lib/ranks";

interface LeaderboardEntry {
  id: string;
  displayName: string;
  quitDate: string;
}

export default function Leaderboard() {
  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("quitDate", "asc"), // Earlier quit date = more days
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LeaderboardEntry[];
      setEntries(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "users");
    });

    return () => unsubscribe();
  }, []);

  const calculateDays = (quitDateStr: string) => {
    const quitDate = new Date(quitDateStr);
    const now = new Date();
    const diff = now.getTime() - quitDate.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md flex flex-col h-full transition-all hover:bg-slate-900/60 w-full">
      <div className="flex justify-between items-start mb-8">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
          <Award className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full tracking-widest uppercase">Global Rank</span>
      </div>
      
      <div className="space-y-6 flex-1">
        <div>
          <p className="text-2xl font-black text-white font-display">Leaderboard</p>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Top 10 Resilient Souls</p>
        </div>

        <div className="space-y-3">
          {entries.map((entry, index) => {
            const days = calculateDays(entry.quitDate);
            const isMe = auth.currentUser?.uid === entry.id;

            return (
              <div 
                key={entry.id}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${
                  isMe ? "bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-slate-950/20 border border-transparent"
                }`}
              >
                <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center font-black text-xs ${
                  index === 0 ? "bg-amber-400 text-slate-950" : 
                  index === 1 ? "bg-slate-300 text-slate-950" :
                  index === 2 ? "bg-orange-400 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold truncate ${isMe ? "text-emerald-400" : "text-white"}`}>
                      {entry.displayName} {isMe && "(You)"}
                    </p>
                    <span className="text-xs" title={getRank(days).title}>{getRank(days).emoji}</span>
                  </div>
                  <p className={`text-[8px] font-black uppercase tracking-tighter opacity-50 ${getRank(days).color}`}>
                    {getRank(days).title}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-white font-display">{days}</p>
                  <p className="text-[8px] text-slate-500 uppercase font-black font-sans">Days</p>
                </div>
              </div>
            );
          })}
          
          {entries.length === 0 && (
            <div className="text-center py-12">
              <UserIcon className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No pioneers yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
