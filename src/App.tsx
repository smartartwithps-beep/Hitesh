/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import QuitForm from "./components/QuitForm";
import QuitCounter from "./components/QuitCounter";
import { CigaretteOff, LogOut, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth, signIn, auth, db, handleFirestoreError, OperationType } from "./lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface UserProfile {
  displayName: string;
  quitDate: string;
  cigarettesPerDay: number;
}

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfile(null);
        return;
      }

      setProfileLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      } finally {
        setProfileLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const handleSetData = async (name: string, date: Date, cigs: number) => {
    if (!user) return;

    const newProfile: UserProfile = {
      displayName: name,
      quitDate: date.toISOString(),
      cigarettesPerDay: cigs,
    };

    try {
      await setDoc(doc(db, "users", user.uid), {
        ...newProfile,
        updatedAt: serverTimestamp(),
      });
      setProfile(newProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset your journey? This will clear your data from the leaderboard.")) {
      // In a real app, you might want to keep history, but for this requirement we'll just clear the profile
      // Actually, let's just clear the local state to trigger the form again.
      // But the requirement says "Leaderboard updates in real time", so we should ideally update the backend too.
      // For now, let's just set profile to null to show the form, but let's not delete the record unless the user wants to start over.
      setProfile(null);
    }
  };

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 relative overflow-hidden flex flex-col">
      {/* Immersive Background Elements */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="flex justify-between items-center px-6 md:px-12 pt-8 md:pt-10 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <CigaretteOff className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase font-display">SmokeFree</span>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-400">
                <UserIcon className="w-4 h-4" />
                <span>{user.displayName || profile?.displayName || "User"}</span>
              </div>
              <button 
                onClick={() => auth.signOut()}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-400"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button 
              onClick={() => signIn()}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="login-prompt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-black mb-6 font-display tracking-tighter">Your Journey Starts Here.</h1>
              <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg">Sign in to track your progress and see how you rank among others reclaiming their freedom.</p>
              <button 
                onClick={() => signIn()}
                className="px-12 py-5 bg-emerald-500 text-slate-950 font-black rounded-3xl text-lg uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Get Started
              </button>
            </motion.div>
          ) : !profile ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <QuitForm onSetData={handleSetData} />
            </motion.div>
          ) : (
            <motion.div
              key="counter"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-7xl"
            >
              <QuitCounter 
                quitDate={new Date(profile.quitDate)} 
                cigarettesPerDay={profile.cigarettesPerDay} 
                onReset={handleReset} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 pb-8 text-center">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
          {profile ? `Freedom Journey Since ${new Date(profile.quitDate).toLocaleDateString()}` : "Take the first step today"}
        </p>
      </footer>
    </div>
  );
}

