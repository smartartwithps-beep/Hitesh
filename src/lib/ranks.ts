export interface Rank {
  days: number;
  title: string;
  emoji: string;
  color: string;
  bg: string;
}

export const RANKS: Rank[] = [
  { days: 365, title: "Final Boss", emoji: "🏆", color: "text-amber-400", bg: "bg-amber-400/10" },
  { days: 180, title: "Untouchable", emoji: "🦾", color: "text-purple-400", bg: "bg-purple-400/10" },
  { days: 120, title: "Rizz King", emoji: "👑", color: "text-blue-400", bg: "bg-blue-400/10" },
  { days: 90, title: "Gigachad Mode", emoji: "⚡", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { days: 60, title: "No Cap Legend", emoji: "🔥", color: "text-orange-400", bg: "bg-orange-400/10" },
  { days: 30, title: "Built Different", emoji: "💀", color: "text-slate-400", bg: "bg-slate-400/10" },
  { days: 14, title: "NPC No More", emoji: "👀", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { days: 7, title: "Sigma Starter", emoji: "🗿", color: "text-indigo-400", bg: "bg-indigo-400/10" },
  { days: 3, title: "Trying fr fr", emoji: "😤", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { days: 1, title: "Still Cooked", emoji: "🚬", color: "text-rose-400", bg: "bg-rose-400/10" },
  { days: 0, title: "Just Started", emoji: "🌱", color: "text-slate-500", bg: "bg-slate-500/10" },
];

export function getRank(days: number): Rank {
  return RANKS.find(r => days >= r.days) || RANKS[RANKS.length - 1];
}
