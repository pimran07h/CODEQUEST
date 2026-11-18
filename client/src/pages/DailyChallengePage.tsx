import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import type { DailyChallenge } from '../types';
import { 
  Flame, 
  Clock, 
  Calendar, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Coins
} from 'lucide-react';

export const DailyChallengePage: React.FC = () => {
  const { user } = useAuth();
  const [daily, setDaily] = useState<DailyChallenge | null>(null);
  const [timeLeft, setTimeLeft] = useState(86400);

  useEffect(() => {
    api.getDaily()
      .then(res => {
        if (res.success) {
          setDaily(res.daily);
          setTimeLeft(res.daily.expiresInSeconds);
        }
      })
      .catch(console.warn);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const currentStreak = user?.streakDays || 1;

  return (
    <div className="min-h-screen bg-[#070b14] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-300 text-xs font-semibold mb-3">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span>Daily Mission & Streak Multiplier</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-gaming text-white">
          Today's CodeQuest Trial
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Solve the daily problem within 24 hours to preserve your consecutive coding streak and unlock 1.5x bonus rewards.
        </p>
      </div>

      {/* 7-Day Streak Calendar Track */}
      <div className="p-6 rounded-3xl bg-[#0c1224] border border-amber-800/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold font-gaming text-white">
              Your Current Streak: <span className="text-amber-400">{currentStreak} Days</span>
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Streak Bonus: +25% XP</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isCompleted = day <= currentStreak;
            const isToday = day === currentStreak;

            return (
              <div
                key={day}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isCompleted
                    ? 'bg-amber-950/50 border-amber-500/60 text-amber-300'
                    : 'bg-[#080c16] border-slate-800 text-slate-500'
                } ${isToday ? 'ring-2 ring-amber-400 shadow-neon-gold/30' : ''}`}
              >
                <span className="text-[10px] font-mono font-bold block mb-1">DAY {day}</span>
                <div className="text-xl">
                  {isCompleted ? '🔥' : '🔒'}
                </div>
                <span className="text-[9px] font-mono mt-1 block">
                  {isCompleted ? 'CLAIMED' : '+50 XP'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Daily Challenge Card */}
      {daily && (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#170e28] via-[#10142b] to-[#0a1224] border border-purple-800/60 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="max-w-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  DAILY QUEST
                </span>
                <span className="text-xs text-purple-300 font-mono font-bold">
                  {daily.challenge.difficulty} Difficulty
                </span>
              </div>

              <h2 className="text-2xl font-bold font-gaming text-white">
                {daily.challenge.title}
              </h2>
              <p className="text-xs text-purple-200 font-mono">{daily.challenge.subtitle}</p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {daily.challenge.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {daily.challenge.topics.map((t, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-black/40 border border-slate-800 text-cyan-300 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Timer & Rewards Box */}
            <div className="p-6 rounded-2xl bg-[#080c16] border border-purple-900/60 text-center shrink-0 w-full lg:w-72 shadow-lg space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  Time Remaining
                </span>
                <div className="flex items-center justify-center gap-1.5 text-2xl font-bold font-mono text-cyan-300">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span>
                    {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="py-2 px-3 rounded-xl bg-purple-950/60 border border-purple-800/60 font-mono text-xs space-y-1">
                <div className="text-amber-300 font-bold">+150 XP (1.5x Bonus)</div>
                <div className="text-yellow-400 font-bold">+75 Quest Coins</div>
              </div>

              <Link
                to={`/arena/${daily.challenge.id}`}
                onClick={() => sound.playClick()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-gaming font-bold text-xs uppercase shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2 hover:scale-105 transition-all"
              >
                <span>ENTER DAILY ARENA</span>
                <Play className="w-3.5 h-3.5 fill-white" />
              </Link>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
