import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import { api } from '../services/api';
import type { World, DailyChallenge } from '../types';
import { 
  Gamepad2, 
  Swords, 
  Compass, 
  Code2, 
  Trophy, 
  Flame, 
  Coins, 
  ShieldCheck, 
  Sparkles, 
  Play, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Zap,
  Target,
  Puzzle,
  ChevronRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [daily, setDaily] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getWorlds(), api.getDaily()])
      .then(([worldsRes, dailyRes]) => {
        if (worldsRes.success) setWorlds(worldsRes.worlds);
        if (dailyRes.success) setDaily(dailyRes.daily);
      })
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, []);

  const currentLevel = user?.level || 1;
  const currentXp = user?.xp || 0;
  const xpBaseForCurrentLevel = Math.pow(currentLevel - 1, 2) * 25;
  const xpRequiredForNextLevel = Math.pow(currentLevel, 2) * 25;
  const xpInLevel = currentXp - xpBaseForCurrentLevel;
  const xpSpan = Math.max(100, xpRequiredForNextLevel - xpBaseForCurrentLevel);
  const levelProgress = Math.min(100, Math.max(5, Math.round((xpInLevel / xpSpan) * 100)));

  return (
    <div className="min-h-screen bg-[#070b14] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner / Hero HUD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d162d] via-[#101b38] to-[#0a1224] border border-purple-900/40 shadow-card-glow relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* User Info */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-neon-purple shrink-0">
              <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center text-3xl sm:text-4xl">
                {user?.avatar === 'avatar-arcane-sorceress' ? '🧙‍♀️' :
                 user?.avatar === 'avatar-mecha-knight' ? '🤖' :
                 user?.avatar === 'avatar-cyber-hacker' ? '👾' : '🥷'}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-gaming text-white">
                  {user?.name || 'Coder Initiate'}
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-cyan-300 border border-purple-700/60 font-mono">
                  {user?.year} • {user?.branch?.split(' ')[0]}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {user?.college} • Weapon: <span className="text-cyan-300 uppercase font-mono font-semibold">{user?.preferredLanguage}</span>
              </p>

              {/* Progress Bar in Hero */}
              <div className="mt-3 flex items-center gap-3">
                <div className="w-36 sm:w-56 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-purple-300">
                  {currentXp} / {xpRequiredForNextLevel} XP ({levelProgress}%)
                </span>
              </div>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-purple-900/50 text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Player Level</p>
              <p className="text-xl sm:text-2xl font-bold font-gaming text-cyan-300 mt-0.5">LVL {currentLevel}</p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-amber-900/50 text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> Streak
              </p>
              <p className="text-xl sm:text-2xl font-bold font-gaming text-amber-400 mt-0.5">{user?.streakDays || 1} Days</p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-yellow-900/50 text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-center gap-1">
                <Coins className="w-3 h-3 text-yellow-400" /> Coins
              </p>
              <p className="text-xl sm:text-2xl font-bold font-gaming text-yellow-400 mt-0.5">{user?.coins || 100}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Launch Game Modes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { to: '/adventure', icon: Gamepad2, label: '3D World', color: 'text-cyan-400', border: 'hover:border-cyan-500' },
          { to: '/puzzles', icon: Puzzle, label: '2D Puzzles', color: 'text-purple-400', border: 'hover:border-purple-500' },
          { to: '/arena', icon: Code2, label: 'Code Arena', color: 'text-emerald-400', border: 'hover:border-emerald-500' },
          { to: '/multiplayer', icon: Swords, label: '1v1 Duels', color: 'text-rose-400', border: 'hover:border-rose-500' },
          { to: '/quiz', icon: Sparkles, label: 'Quiz Royale', color: 'text-amber-400', border: 'hover:border-amber-500' },
          { to: '/daily', icon: Flame, label: 'Daily Quest', color: 'text-orange-400', border: 'hover:border-orange-500' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.to}
              onClick={() => sound.playClick()}
              className={`p-4 rounded-2xl bg-[#0b1120] border border-slate-800/80 ${item.border} transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-center text-center group`}
            >
              <Icon className={`w-6 h-6 ${item.color} mb-2 group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-gaming font-semibold text-white tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Active Quest & Daily Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Quest Hero Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0c1326] border border-purple-900/40 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Active Campaign Quest</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">World 2 • Level 3</span>
            </div>

            <h2 className="text-xl font-bold font-gaming text-white">The Prime Crypt</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Undead sentries in the Logic Dungeon check prime frequencies. Implement a fast primality test in your weapon of choice ({user?.preferredLanguage?.toUpperCase()}) to disarm the poison dart traps.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                Reward: <strong className="text-cyan-300">+100 XP</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                Loot: <strong className="text-yellow-300">+50 Coins</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300">
                Boss Ahead: Infinite Loop Beast
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <Link
              to="/worlds"
              onClick={() => sound.playClick()}
              className="text-xs text-slate-400 hover:text-cyan-300 transition-colors"
            >
              Browse all 6 worlds &rarr;
            </Link>
            <Link
              to="/arena/w2-l3"
              onClick={() => sound.playClick()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-gaming text-xs font-semibold hover:scale-105 transition-all shadow-md shadow-purple-900/40 flex items-center gap-1.5"
            >
              <span>RESUME QUEST</span>
              <Play className="w-3.5 h-3.5 fill-white" />
            </Link>
          </div>
        </div>

        {/* Right Column: Daily Quest */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#141224] to-[#0a0f1d] border border-amber-800/40 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Daily Challenge (1.5x XP)</span>
              </span>
              <span className="text-xs text-amber-400 font-mono">
                {daily ? `${Math.floor(daily.expiresInSeconds / 3600)}h left` : '24h'}
              </span>
            </div>

            <h3 className="text-lg font-bold font-gaming text-white">
              {daily?.challenge?.title || "Daily Algorithmic Trial"}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {daily?.challenge?.description || "Solve today's featured problem to protect your daily coding streak and earn bonus coins."}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-mono text-amber-300 font-semibold">+150 Bonus XP</span>
            <Link
              to={daily ? `/arena/${daily.challenge.id}` : '/daily'}
              onClick={() => sound.playClick()}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-gaming text-xs font-semibold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>ACCEPT CHALLENGE</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Six Worlds Carousel Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-gaming text-white">The Six Coding Worlds</h2>
            <p className="text-xs text-slate-400">Unlock each realm to challenge its guardian titan.</p>
          </div>
          <Link to="/worlds" onClick={() => sound.playClick()} className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1">
            View All Worlds &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {worlds.map((world) => {
            const isUnlocked = user?.unlockedWorlds.includes(world.id);
            const completedCount = world.challenges.filter(c => user?.completedChallenges.includes(c.id)).length;
            const progress = Math.round((completedCount / world.challenges.length) * 100);

            return (
              <div 
                key={world.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isUnlocked 
                    ? 'bg-[#0b1122] border-purple-900/40 hover:border-cyan-500/50' 
                    : 'bg-[#080c14] border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono text-cyan-300">WORLD {world.id}</span>
                  {isUnlocked ? (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Level {world.requiredLevel} Required
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold font-gaming text-white">{world.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{world.subtitle}</p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>Missions: {completedCount}/{world.challenges.length}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Boss: <strong className="text-rose-400">{world.bossName}</strong></span>
                  <Link
                    to={isUnlocked ? `/worlds/${world.id}` : '#'}
                    onClick={() => isUnlocked && sound.playClick()}
                    className={`font-semibold text-xs ${isUnlocked ? 'text-cyan-400 hover:underline' : 'text-slate-600 cursor-not-allowed'}`}
                  >
                    {isUnlocked ? 'Enter World &rarr;' : 'Locked'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
