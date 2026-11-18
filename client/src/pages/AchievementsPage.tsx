import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import type { Achievement } from '../types';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Award, 
  Code2, 
  Bug, 
  Cpu, 
  Zap, 
  Compass, 
  Crown, 
  Flame, 
  Swords, 
  CheckCircle2, 
  Coins 
} from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAchievements()
      .then(res => {
        if (res.success) setAchievements(res.achievements);
      })
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, []);

  const handleClaim = async (achId: string) => {
    sound.playClick();
    try {
      const res = await api.claimAchievement(achId, user?.id || 'demo-user');
      if (res.success) {
        sound.playLevelUp();
        confetti({ particleCount: 75, spread: 60 });
        refreshUser();
      }
    } catch (err) {
      sound.playError();
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-6 h-6 text-cyan-400" />;
      case 'Bug': return <Bug className="w-6 h-6 text-rose-400" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-purple-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'Compass': return <Compass className="w-6 h-6 text-emerald-400" />;
      case 'Crown': return <Crown className="w-6 h-6 text-yellow-400" />;
      case 'Flame': return <Flame className="w-6 h-6 text-amber-400" />;
      case 'Swords': return <Swords className="w-6 h-6 text-rose-400" />;
      default: return <Trophy className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-600/40 text-purple-300 text-xs font-semibold mb-3">
          <Award className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hall of Medals & Milestones</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-gaming text-white">
          Trophies & Achievement Badges
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Unlock prestigious coder accolades as you conquer challenges, vanquish boss titans, and maintain daily streaks.
        </p>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => {
          const isEarned = user?.achievements.includes(ach.id);

          return (
            <div
              key={ach.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                isEarned
                  ? 'bg-[#0d162d] border-cyan-500/50 shadow-neon-cyan/20'
                  : 'bg-[#0a0f1d] border-slate-800/80 opacity-75 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#070b14] border border-purple-900/60 flex items-center justify-center">
                    {getIcon(ach.icon)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-slate-800 text-purple-300">
                    {ach.category}
                  </span>
                </div>

                <h3 className="text-base font-bold font-gaming text-white">{ach.title}</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {ach.description}
                </p>

                <div className="mt-4 flex items-center gap-3 text-xs font-mono">
                  <span className="text-cyan-300 font-semibold">+{ach.xpReward} XP</span>
                  <span className="text-yellow-400 font-semibold">+{ach.coinReward} Coins</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                {isEarned ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Unlocked & Claimed
                  </span>
                ) : (
                  <button
                    onClick={() => handleClaim(ach.id)}
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-gaming text-xs font-semibold shadow-md transition-all"
                  >
                    Claim Achievement Reward
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
